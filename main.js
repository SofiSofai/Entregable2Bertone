document.addEventListener('DOMContentLoaded', () => {
    const transporteSelect = document.getElementById('transporte');
    const transporteDetalles = document.getElementById('transporteDetalles');
    const compartirAuto = document.getElementById('compartirAuto');
    const consumoEnergeticoSelect = document.getElementById('consumoEnergetico');
    const consumoEnergeticoDetalles = document.getElementById('consumoEnergeticoDetalles');
    const carbonForm = document.getElementById('carbonForm');
    const resultadoSection = document.getElementById('resultado');
    const resetFormButton = document.getElementById('resetForm');

    let usuariosData = [];

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
        const datosUsuario = obtenerInformacion();
        const huellaCarbonoTotal = calcularHuellaCarbono(datosUsuario);
        mostrarResultado(datosUsuario, huellaCarbonoTotal);
        guardarDatosUsuario(datosUsuario);
    });

    resetFormButton.addEventListener('click', (event) => {
        carbonForm.reset();
        resultadoSection.innerHTML = '';
        transporteDetalles.style.display = 'none';
        compartirAuto.style.display = 'none';
        consumoEnergeticoDetalles.style.display = 'none';
    });

    function obtenerInformacion() {
        const nombreUsuario = document.getElementById('nombre').value;
        const apellidoUsuario = document.getElementById('apellido').value;
        const empresaUsuario = document.getElementById('empresa').value;

        const transporte = document.getElementById('transporte').value;
        let distanciaTrabajo = 0;
        let cantidadPasajeros = 0;

        if (transporte === 'Auto' || transporte === 'Moto' || transporte === 'Colectivo urbano') {
            distanciaTrabajo = parseFloat(document.getElementById('distancia').value);
        }

        if (transporte === 'Auto') {
            cantidadPasajeros = parseInt(document.getElementById('cantidadPasajeros').value);
        }

        const consumoEnergetico = document.getElementById('consumoEnergetico').value;
        let cantidadConsumo = 0;

        if (consumoEnergetico === 'Electricidad' || consumoEnergetico === 'Gas natural' || consumoEnergetico === 'Diesel') {
            cantidadConsumo = parseFloat(document.getElementById('cantidadConsumo').value);
        }

        const residuosGenerados = parseFloat(document.getElementById('residuos').value);

        return {
            nombreUsuario,
            apellidoUsuario,
            empresaUsuario,
            transporte,
            distanciaTrabajo,
            cantidadPasajeros,
            consumoEnergetico,
            cantidadConsumo,
            residuosGenerados
        };
    }

    function calcularHuellaCarbono(datosUsuario) {
        const CO2_POR_KM_AUTO = 0.21;
        const CO2_POR_KM_MOTO = 0.12;
        const CO2_POR_KM_COLECTIVO = 0.03;
        const CO2_POR_KWH_ELECTRICIDAD = 0.233;
        const CO2_POR_M3_GLP = 2.3;
        const CO2_POR_LITRO_DIESEL = 2.68;

        let huellaCarbonoTotal = 0;

        if (datosUsuario.transporte === 'Auto') {
            huellaCarbonoTotal += datosUsuario.distanciaTrabajo * CO2_POR_KM_AUTO / datosUsuario.cantidadPasajeros;
        } else if (datosUsuario.transporte === 'Moto') {
            huellaCarbonoTotal += datosUsuario.distanciaTrabajo * CO2_POR_KM_MOTO;
        } else if (datosUsuario.transporte === 'Colectivo urbano') {
            huellaCarbonoTotal += datosUsuario.distanciaTrabajo * CO2_POR_KM_COLECTIVO;
        }

        if (datosUsuario.consumoEnergetico === 'Electricidad') {
            huellaCarbonoTotal += datosUsuario.cantidadConsumo * CO2_POR_KWH_ELECTRICIDAD;
        } else if (datosUsuario.consumoEnergetico === 'Gas natural') {
            huellaCarbonoTotal += datosUsuario.cantidadConsumo * CO2_POR_M3_GLP;
        } else if (datosUsuario.consumoEnergetico === 'Diesel') {
            huellaCarbonoTotal += datosUsuario.cantidadConsumo * CO2_POR_LITRO_DIESEL;
        }

        huellaCarbonoTotal += datosUsuario.residuosGenerados * 0.02;

        return huellaCarbonoTotal;
    }

    function mostrarResultado(datosUsuario, huellaCarbonoTotal) {
        resultadoSection.innerHTML = `
            <h2>Resultado de la huella de carbono</h2>
            <p>Nombre: ${datosUsuario.nombreUsuario} ${datosUsuario.apellidoUsuario}</p>
            <p>Empresa: ${datosUsuario.empresaUsuario}</p>
            <p>Transporte: ${datosUsuario.transporte}</p>
            <p>Consumo Energético: ${datosUsuario.consumoEnergetico}</p>
            <p>Residuos Generados: ${datosUsuario.residuosGenerados} kg</p>
            <p>Huella de Carbono Total: ${huellaCarbonoTotal.toFixed(2)} kg CO2e</p>
        `;
    }

    function mostrarError(mensaje) {
        resultadoSection.innerHTML = `<p class="error">${mensaje}</p>`;
    }

    function guardarDatosUsuario(datosUsuario) {
        fetch('/data/usuarios.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        })
        .then(response => response.json())
        .then(data => console.log('Usuario guardado con éxito:', data))
        .catch(error => console.error('Error al guardar el usuario:', error));
    }
});

    async function cargarDatosJSON() {
        try {
            const response = await axios.get('./data/data.json');
            if (response.status === 200) {
                usuariosData = response.data;
            }
        } catch (error) {
            mostrarError('Error al cargar los datos JSON.');
        }
    }

    cargarDatosJSON();
