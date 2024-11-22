from config.database import db




class Producto(db.Model):
    __tablename__ = 'productos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255),)
    imagen = db.Column(db.String(255),) 
    categoria = db.Column(db.String(50),)
    precio = db.Column(db.String(50))
    talla = db.Column(db.String(10))
    cantidad = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "imagen": self.imagen,
            "categoria": self.categoria,
            "precio": self.precio,
            "talla": self.talla,
            "cantidad": self.cantidad
        }
