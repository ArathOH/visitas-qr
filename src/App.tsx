import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import RegisterPage from './pages/RegisterPage'
import MyQRPage from './pages/MyQRPage'
import ScanPage from './pages/ScanPage'
import VisitsPage from './pages/VisitsPage'

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <main className="bg-slate-50 min-h-[calc(100vh-56px)]">
        <Routes>
          <Route path="/" element={<Navigate to="/registrar" />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/mi-qr" element={<MyQRPage />} />
          <Route path="/escanear" element={<ScanPage />} />
          <Route path="/visitas" element={<VisitsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )}