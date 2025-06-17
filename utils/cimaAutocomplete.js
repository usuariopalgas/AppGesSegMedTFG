// src/utils/cimaAutocomplete.js

// Para autocompletar rápido por código (flujo escaneo)
export async function autocompleteCIMA(codigo) {
    // Extrae CN
    let cn = codigo;
    if (codigo.length === 13 && codigo.startsWith('847')) {
        cn = codigo.slice(6, 12);
    }
    let results = [];
    try {
        let response = await fetch(`https://cima.aemps.es/cima/rest/medicamentos?cn=${cn}`);
        let data = await response.json();
        if (data && data.resultados && data.resultados.length > 0) {
            results = data.resultados;
        }
    } catch (e) {
        throw new Error('No se pudo conectar con la API de medicamentos.');
    }
    if (results.length === 0) {
        let cn2 = cn.replace(/^0+/, '');
        if (cn2 !== cn) {
            try {
                let response = await fetch(`https://cima.aemps.es/cima/rest/medicamentos?cn=${cn2}`);
                let data = await response.json();
                if (data && data.resultados && data.resultados.length > 0) {
                    results = data.resultados;
                }
            } catch (e) {
                throw new Error('No se pudo conectar con la API de medicamentos.');
            }
        }
    }
    if (results.length > 0) {
        const med = results[0];
        // Devuelve solo los datos relevantes para autocompletar
        return {
            nombre: med.nombre || '',
            dosis: med.dosis || '',
            tamanioPresentacion: med.dosis || '',
            formaFarmaceutica: med.formaFarmaceutica?.nombre || '',
            viasAdministracion: med.viasAdministracion && med.viasAdministracion.length > 0
                ? med.viasAdministracion.map(v => v.nombre).join(', ')
                : '',
            laboratorio: med.labcomercializador || '',
            principioActivo: med.vtm?.nombre || '',
            prospectoUrl: med.docs && med.docs.length > 0
                ? (med.docs.find(d => d.tipo === 1)?.url || '')
                : '',
            fotoCIMA: med.fotos && med.fotos.length > 0 ? med.fotos[0].url : '',
        };
    } else {
        return null;
    }
}

//búsqueda manual por nombre, CN o EAN
export async function buscarMedicamentoManual(query) {
    let url = '';
    let esCodigo = /^\d{6,13}$/.test(query); // Si son solo números, busca como CN
    if (esCodigo) {
        // Búsqueda por CN (código nacional) o EAN
        url = `https://cima.aemps.es/cima/rest/medicamentos?cn=${query.replace(/^0+/, '')}`;
    } else {
        // Si no es código, busca por nombre (filtro parcial)
        url = `https://cima.aemps.es/cima/rest/medicamentos?nombre=${encodeURIComponent(query)}`;
    }
    try {
        let response = await fetch(url);
        let data = await response.json();
        if (data && data.resultados && data.resultados.length > 0) {
            // Devuelve todos los resultados relevantes para mostrar en la búsqueda manual
            return data.resultados.map(med => ({
                nombre: med.nombre || '',
                dosis: med.dosis || '',
                tamanioPresentacion: med.dosis || '',
                formaFarmaceutica: med.formaFarmaceutica?.nombre || '',
                viasAdministracion: med.viasAdministracion && med.viasAdministracion.length > 0
                    ? med.viasAdministracion.map(v => v.nombre).join(', ')
                    : '',
                laboratorio: med.labcomercializador || '',
                principioActivo: med.vtm?.nombre || '',
                prospectoUrl: med.docs && med.docs.length > 0
                    ? (med.docs.find(d => d.tipo === 1)?.url || '')
                    : '',
                fotoCIMA: med.fotos && med.fotos.length > 0 ? med.fotos[0].url : '',
                ean: med.cpresc || '', // si la API lo devuelve
                cn: med.cn || '',      // CN oficial si disponible
                codigo: med.codigo || '', // por si lo hay
            }));
        } else {
            return [];
        }
    } catch (e) {
        throw new Error('No se pudo conectar con la API de medicamentos.');
    }
}
