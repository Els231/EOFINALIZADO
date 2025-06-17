/**
 * Datos geográficos y catálogos de Nicaragua
 * Para el Sistema de Gestión Escolar
 * Enfocado en Managua, Masaya y Granada
 */

// Departamentos y municipios de Nicaragua (énfasis en Managua, Masaya, Granada)
const nicaraguaDepartments = {
    "Managua": [
        "Managua",
        "Ciudad Sandino",
        "El Crucero",
        "Mateare",
        "San Francisco Libre",
        "San Rafael del Sur",
        "Ticuantepe",
        "Tipitapa",
        "Villa El Carmen"
    ],
    "Masaya": [
        "Masaya",
        "Catarina",
        "La Concepción",
        "Nandasmo",
        "Nindirí",
        "Niquinohomo",
        "San Juan de Oriente",
        "Tisma"
    ],
    "Granada": [
        "Granada",
        "Diriá",
        "Diriomo",
        "Nandaime"
    ],
    "Carazo": [
        "Jinotepe",
        "Diriamba",
        "San Marcos",
        "Santa Teresa",
        "Dolores",
        "El Rosario",
        "La Conquista",
        "La Paz de Carazo"
    ],
    "León": [
        "León",
        "Achuapa",
        "El Jicaral",
        "El Sauce",
        "La Paz Centro",
        "Nagarote",
        "Telica"
    ]
};

// Barrios y sectores por ciudad principal
const nicaraguaSectors = {
    "Managua": [
        "Altamira",
        "Bello Horizonte",
        "Bolonia",
        "Camino del Oriente",
        "Ciudad Jardín",
        "Distrito I",
        "Distrito II",
        "Distrito III",
        "Distrito IV",
        "Distrito V",
        "Distrito VI",
        "Distrito VII",
        "El Dorado",
        "Linda Vista",
        "Los Robles",
        "Managua Centro",
        "Miraflores",
        "Reparto San Juan",
        "San Judas",
        "Villa Fontana"
    ],
    "Masaya": [
        "Barrio Monimbó",
        "Barrio San Jerónimo",
        "Barrio San Juan",
        "Colonia 1ro de Mayo",
        "Colonia Carlos Fonseca",
        "Colonia Rubén Darío",
        "Colonia Sandino",
        "Sector Central"
    ],
    "Granada": [
        "Barrio La Merced",
        "Barrio La Pólvora",
        "Barrio Xalteva",
        "Colonia Alameda",
        "Colonia El Carmen",
        "Colonia La Sabana",
        "Reparto Américas",
        "Sector Central",
        "Sector Costero"
    ]
};

// Nacionalidades más comunes en Nicaragua
const nationalities = [
    "Nicaragüense",
    "Costarricense",
    "Hondureña",
    "Salvadoreña",
    "Estadounidense",
    "Española",
    "Venezolana",
    "Colombiana",
    "Otra"
];

// Grados académicos disponibles (sistema educativo nicaragüense)
const availableGrades = [
    { value: '1', label: '1er Grado', nivel: 'Primaria' },
    { value: '2', label: '2do Grado', nivel: 'Primaria' },
    { value: '3', label: '3er Grado', nivel: 'Primaria' },
    { value: '4', label: '4to Grado', nivel: 'Primaria' },
    { value: '5', label: '5to Grado', nivel: 'Primaria' },
    { value: '6', label: '6to Grado', nivel: 'Primaria' }
];

// Tipos de parentesco
const relationshipTypes = [
    "Padre",
    "Madre",
    "Tutor Legal",
    "Abuelo/a",
    "Tío/a",
    "Hermano/a Mayor",
    "Encargado",
    "Otro Familiar"
];

// Especialidades de profesores
const teacherSpecialties = [
    "Educación Primaria",
    "Lengua y Literatura",
    "Matemáticas",
    "Ciencias Naturales",
    "Ciencias Sociales",
    "Inglés",
    "Educación Física",
    "derecho y Dignidad de la Mujer",

];

// Funciones para obtener datos (igual estructura que el original)
function getDepartments() {
    return Object.keys(nicaraguaDepartments).sort();
}

function getMunicipalities(department) {
    return nicaraguaDepartments[department] || [];
}

function getSectors(municipality) {
    return nicaraguaSectors[municipality] || [];
}

function getNationalities() {
    return nationalities;
}

function getAvailableGrades() {
    return availableGrades;
}

function getRelationshipTypes() {
    return relationshipTypes;
}

function getTeacherSpecialties() {
    return teacherSpecialties;
}

// Función para validar dirección nicaragüense
function validateNicaraguanAddress(department, municipality, sector = null) {
    if (!department || !municipality) return false;
    
    const municipalities = getMunicipalities(department);
    if (!municipalities.includes(municipality)) return false;
    
    if (sector) {
        const sectors = getSectors(municipality);
        if (sectors.length > 0 && !sectors.includes(sector)) return false;
    }
    
    return true;
}

// Función para obtener código departamental
function getDepartmentCode(department) {
    const codes = {
        "Managua": "MN",
        "Masaya": "MS",
        "Granada": "GR",
        "Carazo": "CZ",
        "León": "LE"
    };
    
    return codes[department] || "00";
}

// Exportar para uso global (mismo formato que el original)
window.nicaraguaData = {
    departments: nicaraguaDepartments,
    sectors: nicaraguaSectors,
    nationalities,
    availableGrades,
    relationshipTypes,
    teacherSpecialties,
    getDepartments,
    getMunicipalities,
    getSectors,
    getNationalities,
    getAvailableGrades,
    getRelationshipTypes,
    getTeacherSpecialties,
    validateNicaraguanAddress,
    getDepartmentCode
};

console.log('✅ Nicaragua Data cargado correctamente');