let csvData = null;
let initialRows = 0; // Para contar filas originales
let cleanedRows = 0; // Para contar filas después de la limpieza
let duplicatesRemoved = 0;
let nullValuesRemoved = 0;
let invalidYearsRemoved = 0; // Nuevo contador para años inválidos

// Leer el archivo CSV cuando se sube
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            csvData = e.target.result;
            processCSVData(csvData);
        };
        reader.readAsText(file);
    }
});

// Función para procesar los datos del CSV
function processCSVData(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');

    // Contar el número de filas iniciales
    initialRows = lines.length - 1;

    let records = [];
    let index = 1; // Empezar desde la primera fila de datos

    function processBatch() {
        const BATCH_SIZE = 100; // Procesar 100 filas a la vez
        const batch = lines.slice(index, index + BATCH_SIZE);

        batch.forEach(line => {
            const values = line.split(',');
            const record = headers.reduce((obj, header, idx) => {
                obj[header.trim()] = values[idx] ? values[idx].trim() : null;
                return obj;
            }, {});
            records.push(record);
        });

        index += BATCH_SIZE;

        if (index < lines.length) {
            setTimeout(processBatch, 0); // Esperar antes de procesar el siguiente lote
        } else {
            // Una vez procesados todos los datos, continuar con la limpieza
            records = cleanData(records);
            cleanedRows = records.length;
            displayErrorSummary();
            displayCleanedData(records, headers);
        }
    }

    processBatch(); // Iniciar el procesamiento en lotes
}

// Función para limpiar los datos
function cleanData(records) {
    duplicatesRemoved = 0;
    nullValuesRemoved = 0;
    invalidYearsRemoved = 0; // Reiniciar el contador de años inválidos

    // 1. Eliminar duplicados
    const uniqueRecords = Array.from(new Set(records.map(JSON.stringify))).map(JSON.parse);
    duplicatesRemoved = records.length - uniqueRecords.length;

    // 2. Eliminar filas con valores nulos en columnas clave
    const cleanRecords = uniqueRecords.filter(record => {
        const isValid = record['APPEARANCES'] && record['Year'];
        if (!isValid) nullValuesRemoved++;
        return isValid;
    });

    // 3. Convertir "APPEARANCES" y "Year" a numéricos
    cleanRecords.forEach(record => {
        record['APPEARANCES'] = parseFloat(record['APPEARANCES']) || 0; // Convertir a número o 0
        record['Year'] = parseInt(record['Year']) || null; // Convertir a entero o null
    });

    // 4. Filtrar los años inválidos (fuera del rango de 1900 a 2024)
    const validYears = cleanRecords.filter(record => {
        const isValidYear = record['Year'] >= 1900 && record['Year'] <= 2024;
        if (!isValidYear) invalidYearsRemoved++; // Incrementar el contador si el año es inválido
        return isValidYear;
    });

    // Retornar los registros limpios
    return validYears;
}

// Función para mostrar un resumen de los errores corregidos
function displayErrorSummary() {
    const totalErrorsFixed = initialRows - cleanedRows;
    const errorSummary = document.getElementById('errorSummary');
    
    // Crear la tabla de resumen de errores
    let errorTable = `<h3>Resumen de Errores Corregidos</h3><table><tr><th>Tipo de Error</th><th>Cantidad</th></tr>`;
    errorTable += `<tr><td>Duplicados Eliminados</td><td>${duplicatesRemoved}</td></tr>`;
    errorTable += `<tr><td>Filas con Valores Nulos Eliminadas</td><td>${nullValuesRemoved}</td></tr>`;
    errorTable += `<tr><td>Filas con Años Inválidos Eliminadas</td><td>${invalidYearsRemoved}</td></tr>`;
    errorTable += `<tr><td>Total de Errores Corregidos</td><td>${totalErrorsFixed}</td></tr>`;
    errorTable += `</table>`;
    
    errorSummary.innerHTML = errorTable;
}

// Función para mostrar los datos limpios en una tabla HTML
function displayCleanedData(records, headers) {
    const table = document.getElementById('cleanedDataTable');
    table.innerHTML = ''; // Limpiar la tabla antes de llenarla

    // Crear la fila de encabezados
    let tableContent = '<tr>';
    headers.forEach(header => {
        tableContent += `<th>${header.trim()}</th>`;
    });
    tableContent += '</tr>';

    // Crear las filas de datos
    records.forEach(record => {
        let row = '<tr>';
        headers.forEach(header => {
            row += `<td>${record[header.trim()] || ''}</td>`;
        });
        row += '</tr>';
        tableContent += row;
    });

    // Añadir todo el contenido al DOM de una vez
    table.innerHTML = tableContent;
}


    




