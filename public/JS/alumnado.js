
var alumnos = [
    {
        foto: 'default.jpg',
        nombre: 'Juan Pérez',
        grado: '7 3',
        id: 'A001',
        materia: 'Matemáticas'
    },
    {
        foto: 'default.jpg',
        nombre: 'María García',
        grado: '7 2',
        id: 'A002',
        materia: 'Ciencias'
    },
    {
        foto: 'default.jpg',
        nombre: 'Carlos López',
        grado: '7 1',
        id: 'A003',
        materia: 'Lengua'
    }
];

var notas = [
    {
        alumno: 'Juan Pérez',
        materia: 'Matemáticas',
        nota: 9,
        observaciones: ''
    },
    {
        alumno: 'María García',
        materia: 'Ciencias',
        nota: 8,
        observaciones: ''
    },
    {
        alumno: 'Carlos López',
        materia: 'Lengua',
        nota: 7,
        observaciones: ''
    }
];

function cambiarSeccion(seccion) {
    if (seccion === 'alumnos') {
        document.getElementById('seccionAlumnos').style.display = 'block';
        document.getElementById('seccionNotas').style.display = 'none';
    } else if (seccion === 'notas') {
        document.getElementById('seccionAlumnos').style.display = 'none';
        document.getElementById('seccionNotas').style.display = 'block';
        actualizarSelectAlumnos();
    }
    // Actualizar el estado activo de los botones
    var botones = document.getElementsByClassName('boton-tab');
    for (var i = 0; i < botones.length; i++) {
        botones[i].classList.remove('activo');
    }
    document.querySelector(`button[onclick="cambiarSeccion('${seccion}')"]`).classList.add('activo');
}

function mostrarFormularioAgregar() {
    document.getElementById('formularioAgregar').style.display = 'block';
}

function cerrarFormularioAgregar() {
    document.getElementById('formularioAgregar').style.display = 'none';
    document.getElementById('formAgregarAlumno').reset();
}

