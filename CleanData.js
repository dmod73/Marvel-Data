// Función para leer el archivo CSV cargado
document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0]; // Obtener el archivo cargado
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const csvData = e.target.result;
          processCSVData(csvData);
      };
      reader.readAsText(file); // Leer el archivo como texto
  }
});

// Función para procesar los datos CSV
function processCSVData(data) {
  const lines = data.split('\n'); // Dividir los datos en líneas
  const headers = lines[0].split(','); // Obtener los encabezados

  // Mostrar los encabezados en la tabla
  const tableHeader = document.getElementById('tableHeader');
  headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHeader.appendChild(th);
  });

  // Mostrar 10 ejemplos de filas en la tabla
  const tableBody = document.getElementById('tableBody');
  for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(','); // Dividir cada fila en columnas
      const tr = document.createElement('tr'); // Crear una nueva fila en la tabla

      // Crear columnas para cada valor de la fila
      row.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
      });

      tableBody.appendChild(tr); // Añadir la fila al cuerpo de la tabla
  }
}
