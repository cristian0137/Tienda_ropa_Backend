let productos = [];
fetch("/Obtenerproductos")
    .then(response => response.json())
    .then(data => {
        productos = data;
        console.log(productos)
        cargarProductos(productos);

    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");//--------------------------------------
const numerito = document.querySelector("#numerito");





function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
         <div class="card producto mb-4" style="width: 18rem;">
  <img src="${producto.imagen}" class="card-img-top producto-imagen" alt="${producto.titulo}">
  <div class="card-body producto-detalles">
    <h5 class="card-title producto-titulo">${producto.titulo}</h5>
    <p class="card-text producto-precio">$${producto.precio}</p>
    <div class="d-flex justify-content-center align-items-center gap-2">
      <button class="btn btn-primary btn-sm producto-agregar" id="${producto.id}">
        <i class="bi bi-cart-plus"></i> Agregar
      </button>
      <button class="btn btn-warning btn-sm producto-editar" data-id="${producto.id}">
    <i class="bi bi-pencil-square"></i> Editar
</button>

      <button class="btn btn-danger btn-sm producto-eliminar" id="eliminar-${producto.id}">
        <i class="bi bi-trash"></i> Eliminar
      </button>
    </div>
  </div>
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
    botonesEditar = document.querySelectorAll(".producto-editar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });

    botonesEditar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const productoId = e.currentTarget.getAttribute("data-id");  
            
            window.location.href = `/editar_producto/${productoId}`;
        });
    });
}



let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
actualizarNumerito();

function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id);
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    let mensajeToast = "Producto agregado";

    if (productoAgregado) {
        const productoParaActualizar = {
            id_producto: productoAgregado.id
        };

        
        fetch("/ActualizarCarrito", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productoParaActualizar)
        })
        .then(response => {
            if (response.status === 404) {
                const productoParaCarrito = {
                    id_producto: productoAgregado.id,
                    titulo: productoAgregado.titulo,
                    imagen: productoAgregado.imagen,
                    categoria: productoAgregado.categoria,
                    precio: productoAgregado.precio,
                    talla: productoAgregado.talla, 
                    cantidad: 1, 
                    cantidad_stop: productoAgregado.cantidad
                };

                return fetch("/Agregarcarrito", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productoParaCarrito)
                });
            } else if (response.status === 400) {
                mensajeToast = "No hay más producto disponible";
                throw new Error("Límite de producto alcanzado.");
            } else if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error al actualizar el carrito.");
            }
        })
        .then(data => {
            if (data) {
                console.log("Producto actualizado o agregado:", data);
                actualizarNumerito();
            }
        })
        .catch(error => {
            console.error("Error:", error);
        })
        .finally(() => {
            Toastify({
                text: mensajeToast,
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true, 
                style: {
                    background: mensajeToast === "No hay más producto disponible"
                        ? "linear-gradient(to right, #ff0000, #ff7373)" 
                        : "linear-gradient(to right, #4b33a8, #785ce9)", 
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem', 
                    y: '1.5rem' 
                },
                onClick: function () { } 
            }).showToast();
        });
    } else {
        console.error("Producto no encontrado");
    }
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

function mensajeproductoeliminado() {2
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
