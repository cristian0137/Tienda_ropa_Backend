document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const imagen_ = document.querySelector('input[type="file"]').files[0];
        const categoria = document.getElementById('categoria').value;
        const precio = document.getElementById('precio').value;
        const talla = document.getElementById('talla').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        let imagen = '';
        const formData = new FormData();
        formData.append('imagen', document.getElementById('imagen').files[0]);
        if (imagen_) {
            imagen = `/static/img/${imagen_.name}`;
        }
        console.log(imagen)
        const producto = { titulo, imagen, categoria, precio, talla, cantidad };

        fetch('/Agregarproducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(producto)
        }).then(() => {
            form.reset();
        });

        fetch('/subir_imagen', {
            method: 'POST',
            body: formData
        }).then(() => {
            console.log("IMAGEN GUARDADA")
        });


    });

});
