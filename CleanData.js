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

            // Realizar las operaciones de conjuntos
            performSetOperations(records);
        }

        // Función para realizar las operaciones de conjuntos
        function performSetOperations(records) {
            const results = [];

            // 1. Intersección: Buenos y con identidad secreta
            const goodSecret = records.filter(record => record['ALIGN'] === 'Good Characters' && record['ID'] === 'Secret Identity');
            results.push({ category: 'good-secret', operation: 'Intersección', description: 'Personajes buenos y con identidad secreta', result: goodSecret.length });

            // 2. Intersección: Malos, ojos marrones y masculinos
            const badBrownMale = records.filter(record => record['ALIGN'] === 'Bad Characters' && record['EYE'] === 'Brown Eyes' && record['SEX'] === 'Male Characters');
            results.push({ category: 'bad-brown-male', operation: 'Intersección', description: 'Personajes malos, con ojos marrones y masculinos', result: badBrownMale.length });

            // 3. Intersección: Primera aparición en las décadas de los 30 y 90
            const decade30and90 = records.filter(record => (record['Year'] >= 1930 && record['Year'] < 1940) || (record['Year'] >= 1990 && record['Year'] < 2000));
            results.push({ category: 'decade-30-90', operation: 'Intersección', description: 'Personajes que aparecen por primera vez en las décadas de los 30 y los 90', result: decade30and90.length });

            // 4. Unión: Personajes hombres o mujeres
            const maleOrFemale = records.filter(record => record['SEX'] === 'Male Characters' || record['SEX'] === 'Female Characters');
            results.push({ category: 'male-female', operation: 'Unión', description: 'Personajes hombres o mujeres', result: maleOrFemale.length });

            // 5. Personajes fallecidos
            const deceasedCharacters = records.filter(record => record['ALIVE'] === 'Deceased Characters');
            results.push({ category: 'deceased', operation: 'Complemento', description: 'Personajes que han fallecido', result: deceasedCharacters.length });

            // 6. Diferencia: Personajes buenos pero sin cabello rojo
            const goodNotRedHair = records.filter(record => record['ALIGN'] === 'Good Characters' && record['HAIR'] !== 'Red Hair');
            results.push({ category: 'good-no-red-hair', operation: 'Diferencia', description: 'Personajes buenos, pero sin cabello rojo', result: goodNotRedHair.length });

            // Mostrar los resultados en una tabla
            displayResultsInTable(results);
        }

        // Función para mostrar los resultados en una tabla
        function displayResultsInTable(results) {
            const tableBody = document.getElementById('operationResultsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpiar tabla antes de llenarla

            results.forEach(result => {
                const row = document.createElement('tr');
                row.classList.add(result.category);

                const operationCell = document.createElement('td');
                operationCell.textContent = result.operation;

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = result.description;

                const resultCell = document.createElement('td');
                resultCell.textContent = result.result;

                row.appendChild(operationCell);
                row.appendChild(descriptionCell);
                row.appendChild(resultCell);

                tableBody.appendChild(row);
            });
        }


    




