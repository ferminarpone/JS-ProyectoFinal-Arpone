// Crear una clase para generar objetos 

class Producto {
    constructor(nombre, precio, id, stock, img) {
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.stock = stock;
        this.img = img;
    }
}

// Creacion de array para guardar los objetos

const productos = [
    new Producto("Juego de jardin", "150.000", 1, 1, "fotos/Productos/Juego de mesas y sillas.jpg"),
    new Producto("Escritorio industrial", "70.000", 2, 1, "fotos/Productos/Escritorio.jpg"),
    new Producto("Recibidor", "60.000", 3, 1, "fotos/Productos/Recibidor.jpg"),
    new Producto("Perchero industrial", "15.000", 4, 1, "fotos/Productos/Perchero.jpg"),
    new Producto("Perchero", "15.000", 5, 1, "fotos/Productos/Perchero 2.jpg"),
    new Producto("Soporte para cascos", "25.000", 6, 1, "fotos/Productos/Soporte para casco.jpg"),
    new Producto("Mesa de arrime", "25.000", 7, 1, "fotos/Productos/Mesa de arrime.jpg"),
    new Producto("Rack de Tv", "150.000", 8, 1, "fotos/Productos/Rack de tv.jpg"),
    new Producto("Macetero de exterior", "6.000", 9, 1, "fotos/Productos/Porta maceta 1.jpg"),
    new Producto("Porta maceta de exterior", "1.500", 10, 1, "fotos/Productos/Porta maceta 2.jpg"),
    new Producto("Fogonero", "60.000", 11, 1, "fotos/Productos/Fogonero.jpg"),
    new Producto("Maceteros", "10.000", 12, 1, "fotos/Productos/Macetero.jpg"),
    new Producto("Lampara industrial", "15.000", 13, 1, "fotos/Productos/Lampara industrial.jpg"),
    new Producto("Banqueta disco de arado", "10.000", 14, 1, "fotos/Productos/Banqueta de campo.jpg"),
    new Producto("Barra de interior", "30.000", 15, 1, "fotos/Productos/Barra.jpg"),
    new Producto("Escritorio", "30.000", 16, 1, "fotos/Productos/Escritorio 3.jpg"),
    new Producto("Recibidor", "40.000", 17, 1, "fotos/Productos/Recibidor 3.jpg"),
    new Producto("Estanteria", "15.000", 18, 1, "fotos/Productos/Estanteria.jpg"),
    new Producto("Mesa ratona", "40.000", 19, 1, "fotos/Productos/Mesa ratona 1.jpeg"),

]

// Declarar variables para capturar elementos

const btnProducto = document.querySelectorAll(".java"),
    cantProducto = document.querySelector("#logoCarrito"),
    btnHtmlCarrito = document.querySelector("#btnHtmlCarrito"),
    htmlCarrito = document.querySelector("#htmlCarrito"),
    toggles = document.querySelectorAll('.toggles'),
    total = document.querySelector("#montoTotal"),
    cerrarHtml = document.querySelector("#cerrarHtml"),
    clickFuera = document.querySelector("#productos");

//Declaración de variables

let carrito = [];
let carritoEnStorage;
let id;

//Condicional para mostrar cantidad de articulos en el carrito
if (carrito == 0) {
    cantProducto.innerHTML = '';
    buscadorLS();
}
else {
    cantProducto.innerHTML = carrito.length;
}

//Evento para agregar productos a carrito

btnProducto.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        id = e.target.getAttribute("data-id");
        agregarCarrito()
    });
});

//Funcion para agregar productos al carrito

function agregarCarrito() {
    let buscador = productos.find((el) => el.id == id);
    guardarProductoLS(buscador);
    recuperarProductoLS();
    cantProducto.innerHTML = carrito.length;
}

//Funciones para guardar y recuperar los productos del Local Storage

function guardarProductoLS(prod) {
    localStorage.setItem(`producto${id}`, JSON.stringify(prod))
}

function recuperarProductoLS() {
    let carritoEnStorage = JSON.parse(localStorage.getItem(`producto${id}`));
    let buscar = carrito.find((el) => el.id == carritoEnStorage.id);
    if (!buscar) {
        carrito = [...carrito, carritoEnStorage];
    }
}

//Evento para mostrar el carrito

btnHtmlCarrito.addEventListener("click", carritoHTML)

//Funcion para mostrar el carrito en el nuevo html

function carritoHTML() {
    buscadorLS();
    limpiarHTML();
    if (carrito.length != 0) {
        for (const producto of carrito) {
            row = document.createElement("div");
            row.innerHTML = ` 
            <div class="card d-flex justify-content-center align-items-center m-3" style="width:180px; background-color: #F9F5EB">
            <h5 class="card-title d-block m-3">${producto.nombre}</h5>
            <img src="${producto.img}" class="card-img-top d-block" alt="..." style="width:140px; height:140px"> 
            <div class="card-body d-flex flex-column" >
                <p class="card-text h6">Precio: $${producto.precio}</p>
                <button type="button" class="btn btn-danger d-block" id="${producto.id}">Eliminar</button>
            </div>
            </div>
            `;
            htmlCarrito.appendChild(row);
        }
        total.innerHTML = `Monto total: $${sumadorDePrecios()}`
        presentarInfo(toggles, 'd-none');
    }
    else {
        cantProducto.innerHTML = '';
    }
}

//Funcion para traer todos los productos del LS

function buscadorLS() {
    if (carrito.length == 0) {
        for (let i = 1; i <= productos.length; i++) {
            let carritoEnStorage = JSON.parse(localStorage.getItem(`producto${i}`));
            carrito = [...carrito, carritoEnStorage];
            carrito = carrito.filter(el => el != null)
            if (carrito.length == 0) {
                cantProducto.innerHTML = '';
            }
            else {
                cantProducto.innerHTML = carrito.length;
            }
        }
    }
}

//Funcion que limpia el html del carrito

function limpiarHTML() {
    htmlCarrito.innerHTML = "";
}

//Funcion para presentar info oculta

function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

//Evento para eliminar productos del carrito

htmlCarrito.addEventListener("click", eliminarProductoLS)

//Funcion para eliminar productos

function eliminarProductoLS(e) {

    if (e.target.classList.contains("btn-danger")) {
        let productoID = e.target.getAttribute("id");
        localStorage.removeItem(`producto${productoID}`)
        carrito = carrito.filter((el) => el.id != productoID);
        presentarInfo(toggles, 'd-none');
        cantProducto.innerHTML = carrito.length;
        carritoHTML();
    }
}

//Eventos para cerrar el carrito

cerrarHtml.addEventListener('click', () => {
    presentarInfo(toggles, 'd-none');
    cantProducto.innerHTML = carrito.length;
}
);

clickFuera.addEventListener('click', cerrarCarrito)

//Funcion para cerrar carrito

function cerrarCarrito() {
    if (!nuevoHtml.classList.contains("d-none")) {
        presentarInfo(toggles, 'd-none');
        cantProducto.innerHTML = carrito.length;
    }
}

// Función de monto total

function sumadorDePrecios() {
    let montoTotal = 0;
    carrito.forEach(el => {
        const precio = Number(el.precio.replace('.', ''));
        montoTotal += precio;
    })
    const formateador = new Intl.NumberFormat('es-ES');
    const numeroFormateado = formateador.format(montoTotal);
    return numeroFormateado;
}

