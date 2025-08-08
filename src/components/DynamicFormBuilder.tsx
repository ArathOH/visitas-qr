import { useState } from 'react'
import type { DynamicField } from '../types/models'
import Card from './Card'

export default function DynamicFormBuilder({ initial, onSave }:{ initial: DynamicField[]; onSave:(f:DynamicField[])=>void }){
  const [fields, setFields] = useState<DynamicField[]>(initial)

  const addField = () => setFields([...fields, { id: crypto.randomUUID(), label: 'Nuevo campo', type:'text', required:false }])
  const remove = (id:string)=> setFields(fields.filter(f=>f.id!==id))

  const update = (id:string, patch: Partial<DynamicField>) => setFields(fields.map(f=> f.id===id ? { ...f, ...patch } : f))

  return (
    <Card title="Campos adicionales (opcionales)">
      <div className="space-y-3">
        {fields.map(f=> (
          <div key={f.id} className="grid sm:grid-cols-4 gap-2 items-center">
            <input value={f.label} onChange={e=>update(f.id,{label:e.target.value})} className="border rounded-xl px-3 py-2"/>
            <select value={f.type} onChange={e=>update(f.id,{type:e.target.value as any})} className="border rounded-xl px-3 py-2">
              <option value="text">Texto</option>
              <option value="tel">Teléfono</option>
              <option value="email">Email</option>
              <option value="number">Número</option>
            </select>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!f.required} onChange={e=>update(f.id,{required:e.target.checked})}/> Requerido</label>
            <button onClick={()=>remove(f.id)} className="text-red-600 hover:underline">Eliminar</button>
          </div>  
        ))}
        <div className="flex gap-2">
          <button onClick={addField} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Agregar campo</button>
          <button onClick={()=>onSave(fields)} className="px-4 py-2 rounded-xl border">Guardar cambios</button>
        </div>
      </div>
    </Card>
  )
}