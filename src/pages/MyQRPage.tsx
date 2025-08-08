import { useEffect, useState } from 'react'
import { getVisitor } from '../lib/firestore'
import QRDisplay from '../components/QRDisplay'

// En una app real, obtendrías el visitorId de Auth o localStorage
export default function MyQRPage(){
  const [qr, setQr] = useState<string>('')
  useEffect(()=>{ (async()=>{
    const stored = localStorage.getItem('visitorId')
    if (!stored) return
    const v = await getVisitor(stored)
    if (v) setQr(v.qrId)
  })() },[])
  return (
    <div className="max-w-3xl mx-auto p-4">
      {qr ? <QRDisplay qrId={qr} /> : <p className="text-lg">No se encontró tu QR en este dispositivo.</p>}
    </div>
  )
}