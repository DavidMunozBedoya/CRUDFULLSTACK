document.addEventListener("DOMContentLoaded", leerApi);
const url = "http://localhost:3000/aprendices";
const tabla = document.querySelector("#tabla");
const formulario = document.querySelector("#formulario");
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
                
                <td><button class="btn btn-danger" id="${aprendiz.id}">Eliminar</button>
                <button class="btn btn-warning" id="${aprendiz.id}">Editar</button>
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
    .then(res => res.json())
    .then(res => {
        console.log(res);
        location.reload();
    })
}


formulario.addEventListener("submit", agregarDatos);

function agregarDatos(){
    const datos = {
        id: id.value,
        nombre: nombre.value,
        apellido: apellido.value,
        estaMatriculado: true,
        email: correo.value
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(res => {
        formulario.reset();
        location.reload();
    })
}

function editarRegistro(){
    const id = event.target.id;
    fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(res => {
        console.log("datos", res);
        id.value = res.id;
        nombre.value = res.nombre;
        apellido.value = res.apellido;
        correo.value = res.email;
        
        
    })
}