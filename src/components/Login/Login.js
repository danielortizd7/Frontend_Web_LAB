import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length > 10) {
      setError('⚠ La contraseña no puede tener más de 10 caracteres.');
      setLoading(false);
      return;
    }

    console.log("📩 Enviando datos:", { email, password });

    try {
      const response = await axios.post(
        'https://unificado-u.onrender.com/api/usuarios/login',
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Respuesta del backend:", response.data);

      if (response.data.token) {
        setError('');
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError('⚠ Credenciales inválidas');
      }
    } catch (error) {
      console.error(
        "❌ Error en la solicitud:",
        error.response ? error.response.data : error.message
      );

      if (error.response) {
        setError(
          error.response.data.message ||
          error.response.data.error ||
          '⚠ Error al iniciar sesión.'
        );
      } else {
        setError('⚠ Error de conexión con el servidor.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="contenedor-login">
      <div className="caja-login">
        <div className="logo">
          <img src={logo} alt="Logo de la empresa" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Iniciar sesión</h2>
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">Cargando...</div>}

          <div className="grupo-input">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
                setError('');
              }}
              required
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <button type="submit" className="boton-iniciar" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          <div className="register-link">
            ¿No tienes una cuenta?  
            <span 
              onClick={() => navigate('/register')} 
              style={{ cursor: "pointer", color: "blue", marginLeft: "5px" }}
            >
              Regístrate aquí
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
