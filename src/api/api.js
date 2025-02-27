import axios from "axios";

export const cambiarEstado = async (idMuestra, nuevoEstado) => {
  try {
    const response = await axios.post(
      "https://cambio-estado-api.onrender.com/api/muestras/cambiar-estado",
      {
        id: idMuestra,
        estado: nuevoEstado,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  }
};
