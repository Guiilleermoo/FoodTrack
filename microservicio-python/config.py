from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import time
from sqlalchemy.exc import OperationalError

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://python:python@db:3306/microservicioPythonDB'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'sdfsdfbvcxbc324234sdgdszfgGFD'
    db.init_app(app)

    with app.app_context():
        for _ in range(5):
            try:
                db.create_all()
                break
            except OperationalError:
                print("Esperando a que MySQL esté disponible...")
                time.sleep(2)  # Esperar 2 segundos antes de reintentar

    return app
