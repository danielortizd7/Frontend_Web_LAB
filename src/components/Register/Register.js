import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    tipo: "",
    nombre: "",
    documento: "",
    telefono: "",
    direccion: "",
    email: "",
    password: "",
    especialidad: "",
    codigoSeguridad: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromMenu = location.state?.fromMenu || false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validación de campos obligatorios
    if (
      !formData.tipo ||
      !formData.nombre ||
      !formData.documento ||
      !formData.telefono ||
      !formData.direccion ||
      !formData.email ||
      !formData.password
    ) {
      setError("⚠ Todos los campos obligatorios deben completarse.");
      setLoading(false);
      return;
    }

    console.log("📩 Datos a enviar:", JSON.stringify(formData, null, 2));

    try {
      const response = await axios.post(
        "https://unificado-u.onrender.com/api/usuarios/registro",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✔ Registro exitoso:", response.data);
      setSuccess("✔ Registro exitoso.");
      setLoading(false);

      // Limpiar formulario
      setFormData({
        tipo: "",
        nombre: "",
        documento: "",
        telefono: "",
        direccion: "",
        email: "",
        password: "",
        especialidad: "",
        codigoSeguridad: ""
      });

      // Redirigir a la pantalla de login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(
        "❌ Error en la solicitud:",
        error.response ? error.response.data : error.message
      );
      if (error.response) {
        setError(
          error.response.data.message ||
          error.response.data.error ||
          "⚠ Error en el registro."
        );
      } else {
        setError("⚠ Error de conexión con el servidor.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registro</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {loading && <div className="loading-message">Registrando...</div>}

        <label>Tipo de usuario:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="">Seleccionar tipo</option>
          <option value="cliente">Cliente</option>
          <option value="laboratorista">Laboratorista</option>
          <option value="administrador">Administrador</option>
          <option value="super_admin">Super Administrador</option>
        </select>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {formData.tipo === "laboratorista" && (
          <input
            type="text"
            name="especialidad"
            placeholder="Especialidad"
            value={formData.especialidad}
            onChange={handleChange}
          />
        )}

        {formData.tipo === "super_admin" && (
          <input
            type="text"
            name="codigoSeguridad"
            placeholder="Código de seguridad"
            value={formData.codigoSeguridad}
            onChange={handleChange}
          />
        )}

        {formData.tipo === "administrador" && (
          <div>
            <p>Nivel de acceso: 1</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {fromMenu && (
          <button type="button" onClick={() => navigate("/home")} className="boton-volver">
            Volver al Menú Principal
          </button>
        )}

        <div className="login-link">
          ¿Ya tienes una cuenta?{" "}
          <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>
            Inicia sesión aquí
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;
