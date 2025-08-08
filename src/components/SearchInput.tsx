export default function SearchInput({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  return (
    <input
      value={value}
      onChange={e=>onChange(e.target.value)}
      placeholder="Buscar por nombre…"
      className="w-full sm:w-80 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-lg"
    />
  )
}