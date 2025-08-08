export default function DateRangePicker({ from, to, onChange }:{ from?: string; to?: string; onChange:(a:{from?:string;to?:string})=>void }){
  return (
    <div className="flex gap-2 items-center">
      <input type="date" value={from} onChange={e=>onChange({from:e.target.value,to})} className="px-3 py-2 rounded-xl border" />
      <span className="text-slate-600">a</span>
      <input type="date" value={to} onChange={e=>onChange({from,to:e.target.value})} className="px-3 py-2 rounded-xl border" />
    </div>
  )
}