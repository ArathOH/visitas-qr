import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Card from "./Card";
import { addVisit, getVisitorByQR } from "../lib/firestore";
import toast from "react-hot-toast";

export default function QRScanner() {
  const containerId = "qr-reader"; // debe existir en el DOM
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState("Toca “Activar cámara” y apunta al código");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    qrRef.current = new Html5Qrcode(containerId, /* verbose */ false);
    return () => {
      // limpiar cámara al desmontar
      if (qrRef.current?.isScanning) {
        qrRef.current.stop().catch(() => {});
      }
      qrRef.current?.clear();
      qrRef.current = null;
    };
  }, []);

  const start = async () => {
    if (!qrRef.current) return;
    try {
      setStatus("Abriendo cámara…");
      // Intento 1: facingMode environment (cámara trasera)
      await qrRef.current.start(
        { facingMode: { exact: "environment" } as any },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanFailure
      );
      setIsRunning(true);
      setStatus("Apunta la cámara al QR");
      toast.success("Cámara activa (trasera)");
    } catch {
      // Intento 2: elegir manualmente la cámara trasera
      const cams = await Html5Qrcode.getCameras();
      if (!cams || cams.length === 0) {
        setStatus("No se encontraron cámaras");
        toast.error("No se encontraron cámaras");
        return;
      }
      // heurística: elegir la que diga back/trasera o la última
      const back =
        cams.find((c) =>
          (c.label || "").toLowerCase().includes("back")
        ) || cams[cams.length - 1];

      await qrRef.current.start(
        { deviceId: { exact: back.id } },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanFailure
      );
      setIsRunning(true);
      setStatus("Apunta la cámara al QR");
      toast.success(`Cámara activa: ${back.label || "trasera"}`);
    }
  };

  const stop = async () => {
    if (!qrRef.current) return;
    try {
      await qrRef.current.stop();
      await qrRef.current.clear();
      setIsRunning(false);
      setStatus("Cámara detenida");
      toast("Cámara detenida");
    } catch {
      // ignore
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Evita múltiples registros por el mismo frame
    if (!decodedText) return;

    try {
      const vis = await getVisitorByQR(decodedText.trim());
      if (!vis) {
        setStatus("QR no reconocido");
        toast.error("QR no reconocido");
        return;
      }
      await addVisit(vis.id);
      setStatus(`✅ Visita registrada: ${vis.firstName} ${vis.lastName}`);
      toast.success(`Visita registrada: ${vis.firstName} ${vis.lastName}`);
    } catch (err) {
      setStatus("Error al registrar. Intenta de nuevo.");
      toast.error("Error al registrar la visita");
    }
  };

  // Podemos ignorar fallas de frame a frame para no saturar
  const onScanFailure = (_: string) => {};

  return (
    <Card title="Escanear código QR" className="p-0 overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-lg"
            >
              Activar cámara (trasera)
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-5 py-3 rounded-2xl border text-lg"
            >
              Detener cámara
            </button>
          )}
          <p className="text-lg text-slate-700">{status}</p>
        </div>

        <div
          id={containerId}
          className="rounded-xl overflow-hidden bg-black/5 min-h-[260px]"
        />
        <ul className="text-sm text-slate-500 list-disc pl-5">
          <li>Si la cámara no abre en iPhone, asegúrate de usar HTTPS (tu dominio .web.app ya lo es).</li>
          <li>La app necesita permiso de cámara la primera vez.</li>
        </ul>
      </div>
    </Card>
  );
}
