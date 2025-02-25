import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import RegistroMuestras from "./components/RegistroMuestras";
import Home from "./components/Home";
import Register from "./components/Register";
import Usuarios from "./components/Usuarios"; 
import UsuariosRegistrados from "./components/UsuariosRegistrados"; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {}
          <Route path="/login" element={<Login />} />
          <Route path="/registro-muestras" element={<RegistroMuestras />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios-registrados" element={<UsuariosRegistrados />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
