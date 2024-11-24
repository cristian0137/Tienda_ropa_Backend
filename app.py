from flask import Flask,request,jsonify,render_template
from config.database import db,app
from models.Model_carrito import Carrito
from models.Model_producto import Producto
import os
from werkzeug.utils import secure_filename



UPLOAD_FOLDER = 'config/static/img' 
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'} 


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


db.init_app(app)

with app.app_context():
    db.create_all()



#RUTAS
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/registrarproducto")
def registrar_producto():
    return render_template("Agregar_producto.html")

@app.route("/carrito")
def carrito():
    return render_template("carrito.html")

@app.route("/eliminar-producto")
def eliminarProducto():
    return render_template("eliminar_producto.html")

# AGREGAR
@app.route('/Agregarproducto',methods = ['POST'])
def Agregar_produto():
    data = request.get_json()
    nuevo_procurador = Producto(
        titulo =  data.get('titulo'),
        imagen =  data.get('imagen'),
        categoria =  data.get('categoria'),
        precio =  data.get('precio'),
        talla =  data.get('talla'),
        cantidad =  data.get('cantidad'),
    )
    db.session.add(nuevo_procurador)
    db.session.commit()
    return 'Producto guardado',201

@app.route('/Agregarcarrito',methods = ['POST'])
def Agregar_carrito():
    data = request.get_json()
    nuevo_procurador = Carrito(
        id_producto = data.get('id_producto'),
        titulo =  data.get('titulo'),
        imagen =  data.get('imagen'),
        categoria =  data.get('categoria'),
        precio =  data.get('precio'),
        talla =  data.get('talla'),
        cantidad =  data.get('cantidad'),
    )
    db.session.add(nuevo_procurador)
    db.session.commit()
    return 'Producto guardado',201

@app.route('/subir_imagen', methods=['POST'])
def subir_imagen():
    
    if 'imagen' not in request.files:
        return 'No image part', 405

    imagen = request.files['imagen']

    
    if imagen.filename == '':
        return 'No selected file', 400

    if imagen and allowed_file(imagen.filename):
        
        filename = secure_filename(imagen.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagen.save(image_path)
        image_url = f'/static/img/{filename}'

        return jsonify({'message': 'Imagen subida exitosamente', 'image_url': image_url}), 200
    else:
        return jsonify({'message': 'Tipo de archivo no permitido'}), 403




#OBTENER
@app.route('/Obtenerproductos',methods = ['GET'])
def Obtener_productos():
    productos = Producto.query.all()
    productos_dict = [producto.to_dict() for producto in productos]
    return jsonify(productos_dict) 



@app.route('/Obtenercarrito',methods = ['GET'])
def Obtener_carrito():
    carritos = Carrito.query.all()
    carritos_dict = [carrito.to_dict() for carrito in carritos]
    return jsonify(carritos_dict) 

#ELIMINAR
@app.route('/eliminar_producto', methods = ['DELETE'])
def Eliminar_producto():
    id = request.json['id']
    producto = Producto.query.get(id)

    if producto is None :
        return 'El producto no fue encontrado', 404
    
    db.session.delete(producto)
    db.session.commit()
    return  jsonify({"message": "Producto eliminado"}), 200

@app.route('/Eliminar_p_c', methods=['DELETE'])
def Eliminar_producto_carrito():
    id = request.json['id']
    producto = Carrito.query.get(id)

    if producto is None:
        return 'El producto no fue encontrado', 404
    
    db.session.delete(producto)
    db.session.commit()
    return 'Producto eliminado',200


@app.route('/editar_producto/<int:producto_id>', methods=['GET'])
def editar_producto(producto_id):
    # Buscar el producto en la base de datos usando el ID
    producto = Producto.query.get(producto_id)
    
    if producto is None:
        return "Producto no encontrado", 404  # Si no existe el producto
    
    # Pasar el producto a la plantilla HTML para editarlo
    return render_template('editar_producto.html', producto=producto)


@app.route('/actualizar_producto/<int:producto_id>', methods=['POST'])
def actualizar_producto(producto_id):
    producto = Producto.query.get(producto_id)
    
    if producto is None:
        return jsonify({'success': False, 'message': 'Producto no encontrado'}), 404

    producto.titulo = request.form['titulo']
    producto.cantidad = request.form['cantidad']
    producto.precio = request.form['precio']
    producto.talla = request.form['talla']
    producto.categoria = request.form['categoria']
    
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        if imagen and allowed_file(imagen.filename):
            filename = secure_filename(imagen.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            imagen.save(image_path)
            producto.imagen = f'/static/img/{filename}'

    db.session.commit()

    return jsonify({'success': True, 'message': 'Producto actualizado correctamente'})










if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

