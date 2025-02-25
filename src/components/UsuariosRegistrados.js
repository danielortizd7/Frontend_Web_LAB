import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UsuariosRegistrados.css"; 

const UsuariosRegistrados = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get("https://apis-09nf.onrender.com/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  return (
    <div className="usuarios-container">
      <h1 className="usuarios-title">Usuarios Registrados</h1>

      <div className="table-wrapper">
        <div className="table-responsive">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, index) => (
                  <tr key={usuario.id}>
                    <td>{index + 1}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.documento}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.direccion}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.nombre_usuario}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-users">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosRegistrados;
