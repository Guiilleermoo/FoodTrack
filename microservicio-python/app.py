from config import create_app
from routes import bp as routes_bp

app = create_app()
app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)