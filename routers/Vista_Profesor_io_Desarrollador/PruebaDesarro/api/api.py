"""
Proporciona endpoints para todas las operaciones CRUD
"""
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import json
import os
from typing import Dict, List, Optional

# Crear el blueprint para la API
api = Blueprint('api', __name__, url_prefix='/api')

# Simulación de base de datos usando archivos JSON
DATA_DIR = 'api_data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

class JSONDatabase:
    def __init__(self):
        self.collections = [
            'estudiantes', 'profesores', 'tutores', 'matriculas', 
            'inscripciones', 'notas', 'eventos', 'materias'
        ]
        self.init_collections()
    
    def init_collections(self):
        """Inicializar archivos JSON para cada colección"""
        for collection in self.collections:
            file_path = os.path.join(DATA_DIR, f'{collection}.json')
            if not os.path.exists(file_path):
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump([], f, ensure_ascii=False, indent=2)
    
    def read(self, collection: str) -> List[Dict]:
        """Leer datos de una colección"""
        file_path = os.path.join(DATA_DIR, f'{collection}.json')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def write(self, collection: str, data: List[Dict]) -> bool:
        """Escribir datos a una colección"""
        file_path = os.path.join(DATA_DIR, f'{collection}.json')
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            current_app.logger.error(f"Error escribiendo {collection}: {e}")
            return False
    
    def find_by_id(self, collection: str, record_id: str) -> Optional[Dict]:
        """Buscar un registro por ID"""
        data = self.read(collection)
        for record in data:
            if record.get('id') == record_id:
                return record
        return None
    
    def create(self, collection: str, record: Dict) -> Optional[Dict]:
        """Crear un nuevo registro"""
        data = self.read(collection)
        # Generar ID único
        record['id'] = self.generate_id()
        record['fecha_creacion'] = datetime.now().isoformat()
        record['fecha_actualizacion'] = datetime.now().isoformat()
        data.append(record)
        
        if self.write(collection, data):
            return record
        return None
    
    def update(self, collection: str, record_id: str, updates: Dict) -> Optional[Dict]:
        """Actualizar un registro existente"""
        data = self.read(collection)
        for i, record in enumerate(data):
            if record.get('id') == record_id:
                data[i].update(updates)
                data[i]['fecha_actualizacion'] = datetime.now().isoformat()
                if self.write(collection, data):
                    return data[i]
                break
        return None
    
    def delete(self, collection: str, record_id: str) -> bool:
        """Eliminar un registro"""
        data = self.read(collection)
        original_length = len(data)
        data = [record for record in data if record.get('id') != record_id]
        
        if len(data) < original_length:
            return self.write(collection, data)
        return False
    
    def generate_id(self) -> str:
        """Generar ID único basado en timestamp"""
        return f"{int(datetime.now().timestamp() * 1000)}"

# Instancia global de la base de datos
db = JSONDatabase()

# Middlewares y utilidades
def validate_required_fields(data: Dict, required_fields: List[str]) -> Optional[str]:
    """Validar campos requeridos"""
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return f"Campos requeridos faltantes: {', '.join(missing_fields)}"
    return None

def paginate_results(data: List[Dict], page: int = 1, per_page: int = 10) -> Dict:
    """Paginar resultados"""
    total = len(data)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        'data': data[start:end],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    }

# ================================
# ENDPOINTS DE ESTUDIANTES
# ================================

@api.route('/estudiantes', methods=['GET'])
def get_estudiantes():
    """Obtener lista de estudiantes"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    grado = request.args.get('grado')
    turno = request.args.get('turno')
    search = request.args.get('search')
    
    estudiantes = db.read('estudiantes')
    
    # Aplicar filtros
    if grado:
        estudiantes = [e for e in estudiantes if e.get('grado') == grado]
    if turno:
        estudiantes = [e for e in estudiantes if e.get('turno') == turno]
    if search:
        search_lower = search.lower()
        estudiantes = [e for e in estudiantes if 
                      search_lower in e.get('nombre', '').lower() or 
                      search_lower in e.get('apellido', '').lower() or
                      search_lower in e.get('codigo', '').lower()]
    
    result = paginate_results(estudiantes, page, per_page)
    return jsonify(result)

@api.route('/estudiantes/<estudiante_id>', methods=['GET'])
def get_estudiante(estudiante_id):
    """Obtener estudiante por ID"""
    estudiante = db.find_by_id('estudiantes', estudiante_id)
    if not estudiante:
        return jsonify({'error': 'Estudiante no encontrado'}), 404
    return jsonify(estudiante)

@api.route('/estudiantes', methods=['POST'])
def create_estudiante():
    """Crear nuevo estudiante"""
    data = request.get_json()
    
    required_fields = ['nombre', 'apellido', 'fecha_nacimiento', 'genero', 'grado', 'turno']
    error = validate_required_fields(data, required_fields)
    if error:
        return jsonify({'error': error}), 400
    
    # Generar código de estudiante
    if 'codigo' not in data:
        grado = data.get('grado', '')
        turno = data.get('turno', '')
        timestamp = int(datetime.now().timestamp())
        data['codigo'] = f"EST-{grado}-{turno}-{timestamp}"
    
    estudiante = db.create('estudiantes', data)
    if estudiante:
        return jsonify(estudiante), 201
    return jsonify({'error': 'Error al crear estudiante'}), 500

@api.route('/estudiantes/<estudiante_id>', methods=['PUT'])
def update_estudiante(estudiante_id):
    """Actualizar estudiante"""
    data = request.get_json()
    
    estudiante = db.update('estudiantes', estudiante_id, data)
    if estudiante:
        return jsonify(estudiante)
    return jsonify({'error': 'Estudiante no encontrado'}), 404

@api.route('/estudiantes/<estudiante_id>', methods=['DELETE'])
def delete_estudiante(estudiante_id):
    """Eliminar estudiante"""
    if db.delete('estudiantes', estudiante_id):
        return jsonify({'message': 'Estudiante eliminado correctamente'})
    return jsonify({'error': 'Estudiante no encontrado'}), 404

# ================================
# ENDPOINTS DE PROFESORES
# ================================

@api.route('/profesores', methods=['GET'])
def get_profesores():
    """Obtener lista de profesores"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    especialidad = request.args.get('especialidad')
    estado = request.args.get('estado')
    
    profesores = db.read('profesores')
    
    # Aplicar filtros
    if especialidad:
        profesores = [p for p in profesores if p.get('especialidad') == especialidad]
    if estado:
        profesores = [p for p in profesores if p.get('estado') == estado]
    
    result = paginate_results(profesores, page, per_page)
    return jsonify(result)

