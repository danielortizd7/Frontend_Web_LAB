import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UsuariosRegistrados.css";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Modal from "react-modal";

// Configurar el elemento principal para accesibilidad
Modal.setAppElement("#root");

const UsuariosRegistrados = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estados para el modal de edición
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://unificado-u.onrender.com/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        setLoading(false);
      });
  }, []);

  const usuariosFiltrados = filtro
    ? usuarios.filter((usuario) => usuario.rol?.nombre === filtro)
    : usuarios;

  // Abre el modal y carga el usuario seleccionado
  const handleEdit = (id) => {
    const userToEdit = usuarios.find((user) => user._id === id);
    setSelectedUser(userToEdit);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    // Construir objeto solo con los campos permitidos
    const updatedData = {
      nombre: selectedUser.nombre,
      documento: selectedUser.documento,
      telefono: selectedUser.telefono,
      direccion: selectedUser.direccion,
      email: selectedUser.email,
    };
    try {
      const response = await axios.put(
        `https://unificado-u.onrender.com/api/usuarios/${selectedUser._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUser =
        response.data && response.data._id
          ? response.data
          : { ...selectedUser, ...updatedData };
      const updatedUsers = usuarios.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      setUsuarios(updatedUsers);
      closeModal();
      alert("Usuario actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Error al actualizar el usuario.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`https://unificado-u.onrender.com/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(usuarios.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar usuario");
      }
    }
  };

  return (
    <div className="usuarios-container">
      <button className="btn-back" onClick={() => navigate("/home")}>
        <FaHome size={24} />
      </button>
      <div className="usuarios-registrados-container">
        {/* Sidebar: Barra vertical de filtros */}
        <div className="sidebar">
          <h3>Filtrar por tipo</h3>
          <button
            className={filtro === "cliente" ? "active-filter" : ""}
            onClick={() => setFiltro("cliente")}
          >
            Clientes
          </button>
          <button
            className={filtro === "laboratorista" ? "active-filter" : ""}
            onClick={() => setFiltro("laboratorista")}
          >
            Laboratoristas
          </button>
          <button
            className={filtro === "administrador" ? "active-filter" : ""}
            onClick={() => setFiltro("administrador")}
          >
            Administradores
          </button>
          <button
            className={filtro === "super_admin" ? "active-filter" : ""}
            onClick={() => setFiltro("super_admin")}
          >
            Super Admins
          </button>
          <button
            className={!filtro ? "active-filter" : ""}
            onClick={() => setFiltro(null)}
          >
            Todos
          </button>
        </div>

        {/* Área principal: Tabla de usuarios con scroll */}
        <div className="main-content">
          <div className="usuarios-card">
            {loading ? (
              <div className="loading-message">Cargando usuarios...</div>
            ) : (
              <table className="usuarios-tabla">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Opción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario, index) => (
                      <tr key={usuario._id || index}>
                        <td>{index + 1}</td>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.documento}</td>
                        <td>{usuario.telefono}</td>
                        <td>{usuario.direccion}</td>
                        <td>{usuario.email}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEdit(usuario._id)}>
                            Editar
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(usuario._id)}>
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">
                        No hay usuarios registrados en esta categoría.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal para editar usuario */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Usuario"
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
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        {selectedUser && (
          <div style={{ width: "100%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Usuario</h2>
            <form onSubmit={handleUpdate} style={{ display: "grid", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={selectedUser.nombre}
                  onChange={handleModalChange}
                  required
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Documento:</label>
                <input
                  type="text"
                  name="documento"
                  value={selectedUser.documento}
                  onChange={handleModalChange}
                  required
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Teléfono:</label>
                <input
                  type="text"
                  name="telefono"
                  value={selectedUser.telefono}
                  onChange={handleModalChange}
                  required
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  value={selectedUser.direccion}
                  onChange={handleModalChange}
                  required
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Correo Electrónico:</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleModalChange}
                  required
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsuariosRegistrados;
