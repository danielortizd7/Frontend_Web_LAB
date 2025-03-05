import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Importamos el icono de casa
import "./Usuarios.css"; 

const Usuarios = () => {
  const navigate = useNavigate();

  return (
    <div className="gestion-usuarios-container">
      {/* Botón para regresar a Home */}
      <button className="btn-back" onClick={() => navigate("/home")}>
        <FaHome size={24} />
      </button>

      {/* Título y descripción */}
      <h1>Gestión de Usuarios</h1>
      <p>Selecciona una opción:</p>

      {/* Botones de opciones */}
      <div className="gestion-usuarios-buttons">
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
