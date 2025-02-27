import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";  // Asegúrate de que el archivo styles.css esté en el mismo directorio

const ApiTestInterface = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    idMuestra: "",
    estado: "",
    cedula: "",
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo es idMuestra o cedula, limitamos la longitud
    if (name === "idMuestra" || name === "cedula") {
      if (value.length <= 10) {  // Limita a 10 caracteres como ejemplo
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Enviar solicitud para cambiar el estado de una muestra
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🟡 Enviando datos:", JSON.stringify(form, null, 2));

    if (!form.idMuestra || !form.estado || !form.cedula) {
      alert("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.put(
        "https://cambio-estado-api.onrender.com/api/muestras/cambiar-estado", // Cambia esta URL por la correcta
        {
          idMuestra: form.idMuestra,
          estado: form.estado,
          cedula: form.cedula,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Estado cambiado correctamente!");
      console.log("🟢 Respuesta del servidor:", response.data);
      setForm({ idMuestra: "", estado: "", cedula: "" });

      // Recargar muestras automáticamente después de actualizar
      fetchMuestras();
    } catch (error) {
      console.error("❌ Error al cambiar el estado:", error.response?.data || error.message);
      alert("❌ Error: " + (error.response?.data?.error || error.message));
    }
  };

  // Obtener todas las muestras
  const fetchMuestras = async () => {
    try {
      const response = await axios.get(
        "https://ingreso-resultados.onrender.com/api/resultados/listar" // Cambia esta URL por la correcta
      );
      console.log("📋 Datos obtenidos:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("❌ Error al obtener las muestras:", error.response?.data || error.message);
    }
  };

  // Cargar muestras automáticamente al montar el componente
  useEffect(() => {
    fetchMuestras();
  }, []);

  return (
    <div className="container">
      <h2>Cambiar Estado de Muestra</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>ID de Muestra:</label>
          <input
            type="text"
            name="idMuestra"
            placeholder="ID Muestra"
            value={form.idMuestra}
            onChange={handleChange}
            required
            maxLength="5"  // Limita a 10 caracteres
          />
        </div>

        <div className="input-group">
          <label>Estado:</label>
          <select name="estado" value={form.estado} onChange={handleChange} required>
            <option value="">Seleccione un estado</option>
            <option value="Recibida">Recibida</option>
            <option value="En análisis">En análisis</option>
            <option value="Pendiente de resultados">Pendiente de resultados</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div className="input-group">
          <label>Cédula Laboratorista:</label>
          <input
            type="text"
            name="cedula"
            placeholder="Cédula Laboratorista"
            value={form.cedula}
            onChange={handleChange}
            required
            maxLength="10"  // Limita a 10 caracteres
          />
        </div>

        <button type="submit">Cambiar Estado</button>
      </form>

      {/* Mostrar las muestras en una lista */}
      <div>
        <h3>Listado de Muestras</h3>
        {data && data.length > 0 ? (
          <ul>
            {data.map((muestra, index) => (
              <li key={index}>
                <strong>ID:</strong> {muestra.idMuestra} | <strong>Estado:</strong> {muestra.estado}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay muestras disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ApiTestInterface;