@api.route('/profesores', methods=['POST'])
def create_profesor():
    """Crear nuevo profesor"""
    data = request.get_json()
    
    required_fields = ['nombre', 'apellido', 'especialidad', 'telefono', 'email']
    error = validate_required_fields(data, required_fields)
    if error:
        return jsonify({'error': error}), 400
    
    # Generar código de profesor
    if 'codigo' not in data:
        timestamp = int(datetime.now().timestamp())
        data['codigo'] = f"PROF-{timestamp}"
    
    data['estado'] = data.get('estado', 'Activo')
    
    profesor = db.create('profesores', data)
    if profesor:
        return jsonify(profesor), 201
    return jsonify({'error': 'Error al crear profesor'}), 500

@api.route('/profesores/<profesor_id>', methods=['PUT'])
def update_profesor(profesor_id):
    """Actualizar profesor"""
    data = request.get_json()
    
    profesor = db.update('profesores', profesor_id, data)
    if profesor:
        return jsonify(profesor)
    return jsonify({'error': 'Profesor no encontrado'}), 404

@api.route('/profesores/<profesor_id>', methods=['DELETE'])
def delete_profesor(profesor_id):
    """Eliminar profesor"""
    if db.delete('profesores', profesor_id):
        return jsonify({'message': 'Profesor eliminado correctamente'})
    return jsonify({'error': 'Profesor no encontrado'}), 404

# ================================
# ENDPOINTS DE NOTAS
# ================================

@api.route('/notas', methods=['GET'])
def get_notas():
    """Obtener lista de notas"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    estudiante_id = request.args.get('estudiante_id')
    materia = request.args.get('materia')
    periodo = request.args.get('periodo')
    
    notas = db.read('notas')
    
    # Aplicar filtros
    if estudiante_id:
        notas = [n for n in notas if n.get('estudiante_id') == estudiante_id]
    if materia:
        notas = [n for n in notas if n.get('materia') == materia]
    if periodo:
        notas = [n for n in notas if n.get('periodo') == periodo]
    
    result = paginate_results(notas, page, per_page)
    return jsonify(result)

@api.route('/notas', methods=['POST'])
def create_nota():
    """Crear nueva nota"""
    data = request.get_json()
    
    required_fields = ['estudiante_id', 'materia', 'nota', 'periodo']
    error = validate_required_fields(data, required_fields)
    if error:
        return jsonify({'error': error}), 400
    
    # Validar rango de nota
    try:
        nota_valor = float(data['nota'])
        if nota_valor < 0 or nota_valor > 100:
            return jsonify({'error': 'La nota debe estar entre 0 y 100'}), 400
    except ValueError:
        return jsonify({'error': 'La nota debe ser un número válido'}), 400
    
    # Calcular literal de la nota
    if nota_valor >= 90:
        data['literal'] = 'A'
    elif nota_valor >= 80:
        data['literal'] = 'B'
    elif nota_valor >= 70:
        data['literal'] = 'C'
    elif nota_valor >= 60:
        data['literal'] = 'D'
    else:
        data['literal'] = 'F'
    
    data['fecha_registro'] = datetime.now().isoformat()
    
    nota = db.create('notas', data)
    if nota:
        return jsonify(nota), 201
    return jsonify({'error': 'Error al crear nota'}), 500

@api.route('/notas/<nota_id>', methods=['PUT'])
def update_nota(nota_id):
    """Actualizar nota"""
    data = request.get_json()
    
    nota = db.update('notas', nota_id, data)
    if nota:
        return jsonify(nota)
    return jsonify({'error': 'Nota no encontrada'}), 404

@api.route('/notas/<nota_id>', methods=['DELETE'])
def delete_nota(nota_id):
    """Eliminar nota"""
    if db.delete('notas', nota_id):
        return jsonify({'message': 'Nota eliminada correctamente'})
    return jsonify({'error': 'Nota no encontrada'}), 404

# ================================
# ENDPOINTS DE MATRÍCULAS
# ================================

@api.route('/matriculas', methods=['GET'])
def get_matriculas():
    """Obtener lista de matrículas"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    ano_escolar = request.args.get('ano_escolar')
    estado = request.args.get('estado')
    
    matriculas = db.read('matriculas')
    
    # Aplicar filtros
    if ano_escolar:
        matriculas = [m for m in matriculas if m.get('ano_escolar') == ano_escolar]
    if estado:
        matriculas = [m for m in matriculas if m.get('estado') == estado]
    
    result = paginate_results(matriculas, page, per_page)
    return jsonify(result)

