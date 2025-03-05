import React, { useState } from "react";
import axios from "axios";
import "./RegistroMuestras.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Modal from "react-modal";

// Configurar el elemento principal para accesibilidad
Modal.setAppElement("#root");

const RegistroMuestras = () => {
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [tipoMuestreo, setTipoMuestreo] = useState("");
  const [analisisSeleccionados, setAnalisisSeleccionados] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [usuarioExiste, setUsuarioExiste] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validacionRealizada, setValidacionRealizada] = useState(false);
  const navigate = useNavigate();

  // Estados para el modal de registro de usuario
  const [registroModalIsOpen, setRegistroModalIsOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
    email: "",
    password: ""
  });

  const opcionesAnalisis = [
    "Aluminio", "Arsénico", "Bromo", "Cadmio", "Carbono Orgánico Total (COT)",
    "Cloro Residual", "Cloro Total", "Cloruros", "Cobalto", "Cobre",
    "Color Aparente", "Color Real", "Conductividad", "Cromo", "DBO5",
    "DQO", "Dureza Cálcica", "Dureza Magnésica", "Dureza Total", "Ortofosfatos",
    "Fósforo Total", "Hierro", "Magnesio", "Manganeso", "Mercurio",
    "Molibdeno", "Níquel", "Nitratos", "Nitritos", "Nitrógeno Amoniacal",
    "Nitrógeno Total", "Oxígeno Disuelto", "pH", "Plata", "Plomo",
    "Potasio", "Sólidos Sedimentables", "Sólidos Suspendidos", "Sólidos Totales",
    "Sulfatos", "Turbiedad", "Yodo", "Zinc"
  ];

  const handleAnalisisChange = (value) => {
    setAnalisisSeleccionados((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const validarUsuario = async () => {
    setError("");
    setNombre("");
    setLoading(true);
    setValidacionRealizada(false);
    if (!documento.trim()) {
      setError("Ingrese un documento para validar.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://unificado-u.onrender.com/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuarioEncontrado = response.data.find((user) => user.documento === documento);
      setUsuarioExiste(!!usuarioEncontrado);
      if (usuarioEncontrado) setNombre(usuarioEncontrado.nombre);
    } catch (error) {
      setError("Error al validar usuario. Intente nuevamente.");
    }
    setValidacionRealizada(true);
    setLoading(false);
  };

  const registrarMuestra = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    if (!documento || !fechaHora || !tipoMuestreo || analisisSeleccionados.length === 0) {
      setError("Todos los campos obligatorios deben estar completos.");
      setLoading(false);
      return;
    }
    try {
      // Se usa el endpoint de registro de muestra que no ha cambiado
      const response = await axios.post("https://backendregistromuestra.onrender.com/muestras/registrar", {
        documento,
        fechaHora,
        tipoMuestreo,
        analisisSeleccionados,
      });
      if (response.status === 201) {
        setSuccessMessage("Muestra registrada exitosamente.");
        setDocumento("");
        setFechaHora("");
        setTipoMuestreo("");
        setAnalisisSeleccionados([]);
        setNombre("");
      }
    } catch (error) {
      setError("Error al registrar la muestra. Intente nuevamente.");
    }
    setLoading(false);
  };

  // Funciones para el modal de registro de usuario
  const handleNuevoUsuarioChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const handleRegistrarUsuario = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://unificado-u.onrender.com/api/usuarios/registro",
        { ...nuevoUsuario, tipo: "cliente" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        // Asumimos que la respuesta retorna el usuario registrado en response.data.usuario
        setNombre(response.data.usuario.nombre);
        setUsuarioExiste(true);
        setRegistroModalIsOpen(false);
        alert("Usuario registrado con éxito.");
      }
    } catch (error) {
      alert("Error al registrar el usuario.");
    }
  };

  return (
    <>
      <div className="registro-container">
        <button className="btn-back" onClick={() => navigate("/home")}>
          <FaHome size={24} />
        </button>

        <div className="registro-card">
          <div className="header">
            <img src={logo} alt="Logo" className="logo" />
            <h2>Registro de Muestras</h2>
          </div>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {loading && <p className="loading-message">Cargando...</p>}

          <form className="registro-form" onSubmit={registrarMuestra}>
            <div className="form-group">
              <label>Documento Cliente</label>
              <div className="documento-container">
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-validar"
                  onClick={validarUsuario}
                  disabled={loading}
                >
                  {loading ? "Validando..." : "Validar"}
                </button>
                {(!loading && validacionRealizada && !usuarioExiste && documento.trim() !== "") && (
                  <button
                    type="button"
                    className="btn-registrar-usuario"
                    onClick={() => {
                      setNuevoUsuario({
                        nombre: "",
                        documento: documento,
                        telefono: "",
                        direccion: "",
                        email: "",
                        password: ""
                      });
                      setRegistroModalIsOpen(true);
                    }}
                  >
                    Registrar Usuario
                  </button>
                )}
              </div>
            </div>

            {usuarioExiste && (
              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input type="text" value={nombre} readOnly />
              </div>
            )}

            <div className="form-group">
              <label>Fecha y Hora</label>
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Muestreo</label>
              <input
                type="text"
                value={tipoMuestreo}
                onChange={(e) => setTipoMuestreo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Análisis a Realizar</label>
              <div className="analisis-container">
                <div className="analisis-grid">
                  {opcionesAnalisis.map((opcion) => (
                    <div
                      key={opcion}
                      className={`analisis-item ${analisisSeleccionados.includes(opcion) ? "seleccionado" : ""}`}
                      onClick={() => handleAnalisisChange(opcion)}
                    >
                      <input
                        type="checkbox"
                        value={opcion}
                        checked={analisisSeleccionados.includes(opcion)}
                        readOnly
                      />
                      {opcion}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal para registrar un nuevo usuario */}
      <Modal
        isOpen={registroModalIsOpen}
        onRequestClose={() => setRegistroModalIsOpen(false)}
        contentLabel="Registrar Usuario"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            borderRadius: "12px",
            width: "450px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)"
          }
        }}
      >
        <div style={{ width: "100%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Registrar Usuario</h2>
          <form onSubmit={handleRegistrarUsuario} style={{ display: "grid", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Documento:</label>
              <input
                type="text"
                name="documento"
                value={nuevoUsuario.documento}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
                readOnly
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={nuevoUsuario.nombre}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={nuevoUsuario.telefono}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={nuevoUsuario.direccion}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={nuevoUsuario.email}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={nuevoUsuario.password}
                onChange={handleNuevoUsuarioChange}
                required
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setRegistroModalIsOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2F80ED",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RegistroMuestras;
