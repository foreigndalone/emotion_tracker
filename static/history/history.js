import { renderReflection } from '../modules/scripts/reflectionUtils.js';

document.addEventListener("DOMContentLoaded", () => {

  // === NAVBAR ===
  const button_home = document.querySelector('#js-home');
  const button_profile = document.querySelector('#js-profile');
  const button_history = document.querySelector('#js-history');
  const button_insights = document.querySelector('#js-insights');
  const reflectionsList = document.querySelector('#reflections__list');

  button_home.addEventListener('click', () => window.location.href = '../main/main.html');
  button_profile.addEventListener('click', () => window.location.href = '../profile/personalInfo/personalInfo.html');
  button_history.addEventListener('click', () => window.location.href = 'history.html');
  button_insights.addEventListener('click', () => window.location.href = '../insights/insights.html');

  // === FILTER MODAL ===
  const filterModal = document.querySelector('#filterModal');
  const openFilterBtn = document.querySelector('#openFilterBtn');
  const closeFilterBtn = document.querySelector('#closeFilterBtn');
  const moodSelect = document.querySelector('#moodSelect');
  const dateFrom = document.querySelector('#dateFrom');
  const dateTo = document.querySelector('#dateTo');
  const applyFilterBtn = filterModal.querySelector('.button:not(.button--secondary)');

  // OPEN MODAL
  openFilterBtn.addEventListener('click', () => {
    filterModal.classList.remove('hidden');
  });

  // CLOSE MODAL
  closeFilterBtn.addEventListener('click', () => {
    filterModal.classList.add('hidden');
  });

  // === REFLECTIONS ===
  const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
    
  const userIdJSON = {
      userId: localStorage.getItem('userId')
  }

  fetch('http://127.0.0.1:5050/api/get_reflections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userIdJSON)
  })
    .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
      .then(data => {
        console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user..."
        const reflections = data
        localStorage.setItem('reflections', JSON.stringify(reflections))
      })
      .catch(error => {
        console.error("Fetch error:", error);
      });

  const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
  reflectionsList.innerHTML = ''; // ✅ очистка перед рендером


  
  // если рефлексий нет — показываем сообщение
  if (reflections.length === 0) {
    reflectionsList.innerHTML = `<li class="reflection-card"><p>No reflections found.</p></li>`;
  } else {
    reflections.forEach(ref => renderReflection(ref, reflectionsList));
  }

  // DELETE REFLECTIONS
  reflectionsList.addEventListener('click', (e) => {
    if (!e.target.closest('.js-delete')) return;  // игнорируем клики не по кнопкам удаления

    const li = e.target.closest('.reflection-card'); // находим карточку, внутри которой кликнули
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    const index = Array.from(reflectionsList.children).indexOf(li); // узнаём индекс карточки в списке
    const reflection = reflections[index]; // находим соответствующий объект reflection

    if (!confirm('Delete this reflection?')) return;

    fetch('http://127.0.0.1:5050/api/delete_reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Id: reflection.id, userId: localStorage.getItem("userId") })
    })
    .then(res => res.json())
    .then(data => {
      // обновляем localStorage
      localStorage.setItem('reflections', JSON.stringify(data));

      // перерисовываем все элементы
      reflectionsList.innerHTML = '';
      data.forEach(ref => renderReflection(ref, reflectionsList));
    })
    .catch(err => console.error(err));
  });

  // === FILTERING ===
  applyFilterBtn.addEventListener('click', () => {
    const moodValue = moodSelect.value;
    const from = dateFrom.value ? new Date(dateFrom.value).getTime() : null;
    const to = dateTo.value ? new Date(dateTo.value).getTime() + 24*60*60*1000 : null;

    const filtered = savedReflections.filter(ref => {
      const moodMatch = moodValue === 'all' || ref.userMood === moodValue;
      const dateMs = ref.ts || new Date(ref.dateOfReflection).getTime();
      const dateMatch = (!from || dateMs >= from) && (!to || dateMs <= to);
      return moodMatch && dateMatch;
    });

    reflectionsList.innerHTML = ''; // ✅ очистка перед рендером
    if (filtered.length === 0) {
    reflectionsList.innerHTML = `<li class="reflection-card"><p>No reflections found.</p></li>`;
  } else {
    filtered.forEach(ref => renderReflection(ref, reflectionsList));
  }
    filterModal.classList.add('hidden');
  });

    })