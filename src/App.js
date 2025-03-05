import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import RegistroMuestras from "./components/RegistroMuestras/RegistroMuestras";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Usuarios from "./components/Usuarios/Usuarios"; 
import UsuariosRegistrados from "./components/UsuariosRegistrados/UsuariosRegistrados"; 
import Muestras from "./components/Muestras/Muestras";
import Configuracion from "./components/Configuracion/Configuracion";
import "./styles/variables.css";
import "./styles/globals.css";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro-muestras" element={<RegistroMuestras />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios-registrados" element={<UsuariosRegistrados />} />
          <Route path="/muestras" element={<Muestras />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
