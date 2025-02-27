import React, { useState, useEffect } from "react";
import axios from "axios";
import "./muestras.css";

const RegistroMuestras = () => {
  const [form, setForm] = useState({
    idMuestra: "",
    pH: "",
    turbidez: "",
    oxigenoDisuelto: "",
    nitratos: "",
    fosfatos: "",
    cedula: "",
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://ingreso-resultados.onrender.com/api/resultados/registrar",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Resultado registrado correctamente!");
      setForm({
        idMuestra: "",
        pH: "",
        turbidez: "",
        oxigenoDisuelto: "",
        nitratos: "",
        fosfatos: "",
        cedula: "",
      });
      fetchResults();
    } catch (error) {
      alert("❌ Error al registrar resultado: " + (error.response?.data?.error || error.message));
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get("https://ingreso-resultados.onrender.com/api/resultados/listar");
      setData(response.data);
      console.log("📋 Datos cargados:", response.data);
    } catch (error) {
      alert("❌ Error al obtener los resultados: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container">
      <h1>Ingreso de Resultados</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="idMuestra">Código de Muestra:</label>
          <input type="text" name="idMuestra" value={form.idMuestra} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="pH">pH:</label>
          <input type="number" step="0.1" name="pH" value={form.pH} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="turbidez">Turbidez:</label>
          <input type="number" step="0.1" name="turbidez" value={form.turbidez} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="oxigenoDisuelto">Oxígeno Disuelto:</label>
          <input type="number" step="0.1" name="oxigenoDisuelto" value={form.oxigenoDisuelto} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="nitratos">Nitratos:</label>
          <input type="number" step="0.1" name="nitratos" value={form.nitratos} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="fosfatos">Fosfatos:</label>
          <input type="number" step="0.1" name="fosfatos" value={form.fosfatos} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="cedula">Cédula Laboratorista:</label>
          <input type="text" name="cedula" value={form.cedula} onChange={handleChange} required />
        </div>
        <button type="submit">Registrar</button>
      </form>

      <h2>📋 Lista de Resultados</h2>
      <button onClick={fetchResults}>Cargar Resultados</button>
      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>ID Muestra</th>
              <th>pH</th>
              <th>Turbidez</th>
              <th>Oxígeno Disuelto</th>
              <th>Nitratos</th>
              <th>Fosfatos</th>
              <th>Cédula Laboratorista</th>
              <th>Nombre Laboratorista</th>
              <th>Fecha de Análisis</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id}>
                  <td>{item.idMuestra}</td>
                  <td>{item.pH}</td>
                  <td>{item.turbidez}</td>
                  <td>{item.oxigenoDisuelto}</td>
                  <td>{item.nitratos}</td>
                  <td>{item.fosfatos}</td>
                  <td>{item.cedulaLaboratorista}</td>
                  <td>{item.nombreLaboratorista}</td>
                  <td>{new Date(item.fechaAnalisis).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No hay resultados disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroMuestras;
