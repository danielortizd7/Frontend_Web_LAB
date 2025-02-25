import React, { useState } from "react";
import axios from "axios";
import "./RegistroMuestras.css";
import logo from "../assets/logo.png";

const RegistroMuestras = () => {
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioExiste, setUsuarioExiste] = useState(null);
  const [tipoAgua, setTipoAgua] = useState("");
  const [otroTipoAgua, setOtroTipoAgua] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [id_muestra, setIdMuestra] = useState("");
  const [tipoMuestreo, setTipoMuestreo] = useState("");
  const [analisisSeleccionados, setAnalisisSeleccionados] = useState([]);

  const opcionesAnalisis = [
    { value: "aluminio", label: "Aluminio" },
    { value: "arsenico", label: "Arsénico" },
    { value: "bromo", label: "Bromo" },
    { value: "cadmio", label: "Cadmio" },
    { value: "cot", label: "Carbono Orgánico Total (COT)" },
    { value: "cloro_residual", label: "Cloro Residual" },
    { value: "cloro_total", label: "Cloro Total" },
    { value: "cloruros", label: "Cloruros" },
    { value: "cobalto", label: "Cobalto" },
    { value: "cobre", label: "Cobre" },
    { value: "color_aparente", label: "Color Aparente" },
    { value: "color_real", label: "Color Real" },
    { value: "conductividad", label: "Conductividad" },
    { value: "cromo", label: "Cromo" },
    { value: "dbo5", label: "Demanda Bioquímica de Oxígeno (DBO5)" },
    { value: "dqo", label: "Demanda Química de Oxígeno (DQO)" },
    { value: "dureza_calcica", label: "Dureza Cálcica" },
    { value: "dureza_magnesica", label: "Dureza Magnésica" },
    { value: "dureza_total", label: "Dureza Total" },
    { value: "ortofosfatos", label: "Ortofosfatos" },
    { value: "fosforo_total", label: "Fósforo Total" },
    { value: "hierro", label: "Hierro" },
    { value: "magnesio", label: "Magnesio" },
    { value: "manganeso", label: "Manganeso" },
    { value: "mercurio", label: "Mercurio" },
    { value: "molibdeno", label: "Molibdeno" },
    { value: "niquel", label: "Níquel" },
    { value: "nitratos", label: "Nitratos" },
    { value: "nitritos", label: "Nitritos" },
    { value: "nitrogeno_amoniacal", label: "Nitrógeno Amoniacal" },
    { value: "nitrogeno_total", label: "Nitrógeno Total" },
    { value: "oxigeno_disuelto", label: "Oxígeno Disuelto" },
    { value: "ph", label: "pH" },
    { value: "plata", label: "Plata" },
    { value: "plomo", label: "Plomo" },
    { value: "potasio", label: "Potasio" },
    { value: "solidos_sedimentables", label: "Sólidos Sedimentables" },
    { value: "solidos_suspendidos", label: "Sólidos Suspendidos" },
    { value: "solidos_totales", label: "Sólidos Totales" },
    { value: "sulfatos", label: "Sulfatos" },
    { value: "turbiedad", label: "Turbiedad" },
    { value: "yodo", label: "Yodo" },
    { value: "zinc", label: "Zinc" },
  ];


  const handleAnalisisChange = (value) => {
    setAnalisisSeleccionados((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const validarUsuario = async () => {
    setError(""); 
    setNombre("");

    if (!documento.trim()) {
      setError("Ingrese un documento para validar.");
      return;
    }

    try {
      const response = await axios.get("https://apis-09nf.onrender.com/usuarios");
      const usuarioEncontrado = response.data.find((user) => user.documento === documento);

      if (usuarioEncontrado) {
        setNombre(usuarioEncontrado.nombre);
        setUsuarioExiste(true);
      } else {
        setUsuarioExiste(false);
      }
    } catch (error) {
      setError("Error al validar usuario. Intente nuevamente.");
      console.error("Error al validar usuario:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!documento || !tipoAgua || !fechaHora || !tipoMuestreo || analisisSeleccionados.length === 0) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }
    setSuccessMessage("Muestra registrada exitosamente.");
    setIdMuestra("12345");
    setError("");
  };
  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    if (!nombre || !documento || !telefono || !direccion || !correo || !nombre_usuario || !contraseña) {
      setError("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      const response = await axios.post("https://apis-09nf.onrender.com/usuarios", {
        nombre,
        documento,
        telefono,
        direccion,
        correo,
        nombre_usuario,
        contraseña
      });
  
      if (response.status === 201) {
        setSuccessMessage("Usuario registrado exitosamente.");
        setModalOpen(false);
        setUsuarioExiste(true);
        setNombre(response.data.nombre);
      }
    } catch (error) {
      setError("Error al registrar usuario. Intente nuevamente.");
      console.error("Error al registrar usuario:", error);
    }
  };

  const registrarMuestra = async (e) => {
    e.preventDefault(); 
    setError("");
    setSuccessMessage("");
  
    if (!documento || !tipoAgua || !fechaHora || !tipoMuestreo || analisisSeleccionados.length === 0) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }
  
    try {
      const response = await axios.post("https://backendregistromuestra.onrender.com/muestras/registrar", {
        documento,
        tipoAgua,
        otroTipoAgua: tipoAgua === "otro" ? otroTipoAgua : null, 
        fechaHora,
        tipoMuestreo,
        analisis: analisisSeleccionados, // Lista de análisis seleccionados
      });
  
      if (response.status === 201) {
        setSuccessMessage("Muestra registrada exitosamente.");
        setIdMuestra(response.data.id_muestra); 
        
        setDocumento("");
        setTipoAgua("");
        setOtroTipoAgua("");
        setFechaHora("");
        setTipoMuestreo("");
        setAnalisisSeleccionados([]);
        setNombre("");
      }
      
    } catch (error) {
      setError("Error al registrar la muestra. Intente nuevamente.");
      console.error("Error al registrar muestra:", error);
    }
  };
  
  

  return (
    <div className="form-container">
      <div className="logo">
        <img src={logo} alt="Logo del laboratorio" />
      </div>

      <h2>Registro de Muestras</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={registrarMuestra}>

        <label htmlFor="documento">Documento Cliente</label>
        <div className="documento-container">
          <input
            type="text"
            id="documento"
            placeholder="Ingrese el documento"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
          />
          <button type="button" onClick={validarUsuario}>
            Validar
          </button>
        </div>

        {usuarioExiste === true && (
          <div>
            <label htmlFor="nombre">Nombre del Cliente</label>
            <input type="text" id="nombre" value={nombre} readOnly />
          </div>
        )}

        {usuarioExiste === false && (
          <button type="button" onClick={() => setModalOpen(true)}>
            Registrar Usuario
          </button>
        )}

        <label htmlFor="tipoAgua">Tipo de Agua</label>
        <select id="tipoAgua" value={tipoAgua} onChange={(e) => setTipoAgua(e.target.value)} required>
          <option value="">Seleccione tipo de agua</option>
          <option value="natural">Agua Natural</option>
          <option value="potable">Agua Potable</option>
          <option value="residual">Agua Residual</option>
          <option value="otro">Otro</option>
        </select>

        {tipoAgua === "otro" && (
          <div>
            <label htmlFor="otroTipoAgua">Especifique el tipo de agua</label>
            <input type="text" id="otroTipoAgua" value={otroTipoAgua} onChange={(e) => setOtroTipoAgua(e.target.value)} required />
          </div>
        )}

        <label htmlFor="fechaHora">Fecha y Hora</label>
        <input type="datetime-local" id="fechaHora" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required />

        {id_muestra && (
  <div>
    <label htmlFor="id_muestra">ID de Muestra (Código Único)</label>
    <input type="text" id="id_muestra" value={id_muestra} readOnly />
  </div>
)}


        <label htmlFor="tipoMuestreo">Tipo de Muestreo</label>
        <input type="text" id="tipoMuestreo" value={tipoMuestreo} onChange={(e) => setTipoMuestreo(e.target.value)} required />

        <label htmlFor="analisis">Análisis a Realizar</label>
        <div className="analisis-grid">
          {opcionesAnalisis.map((opcion) => (
            <div key={opcion.value} className="opcion-analisis">
              <input type="checkbox" id={opcion.value} value={opcion.value} checked={analisisSeleccionados.includes(opcion.value)} onChange={() => handleAnalisisChange(opcion.value)} />
              <label htmlFor={opcion.value}>{opcion.label}</label>
            </div>
          ))}
        </div>

        <button type="submit">Registrar</button>
      </form>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Registrar Cliente</h3>
            <form onSubmit={registrarUsuario}>
  <label htmlFor="nombre">Nombre</label>
  <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

  <label htmlFor="documento">Documento</label>
  <input type="text" id="documento" value={documento} onChange={(e) => setDocumento(e.target.value)} required />

  <label htmlFor="telefono">Teléfono</label>
  <input type="text" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

  <label htmlFor="direccion">Dirección</label>
  <input type="text" id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

  <label htmlFor="correo">Correo</label>
  <input type="email" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

  <label htmlFor="nombre_usuario">Nombre de Usuario</label>
  <input type="text" id="nombre_usuario" value={nombre_usuario} onChange={(e) => setNombre_usuario(e.target.value)} required />

  <label htmlFor="contraseña">Contraseña</label>
  <input type="password" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />

  {error && <p className="error-message">{error}</p>}
  {successMessage && <p className="success-message">{successMessage}</p>}

  <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
  <button type="submit">Registrar</button>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroMuestras;