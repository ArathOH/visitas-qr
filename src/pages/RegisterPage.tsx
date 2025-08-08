import RegisterForm from '../components/RegisterForm'
import QRDisplay from '../components/QRDisplay'
import { useState } from 'react'
import type { Visitor } from '../types/models'

export default function RegisterPage(){
  const [v, setV] = useState<Visitor | null>(null)
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {!v && <RegisterForm onDone={setV} />} 
      {v && <QRDisplay qrId={v.qrId} />}
    </div>
  )
}