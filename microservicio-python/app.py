from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

app = Flask(__name__)

# Configura la conexión a la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://python:python@db/microservicioPythonDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Usuario(db.Model):
    id_usuario = db.Column(db.Integer, primary_key=True)  # ID de Usuario (Clave Primaria)
    nombre_usuario = db.Column(db.String(80), nullable=False)  # Nombre de Usuario
    correo_electronico = db.Column(db.String(120), unique=True, nullable=False)  # Correo Electrónico
    contrasena = db.Column(db.String(128), nullable=False)  # Contraseña (Almacenada de manera segura)
    fecha_registro = db.Column(db.DateTime, default=datetime.now(timezone.utc))  # Fecha de Registro
    edad = db.Column(db.Integer)  # Edad

    def __repr__(self):
        return f'<Usuario {self.nombre_usuario}>'
    
# Crear los esquemas
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

@app.route('/')
def hello():
    return "Hola Flask!"

# Crear usuario
# Buscar usuario por gmail y contraseña
# Eliminar usuario

# Crear Alimento
# Actualizar Alimento
# Eliminar Alimento

# Crear Registro de Consumo
# Eliminar Registro de Consumo

