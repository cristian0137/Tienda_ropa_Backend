document.addEventListener("DOMContentLoaded", () => {

    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
    let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const contenedorTotal = document.querySelector("#total");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");



    async function cargarProductosCarrito() {
        try {
            const response = await fetch('/Obtenercarrito'); // Llama al endpoint para obtener el carrito
            if (!response.ok) throw new Error('Error al obtener productos del carrito');

            const productosEnCarrito = await response.json(); // Obtiene la respuesta en formato JSON
            let total =0
            if (productosEnCarrito.length > 0) {
                contenedorCarritoVacio.classList.add("disabled");
                contenedorCarritoProductos.classList.remove("disabled");
                contenedorCarritoAcciones.classList.remove("disabled");
                contenedorCarritoComprado.classList.add("disabled");

                contenedorCarritoProductos.innerHTML = ""; // Limpia el contenedor

                productosEnCarrito.forEach(producto => {
                    const subtotal = (producto.cantidad * producto.precio).toFixed(3);
                    total = (parseFloat(total) + parseFloat(subtotal)).toFixed(3);
                    
                    //console.log(subtotal)
                    const div = document.createElement("div");
                    div.classList.add("carrito-producto");
                    div.innerHTML = `
                        <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                        <div class="carrito-producto-titulo">
                            <small>Título</small>
                            <h3>${producto.titulo}</h3>
                        </div>
                        <div class="carrito-producto-cantidad">
                            <small>Cantidad</small>
                            <p>${producto.cantidad}</p>
                        </div>
                        <div class="carrito-producto-precio">
                            <small>Precio</small>
                            <p>$${producto.precio}</p>
                        </div>
                        <div class="carrito-producto-subtotal">
                            <small>Subtotal</small>
                            <p>$${subtotal}</p>
                        </div>
                        <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                    `;
                    contenedorCarritoProductos.append(div);
                });
                console.log(total)
                contenedorTotal.textContent = `$${total}`; 
                actualizarBotonesEliminar();
            } else {
                contenedorCarritoVacio.classList.remove("disabled");
                contenedorCarritoProductos.classList.add("disabled");
                contenedorCarritoAcciones.classList.add("disabled");
                contenedorCarritoComprado.classList.add("disabled");
            }
        } catch (error) {
            
        }
    }

    cargarProductosCarrito();

    function actualizarBotonesEliminar() {
        botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarDelCarrito);
        });
    }

    function eliminarDelCarrito(e) {
        const idBoton = e.currentTarget.id;

        // Realizar solicitud DELETE a la API
        fetch("/Eliminar_p_c", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: idBoton }) // Enviar ID del producto
        })
            .then(response => {
                if (response.ok) {
                    // Si la eliminación fue exitosa
                    return response.text();
                } else if (response.status === 404) {
                    throw new Error("El producto no fue encontrado.");
                } else {
                    throw new Error("Error al intentar eliminar el producto.");
                }
            })
            .then(message => {
                console.log(message);
                cargarProductosCarrito()
                // Notificar éxito
                Toastify({
                    text: "Producto eliminado",
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
                        x: '1.5rem',
                        y: '1.5rem'
                    },
                    onClick: function () { }
                }).showToast();
            })
            .catch(error => {
                console.error(error);

                // Notificar error
                Toastify({
                    text: error.message,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #d9534f, #f57170)",
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
    }


    botonVaciar.addEventListener("click", vaciarCarrito);
    function vaciarCarrito() {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'question',
            html: `Se van a borrar todos los productos.`,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/EliminarTodosProductosCarrito', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .catch((error) => {
                    console.error('Error al eliminar los productos:', error);
                })
                .finally(() => {
                    cargarProductosCarrito();
                });
            }
        });
    }



    botonComprar.addEventListener("click", comprarCarrito);
    function comprarCarrito() {

        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
 
    }



})