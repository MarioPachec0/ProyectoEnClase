
// Manejo del botón "Empezar"
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
});

// Manejo del botón "Registrarse"
document.getElementById('register-button').addEventListener('click', function() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('register-screen').classList.add('active');
});

// Manejo del formulario de registro
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Guardar datos de registro
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;
    localStorage.setItem('userEmail', newEmail);
    localStorage.setItem('userPassword', newPassword);
    alert('Registro exitoso.');
    document.getElementById('register-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('active');
});

// Manejo del formulario de login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Validar login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
    if (email === storedEmail && password === storedPassword) {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('events-screen').classList.add('active');
    } else {
        alert('Email o contraseña incorrectos.');
    }
});

// Manejo del menú
document.getElementById('menu-button').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('active');
});

// Cerrar el menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const menu = document.querySelector('.menu');
    const menuButton = document.getElementById('menu-button');
    if (!menu.contains(event.target) && event.target !== menuButton) {
        menu.classList.remove('active');
    }
});

// Cambio de día en la selección de eventos
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
let currentDayIndex = 0;

document.getElementById('previous-day').addEventListener('click', function() {
    currentDayIndex = (currentDayIndex === 0) ? daysOfWeek.length - 1 : currentDayIndex - 1;
    document.getElementById('day-selector').textContent = daysOfWeek[currentDayIndex];
});

document.getElementById('next-day').addEventListener('click', function() {
    currentDayIndex = (currentDayIndex === daysOfWeek.length - 1) ? 0 : currentDayIndex + 1;
    document.getElementById('day-selector').textContent = daysOfWeek[currentDayIndex];
});

// Manejo de cerrar sesión
document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    document.getElementById('events-screen').classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
});

//------------------------------------
// Variables globales para el calendario
// Variables globales para el calendario
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || {};

// Función para mostrar el calendario
function renderCalendar() {
  const monthYear = document.getElementById('month-year');
  const calendar = document.getElementById('calendar');
  
  monthYear.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  calendar.innerHTML = '';
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendar.appendChild(createCalendarDay(''));
  }
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dayElement = createCalendarDay(day);
    
    if (events[dateString]) {
      events[dateString].forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.textContent = event.title;
        dayElement.appendChild(eventElement);
      });
    }
    
    calendar.appendChild(dayElement);
  }
}

// Función para crear un día del calendario
function createCalendarDay(day) {
  const dayElement = document.createElement('div');
  dayElement.className = 'calendar-day';
  dayElement.textContent = day;
  
  if (day) { // Solo añadir el evento click si hay un día
    dayElement.addEventListener('click', () => showEventForm(day));
  }
  
  return dayElement;
}

// Función para mostrar el formulario de evento
function showEventForm(day) {
  const eventForm = document.getElementById('event-form');
  eventForm.style.display = 'block';
  
  const eventDatetime = document.getElementById('event-datetime');
  eventDatetime.value = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00`;
}

// Función para guardar un evento
function saveEvent() {
  const eventTitle = document.getElementById('event-title').value;
  const eventDatetime = document.getElementById('event-datetime').value;
  
  if (!eventTitle || !eventDatetime) return;
  
  const dateString = eventDatetime.split('T')[0];
  
  if (!events[dateString]) {
    events[dateString] = [];
  }
  
  events[dateString].push({
    title: eventTitle,
    datetime: eventDatetime
  });
  
  localStorage.setItem('events', JSON.stringify(events));
  
  document.getElementById('event-form').style.display = 'none';
  document.getElementById('event-title').value = '';
  
  renderCalendar();
}

// Event listeners para los botones del calendario
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById('save-event').addEventListener('click', saveEvent);

// Mostrar el calendario cuando se hace clic en el botón del menú
document.getElementById('calendar-button').addEventListener('click', function() {
  document.getElementById('event-list-screen').classList.remove('active');
  document.getElementById('calendar-screen').classList.add('active');
  renderCalendar();
});

// Inicializar el calendario
renderCalendar();
function renderEventList() {
  const eventListContainer = document.getElementById('event-list-container');
  eventListContainer.innerHTML = '';

  Object.keys(events).forEach(date => {
    events[date].forEach(event => {
      const eventItem = document.createElement('div');
      eventItem.className = 'event-list-item';
      eventItem.innerHTML = `
        <div class="event-info">
          <div class="event-title">${event.title}</div>
          <div class="event-date">${date}</div>
        </div>
      `;
      eventListContainer.appendChild(eventItem);
    });
  });
}
function showEventForm(day) {
  const eventForm = document.getElementById('event-form');
  eventForm.style.display = 'block';

  const eventDatetime = document.getElementById('event-datetime');
  eventDatetime.value = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00`;
}
// Función para guardar un evento
function saveEvent() {
  const eventTitle = document.getElementById('event-title').value;
  const eventDatetime = document.getElementById('event-datetime').value;

  if (!eventTitle || !eventDatetime) return;

  const dateString = eventDatetime.split('T')[0];

  if (!events[dateString]) {
    events[dateString] = [];
  }

  events[dateString].push({
    title: eventTitle,
    datetime: eventDatetime
  });

  localStorage.setItem('events', JSON.stringify(events));

  document.getElementById('event-form').style.display = 'none';
  document.getElementById('event-title').value = '';

  renderCalendar();
  renderEventList(); // También actualizar la lista de eventos
}




