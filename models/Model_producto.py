from config.database import db




class Producto(db.Model):
    __tablename__ = 'Productos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255),)
    imagen = db.Column(db.String(255),) 
    categoria_nombre = db.Column(db.String(50),)
    categoria_id = db.Column(db.String(50),)
    precio = db.Column(db.Float)
    talla = db.Column(db.String(10))
    cantidad = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
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
