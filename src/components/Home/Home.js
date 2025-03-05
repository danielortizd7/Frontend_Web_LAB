import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaVials, FaFileAlt, FaClipboardList, FaSignature, FaCog } from "react-icons/fa";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Estados para almacenar los datos de la API
  const [usuariosTotal, setUsuariosTotal] = useState(0);
  const [muestrasHoy, setMuestrasHoy] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No hay token disponible, el usuario debe autenticarse.");
      setError("No hay sesión activa. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Obtener total de usuarios
    axios.get("https://unificado-u.onrender.com/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setUsuariosTotal(response.data.length);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        if (error.response && error.response.status === 401) {
          setError("Sesión expirada. Redirigiendo al login...");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 2000);
        }
      });

    // Obtener muestras registradas hoy
    axios.get("https://backendregistromuestra.onrender.com/muestras")
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("Error: la respuesta de la API no es un array.");
          return;
        }
        const hoy = new Date().toISOString().split("T")[0];
        const muestrasDeHoy = response.data.filter(muestra => muestra.fechaHora?.startsWith(hoy));
        setMuestrasHoy(muestrasDeHoy.length);
      })
      .catch((error) => console.error("Error al obtener muestras:", error));

  }, [navigate]);

  return (
    <div className="home-container">
      {/* Barra de navegación superior */}
      <nav className="menu-bar">
        <button className="menu-item" onClick={() => navigate("/usuarios")}>
          <FaUsers className="menu-icon" />
          Usuarios
        </button>
        <button className="menu-item" onClick={() => navigate("/registro-muestras")}>
          <FaVials className="menu-icon" />
          Muestras
        </button>
        <button className="menu-item" onClick={() => navigate("/ingreso-resultados")}>
          <FaFileAlt className="menu-icon" />
          Resultados
        </button>
        <button className="menu-item" onClick={() => navigate("/Muestras")}>
          <FaClipboardList className="menu-icon" />
          Informes
        </button>
        <button className="menu-item" onClick={() => navigate("/firma-electronica")}>
          <FaSignature className="menu-icon" />
          Firma
        </button>
        <button className="menu-item" onClick={() => navigate("/configuracion")}>
          <FaCog className="menu-icon" />
          Configuración
        </button>
      </nav>

      {/* Contenido principal */}
      <div className="home-content">
        <h1>Bienvenido a la plataforma</h1>

        {error && <p className="error-message">{error}</p>}

        {/* Widgets informativos con datos de la API */}
        <div className="widgets-container">
          <div className="widget">
            <FaUsers className="widget-icon" />
            <div>
              <h3>Usuarios</h3>
              <p>{usuariosTotal} registrados</p>
            </div>
          </div>
          <div className="widget">
            <FaVials className="widget-icon" />
            <div>
              <h3>Muestras</h3>
              <p>{muestrasHoy} registradas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
