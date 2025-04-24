document.addEventListener("DOMContentLoaded", leerApi);
const url = "http://localhost:3000/aprendices";
const tabla = document.querySelector("#tabla");
const formulario = document.querySelector("#formulario");
const formularioModal = document.querySelector("#formularioModal");
const id = document.querySelector("#id");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const correo = document.querySelector("#correo");

function leerApi(){

    fetch(url)
    .then((res) => res.json())
    .then((res) =>{
        console.log(res);            
        res.forEach((aprendiz) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${aprendiz.id}</td>
                <td>${aprendiz.nombre}</td>
                <td>${aprendiz.apellido}</td>
                <td>${aprendiz.estaMatriculado}</td>
                <td>${aprendiz.email}</td>
                
                <td>
                <button class="btn btn-danger" 
                id="${aprendiz.id}">
                Eliminar
                </button> 
                <button 
                class="btn btn-warning btn-editar" 
                id="${aprendiz.id}" 
                data-bs-toggle="modal" 
                data-bs-target="#modalFormulario">
                Editar
                </button>
                </td>
                <td></td>
            `;
            tabla.appendChild(fila);
        });
        const btnEliminar = document.querySelectorAll(".btn-danger");
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', eliminarRegistro);
        });
        const btnEditar = document.querySelectorAll(".btn-warning");
        btnEditar.forEach(btn => {
            btn.addEventListener('click', editarRegistro);
        });
    });
};

function eliminarRegistro(e){
    const id = e.target.id;
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        location.reload();
    })
}


formulario.addEventListener("submit", agregarDatos);

function agregarDatos(e) {
    e.preventDefault();

    const nuevoId = id.value; // Obtener el nuevo ID del formulario
    // Verificar si el ID ya existe en la API

    fetch(`${url}/${nuevoId}`)
        .then((res) => {
            if (res.ok) { //pregunto si la respuesta es true (si la respuesta del servidor es 200)
                return res.json(); // Si la respuesta es true, significa que el ID ya existe
                // El ID ya existe
                alert("El ID ya existe, por favor ingresa otro ID.");
                throw new Error("ID duplicado");
            } else {
                // El ID no existe, se puede agregar
                const datos = {
                    id: id.value,
                    nombre: nombre.value,
                    apellido: apellido.value,
                    estaMatriculado: "True",
                    email: correo.value
                };
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });
            }
        })
        .then((res) => res.json())
        .then((res) => {
            formulario.reset(); // limpia los inputs del formulario
            location.reload(); // recarga la pagina para ver los cambios (como si fuera un f5 - actualiza la pagina)
        })
        .catch(error => {
            if (error.message !== "ID duplicado") {
                console.error("Error inesperado:", error);
            }
        });
}


function editarRegistro(e){
    const idRegistro = e.target.id; // cargo el id del registro a editar
    //consulto la api para obtener los datos del registro
    // y cargarlos en el formulario
    fetch(`${url}/${idRegistro}`) //url + idRegistro
    .then((res) => res.json())
    .then((res) => {
        
        // invoco los inputs del modal        
        const idModal = document.querySelector("#idModal");
        const nombreModal = document.querySelector("#nombreModal");
        const apellidoModal = document.querySelector("#apellidoModal");
        const correoModal = document.querySelector("#correoModal");
        // cargo los datos en el formulario
        idModal.value = res.id;
        nombreModal.value = res.nombre;
        apellidoModal.value = res.apellido;
        correoModal.value = res.email;
        
        
        const modal = new bootstrap.Modal(document.querySelector('#modal')); // instancio el modal de bootstrap
        modal.show();   // Mostrar el modal 
        
        //inhabilito el input del id para que no se pueda editar
        idModal.setAttribute("readonly", true);
        idModal.setAttribute("disabled", true);
        
    })
}

// Agregar el evento al botón de guardar cambios
formularioModal.addEventListener("submit", ActualizarDatos); 

function ActualizarDatos(e) {
    e.preventDefault();
    // Obtener los valores del formulario modal
    const idModal = document.querySelector("#idModal").value;
    const nombreModal = document.querySelector("#nombreModal").value;
    const apellidoModal = document.querySelector("#apellidoModal").value;
    const correoModal = document.querySelector("#correoModal").value;
    const estadoModal = document.querySelector("#estadoModal").value;

    const datosActualizados = {
        id: idModal,
        nombre: nombreModal,
        apellido: apellidoModal,
        estaMatriculado: estadoModal,
        email: correoModal
    };

    fetch(`${url}/${idModal}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(res => res.json())
    .then(res => {
        formulario.reset();
        location.reload();
    });

}