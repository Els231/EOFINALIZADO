import os
import logging
from flask import Flask, render_template, send_from_directory
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase

# Importar el blueprint de la API
from routers.Vista_Profesor_io_Desarrollador.PruebaDesarro.api.api import api

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-for-school-system")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configuración para SQLite local
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'school_system.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the app with the extension
db.init_app(app)

# Main route
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# API routes for future expansion
@app.route('/api/health')
def health_check():
    return {'status': 'ok', 'message': 'Sistema de Gestión Escolar - Activo'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Esto creará el archivo school_system.db si no existe
    app.run(host='0.0.0.0', port=5000, debug=True)