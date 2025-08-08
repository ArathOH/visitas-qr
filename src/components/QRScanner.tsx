import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import { addVisit, getVisitorByQR } from '../lib/firestore'

export default function QRScanner(){
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<string>('Apunta la cámara al código QR')

  useEffect(()=>{
    if (!ref.current) return
    const scanner = new Html5QrcodeScanner(ref.current.id, { fps: 10, qrbox: 250 }, false)
    scanner.render(async (text)=>{
      try{
        const vis = await getVisitorByQR(text)
        if (!vis) { setStatus('QR no reconocido'); return }
        await addVisit(vis.id)
        setStatus(`Visita registrada: ${vis.firstName} ${vis.lastName}`)
      }catch(err){
        setStatus('Error al registrar. Intenta de nuevo.')
      }
    }, ()=>{})
    return ()=> { try { (scanner as any).clear() } catch{} }
  },[])

  return (
    <Card title="Escanear código QR">
      <div id="qr-reader" ref={ref} className="rounded-xl overflow-hidden" />
      <p className="mt-3 text-lg">{status}</p>
    </Card>
  )
}