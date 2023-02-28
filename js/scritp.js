// Declarar variables para capturar elementos

const cantProducto = document.querySelector("#logoCarrito"),
  btnHtmlCarrito = document.querySelector("#btnHtmlCarrito"),
  htmlCarrito = document.querySelector("#htmlCarrito"),
  toggles = document.querySelectorAll(".toggles"),
  total = document.querySelector("#montoTotal"),
  cerrarHtml = document.querySelector("#cerrarHtml"),
  clickFuera = document.querySelector("#productos"),
  container = document.querySelector("#container"),
  checkMenu = document.querySelector("#check");

let disableScroll = () => {
  if (!nuevoHtml.classList.contains("d-none")) {
    clickFuera.classList.add("scroll");
  } else {
    if (clickFuera.classList.contains("scroll")) {
      clickFuera.classList.remove("scroll");
    }
  }
};

//Declaración de variables

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
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
  }

  visualizarProductos() {
    const card = `
        <div class="col">
            <div class="card">
                    <img src="${this.img}" class="card-img-top"
                        alt="${this.nombre}">                      
                <div class="card-body">
                    <h3 class="card-title text-center">${this.nombre}</h3>
                    <p class="h5 text-center">$${this.precio}</p>
                    <div class="d-flex justify-content-center">
                        <button class="buttonCard" id="producto${this.id}"> Agregar a
                            carrito </button>
                    </div>
                </div>
            </div>
         </div>
        `;
    container.innerHTML += card;
  }
  agregarEvento() {
    const btnProducto = document.getElementById(`producto${this.id}`);
    const encontrarProd = productos.find((p) => p.id == this.id);
    btnProducto.addEventListener("click", () => agregarCarrito(encontrarProd));
  }
}

//Funcion asincronica para traer informacion de una API/archivo json, como en este caso

const leerDB = async () => {
  const resp = await fetch("./json/DB.json");
  const data = await resp.json();
  data.forEach((prod) => {
    let newProducto = new Producto(
      prod.nombre,
      prod.precio,
      prod.id,
      prod.stock,
      prod.img
    );
    productos.push(newProducto);
  });
  productos.forEach((el) => {
    el.visualizarProductos();
  });
  productos.forEach((el) => {
    el.agregarEvento();
  });
};

leerDB();

// Operador ternario para mostrar cantidad de productos en carrito

function cantidadCarrito() {
  carrito.length == 0
    ? (cantProducto.innerHTML = "")
    : (cantProducto.innerHTML = carrito.reduce(
        (acc, prod) => acc + prod.cantidad,
        0
      ));
}
cantidadCarrito();

//Funcion para agregar productos al carrito