//MENSAJE DE CONFIRMACION DE GUARDAR EVENTO
function showConfirmationMessage(message) {
  const messageElement = document.getElementById('confirmation-message');
  messageElement.textContent = message;
  messageElement.classList.add('show');
  
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 3000); // El mensaje desaparecerá después de 3 segundos
}

function saveEvent() {
  const eventTitle = document.getElementById('event-title').value;
  const eventDatetime = document.getElementById('event-datetime').value;

  if (!eventTitle || !eventDatetime) return;

  const dateString = eventDatetime.split('T')[0];

  if (!events[dateString]) {
    events[dateString] = [];
  }

  events[dateString].push({
    title: eventTitle,
    datetime: eventDatetime
  });

  localStorage.setItem('events', JSON.stringify(events));

  document.getElementById('event-form').style.display = 'none';
  document.getElementById('event-title').value = '';

  renderCalendar();
  
  // Mostrar mensaje de confirmación estilizado
  showConfirmationMessage('Evento guardado correctamente');
}


// Función para actualizar la lista de eventos
function updateEventList() {
  const eventListContainer = document.getElementById('event-list-container');
  eventListContainer.innerHTML = '';

  // Obtén todos los eventos del almacenamiento local
  const allEvents = [];
  for (let dateString in events) {
    events[dateString].forEach(event => {
      allEvents.push({
        title: event.title,
        date: new Date(dateString + 'T' + event.datetime.split('T')[1])
      });
    });
  }

  // Ordena los eventos por fecha
  allEvents.sort((a, b) => a.date - b.date);

  // Crea elementos para cada evento
  allEvents.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = 'event-list-item';
    eventElement.innerHTML = `
      <div class="event-info">
        <div class="event-title">${event.title}</div>
        <div class="event-date">${formatDate(event.date)}</div>
      </div>
    `;
    eventListContainer.appendChild(eventElement);
  });
}

// Función para formatear la fecha
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('es-ES', options);
}

// Asegúrate de llamar a updateEventList() cuando se muestre la pantalla de lista de eventos
document.getElementById('events-button').addEventListener('click', function() {
  showScreen('event-list-screen');
  updateEventList();
});

// También actualiza la lista de eventos después de guardar un nuevo evento
function saveEvent() {
  // ... (código existente para guardar el evento) ...

  updateEventList(); // Añade esta línea al final de la función saveEvent
}



// Event listeners para los botones del calendario
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById('save-event').addEventListener('click', saveEvent);

// Mostrar el calendario cuando se hace clic en el botón del menú
document.getElementById('calendar-button').addEventListener('click', function() {
  document.getElementById('events-screen').classList.remove('active');
  document.getElementById('calendar-screen').classList.add('active');
  renderCalendar();
});

// Inicializar el calendario
renderCalendar();

// Manejo del botón "Volver" en el calendario
document.getElementById('back-button').addEventListener('click', function() {
  document.getElementById('calendar-screen').classList.remove('active');
  document.getElementById('events-screen').classList.add('active');
});


// Función para cambiar entre pantallas
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Manejo del botón de categorías en la pantalla de eventos
document.getElementById('category-button').addEventListener('click', function() {
  showScreen('categories-screen');
});

// Manejo del menú en la pantalla de categorías
document.getElementById('menu-button-categories').addEventListener('click', function() {
  document.querySelector('#categories-screen .menu').classList.toggle('active');
});

