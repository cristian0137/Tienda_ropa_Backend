document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const productoId = window.location.pathname.split('/').pop(); // Obtener el ID del producto desde la URL

    const formData = new FormData();
    formData.append('titulo', document.getElementById('titulo').value);
    formData.append('cantidad', document.getElementById('cantidad').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('talla', document.getElementById('talla').value);
    formData.append('categoria', document.getElementById('categoria').value);
    if (document.getElementById('imagen').files.length > 0) {
        formData.append('imagen', document.getElementById('imagen').files[0]);
    }

    fetch(`/actualizar_producto/${productoId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Toastify({
                text: "Producto actualizado correctamente",
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right",
                style: {
                    background: "linear-gradient(to right, #4b33a8, #785ce9)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                }
            }).showToast();
        }
    })
    .catch(error => console.error("Error al actualizar el producto:", error));
});
