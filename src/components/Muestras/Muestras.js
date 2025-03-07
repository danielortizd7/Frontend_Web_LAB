import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Muestras.css";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Muestras = () => {
  const [muestras, setMuestras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [renderizar, setRenderizar] = useState(false); 
  const muestrasPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const muestrasResponse = await fetch("https://backendregistromuestra.onrender.com/muestras");
        if (!muestrasResponse.ok) throw new Error("Error al obtener las muestras");
        const muestrasData = await muestrasResponse.json();

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado en localStorage");

        const usuariosResponse = await fetch("https://unificado-u.onrender.com/api/usuarios", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!usuariosResponse.ok) throw new Error("Error al obtener los usuarios");
        const usuariosData = await usuariosResponse.json();

        const muestrasCompletas = muestrasData.map((muestra) => {
          const usuario = usuariosData.find((user) => user.documento === muestra.documento);
          return {
            ...muestra,
            nombreCliente: usuario ? usuario.nombre : "No encontrado",
            telefono: usuario ? usuario.telefono : "No encontrado",
          };
        });

        setMuestras(muestrasCompletas);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(`Página actual (UI): ${paginaActual}`);
  }, [paginaActual, renderizar]);

  const generarPDFMuestra = (muestra, preview = false) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Detalles de la Muestra", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["ID Muestra", muestra.id_muestra || "N/A"],
        ["Documento", muestra.documento || "N/A"],
        ["Nombre del Cliente", muestra.nombreCliente || "No encontrado"],
        ["Teléfono", muestra.telefono || "No encontrado"],
        ["Tipo Muestreo", muestra.tipoMuestreo || "N/A"],
        ["Fecha", muestra.fechaHora ? new Date(muestra.fechaHora).toLocaleDateString() : "N/A"],
        [
          "Análisis Seleccionados",
          muestra.analisisSeleccionados?.length > 0 ? muestra.analisisSeleccionados.join(", ") : "Ninguno",
        ],
      ],
      theme: "grid",
    });

    const yFinal = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(
      "Nota: Esta información es confidencial y solo puede ser utilizada para fines internos del laboratorio.",
      14,
      yFinal
    );

    if (preview) {
      window.open(doc.output("bloburl"), "_blank");
    } else {
      doc.save(`Muestra_${muestra.id_muestra}.pdf`);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPaginaActual(1);
  };

  const muestrasFiltradas = muestras.filter((muestra) =>
    muestra.nombreCliente.toLowerCase().includes(search.toLowerCase()) ||
    String(muestra.id_muestra).includes(search)
  );

  const totalPaginas = Math.ceil(muestrasFiltradas.length / muestrasPorPagina);
  const indexUltimaMuestra = paginaActual * muestrasPorPagina;
  const indexPrimeraMuestra = indexUltimaMuestra - muestrasPorPagina;
  const muestrasPaginadas = muestrasFiltradas.slice(indexPrimeraMuestra, indexUltimaMuestra);

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual((prev) => prev + 1);
      setRenderizar((prev) => !prev); 
    }
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual((prev) => prev - 1);
      setRenderizar((prev) => !prev); 
    }
  };

  if (loading) return <div className="mensaje-carga">Cargando...</div>;
  if (error) return <div className="mensaje-error">Error: {error}</div>;

  return (
    <div className="muestras-container">
      <h2>Tabla de Muestras</h2>

      <button className="btn-back" onClick={() => navigate("/home")}>
        <FaHome size={24} />
      </button>

      <input
        type="text"
        placeholder="Buscar por ID o nombre del cliente..."
        value={search}
        onChange={handleSearch}
        className="buscador"
      />

      <div className="tabla-scroll">
        <table>
          <thead>
            <tr>
              <th>ID Muestra</th>
              <th>Documento</th>
              <th>Nombre Cliente</th>
              <th>Teléfono</th>
              <th>Tipo Muestreo</th>
              <th>Fecha</th>
              <th>Análisis Seleccionados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {muestrasPaginadas.map((m) => (
              <tr key={m.id_muestra || Math.random()}>
                <td>{m.id_muestra || "N/A"}</td>
                <td>{m.documento || "N/A"}</td>
                <td>{m.nombreCliente || "No encontrado"}</td>
                <td>{m.telefono || "No encontrado"}</td>
                <td>{m.tipoMuestreo || "N/A"}</td>
                <td>{m.fechaHora ? new Date(m.fechaHora).toLocaleDateString() : "N/A"}</td>
                <td>{m.analisisSeleccionados ? m.analisisSeleccionados.join(", ") : "Ninguno"}</td>
                <td>
                  <button className="btn-pdf" onClick={() => generarPDFMuestra(m)}>Descargar PDF</button>
                  <button className="btn-preview" onClick={() => generarPDFMuestra(m, true)}>Visualizar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {}
      <div className="paginacion">
        <button disabled={paginaActual === 1} onClick={handlePaginaAnterior}>
          Anterior
        </button>
        <span key={paginaActual}>Página {paginaActual} de {totalPaginas}</span>
        <button disabled={paginaActual >= totalPaginas} onClick={handlePaginaSiguiente}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Muestras;