// Manejo de la navegación desde la pantalla de categorías
document.getElementById('events-button-categories').addEventListener('click', function() {
  showScreen('events-screen');
});

// Añade aquí más event listeners para los otros botones del menú en la pantalla de categorías

// Cerrar el menú al hacer clic fuera de él (tanto en la pantalla de eventos como en la de categorías)
document.addEventListener('click', function(event) {
  const menus = document.querySelectorAll('.menu');
  const menuButtons = document.querySelectorAll('.menu-icon');
  menus.forEach((menu, index) => {
      if (!menu.contains(event.target) && event.target !== menuButtons[index]) {
          menu.classList.remove('active');
      }
  });
});

// Array para almacenar los favoritos
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Función para actualizar los favoritos en el almacenamiento local
function updateFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Función para añadir o quitar de favoritos
function toggleFavorite(categoryId) {
    const index = favorites.indexOf(categoryId);
    if (index === -1) {
        favorites.push(categoryId);
    } else {
        favorites.splice(index, 1);
    }
    updateFavorites();
    updateFavoritesScreen();
}

// Función para actualizar la pantalla de favoritos
function updateFavoritesScreen() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = '';
    favorites.forEach(categoryId => {
        const originalItem = document.querySelector(`.category-item[data-id="${categoryId}"]`);
        if (originalItem) {
            const clonedItem = originalItem.cloneNode(true);
            clonedItem.querySelector('.favorite-btn').remove();
            favoritesGrid.appendChild(clonedItem);
        }
    });
}

// Añadir event listeners a los botones de favoritos
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const categoryId = this.closest('.category-item').dataset.id;
        toggleFavorite(categoryId);
        this.classList.toggle('active');
    });
});

// Manejar la navegación a la pantalla de favoritos
document.getElementById('favorites-button').addEventListener('click', function() {
    showScreen('favorites-screen');
    updateFavoritesScreen();
});

document.getElementById('favorites-button-categories').addEventListener('click', function() {
    showScreen('favorites-screen');
    updateFavoritesScreen();
});

// Manejar la navegación desde la pantalla de favoritos
document.getElementById('events-button-favorites').addEventListener('click', function() {
    showScreen('events-screen');
});

document.getElementById('categories-button-favorites').addEventListener('click', function() {
    showScreen('categories-screen');
});

// Inicializar la pantalla de favoritos
updateFavoritesScreen();


//JS PARA LA PANTALLA DE EVENTOS POR COLORES
// Función para mostrar la pantalla de lista de eventos
function showEventList() {
  showScreen('event-list-screen');
  updateEventList();
}

// Función para actualizar la lista de eventos
function updateEventList() {
  const eventListContainer = document.getElementById('event-list-container');
  eventListContainer.innerHTML = '';

  // Obtén los eventos del almacenamiento local
  const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

  // Ordena los eventos por fecha
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-list-item';
      eventElement.innerHTML = `
          <div class="event-info">
              <div class="event-title">${event.title}</div>
              <div class="event-date">${formatDate(new Date(event.date))}</div>
          </div>
          <div class="event-color" style="background-color: ${event.color || '#3498db'}"></div>
      `;
      eventListContainer.appendChild(eventElement);
  });
}

// Función para formatear la fecha
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('es-ES', options);
}

// Añade un event listener para el botón de eventos en la pantalla principal
document.getElementById('events-button').addEventListener('click', showEventList);

// Añade event listeners para los botones del menú en la pantalla de lista de eventos
document.getElementById('categories-button-event-list').addEventListener('click', () => showScreen('categories-screen'));
document.getElementById('favorites-button-event-list').addEventListener('click', () => showScreen('favorites-screen'));
document.getElementById('calendar-button-event-list').addEventListener('click', () => showScreen('calendar-screen'));

// Actualiza la función de guardar evento para incluir un color
function saveEvent() {
  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-datetime').value;
  const color = document.getElementById('event-color').value; // Asegúrate de añadir un input de color en el formulario de eventos

  if (title && date) {
      const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
      events.push({ title, date, color });
      localStorage.setItem('calendarEvents', JSON.stringify(events));
      updateCalendar();
      closeEventForm();
  }
}


function backToEvents() {
  showScreen('events-screen');
}

// Event listeners para los botones "Volver"
document.getElementById('back-button-categories').addEventListener('click', backToEvents);
document.getElementById('back-button-favorites').addEventListener('click', backToEvents);
document.getElementById('back-button-event-list').addEventListener('click', backToEvents);
