import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const link = 'px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700'
  const active = 'bg-slate-900 text-white hover:bg-slate-900'
  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-5xl mx-auto flex items-center justify-between p-2">
        <div className="font-bold text-lg">Visitas QR</div>
        <div className="flex gap-2">
          <NavLink to="/registrar" className={({isActive}) => `${link} ${isActive?active:''}`}>Registrar</NavLink>
          <NavLink to="/mi-qr" className={({isActive}) => `${link} ${isActive?active:''}`}>Mi QR</NavLink>
          <NavLink to="/escanear" className={({isActive}) => `${link} ${isActive?active:''}`}>Escanear</NavLink>
          <NavLink to="/visitas" className={({isActive}) => `${link} ${isActive?active:''}`}>Visitas</NavLink>
        </div>
      </nav>
    </header>
  )
}