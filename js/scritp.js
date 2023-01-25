// Declarar variables para capturar elementos

const cantProducto = document.querySelector("#logoCarrito"),
    btnHtmlCarrito = document.querySelector("#btnHtmlCarrito"),
    htmlCarrito = document.querySelector("#htmlCarrito"),
    toggles = document.querySelectorAll('.toggles'),
    total = document.querySelector("#montoTotal"),
    cerrarHtml = document.querySelector("#cerrarHtml"),
    clickFuera = document.querySelector("#productos"),
    container = document.querySelector("#container");

//Declaración de variables

let carrito =  JSON.parse(localStorage.getItem("carrito")) || [];
const productos = [];
let carritoEnStorage;
let id;

// Crear una clase constructora con sus metodos

class Producto {
    constructor(nombre, precio, id, stock, img) {
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.stock = stock;
        this.img = img;
    };

    visualizarProductos(){
       const card  = `
        <div class="col">
            <div class="card">
                <a href="" data-bs-toggle="modal" data-bs-target="#producto${this.id}">
                    <img src="${this.img}" class="card-img-top h6"
                        alt="${this.nombre}">
                </a>
                <div class="card-body">
                    <h3 class="card-title text-center">${this.nombre}</h3>
                    <p class="h5 text-center">$${this.precio}</p>
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-primary" id="producto${this.id}">Agregar a
                            carrito</button>
                    </div>
                </div>
            </div>
         </div>
        `;
        container.innerHTML+= card; 
    };
    agregarEvento(){
        const btnProducto = document.getElementById(`producto${this.id}`);
        const encontrarProd = productos.find( (p)=> p.id == this.id);
        btnProducto.addEventListener("click", ()=>agregarCarrito(encontrarProd));
    }
};

//Funcion asincronica para traer informacion de una API/archivo json, como en este caso

const leerDB = async () => {
    const resp = await fetch("./json/DB.json");
    const data = await resp.json();

    data.forEach((prod) => {
        let newProducto = new Producto (prod.nombre, prod.precio, prod.id, prod.stock, prod.img);
        productos.push(newProducto);
    });
    productos.forEach((el)=>{
        el.visualizarProductos();
    })
    productos.forEach((el)=>{
        el.agregarEvento();
    })
};

leerDB();

// Operador ternario para mostrar cantidad de productos en carrito
function cantidadCarrito(){
carrito.length == 0 ? cantProducto.innerHTML = "" : cantProducto.innerHTML = carrito.reduce((acc,prod)=> acc + prod.cantidad, 0);
}
cantidadCarrito()
//Funcion para agregar productos al carrito

function agregarCarrito(producto){
    const cargado = carrito.find(p => p.id == producto.id);
    if(!cargado){
        carrito.push({...producto , cantidad:1 });
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    else{
        const filtrado = carrito.filter(p => p.id != cargado.id);
        carrito = 
        [... filtrado,
            {
                ...cargado,
                cantidad: cargado.cantidad + 1
            }
        ]
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    cantidadCarrito()
    
}

//Evento para mostrar el carrito

btnHtmlCarrito.addEventListener("click", carritoHTML)

//Funcion para mostrar el carrito en el nuevo html

function carritoHTML() {
    limpiarHTML();
    if (carrito.length != 0) {
        carrito.forEach(el=>{
            if(el.cantidad !=0){
                row = document.createElement("div");
                row.innerHTML = ` 
                <div class="card d-flex justify-content-center align-items-center m-3" style="width:180px; background-color: #F9F5EB">
                <h5 class="card-title d-block m-3">${el.nombre}</h5>
                <img src="${el.img}" class="card-img-top d-block" alt="..." style="width:140px; height:140px"> 
                <div class="card-body d-flex flex-column" >
                <p class="card-text h6">Precio: $${el.precio}</p>
                <button type="button" class="btn btn-danger d-block" id="${el.id}">Eliminar</button>
                </div>
                </div>
                `;
            htmlCarrito.appendChild(row);
            total.innerHTML = `Monto total: $${sumadorDePrecios()}`
            
            }
        })
        
     }
        
    else {
        cantidadCarrito()
        presentarInfo(toggles, 'd-none');
        
    }
    presentarInfo(toggles, 'd-none');
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
        //localStorage.removeItem(`producto${productoID}`)
        const buscar = carrito.find(e=>e.id == productoID);
        const resta = buscar.cantidad-1;
        const filtro = carrito.filter((el) => el.id != productoID);        

        if(resta !=0){
            carrito =  [...filtro,{...buscar, cantidad: resta}]
        } else{
            carrito = [...filtro]
        }
        
        localStorage.setItem("carrito", JSON.stringify(carrito));
        presentarInfo(toggles, 'd-none');
        cantidadCarrito()
        carritoHTML(); 
    }
}


//Eventos para cerrar el carrito

cerrarHtml.addEventListener('click', () => {
    presentarInfo(toggles, 'd-none');
    cantidadCarrito()
}
);

clickFuera.addEventListener('click', cerrarCarrito)

//Funcion para cerrar carrito

function cerrarCarrito() {
    if (!nuevoHtml.classList.contains("d-none")) {
        presentarInfo(toggles, 'd-none');
        cantidadCarrito()
    }
}



// Función de monto total

function sumadorDePrecios() {
    let montoTotal = 0;
    carrito.forEach(el => {
        const precio = Number(el.precio.replace('.', ''));
        const totalElemento = precio*el.cantidad
        montoTotal += totalElemento;
    })
    const formateador = new Intl.NumberFormat('es-ES');
    const numeroFormateado = formateador.format(montoTotal);
    return numeroFormateado;
}
