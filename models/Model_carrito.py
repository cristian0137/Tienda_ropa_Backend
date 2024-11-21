from config.database import db

class Producto(db.Model):
    __tablename__ = 'carrito'
    
    id = db.Column(db.Integer(50), primary_key=True)
    id_producto= db.Column(db.Integer(50),db.ForeignKey("Sillas.id"))
    titulo = db.Column(db.String(255), )
    imagen = db.Column(db.String(255), ) 
    categoria_nombre = db.Column(db.String(50),)
    categoria_id = db.Column(db.String(50),)
    precio = db.Column(db.Float,)
    talla = db.Column(db.String(10),)
    cantidad = db.Column(db.Integer,)

    def to_dict(self):
        return {
            "id": self.id,
            "id_producto": self.id_producto,
            "titulo": self.titulo,
            "imagen": self.imagen,
            "categoria": {
                "nombre": self.categoria_nombre,
                "id": self.categoria_id
            },
            "precio": self.precio,
            "talla": self.talla,
            "cantidad": self.cantidad
        }