let leyenda = ''; 

function fetchStudentData() {
    const studentId = document.getElementById('studentIdInput').value; 
    const resultDiv = document.getElementById('student-info');
    const gradesHeader = document.getElementById('gradesHeader');
    const gradesBody = document.getElementById('gradesBody');
    const modulosHeader = document.getElementById('modulosHeader');
    const modulosBody = document.getElementById('modulosBody');
    const academicSubjects = document.getElementById('academicSubjects');
    const leyendaSection = document.getElementById('leyenda-section');
    const leyendaContent = document.getElementById('leyenda-content');

    gradesBody.innerHTML = ''; 
    gradesHeader.innerHTML = ''; 
    modulosBody.innerHTML = ''; 
    modulosHeader.innerHTML = ''; 
    resultDiv.innerHTML = '';  

    if (!studentId || isNaN(studentId)) {
        alert('Por favor, ingrese un ID válido');
        return;
    }

    fetch(`http://147.182.228.147:5001/api/students/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                const student = data.data.student; 
                
                if (data.data.results[0].courseNotes) { 
                    leyenda = `${data.data.results[0].courseNotes}`;
                    leyendaContent.textContent = leyenda;
                    leyendaSection.style.display = 'block'; // Mostrar la sección si hay leyenda
                } else {
                    leyendaSection.style.display = 'none'; // Ocultar la sección si no hay leyenda
                }
                
                resultDiv.innerHTML = `
                    <center>
                        <h2>${student.nombre} ${student.lastname}</h2>
                        <p><strong>No.:</strong> ${data.data.student.name}</p>
                        <p><strong>Curso:</strong> ${data.data.results[0].courseName}</p>
                    </center>
                `;

                // Mostrar la sección de asignaturas
                academicSubjects.classList.remove('hidden');

                // Generar el encabezado de la tabla de calificaciones
                const competencias = ['Comunicación', 'Pensamiento Lógico', 'Científica y Tecnológica', 'Ética Ciudadana'];
                let headerRow1 = '<tr><th rowspan="2">PERÍODOS</th>';
                let headerRow2 = '<tr>';

                competencias.forEach(comp => {
                    headerRow1 += `<th colspan="4" class="competencias">${comp}</th>`;
                    for (let i = 1; i <= 4; i++) {
                        headerRow2 += `<th>P${i}</th>`;
                    }
                });

                headerRow1 += '<th colspan="4" class="competencias">Promedio Competencias Específicas</th><th rowspan="2">Calificación Final</th></tr>';
                for (let i = 1; i <= 4; i++) {
                    headerRow2 += `<th>PC${i}</th>`;
                }
                headerRow2 += '</tr>';

                gradesHeader.innerHTML = headerRow1 + headerRow2;

                // Llenar la tabla con las calificaciones
                data.data.results.forEach(result => {
                    const grade = result.grade || {};
                    const isGradeValid = ['cp1', 'cp2', 'cp3', 'cp4', 'pp1', 'pp2', 'pp3', 'pp4', 'ctp1', 'ctp2', 'ctp3', 'ctp4', 'ecp1', 'ecp2', 'ecp3', 'ecp4']
                        .some(key => (grade[key] || 0) > 0);

                    if (isGradeValid) {
                        let gradeRow = `<tr><td>${result.className}</td>`;
                        gradeRow += `<td>${grade.cp1 || '-'}</td><td>${grade.cp2 || '-'}</td><td>${grade.cp3 || '-'}</td><td>${grade.cp4 || '-'}</td>`;
                        gradeRow += `<td>${grade.pp1 || '-'}</td><td>${grade.pp2 || '-'}</td><td>${grade.pp3 || '-'}</td><td>${grade.pp4 || '-'}</td>`;
                        gradeRow += `<td>${grade.ctp1 || '-'}</td><td>${grade.ctp2 || '-'}</td><td>${grade.ctp3 || '-'}</td><td>${grade.ctp4 || '-'}</td>`;
                        gradeRow += `<td>${grade.ecp1 || '-'}</td><td>${grade.ecp2 || '-'}</td><td>${grade.ecp3 || '-'}</td><td>${grade.ecp4 || '-'}</td>`;
                        gradeRow += `<td>${grade.cppromedio || '-'}</td><td>${grade.pppromedio || '-'}</td><td>${grade.ctppromedio || '-'}</td><td>${grade.ecppromedio || '-'}</td>`;
                        gradeRow += `<td>${grade.promediogral || '-'}</td></tr>`;

                        gradesBody.innerHTML += gradeRow;
                    }
                });

                // Generar el encabezado de la tabla de módulos técnicos
                let modulosHeaderRow = '<tr><th>Resultados de Aprendizaje</th>';
                for (let i = 1; i <= 14; i++) {
                    modulosHeaderRow += `<th>RA${i}</th>`;
                }
                modulosHeaderRow += '<th>Cal. Total</th></tr>';
                modulosHeader.innerHTML = modulosHeaderRow;

                // Llenar la tabla con los módulos técnicos
                data.data.results.forEach(modulo => {
                    const isModuloValid = Array.from({ length: 14 }, (_, i) => `ra${i + 1}`)
                        .some(key => (modulo.grade[key] || 0) > 0);

                    if (isModuloValid) {
                        let moduloRow = `<tr><td>${modulo.className}</td>`;
                        let totalCal = 0;

                        for (let i = 1; i <= 14; i++) {
                            const ra = modulo.grade[`ra${i}`] || '-';
                            moduloRow += `<td>${ra}</td>`;
                            if (typeof ra === 'number') {
                                totalCal += ra;
                            }
                        }
                        moduloRow += `<td>${totalCal > 0 ? totalCal : '-'}</td></tr>`;
                        modulosBody.innerHTML += moduloRow;
                    }
                });
                 
            } else {
               alert ('Estudiante no encontrado');
            }
        })
        .catch(error => {
           // resultDiv.innerHTML = `<p class="error">Error en la búsqueda: ${error.message}</p>`;
           alert('Error en la búsqueda, verifique su ID.');
          
        });
}
