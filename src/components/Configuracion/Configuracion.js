import React from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css"; // Importa el CSS
import { FaHome } from "react-icons/fa";


const Configuracion = () => {
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token de sesión
    navigate("/login"); // Redirige al login
  };
  

  return (

    
    <div className="config-container">
      <button className="logout-button" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      <button className="btn-back" onClick={() => navigate("/home")}>
  <FaHome size={24} />
</button>


      
    </div>
  );
};

export default Configuracion;
