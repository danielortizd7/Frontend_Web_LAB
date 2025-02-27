import React, { useState } from "react";
import { cambiarEstado } from "../api/api";

const CambiarEstado = () => {
  const [idMuestra, setIdMuestra] = useState("");
  const [estado, setEstado] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar que la página se recargue
    if (!idMuestra || !estado) {
      alert("Por favor, ingresa el ID de la muestra y el estado.");
      return;
    }

    const resultado = await cambiarEstado(idMuestra, estado);
    console.log("Resultado de la API:", resultado);
  };

  return (
    <div>
      <h2>Cambiar Estado de Muestra</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID de la muestra"
          value={idMuestra}
          onChange={(e) => setIdMuestra(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nuevo estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
        <button type="submit">Cambiar Estado</button>
      </form>
    </div>
  );
};

export default CambiarEstado;
