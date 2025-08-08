import { useEffect, useState } from 'react'
import Card from './Card'
import { listVisits } from '../lib/firestore'
import { exportVisitsXLSX } from '../utils/csv'
import SearchInput from './SearchInput'
import DateRangePicker from './DateRangePicker'
import { fmtDate } from '../utils/ui'

export default function VisitsTable(){
  const [rows, setRows] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [range, setRange] = useState<{from?:string; to?:string}>({})

  const load = async ()=>{
    const from = range.from ? new Date(range.from).getTime() : undefined
    const to = range.to ? new Date(range.to + 'T23:59:59').getTime() : undefined
    const data = await listVisits({ from, to }, q)
    setRows(data)
  }

  useEffect(()=>{ load() },[q, range.from, range.to])

  const toExport = rows.map(r=> ({
    Fecha: fmtDate(r.ts),
    Nombre: `${r.visitor?.firstName ?? ''} ${r.visitor?.lastName ?? ''}`.trim(),
    Telefono: r.visitor?.phone ?? '',
    ...r.visitor?.dynamicAnswers,
  }))

  return (
    <Card title="Visitas registradas">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-3">
        <SearchInput value={q} onChange={setQ} />
        <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
        <button onClick={()=>exportVisitsXLSX(toExport)} className="px-4 py-2 rounded-xl bg-slate-900 text-white">Exportar a Excel</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-lg">
          <thead>
            <tr className="border-b">
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r:any)=> (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="py-2 pr-4">{fmtDate(r.ts)}</td>
                <td className="py-2 pr-4">{`${r.visitor?.firstName ?? ''} ${r.visitor?.lastName ?? ''}`}</td>
                <td className="py-2 pr-4">{r.visitor?.phone ?? ''}</td>
              </tr>
            ))}
            {rows.length===0 && (
              <tr><td colSpan={3} className="py-6 text-slate-500">Sin visitas en el rango seleccionado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}