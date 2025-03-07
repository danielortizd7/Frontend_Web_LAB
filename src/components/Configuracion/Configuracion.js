import React from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css"; 
import { FaHome } from "react-icons/fa";


const Configuracion = () => {
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
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