function agregarAlumno() {
    var nombre = document.getElementById('nombreAlumno').value.trim();
    var grado = document.getElementById('gradoAlumno').value;
    var id = document.getElementById('idAlumno').value.trim();
    var materia = document.getElementById('materiaAlumno').value.trim();

    if (nombre === '' || grado === '' || id === '' || materia === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    var nuevoAlumno = {
        foto: 'default.jpg',
        nombre: nombre,
        grado: grado,
        id: id,
        materia: materia
    };
    alumnos.push(nuevoAlumno);
    mostrarAlumnos();

    // Limpiar el formulario y cerrarlo
    cerrarFormularioAgregar();
    // Actualizar el select de alumnos en la sección de notas
    actualizarSelectAlumnos();
}

function mostrarAlumnos() {
    var lista = document.getElementById('entradasAlumnos');
    lista.innerHTML = '';

    alumnos.forEach(function(alumno, index) {
        var fila = document.createElement('tr');
        fila.classList.add('bg-white', 'hover:bg-gray-50');
        fila.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${alumno.foto}" alt="Foto de ${alumno.nombre}" class="h-10 w-10 rounded-full">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${alumno.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${alumno.grado}</td>
            <td class="px-6 py-4 whitespace-nowrap">${alumno.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">${alumno.materia}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editarAlumno(${index})" class="text-blue-600 hover:text-blue-900">Editar</button>
                <button onclick="eliminarAlumno(${index})" class="text-red-600 hover:text-red-900 ml-2">Eliminar</button>
            </td>
        `;
        lista.appendChild(fila);
    });
}

function buscarAlumno() {
    var filtro = document.getElementById('buscadorAlumnos').value.toLowerCase();
    var filas = document.querySelectorAll('#entradasAlumnos tr');

    filas.forEach(function(fila) {
        var nombre = fila.cells[1].textContent.toLowerCase();
        if (nombre.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function eliminarAlumno(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
        // Eliminar las notas asociadas a este alumno
        notas = notas.filter(function(nota) {
            return nota.alumno !== alumnos[index].nombre;
        });
        alumnos.splice(index, 1);
        mostrarAlumnos();
        mostrarNotas();
        actualizarSelectAlumnos();
    }
}

function editarAlumno(index) {
    var alumno = alumnos[index];
    mostrarFormularioAgregar();
    document.getElementById('nombreAlumno').value = alumno.nombre;
    document.getElementById('gradoAlumno').value = alumno.grado;
    document.getElementById('idAlumno').value = alumno.id;
    document.getElementById('materiaAlumno').value = alumno.materia;

    // Remover el alumno actual para evitar duplicados al guardar
    alumnos.splice(index, 1);
    actualizarSelectAlumnos();
}

function mostrarFormularioAgregarNota() {
    actualizarSelectAlumnos();
    document.getElementById('formularioAgregarNota').style.display = 'block';
}

function cerrarFormularioAgregarNota() {
    document.getElementById('formularioAgregarNota').style.display = 'none';
    document.getElementById('formAgregarNota').reset();
}

function actualizarSelectAlumnos() {
    var select = document.getElementById('alumnoNota');
    select.innerHTML = '<option value="">Seleccione Alumno</option>';
    alumnos.forEach(function(alumno, index) {
        var option = document.createElement('option');
        option.value = alumno.nombre;
        option.textContent = alumno.nombre;
        select.appendChild(option);
    });
}

function agregarNota() {
    var alumnoNombre = document.getElementById('alumnoNota').value;
    var materia = document.getElementById('materiaNota').value.trim();
    var notaValor = document.getElementById('notaValor').value;
    var observaciones = document.getElementById('observacionesNota').value.trim();

    if (alumnoNombre === '' || materia === '' || notaValor === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    var nuevaNota = {
        alumno: alumnoNombre,
        materia: materia,
        nota: notaValor,
        observaciones: observaciones
    };
    notas.push(nuevaNota);
    mostrarNotas();

    // Limpiar el formulario y cerrarlo
    cerrarFormularioAgregarNota();
}

function mostrarNotas() {
    var lista = document.getElementById('entradasNotas');
    lista.innerHTML = '';

    notas.forEach(function(nota, index) {
        var fila = document.createElement('tr');
        fila.classList.add('bg-white', 'hover:bg-gray-50');
        fila.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${nota.alumno}</td>
            <td class="px-6 py-4 whitespace-nowrap">${nota.materia}</td>
            <td class="px-6 py-4 whitespace-nowrap">${nota.nota}</td>
            <td class="px-6 py-4 whitespace-nowrap">${nota.observaciones}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="editarNota(${index})" class="text-blue-600 hover:text-blue-900">Editar</button>
                <button onclick="eliminarNota(${index})" class="text-red-600 hover:text-red-900 ml-2">Eliminar</button>
            </td>
        `;
        lista.appendChild(fila);
    });
}

function buscarNota() {
    var filtro = document.getElementById('buscadorNotas').value.toLowerCase();
    var filas = document.querySelectorAll('#entradasNotas tr');

    filas.forEach(function(fila) {
        var alumno = fila.cells[0].textContent.toLowerCase();
        var materia = fila.cells[1].textContent.toLowerCase();
        var observaciones = fila.cells[3].textContent.toLowerCase();

        if (alumno.includes(filtro) || materia.includes(filtro) || observaciones.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function eliminarNota(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
        notas.splice(index, 1);
        mostrarNotas();
    }
}

function editarNota(index) {
    var nota = notas[index];
    mostrarFormularioAgregarNota();
    document.getElementById('alumnoNota').value = nota.alumno;
    document.getElementById('materiaNota').value = nota.materia;
    document.getElementById('notaValor').value = nota.nota;
    document.getElementById('observacionesNota').value = nota.observaciones;

    // Remover la nota actual para evitar duplicados al guardar
    notas.splice(index, 1);
}

// Inicializa mostrando los alumnos y notas precargados
mostrarAlumnos();
mostrarNotas();
actualizarSelectAlumnos();
