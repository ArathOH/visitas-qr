import { useEffect, useState } from 'react'
import Card from './Card'
import type { DynamicField, Visitor } from '../types/models'
import { createOrUpdateVisitor, getFieldDefinition } from '../lib/firestore'

export default function RegisterForm({ onDone }:{ onDone:(v:Visitor)=>void }){
  const [firstName, setFirst] = useState('')
  const [lastName, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [dyn, setDyn] = useState<DynamicField[]>([])
  const [answers, setAns] = useState<Record<string, any>>({})

  useEffect(()=>{ (async()=> setDyn(await getFieldDefinition()))() },[])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const qrId = crypto.randomUUID()
    const v: Visitor = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      dynamicAnswers: answers,
      qrId,
      createdAt: Date.now(),
    }
    await createOrUpdateVisitor(v)
    localStorage.setItem('visitorId', v.id)
    onDone(v)
  }

  const can = firstName.trim() && lastName.trim()

  return (
    <Card title="Registro de visitante">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input required value={firstName} onChange={e=>setFirst(e.target.value)} placeholder="Nombre" className="px-4 py-3 rounded-xl border text-lg"/>
          <input required value={lastName} onChange={e=>setLast(e.target.value)} placeholder="Apellido" className="px-4 py-3 rounded-xl border text-lg"/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Teléfono" className="px-4 py-3 rounded-xl border text-lg"/>
        </div>

        {dyn.length>0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Campos adicionales</h3>
            {dyn.map(f=> (
              <div key={f.id} className="grid sm:grid-cols-3 gap-2 items-center">
                <label className="text-slate-700">{f.label}{f.required && ' *'}</label>
                <input
                  required={!!f.required}
                  type={f.type}
                  onChange={e=>setAns({...answers, [f.label]: e.target.value})}
                  className="px-3 py-2 rounded-xl border"
                />
              </div>
            ))}
          </div>
        )}

        <button disabled={!can} className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-green-600 text-white text-lg disabled:opacity-50">Guardar y generar QR</button>
      </form>
    </Card>
  )
}