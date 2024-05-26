// Declarar variables, constantes y arrays
let nombreUsuario;
let apellidoUsuario;
let empresaUsuario;
let transporte;
let distanciaTrabajoAuto = 0;
let distanciaTrabajoMoto = 0;
let distanciaTrabajoUrbano = 0;
let emisionesTransporteTotal;

let consumoEnergetico;
let consumoEnergeticoElectrico = 0;
let consumoEnergeticoGLP = 0;
let consumoEnergeticoDiesel = 0;
let emisionesEnergiaTotal;

let residuosGenerados = 0;

let huellaCarbonoTotal;

const factorEmisionTransporteAuto = 2.5; // en kg CO2 por kilómetro recorrido
const factorEmisionTransporteMoto = 2; // en kg CO2 por kilómetro recorrido
const factorEmisionTransporteUrbano = 1.8; // en kg CO2 por kilómetro recorrido
const factorEmisionEnergiaElectrica = 0.5; // en kg CO2 por kWh consumido
const factorEmisionEnergiaGLP = 1.3; // en kg CO2 por m3 consumido
const factorEmisionEnergiaDiesel = 1.3; // en kg CO2 por m3 consumido
const factorEmisionResiduos = 0.1; // en kg CO2 por kg de residuos derivados a vertedero

let usuarioEmpresa = []; // Array para almacenar los nombres de las personas que contestaron la encuesta
let pasajerosAuto = []; // Array para almacenar los nombres de los pasajeros del auto

