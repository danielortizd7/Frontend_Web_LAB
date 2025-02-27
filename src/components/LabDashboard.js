import React, { useState } from 'react';
import { FaFlask } from "react-icons/fa";
import axios from 'axios';
import './styles.css';

const statusOptions = ["Seleccione un estado", "En análisis", "Recibida", "Finalizado"];
const statusColors = {
  "Seleccione un estado": "bg-gray-500",
  "En análisis": "bg-red-500",
  "Recibida": "bg-yellow-500",
  "Finalizado": "bg-green-500",
};

export default function LabDashboard() {
  const [users, setUsers] = useState([
    { name: "Usuario 1", status: "Seleccione un estado", sampleId: "H02", laboratoryId: "87654321" },
  ]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [labData, setLabData] = useState([]);
  const [showLabData, setShowLabData] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [sampleIdError, setSampleIdError] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // Estado para mostrar el mensaje de guardado

  const token = "tu_token_jwt_aqui";

  // Cambiar estado de la muestra en la API
  const handleStatusChange = async (index, newStatus) => {
    const updatedUsers = [...users];
    updatedUsers[index].status = newStatus;
    setUsers(updatedUsers);

    try {
      const response = await axios.post('https://cambio-estado-api.onrender.com/api/muestras/cambiar-estado', {
        sampleId: users[index].sampleId,
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Estado actualizado en la API:", response.data);
      } else {
        console.error("Error al actualizar el estado en la API:", response.data);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }

    setOpenDropdown(null);
  };

  // Obtener datos del laboratorio desde la API
  const fetchLabData = async () => {
    try {
      const response = await axios.get("https://cambio-estado-api.onrender.com/api/muestras", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setLabData(response.data);
      setShowLabData(true);
    } catch (error) {
      console.error("Error al obtener los datos del laboratorio", error);
    }
  };

  // Activar modo de edición
  const handleEditClick = (index) => {
    setEditMode(index);
    setEditedUser({ ...users[index] });
  };

  // Guardar los cambios (validación incluida)
  const handleSaveClick = async (index) => {
    // Validar que el ID de muestra no esté vacío
    if (!editedUser.sampleId) {
      setSampleIdError(true); // Mostrar advertencia si el campo está vacío
      return;
    }

    // Actualizamos la lista de usuarios con los cambios realizados
    const updatedUsers = [...users];
    updatedUsers[index] = editedUser; // Actualizamos el usuario editado
    setUsers(updatedUsers); // Guardamos los cambios en el estado

    try {
      // Llamada a la API para guardar los datos actualizados
      const response = await axios.post('https://cambio-estado-api.onrender.com/api/muestras/cambiar-estado', {
        sampleId: editedUser.sampleId,
        laboratoryId: editedUser.laboratoryId,
        status: editedUser.status, // Incluimos el estado también
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Datos actualizados en la API:", response.data);
        setSaveMessage("Datos guardados con éxito."); // Mostrar mensaje de éxito
      } else {
        console.error("Error al actualizar los datos en la API:", response.data);
        setSaveMessage("Error al guardar los datos. Intenta de nuevo."); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setSaveMessage("Error al guardar los datos. Intenta de nuevo.");
    }

    setEditMode(null); // Salir del modo de edición
    setSampleIdError(false); // Resetear el error

    // Limpiar el mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setSaveMessage("");
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <FaFlask size={32} className="icon" onClick={fetchLabData} style={{ cursor: 'pointer' }} />
          <h1 className="title">LabH2O</h1>
        </div>

        <p className="note">
          Nota:
          <FaFlask className="history-icon" onClick={fetchLabData} style={{ cursor: 'pointer' }} />
        </p>

        {showLabData && (
          <div className="lab-data">
            <h2>Datos del laboratorio</h2>
            <ul>
              {labData.map((item, index) => (
                <li key={index} className="lab-item">
                  <strong>ID:</strong> {item.sampleId} - <strong>Estado:</strong> {item.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="user-list">
          {users.map((user, index) => (
            <div key={index} className="user-item">
              <div className="user-info">
                <FaFlask className="user-icon" />
                <span className="user-name">{user.name}</span>
              </div>

              <div className="input-group">
                <label>ID de muestra:</label>
                {editMode === index ? (
                  <>
                    <input
                      type="text"
                      name="sampleId"
                      value={editedUser.sampleId}
                      onChange={handleInputChange}
                      className={sampleIdError ? 'input-error' : ''}
                    />
                    {sampleIdError && <span className="warning-message">Por favor, ingrese un ID de muestra.</span>}
                  </>
                ) : (
                  <span>{user.sampleId}</span>
                )}
              </div>

              <div className="input-group">
                <label>Cédula laboratorista:</label>
                {editMode === index ? (
                  <input
                    type="text"
                    name="laboratoryId"
                    value={editedUser.laboratoryId}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{user.laboratoryId}</span>
                )}
              </div>

              <div className="dropdown">
                <button
                  className={`dropdown-button ${statusColors[user.status]}`}
                  onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                >
                  {user.status}
                </button>
                {openDropdown === index && (
                  <div className="dropdown-content">
                    {statusOptions.map((status) => (
                      <button 
                        key={status} 
                        className={`dropdown-option ${user.status === status ? "selected-option" : ""}`}
                        onClick={() => handleStatusChange(index, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="edit-buttons">
                {editMode === index ? (
                  <button className="register-button" onClick={() => handleSaveClick(index)}>Guardar</button>
                ) : (
                  <button className="register-button" onClick={() => handleEditClick(index)}>Registrar</button>
                )}
              </div>

              {/* Mostrar mensaje de guardado */}
              {saveMessage && (
                <div className={`save-message ${saveMessage.includes("Éxito") ? "success" : "error"}`}>
                  {saveMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