@api.route('/matriculas', methods=['POST'])
def create_matricula():
    """Crear nueva matrícula"""
    data = request.get_json()
    
    required_fields = ['estudiante_id', 'grado', 'ano_escolar']
    error = validate_required_fields(data, required_fields)
    if error:
        return jsonify({'error': error}), 400
    
    # Generar código de matrícula
    if 'codigo' not in data:
        timestamp = int(datetime.now().timestamp())
        grado = data.get('grado', '')
        data['codigo'] = f"MAT-{grado}-{timestamp}"
    
    data['estado'] = data.get('estado', 'Activa')
    data['fecha_matricula'] = datetime.now().isoformat()
    
    matricula = db.create('matriculas', data)
    if matricula:
        return jsonify(matricula), 201
    return jsonify({'error': 'Error al crear matrícula'}), 500

# ================================
# ENDPOINTS DE ESTADÍSTICAS
# ================================

@api.route('/estadisticas/dashboard', methods=['GET'])
def get_dashboard_stats():
    """Obtener estadísticas para el dashboard"""
    estudiantes = db.read('estudiantes')
    profesores = db.read('profesores')
    notas = db.read('notas')
    matriculas = db.read('matriculas')
    
    # Calcular estadísticas
    total_estudiantes = len(estudiantes)
    total_profesores = len([p for p in profesores if p.get('estado') == 'Activo'])
    total_matriculas = len([m for m in matriculas if m.get('estado') == 'Activa'])
    
    # Promedio general
    if notas:
        total_notas = sum(float(n.get('nota', 0)) for n in notas)
        promedio_general = round(total_notas / len(notas), 2)
    else:
        promedio_general = 0
    
    # Estudiantes por grado
    estudiantes_por_grado = {}
    for estudiante in estudiantes:
        grado = estudiante.get('grado', 'Sin grado')
        estudiantes_por_grado[grado] = estudiantes_por_grado.get(grado, 0) + 1
    
    return jsonify({
        'totales': {
            'estudiantes': total_estudiantes,
            'profesores': total_profesores,
            'matriculas': total_matriculas,
            'promedio_general': promedio_general
        },
        'distribucion': {
            'estudiantes_por_grado': estudiantes_por_grado
        }
    })

# ================================
# ENDPOINTS DE BÚSQUEDA
# ================================

@api.route('/buscar', methods=['GET'])
def buscar_global():
    """Búsqueda global en todas las colecciones"""
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({'error': 'Parámetro de búsqueda requerido'}), 400
    
    resultados = {
        'estudiantes': [],
        'profesores': [],
        'tutores': []
    }
    
    # Buscar en estudiantes
    estudiantes = db.read('estudiantes')
    for estudiante in estudiantes:
        if (query in estudiante.get('nombre', '').lower() or 
            query in estudiante.get('apellido', '').lower() or 
            query in estudiante.get('codigo', '').lower()):
            resultados['estudiantes'].append(estudiante)
    
    # Buscar en profesores
    profesores = db.read('profesores')
    for profesor in profesores:
        if (query in profesor.get('nombre', '').lower() or 
            query in profesor.get('apellido', '').lower() or 
            query in profesor.get('especialidad', '').lower()):
            resultados['profesores'].append(profesor)
    
    # Buscar en tutores
    tutores = db.read('tutores')
    for tutor in tutores:
        if (query in tutor.get('nombre', '').lower() or 
            query in tutor.get('apellido', '').lower()):
            resultados['tutores'].append(tutor)
    
    return jsonify(resultados)

# ================================
# ENDPOINTS DE EXPORTACIÓN
# ================================

@api.route('/exportar/<collection>', methods=['GET'])
def exportar_coleccion(collection):
    """Exportar datos de una colección"""
    if collection not in db.collections:
        return jsonify({'error': 'Colección no válida'}), 400
    
    data = db.read(collection)
    return jsonify({
        'collection': collection,
        'total_records': len(data),
        'exported_at': datetime.now().isoformat(),
        'data': data
    })

# ================================
# MANEJO DE ERRORES
# ================================

@api.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@api.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

@api.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Solicitud inválida'}), 400