function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(seccionId).style.display = 'block';

    const botones = document.querySelectorAll('.tab-button');
    botones.forEach(boton => {
        boton.classList.remove('active');
    });
    document.querySelector(`[onclick="mostrarSeccion('${seccionId}')"]`).classList.add('active');
}

function agregarProfesor() {
    alert('Funcionalidad para agregar profesor');
}

function agregarAlumno() {
    alert('Funcionalidad para agregar alumno');
}

function agregarMateria() {
    alert('Funcionalidad para agregar materia');
}

function editarProfesor(button) {
    alert('Funcionalidad para editar profesor');
}

function eliminarProfesor(button) {
    alert('Funcionalidad para eliminar profesor');
}

function editarAlumno(button) {
    alert('Funcionalidad para editar alumno');
}

function eliminarAlumno(button) {
    alert('Funcionalidad para eliminar alumno');
}

function editarMateria(button) {
    alert('Funcionalidad para editar materia');
}

function eliminarMateria(button) {
    alert('Funcionalidad para eliminar materia');
}