function agregarCarrito(producto) {
  Swal.fire({
    icon: "success",
    width: "350px",
    title: "Producto agregado con exito!",
    confirmButtonText:
      '<button id="seguirComprando">Continuar comprando</button>',
    showCancelButton: true,
    cancelButtonText:
      '<div id="mostrarCarrito"> <button type="button">Ir al carrito</button> </div>',
  });
  const cargado = carrito.find((p) => p.id == producto.id);
  if (!cargado) {
    carrito.push({ ...producto, cantidad: 1 });
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } else {
    const filtrado = carrito.filter((p) => p.id != cargado.id);
    carrito = [
      ...filtrado,
      {
        ...cargado,
        cantidad: cargado.cantidad + 1,
      },
    ];
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  cantidadCarrito();
  const carro = document.getElementById("mostrarCarrito");
  carro.addEventListener("click", carritoHTML);
}

//Funcion para cerrar Hamburger menu

let closeMenu = () => {
  if (checkMenu.checked) {
    checkMenu.checked = false;
  }
};

//Evento para mostrar el carrito

btnHtmlCarrito.addEventListener("click", carritoHTML);

//Funcion para mostrar el carrito en el nuevo html

function carritoHTML() {
  closeMenu();
  limpiarHTML();
  if (carrito.length != 0) {
    carrito.forEach((el) => {
      if (el.cantidad != 0) {
        row = document.createElement("div");
        row.innerHTML = ` 
                <div class="container">                
                    <div class="card d-flex flex-row justify-content-between align-items-center m-2" style="width:420px; height:120px; background-color: #F9F5EB">
                        <div class="d-flex flex-column align-items-center mb-2" style="width: 150px">
                            <h5 class="card-title">${el.nombre}</h5>
                            <img src="${el.img}" class="card-img-top;" alt="..." style="width:70px; height:70px"> 
                        </div>

                        <div>     
                            <p class="card-text h5" style="width:70px" > $${el.precio}</p>
                        </div>    
                    
                        <div class="d-flex align-items-center" >
                            <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <button type="button" style="color:#F9F5EB; background-color: #253b5b " class="btn aumentar btn-sm mb-1" id="${el.id}">+</button>
                                <button type="button" style="color:#F9F5EB; background-color: rgb(174, 62, 62) " class="btn disminuir btn-sm" id="${el.id}">-</button>
                            </div>
                            <p class=" p-2 ms-2 h6 border border-dark rounded" style="width: 26px; text-align:center">${el.cantidad}</p>
                        </div>                    
                        <button type="button" style="color:#F9F5EB; background-color: rgb(174, 62, 62) " class="btn btn-sm eliminar  me-4" id="${el.id}">Eliminar</button>                               
                    </div>
                </div>    
                `;
        htmlCarrito.appendChild(row);
        total.innerHTML = `Monto total: $${sumadorDePrecios()}`;
      }
    });
  } else {
    cantidadCarrito();
    presentarInfo(toggles, "d-none");
  }
  presentarInfo(toggles, "d-none");
}

//Funcion que limpia el html del carrito

function limpiarHTML() {
  htmlCarrito.innerHTML = "";
}

//Funcion para presentar info oculta

function presentarInfo(array, clase) {
  array.forEach((element) => {
    element.classList.toggle(clase);
  });
  disableScroll();
}

//Evento para disminuir cantidad dentro del carrito

htmlCarrito.addEventListener("click", disminuirCantidad);

//Funcion para disminuir cantidad dentro del carrito

function disminuirCantidad(e) {
  if (e.target.classList.contains("disminuir")) {
    let productoID = e.target.getAttribute("id");
    const buscar = carrito.find((e) => e.id == productoID);
    const posicion = carrito.indexOf(buscar);
    if (buscar.cantidad > 1) {
      carrito[posicion].cantidad = buscar.cantidad - 1;
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      carrito[posicion].cantidad = 1;
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    presentarInfo(toggles, "d-none");
    cantidadCarrito();
    carritoHTML();
  }
}

//Evento para aumentar cantidad dentro de carrito

htmlCarrito.addEventListener("click", aumentarCantidad);

//Funcion para aumentar cantidad dentro de carrito

function aumentarCantidad(e) {
  if (e.target.classList.contains("aumentar")) {
    let productoID = e.target.getAttribute("id");
    const buscar = carrito.find((e) => e.id == productoID);
    const posicion = carrito.indexOf(buscar);
    carrito[posicion].cantidad = buscar.cantidad + 1;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    presentarInfo(toggles, "d-none");
    cantidadCarrito();
    carritoHTML();
  }
}

//Evento para deliminar producto del carrito

htmlCarrito.addEventListener("click", eliminarProducto);

//Funcion para eliminar producto del carrito

function eliminarProducto(e) {
  if (e.target.classList.contains("eliminar")) {
    Swal.fire({
      icon: "warning",
      width: "400px",
      title: "¿Estas seguro?",
      text: "El producto será eliminado del carrito",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:
        '<div style="font-size:10px"> Si, eliminar producto!</div>',
      cancelButtonText: '<div style="font-size:10px"> Cancelar </div>',
    }).then((result) => {
      if (result.isConfirmed) {
        let productoID = e.target.getAttribute("id");
        const filtro = carrito.filter((el) => el.id != productoID);
        carrito = [...filtro];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        presentarInfo(toggles, "d-none");
        cantidadCarrito();
        //carritoHTML();
      }
    });
  }
}

//Eventos para cerrar el carrito

cerrarHtml.addEventListener("click", () => {
  presentarInfo(toggles, "d-none");
  cantidadCarrito();
});

clickFuera.addEventListener("click", cerrarCarrito);

//Funcion para cerrar carrito

function cerrarCarrito() {
  if (!nuevoHtml.classList.contains("d-none")) {
    presentarInfo(toggles, "d-none");
    cantidadCarrito();
  }
}

// Función de monto total

function sumadorDePrecios() {
  let montoTotal = 0;
  carrito.forEach((el) => {
    const precio = Number(el.precio.replace(".", ""));
    const totalElemento = precio * el.cantidad;
    montoTotal += totalElemento;
  });
  const formateador = new Intl.NumberFormat("es-ES");
  const numeroFormateado = formateador.format(montoTotal);
  return numeroFormateado;
}
