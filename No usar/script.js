document.addEventListener('DOMContentLoaded', () => {
    const patientData = `{
      "patients": [
        { "nombre": "Pedro", "apellido": "Perez", "edad": 45, "patologia": "Hipertensión", "status": "Estable" },
        { "nombre": "María", "apellido": "González", "edad": 35, "patologia": "Diabetes Tipo 2", "status": "Estable" },
        { "nombre": "Carlos", "apellido": "Rodríguez", "edad": 29, "patologia": "Asma", "status": "Controlado" },
        { "nombre": "Ana", "apellido": "Martínez", "edad": 50, "patologia": "Cardiopatía", "status": "Crítico" },
        { "nombre": "Luis", "apellido": "Fernández", "edad": 65, "patologia": "", "status": "Estable" },
        { "nombre": "Sofía", "apellido": "López", "edad": 23, "patologia": "Alergias", "status": "Controlado" },
        { "nombre": "Miguel", "apellido": "Ramírez", "edad": 38, "patologia": "Migrañas", "status": "Estable" },
        { "nombre": "Isabel", "apellido": "Torres", "edad": 27, "patologia": "Hipotiroidismo", "status": "Controlado" },
        { "nombre": "Jorge", "apellido": "Díaz", "edad": 55, "patologia": "Cáncer de Piel", "status": "Tratamiento" },
        { "nombre": "Laura", "apellido": "Hernández", "edad": 42, "patologia": "Obesidad", "status": "Estable" }
      ]
    }`;

    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', patientData);
    }

    let patients = JSON.parse(localStorage.getItem('patients')).patients;
    let selectedPatient = null;

    const patientList = document.querySelector('#patient-list tbody');
    const filterInput = document.getElementById('filter-input');
    const modal = document.getElementById('patient-modal');
    const closeModal = document.querySelector('.close');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const patientForm = document.getElementById('patient-form');

    const nameInput = document.getElementById('name');
    const lastnameInput = document.getElementById('lastname');
    const ageInput = document.getElementById('age');
    const pathologyInput = document.getElementById('pathology');
    const statusInput = document.getElementById('status');
    const patientIdInput = document.getElementById('patient-id');

    function renderPatients() {
        patientList.innerHTML = '';
        const filteredPatients = patients.filter(patient => patient.patologia.toLowerCase().includes(filterInput.value.toLowerCase()));
        filteredPatients.forEach((patient, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${patient.nombre}</td>
                <td>${patient.apellido}</td>
                <td>${patient.edad}</td>
                <td>${patient.patologia}</td>
                <td>${patient.status}</td>
                <td>
                    <button onclick="editPatient(${index})">Editar</button>
                    <button onclick="deletePatient(${index})">Eliminar</button>
                </td>
            `;
            patientList.appendChild(tr);
        });
    }

    window.editPatient = function (index) {
        selectedPatient = patients[index];
        nameInput.value = selectedPatient.nombre;
        lastnameInput.value = selectedPatient.apellido;
        ageInput.value = selectedPatient.edad;
        pathologyInput.value = selectedPatient.patologia;
        statusInput.value = selectedPatient.status;
        patientIdInput.value = index;
        openModal();
    }

    window.deletePatient = function (index) {
        patients.splice(index, 1);
        localStorage.setItem('patients', JSON.stringify({ patients }));
        renderPatients();
    }

    function openModal() {
        modal.style.display = 'flex';
    }

    function closeModalFunc() {
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeModalFunc);

    addPatientBtn.addEventListener('click', () => {
        selectedPatient = null;
        patientForm.reset();
        openModal();
    });

    patientForm.addEventListener('submit', event => {
        event.preventDefault();
        const patient = {
            nombre: nameInput.value,
            apellido: lastnameInput.value,
            edad: parseInt(ageInput.value),
            patologia: pathologyInput.value,
            status: statusInput.value,
        };

        const patientIndex = patientIdInput.value;
        if (selectedPatient) {
            patients[patientIndex] = patient;
        } else {
            patients.push(patient);
        }
        localStorage.setItem('patients', JSON.stringify({ patients }));
        closeModalFunc();
        renderPatients();
    });

    filterInput.addEventListener('input', renderPatients);

    renderPatients();
});
