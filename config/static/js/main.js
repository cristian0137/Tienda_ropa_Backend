let productos = [];
fetch("/Obtenerproductos")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);

    })
        
//url_for('static', filename='images/mi_imagen.jpg');//C:\Users\crist\OneDrive\Escritorio\Tienda_ropa_backend\Tienda_ropa_Backend\config\static\img\imagen1.png

//  static/img/imagen1.png
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
                <button class="producto-eliminar" id="eliminar-${producto.id}">Eliminar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

//-------------------------------------------
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        let productosFiltrados = []; 

        if (e.currentTarget.id != "todos") {
            productosFiltrados = productos.filter(producto => producto.categoria === e.currentTarget.id);

            if (productosFiltrados.length > 0) {
                tituloPrincipal.innerText = productosFiltrados[0].categoria;
            } else {
                tituloPrincipal.innerText = "No hay productos en esta categoría";
            }
        } else {
            productosFiltrados = productos;
            tituloPrincipal.innerText = "Todos los productos";
        }
        cargarProductos(productosFiltrados);
    });
});


function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesEliminar = document.querySelectorAll(".producto-eliminar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id.split('-')[1]; // Obtener ID del producto

    
    fetch("/eliminar_producto", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: idBoton })
    })
    .then(() => {
        console.log("Se elimino sastifactoriamente")
        mensajeproductoeliminado()
    })
    .catch(error => console.error("Error en la solicitud:", error));



}

function mensajeproductoeliminado() {
    Toastify({
        text: "Producto eliminado exitosamente",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal 
            y: '1.5rem' // vertical 
          }, // Callback after click
      }).showToast();

      setTimeout(() => {
        location.reload();
    }, 1000);

}
