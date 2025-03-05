import React, { useState } from 'react';
import ModalRegistroCliente from './ModalRegistroCliente';

const RegistroMuestras = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="contenedor-registro">
      <div className="caja-registro">
        <div className="logo">
          <img src="logo.png" alt="Logo LabH2O" />
          <h1>Registro de Muestras</h1>
        </div>
        <form>
          {}
          <div className="grupo-input">
            <label>Cédula Cliente</label>
            <input type="text" placeholder="Ingrese la cédula del cliente" />
          </div>
          {}
          <button type="submit" className="boton-registrar">Registrar</button>
        </form>
        <button className="boton-modal" onClick={() => setModalOpen(true)}>Registrar Cliente</button>
      </div>
      <ModalRegistroCliente isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default RegistroMuestras;
