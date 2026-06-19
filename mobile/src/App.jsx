import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import MisReservas from './pages/MisReservas';
import DetalleLugar from './pages/DetalleLugar';
import RecuperarPassword from './pages/RecuperarPassword';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/lugar/:id" element={<DetalleLugar />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
      </Routes>
    </BrowserRouter>
  );
}