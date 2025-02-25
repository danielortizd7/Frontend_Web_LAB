import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

import iconMuestras from "../assets/muestras.png";
import iconResultados from "../assets/resultados.png";
import iconConfiguracion from "../assets/configuracion.png";
import iconReportes from "../assets/informes.png"; 
import iconGestion from "../assets/gestion.jpg";
import iconFirma from "../assets/firma.png"; 



const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {}
      <nav className="menu-bar">
        <button className="menu-item" onClick={() => navigate("/usuarios")}>
          <img src={iconGestion} alt="Usuarios" />
          Usuarios
        </button>

        <button className="menu-item" onClick={() => navigate("/registro-muestras")}>
          <img src={iconMuestras} alt="Gestión de muestras" />
          Muestras
        </button>

        <button className="menu-item" onClick={() => navigate("/ingreso-resultados")}>
          <img src={iconResultados} alt="Ingreso de resultados" />
          Resultados
        </button>

        <button className="menu-item" onClick={() => navigate("/generar-reportes")}>
          <img src={iconReportes} alt="Generar Reportes" />
          Reportes
        </button>

        <button className="menu-item" onClick={() => navigate("/firma-electronica")}>
          <img src={iconFirma} alt="Firma Electrónica" />
          Firma
        </button>

        <button className="menu-item" onClick={() => navigate("/configuracion")}>
          <img src={iconConfiguracion} alt="Configuración" />
          Configuración
        </button>
      </nav>

      {}
      <div className="home-content">
        <h1>Bienvenido a la plataforma</h1>
      </div>
      
      
      
    </div>
    
  );
};

export default Home;