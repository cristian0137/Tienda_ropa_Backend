from flask import Flask,request,jsonify,render_template
from config.database import db,app
from models.Model_carrito import Carrito
from models.Model_producto import Producto

db.init_app(app)

with app.app_context():
    db.create_all()




#RUTAS
@app.route("/")
def index():
    return render_template("index.html")

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












if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')

