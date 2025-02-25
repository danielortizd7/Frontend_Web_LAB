import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './Register.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        documento: '',
        telefono: '',
        direccion: '',
        correo: '',
        nombre_usuario: '',
        contraseña: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        console.log("Datos a enviar:", formData);

        if (!formData.nombre || !formData.documento || !formData.telefono || !formData.direccion || !formData.correo || !formData.nombre_usuario || !formData.contraseña) {
            setError('⚠ Todos los campos son obligatorios.');
            return;
        }

        if (formData.contraseña.length < 6 || formData.contraseña.length > 10) {
            setError('⚠ La contraseña debe tener entre 6 y 10 caracteres.');
            return;
        }

        if (!/^\d{10}$/.test(formData.telefono)) {
            setError('⚠ El teléfono debe tener 10 dígitos.');
            return;
        }

        if (!/^\d+$/.test(formData.documento)) { 
            setError('⚠ El documento solo debe contener números.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            setError('⚠ El correo electrónico no es válido.');
            return;
        }

        try {
            const response = await axios.post('https://apis-09nf.onrender.com/usuarios', formData);
            console.log('✔ Registro exitoso:', response.data);
            setSuccess('✔ Registro exitoso.');

            setFormData({
                nombre: '',
                documento: '',
                telefono: '',
                direccion: '',
                correo: '',
                nombre_usuario: '',
                contraseña: ''
            });

        } catch (error) {
            console.error("Error en la solicitud:", error);
            if (error.response) {
                setError(error.response.data.error || 'Error en el servidor.');
            } else if (error.request) {
                setError('⚠ Error de red. Verifica tu conexión.');
            } else {
                setError('⚠ Ocurrió un error inesperado.');
            }
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Registro</h2>

                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        {success}
                        <br />
                        <Link to="/login" className="go-to-login">
                            Ir a Login
                        </Link>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="documento">Documento</label>
                    <input type="text" id="documento" name="documento" value={formData.documento} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="correo">Correo Electrónico</label>
                    <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="nombre_usuario">Nombre de Usuario</label>
                    <input type="text" id="nombre_usuario" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="contraseña">Contraseña</label>
                    <input type="password" id="contraseña" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
                </div>

                <button type="submit">Registrarse</button>

                <div className="login-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
