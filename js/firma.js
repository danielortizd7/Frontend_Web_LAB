document.addEventListener('DOMContentLoaded', () => {
    // Evento para limpiar firmas
    document.querySelectorAll('.btn-limpiar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const canvasId = e.target.dataset.canvas;
            limpiarFirma(canvasId);
        });
    });

    document.getElementById('btnBuscar').addEventListener('click', buscarMuestra);
    document.getElementById('btnGuardar').addEventListener('click', guardarFirmas);
    document.getElementById('btnVisualizar').addEventListener('click', visualizarPDF);

    // Inicializar los canvas para firmas
    configurarCanvas('firmaLab');
    configurarCanvas('firmaCli');
});

// Función para buscar una muestra
async function buscarMuestra() {
    const idMuestra = document.getElementById('idMuestra').value.trim();
    if (!idMuestra) {
        alert('Ingrese un ID de muestra');
        return;
    }

    try {
        const response = await axios.get(`https://backend-daniel.onrender.com/api/firmas/buscar/${idMuestra}`);
        document.getElementById('infoMuestra').innerHTML = `
            <p><strong>ID:</strong> ${response.data.id_muestra}</p>
            <p><strong>Fecha:</strong> ${new Date(response.data.fechaHora).toLocaleDateString()}</p>
            <p><strong>Cédula Laboratorista:</strong> ${response.data.cedulaLaboratorista}</p>
            <p><strong>Cédula Cliente:</strong> ${response.data.cedulaCliente || 'No registrada'}</p>
        `;
    } catch (error) {
        alert(error.response?.data?.error || 'Error buscando muestra');
    }
}

// Función para guardar firmas
async function guardarFirmas() {
    const idMuestra = document.getElementById('idMuestra').value.trim();
    const cedulaLab = document.getElementById('cedulaLaboratorista').value.trim();
    const cedulaCli = document.getElementById('cedulaCliente').value.trim() || null;
    
    if (!idMuestra || !cedulaLab) {
        alert('Debe ingresar el ID de muestra y la cédula del laboratorista');
        return;
    }

    const firmaLab = document.getElementById('firmaLab').toDataURL();
    const firmaCli = document.getElementById('firmaCli').toDataURL();

    try {
        await axios.post('https://backend-daniel.onrender.com/api/firmas/guardarFirma', {
            id_muestra: idMuestra,
            cedulaLaboratorista: cedulaLab,
            firmaLaboratorista: firmaLab,
            cedulaCliente: cedulaCli,
            firmaCliente: firmaCli
        });

        alert('Firmas guardadas correctamente');
    } catch (error) {
        alert(error.response?.data?.error || 'Error guardando firmas');
    }
}

// Función para visualizar el PDF de la muestra
function visualizarPDF() {
    const idMuestra = document.getElementById('idMuestra').value.trim();
    if (!idMuestra) {
        alert('Ingrese un ID de muestra');
        return;
    }

    // Abre el PDF generado en una nueva pestaña
    window.open(`https://backend-daniel.onrender.com/api/firmas/pdfs/${idMuestra}`, '_blank');
}

// Configuración del canvas para la firma
function configurarCanvas(id) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    let dibujando = false;
    let ultimoX = 0;
    let ultimoY = 0;

    canvas.addEventListener('mousedown', (e) => iniciarDibujo(e, ctx));
    canvas.addEventListener('mousemove', (e) => dibujar(e, ctx));
    canvas.addEventListener('mouseup', () => dibujando = false);
    canvas.addEventListener('mouseout', () => dibujando = false);

    function iniciarDibujo(e, ctx) {
        dibujando = true;
        const rect = canvas.getBoundingClientRect();
        ultimoX = e.clientX - rect.left;
        ultimoY = e.clientY - rect.top;
    }

    function dibujar(e, ctx) {
        if (!dibujando) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(ultimoX, ultimoY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ultimoX = x;
        ultimoY = y;
    }
}

// Función para limpiar firma
function limpiarFirma(idCanvas) {
    const canvas = document.getElementById(idCanvas);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