document.addEventListener('DOMContentLoaded', () => {
    const transporteSelect = document.getElementById('transporte');
    const transporteDetalles = document.getElementById('transporteDetalles');
    const compartirAuto = document.getElementById('compartirAuto');
    const consumoEnergeticoSelect = document.getElementById('consumoEnergetico');
    const consumoEnergeticoDetalles = document.getElementById('consumoEnergeticoDetalles');
    const carbonForm = document.getElementById('carbonForm');
    const resultadoSection = document.getElementById('resultado');
    const resetFormButton = document.getElementById('resetForm');

    transporteSelect.addEventListener('change', (event) => {
        transporteDetalles.style.display = 'none';
        compartirAuto.style.display = 'none';
        if (event.target.value === 'Auto' || event.target.value === 'Moto' || event.target.value === 'Colectivo urbano') {
            transporteDetalles.style.display = 'block';
        }
        if (event.target.value === 'Auto') {
            compartirAuto.style.display = 'block';
        }
    });

    consumoEnergeticoSelect.addEventListener('change', (event) => {
        consumoEnergeticoDetalles.style.display = 'block';
        const label = document.querySelector('label[for="cantidadConsumo"]');
        if (event.target.value === 'Electricidad') {
            label.textContent = 'Cantidad consumida (kWh):';
        } else {
            label.textContent = 'Cantidad consumida (m3):';
        }
    });

    carbonForm.addEventListener('submit', (event) => {
        event.preventDefault();
        obtenerInformacion();
        calcularHuellaCarbono();
        mostrarResultado();
        guardarDatosUsuario();
    });

    resetFormButton.addEventListener('click', (event) => {
        carbonForm.reset();
        resultadoSection.innerHTML = '';
        transporteDetalles.style.display = 'none';
        compartirAuto.style.display = 'none';
        consumoEnergeticoDetalles.style.display = 'none';
    });

    function obtenerInformacion() {
        // Preguntar nombre y apellido del usuario
        nombreUsuario = document.getElementById('nombre').value;
        apellidoUsuario = document.getElementById('apellido').value;
        empresaUsuario = document.getElementById('empresa').value;

        // Preguntar sobre el transporte utilizado
        transporte = document.getElementById('transporte').value;

        // Determinar la distancia al trabajo según el medio de transporte seleccionado
        if (transporte === 'Auto') {
            distanciaTrabajoAuto = parseFloat(document.getElementById('distancia').value);
            let cantidadPasajerosAuto = parseInt(document.getElementById('cantidadPasajeros').value);

            pasajerosAuto = []; // Reset pasajerosAuto array
            for (let i = 0; i < cantidadPasajerosAuto; i++) {
                let nombrePasajero = prompt(`Ingresa el nombre y apellido del pasajero ${i + 1}:`);
                pasajerosAuto.push(nombrePasajero);
            }

        } else if (transporte === 'Moto') {
            distanciaTrabajoMoto = parseFloat(document.getElementById('distancia').value);
        } else if (transporte === 'Colectivo urbano') {
            distanciaTrabajoUrbano = parseFloat(document.getElementById('distancia').value);
        } else {
            distanciaTrabajo = 0; // Si no es "Automóvil ni Moto ni Urbano", la distancia al trabajo es 0
        }

        // Preguntar sobre el consumo energético
        consumoEnergetico = document.getElementById('consumoEnergetico').value;

        // Determinar el consumo energético total
        if (consumoEnergetico === 'Electricidad') {
            consumoEnergeticoElectrico = parseFloat(document.getElementById('cantidadConsumo').value);
        } else if (consumoEnergetico === 'Gas natural') {
            consumoEnergeticoGLP = parseFloat(document.getElementById('cantidadConsumo').value);
        } else if (consumoEnergetico === 'Diesel') {
            consumoEnergeticoDiesel = parseFloat(document.getElementById('cantidadConsumo').value);
        }

        // Preguntar sobre los residuos generados
        residuosGenerados = parseFloat(document.getElementById('residuos').value);
    }

    function calcularHuellaCarbono() {
        // Calcular emisiones por transporte
        let emisionesTransporteAuto = (distanciaTrabajoAuto / (1 + pasajerosAuto.length)) * factorEmisionTransporteAuto;
        let emisionesTransporteMoto = distanciaTrabajoMoto * factorEmisionTransporteMoto;
        let emisionesTransporteUrbano = distanciaTrabajoUrbano * factorEmisionTransporteUrbano;

        emisionesTransporteTotal = emisionesTransporteAuto + emisionesTransporteMoto + emisionesTransporteUrbano;

        // Calcular emisiones por consumo energético
        let emisionesEnergiaElectrica = consumoEnergeticoElectrico * factorEmisionEnergiaElectrica;
        let emisionesEnergiaGLP = consumoEnergeticoGLP * factorEmisionEnergiaGLP;
        let emisionesEnergiaDiesel = consumoEnergeticoDiesel * factorEmisionEnergiaDiesel;

        emisionesEnergiaTotal = emisionesEnergiaElectrica + emisionesEnergiaGLP + emisionesEnergiaDiesel;

        // Calcular emisiones por residuos generados
        let emisionesResiduos = residuosGenerados * factorEmisionResiduos;

        // Calcular huella de carbono total
        huellaCarbonoTotal = emisionesTransporteTotal + emisionesEnergiaTotal + emisionesResiduos;
    }

    function mostrarResultado() {
        resultadoSection.innerHTML = `
            <h2>Resultado:</h2>
            <p>Nombre: ${nombreUsuario} ${apellidoUsuario}</p>
            <p>Empresa: ${empresaUsuario}</p>
            <p>Transporte: ${transporte}</p>
            <p>Consumo energético: ${consumoEnergetico}</p>
            <p>Residuos generados: ${residuosGenerados} kg</p>
            <p><strong>Huella de carbono total: ${huellaCarbonoTotal.toFixed(2)} kg CO2</strong></p>
        `;
    }

    function guardarDatosUsuario() {
        let usuario = {
            nombre: nombreUsuario,
            apellido: apellidoUsuario,
            empresa: empresaUsuario,
            transporte: transporte,
            distanciaTrabajoAuto: distanciaTrabajoAuto,
            distanciaTrabajoMoto: distanciaTrabajoMoto,
            distanciaTrabajoUrbano: distanciaTrabajoUrbano,
            consumoEnergetico: consumoEnergetico,
            consumoEnergeticoElectrico: consumoEnergeticoElectrico,
            consumoEnergeticoGLP: consumoEnergeticoGLP,
            consumoEnergeticoDiesel: consumoEnergeticoDiesel,
            residuosGenerados: residuosGenerados,
            huellaCarbonoTotal: huellaCarbonoTotal,
            pasajerosAuto: pasajerosAuto
        };

        usuarioEmpresa.push(usuario);
        localStorage.setItem('usuarioEmpresa', JSON.stringify(usuarioEmpresa));
    }
});
