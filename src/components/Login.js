import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import logo from "../assets/logo.png"; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar estado cuando el componente se monta
    setUsername('');
    setPassword('');
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length > 10) {
      setError('⚠ La contraseña no puede tener más de 10 caracteres.');
      return;
    }

    try {
      const response = await axios.post('https://apis-09nf.onrender.com/usuarios/login', {
        nombre_usuario: username,
        contraseña: password,
      });

      if (response.data.usuario) {
        setError('');
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError('⚠ Credenciales inválidas');
      }
    } catch (error) {
      setError('⚠ Error al iniciar sesión. Verifica tus datos.');
    }
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

          <div className="grupo-input">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
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

          <button type="submit" className="boton-iniciar">Iniciar sesión</button>

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
