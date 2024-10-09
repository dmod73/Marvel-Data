let csvData = null;

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

            // Convertir los datos en un array de objetos
            let records = lines.slice(1).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header.trim()] = values[index] ? values[index].trim() : null;
                    return obj;
                }, {});
            });

            // Realizar las operaciones de cardinalidad
            performCardinalityOperations(records);
        }

        // Función para realizar las operaciones de cardinalidad
        function performCardinalityOperations(records) {
            const results = [];

            // 1. Cardinalidad del conjunto de personajes masculinos (M)
            const maleCharacters = records.filter(record => record['SEX'] === 'Male Characters');
            results.push({ category: 'cardinality-male', set: 'M', description: 'Personajes masculinos', cardinality: maleCharacters.length });

            // 2. Cardinalidad del conjunto de personajes femeninos (F)
            const femaleCharacters = records.filter(record => record['SEX'] === 'Female Characters');
            results.push({ category: 'cardinality-female', set: 'F', description: 'Personajes femeninos', cardinality: femaleCharacters.length });

            // 3. Cardinalidad de la intersección de personajes con ojos verdes y cabello rojo
            const intersectionGreenEyesRedHair = records.filter(record => record['EYE'] === 'Green Eyes' && record['HAIR'] === 'Red Hair');
            results.push({ category: 'intersection-green-eyes-red-hair', set: 'Intersección', description: 'Personajes con ojos verdes y cabello rojo', cardinality: intersectionGreenEyesRedHair.length });

            // Mostrar los resultados en una tabla
            displayCardinalityResults(results);
        }

        // Función para mostrar los resultados en una tabla
        function displayCardinalityResults(results) {
            const tableBody = document.getElementById('cardinalityResultsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            results.forEach(result => {
                const row = document.createElement('tr');
                row.classList.add(result.category);

                const setCell = document.createElement('td');
                setCell.textContent = result.set;

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = result.description;

                const cardinalityCell = document.createElement('td');
                cardinalityCell.textContent = result.cardinality;

                row.appendChild(setCell);
                row.appendChild(descriptionCell);
                row.appendChild(cardinalityCell);

                tableBody.appendChild(row);
            });
        }


    




