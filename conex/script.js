const modal = document.querySelector('.modal-container');

const tbody = document.querySelector('tbody');

const cedula = document.querySelector('#m-cedula');

const nombres = document.querySelector('#m-nombre');

const apellidos = document.querySelector('#m-apellido');

const centro_de_trabajo = document.querySelector('#m-trab');

const telefono = document.querySelector('#m-phone');

const correo_electronico = document.querySelector('#m-email');

const salario = document.querySelector('#m-salario');

const ocupacion = document.querySelector('#m-ocup');

const btnSalvar = document.querySelector('#btnSalvar');

let items = [];
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit && items[index]) {
        cedula.value = items[index].Cedula || '';
        nombres.value = items[index].Nombres || '';
        apellidos.value = items[index].Apellidos || '';
        centro_de_trabajo.value = items[index].CentroTrabajo || '';
        telefono.value = items[index].Telefono || '';
        correo_electronico.value = items[index].CorreoElectronico || '';
        salario.value = items[index].Salario || '';
        ocupacion.value = items[index].Ocupacion || '';
        id = index;
    } else {
        // Limpiar campos para nuevo registro
        cedula.value = '';
        nombres.value = '';
        apellidos.value = '';
        centro_de_trabajo.value = '';
        telefono.value = '';
        correo_electronico.value = '';
        salario.value = '';
        ocupacion.value = '';
        id = undefined;
    }
}

function editItems(index) {
    openModal(true, index);
}

function deleteItems(index) {
    if(confirm('¿Está seguro de eliminar este empleado?')) {
        items.splice(index, 1);
        setItemsBD();
        loadItems();
    }
}

function insertItem(item, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${item.Cedula || ''}</td>
        <td>${item.Nombres || ''}</td>
        <td>${item.Apellidos || ''}</td>
        <td>${item.CentroTrabajo || ''}</td>
        <td>${item.Telefono || ''}</td>
        <td>${item.CorreoElectronico || ''}</td>
        <td>${item.Salario || ''}</td>
        <td>${item.Ocupacion || ''}</td>
        <td class="acao"> 
            <button type="button" onclick="editItems(${index})">
                <i class="bx bx-edit"></i> 
            </button>
        </td>
        <td class="acao">
            <button type="button" onclick="deleteItems(${index})">
                <i class="bx bx-trash"></i> 
            </button>
        </td>     
    `;
    tbody.appendChild(tr);
}

btnSalvar.onclick = e => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!cedula.value || !nombres.value || !apellidos.value || !salario.value) {
        alert('Por favor complete los campos requeridos: Cédula, Nombres, Apellidos y Salario');
        return;
    }

    const newItem = {
        Cedula: cedula.value,
        Nombres: nombres.value,
        Apellidos: apellidos.value,
        CentroTrabajo: centro_de_trabajo.value,
        Telefono: telefono.value,
        CorreoElectronico: correo_electronico.value,
        Salario: salario.value,
        Ocupacion: ocupacion.value
    };

    if (id !== undefined) {
        items[id] = newItem; // Actualizar existente
    } else {
        items.push(newItem); // Agregar nuevo
    }

    setItemsBD();
    modal.classList.remove('active');
    loadItems();
};

function loadItems() {
    items = getItemsBD();
    tbody.innerHTML = '';
    items.forEach((item, index) => {
        insertItem(item, index);
    });
}

const getItemsBD = () => JSON.parse(localStorage.getItem('dbfunc')) || [];
const setItemsBD = () => localStorage.setItem('dbfunc', JSON.stringify(items));
// Eliminar los datos anteriormente guardado
localStorage.removeItem('dbfunc');
// verificacion de la consola por errores
console.log('Datos cargados:', items);

// Inicializar
loadItems();



