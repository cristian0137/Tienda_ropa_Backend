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
    nuevo_producto = Carrito(
        id_producto = data.get('id_producto'),
        titulo =  data.get('titulo'),
        imagen =  data.get('imagen'),
        categoria =  data.get('categoria'),
        precio =  data.get('precio'),
        talla =  data.get('talla'),
        cantidad =  data.get('cantidad'),
        cantidad_stop =  data.get('cantidad_stop'),
    )
    db.session.add(nuevo_producto)
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
@app.route('/EliminarProducto', methods = ['DELETE'])
def Eliminar_producto():
    id = request.json['id']
    producto = Producto.query.get(id)

    if producto is None :
        return 'El producto no fue encontrado', 404
    
    db.session.delete(producto)
    db.session.commit()
    return 'producto eliminado', 200

@app.route('/Eliminar_p_c', methods=['DELETE'])
def Eliminar_producto_carrito():
    id = request.json['id']
    producto = Carrito.query.get(id)

    if producto is None:
        return 'El producto no fue encontrado', 404
    
    db.session.delete(producto)
    db.session.commit()
    return 'Producto eliminado',200

@app.route('/EliminarTodosProductosCarrito', methods=['DELETE'])
def eliminar_todos_productos_carrito():
    try:
        productos = Carrito.query.all()
        if not productos:
            return 'No hay productos para eliminar', 404
        for producto in productos:
            db.session.delete(producto)
        db.session.commit()
        
        return 'Todos los productos fueron eliminados', 200
    except Exception as e:
        db.session.rollback() 
        return f'Error al eliminar los productos: {str(e)}', 500



#Editar

@app.route('/ActualizarCarrito', methods=['POST'])
def actualizar_carrito():
    datos = request.json
    id_producto = datos.get('id_producto')

    if not id_producto:
        return jsonify({"error": "El campo 'id_producto' es obligatorio"}), 402
    producto_en_carrito = Carrito.query.filter_by(id_producto=id_producto).first()
    if producto_en_carrito:
        if producto_en_carrito.cantidad == producto_en_carrito.cantidad_stop:
            return jsonify({
                "error": "No se puede incrementar la cantidad. Se alcanzó el límite máximo permitido.",
                "cantidad_actual": producto_en_carrito.cantidad,
                "cantidad_stop": producto_en_carrito.cantidad_stop
            }), 400
        producto_en_carrito.cantidad += 1
        db.session.commit()
        return jsonify({"mensaje": "Cantidad actualizada", "producto": producto_en_carrito.to_dict()}), 200
    else:
        return jsonify({"error": "El producto no está en el carrito"}), 404

@app.route('/ComprarCarrito', methods=['POST'])
def comprar_carrito():
    try:
        productos_en_carrito = Carrito.query.all()

        if not productos_en_carrito:
            return jsonify({"error": "El carrito está vacío"}), 404

        for item in productos_en_carrito:
            producto = Producto.query.filter_by(id=item.id_producto).first()
            if not producto:
                return jsonify({"error": f"Producto con ID {item.id_producto} no encontrado"}), 404

            if producto.cantidad < item.cantidad:
                return jsonify({
                    "error": f"Stock insuficiente para el producto {producto.nombre}.",
                    "stock_disponible": producto.cantidad,
                    "cantidad_requerida": item.cantidad
                }), 400

            producto.cantidad -= item.cantidad

        Carrito.query.delete()
        db.session.commit()

        return jsonify({"mensaje": "Compra realizada con éxito. Carrito vaciado."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Ocurrió un error al procesar la compra.", "detalle": str(e)}), 500









if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

