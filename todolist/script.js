// Recupero gli elementi di interesse dalla pagina
const button = document.querySelector('.plus');
const inputField = document.querySelector('input');
const todoList = document.querySelector('.todo-list');
const emptyListMessage = document.querySelector('.empty-list-message');
const emptyListMessageCompleted = document.querySelector('.empty-list-message-completed');
const completedList = document.querySelector('.completed-list');
const cestino = document.querySelector('.svuota');
var iconaTema = document.getElementById("iconaTema");

// Creo una chiave per il local storage
const STORAGE_KEY = 'Todo_Activities';

// Storage completate
const STORAGE_COMPLETED_KEY = 'Completed_Activities';

// Preparo una lista di attività
let activities = [];
let completed = []

//Pulsante cambio colore tema
iconaTema.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        iconaTema.src = "images/sun.png";
    } else {
        iconaTema.src = "images/moon.png";
    }
}

// Controllo se per caso c'erano delle attività nel local storage
const storage = localStorage.getItem(STORAGE_KEY);

const storeComp = localStorage.getItem(STORAGE_COMPLETED_KEY);

if (storeComp) {
    completed = JSON.parse(storeComp);
}

showCompleted();

if (storage) {
    activities = JSON.parse(storage);
}

// Chiedo a JS di decidere cosa mostrare
showContent();

// # OPERAZIONI DINAMICHE 
// Reagisco al click del bottone
button.addEventListener('click', function () {
    // Chiedo di aggiungere l'attività
    addActivity();
});

//Reagisco al tasto ENTER
inputField.addEventListener("keyup", e => {
    e.preventDefault();
    if (e.keyCode === 13) {
        button.click();
    }
})

// # FUNZIONI

//Lista attività da completare
// Funzione che decide cosa mostrare in pagina
function showContent() {
    // Innanzitutto pulisco tutto
    todoList.innerText = '';
    emptyListMessage.innerText = '';


    if (activities.length > 0) {
        // Se c'è almeno una attività...
        // per ciascuna attività...
        activities.forEach(function (activity) {
            // Crea un template HTML
            const template = createActivityTemplate(activity)

            // Inseriscilo in pagina
            todoList.innerHTML += template;
        });

        //rendi il cestino cliccabile
        makeBinClickable();
        // Rendi cliccabili i check
        makeCheckClickable();
        //rendi cliccabili gli Edit
        makeEditClickable();

    } else {
        // ALTRIMENTI
        // Mostra il messaggio di lista vuota
        emptyListMessage.innerText = 'Sembra che non ci siano attività';
    }
}

//Lista attività completate
//Puliamo tutto
showCompleted();
function showCompleted() {
    completedList.innerText = '';
    emptyListMessageCompleted.innerText = '';
    //Se c'è un attività completata
    if (completed.length > 0) {
        //Per ogni attività crea un template HTML
        completed.forEach(function (complete) {
            const template = createCompleteTemplate(complete)
            completedList.innerHTML += template
        })
        //Sennò mostra messaggio di attività completate vuoto
    } else {
        emptyListMessageCompleted.innerText = 'Non ci sono attività completate'
    }
}

// Funzione per aggiungere un'attività
function addActivity() {
    // Recupero il testo nel campo
    const newActivity = inputField.value.trim();
    // Se il campo non è vuoto... 
    if (newActivity.length > 0) {
        // Aggiungo l'attività alla lista
        activities.push(newActivity);
        // Aggiorna lo storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        // Ora, ridecidi cosa mostrare
        showContent();
        // svuoto il campo
        inputField.value = '';
    }
}

// Funzione per rendere i check cliccabili
function makeCheckClickable() {
    // Cerca tutti i check e fa' sì che siano cliccabili
    const checks = document.querySelectorAll('.todo-check');
    // Per ognuno dei check...
    checks.forEach(function (check, index) {
        check.addEventListener('click', function () {
            // Rimuovi l'elemento dalla list  
            const removedItem = activities.splice(index, 1);
            completed = completed.concat(removedItem);

            // Aggiorna anche il localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));

            localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completed));

            // Aggiorna la lista in pagina
            showContent();
            showCompleted();
        });
    })
}

//funzione per rendere Edit cliccabile
function makeEditClickable() {
    //Cerca tutti gli edit e fà si che siano cliccabili
    const edits = document.querySelectorAll('.todo-edit');
    // Per ogni edit, al click
    edits.forEach(function (edit, index) {
        edit.addEventListener('click', function () {
            let activity = activities[index];
            let nuovaAttività = prompt("Modifica attività", activity)
            // Se non c'è un testo diverso non fare nulla
            if (activity == nuovaAttività || nuovaAttività == "" || nuovaAttività == null) {
                //Sennò sostituisci la vecchi attività con quella nuova
            } else {
                activities[index] = nuovaAttività;
                // Aggiorna anche il localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
                //Aggiorna la lista
                showContent();
            }
        })
    })
}

//funzione per rendere il cestino cliccabile
function makeBinClickable() {
    const bins = document.querySelectorAll('.todo-delete');
    // Per ogni bin, al click elimina la determinata attività
    bins.forEach(function (bin, index) {
        bin.addEventListener('click', function () {
            activities.splice(index, 1);
            // Aggiorna il local Storage e la lista mostrata
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
            showContent();
        });
    })
}

// Funzione che crea un template HTML per un'attività da completare
function createActivityTemplate(activity) {
    // Restituisci questo pezzo di HTML
    return `
   <li class="todo-item">
     <div class="todo-check" title="Completato"></div>
     <p class="todo-text">${activity}</p>
     <img class="todo-edit" title="Modifica" src="images/edit.svg" alt="Edit Icon">
     <img class="todo-delete" title="Elimina" src="images/cestino.png" alt="Cestino Icon">
   </li>
   `;
}

// Funzione che crea un template HTML per attività completata
function createCompleteTemplate(complete) {
    // Restituisci questo pezzo di HTML
    return `
   <li class="completed-item">
     <p class="completed-text">${complete}</p>
   </li>
   `;
}

//funzione per cliccare il cestino che svuota
cestino.addEventListener('click', function () {
    //Mostriamo il prompt di conferma
    if (window.confirm("Vuoi davvero eliminare tutte le Attività Completate?")) {
        ClearAllCompletedActivities();
        localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completed));
        showCompleted();
    }
    //Funzione per svuotare le attività completate
    function ClearAllCompletedActivities() {

        if (completed.length > 0) {
            completed = []
        }
    };
});