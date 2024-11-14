from datetime import datetime, timezone
from config import db

# Tabla de Usuarios
class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombreUsario = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    contrasena = db.Column(db.String(128), nullable=False)
    fechaRegistro = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    edad = db.Column(db.Integer)

    def __repr__(self):
        return f'<Usuario {self.nombre_usuario}>'
    
    def to_dict(self):
        return {'id': self.id, 'name': self.nombreUsario, 'email': self.email, 'fechaRegistro': self.fechaRegistro, 'edad': self.edad}

# Tabla de Alimentos
class Alimento(db.Model):
    __tablename__ = 'alimento'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombreAlimento = db.Column(db.String(80), nullable=False)
    nutriScore = db.Column(db.String(1))

    def __repr__(self):
        return f'<Alimento {self.nombreAlimento}>'
    
    def to_dict(self):
        return {'id': self.id, 'name': self.nombreAlimento, 'nutriScore': self.nutriScore}

# Tabla de Registros de Consumo
class Consumo(db.Model):
    __tablename__ = 'consumo'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    alimentoID = db.Column(db.Integer, db.ForeignKey('alimento.id'), nullable=False)
    usuarioID = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    fechaConsumo = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    cantidad = db.Column(db.Double, nullable=False)
    calorias = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Consumo {self.alimentoID} por Usuario {self.usuarioID}>'

    
    def to_dict(self):
        return {'id': self.id, 'alimentoID': self.alimentoID, 'usuarioID': self.usuarioID, 'fechaConsumo': self.fechaConsumo, 'cantidad': self.cantidad, 'calorias': self.calorias}