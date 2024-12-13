from config.database import db

class Carrito(db.Model):
    __tablename__ = 'carrito'
    
    id = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer, db.ForeignKey("productos.id", ondelete='CASCADE'))
    titulo = db.Column(db.String(255), )
    imagen = db.Column(db.String(255), ) 
    categoria = db.Column(db.String(50),)
    precio = db.Column(db.String(50))
    talla = db.Column(db.String(10),)
    cantidad = db.Column(db.Integer,)
    cantidad_stop= db.Column(db.Integer,)

    def to_dict(self):
        return {
            "id": self.id,
            "id_producto": self.id_producto,
            "titulo": self.titulo,
            "imagen": self.imagen,
            "categoria": self.categoria,
            "precio": self.precio,
            "talla": self.talla,
            "cantidad": self.cantidad,
            "cantidad_stop": self.cantidad_stop
        }