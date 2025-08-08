import { cls } from '../utils/ui'

export default function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cls('bg-white rounded-2xl shadow p-4 sm:p-6 border border-slate-200', className)}>
      {title && <h2 className="text-xl font-semibold mb-3 text-slate-800">{title}</h2>}
      {children}
    </section>
  )
}