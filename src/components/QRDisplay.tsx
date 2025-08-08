import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import Card from './Card'

export default function QRDisplay({ qrId }:{ qrId:string }){
  const [url, setUrl] = useState<string>('')
  useEffect(()=>{ (async()=> setUrl(await QRCode.toDataURL(qrId, { margin:1, width:256 })))() },[qrId])
  return (
    <Card title="Tu código QR">
      <div className="flex flex-col items-center gap-3">
        {url && <img src={url} alt="QR" className="w-48 h-48"/>}
        <p className="text-center text-slate-600">Guárdalo en tu teléfono. Cada vez que lo escaneen, quedará registrada tu visita.</p>
        {url && (
          <a download={`mi-qr.png`} href={url} className="px-4 py-2 rounded-xl border">Descargar</a>
        )}
      </div>
    </Card>
  )
}