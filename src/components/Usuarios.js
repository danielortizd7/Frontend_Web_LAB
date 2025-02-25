import React from "react";
import { useNavigate } from "react-router-dom";
import "./Usuarios.css"; 

const Usuarios = () => {
  const navigate = useNavigate();

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarios</h1>
      <p>Selecciona una opción:</p>

      <div className="usuarios-buttons">
        <button className="btn-usuarios" onClick={() => navigate("/Register")}>
          ➕ Registrar Usuario
        </button>
        <button className="btn-usuarios" onClick={() => navigate("/usuarios-registrados")}>
          📋 Ver Usuarios Registrados
        </button>
      </div>
    </div>
  );
};

export default Usuarios;
