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

  function renderReflections(refs) {
    reflectionsList.innerHTML = '';
    if (refs.length === 0) {
      reflectionsList.innerHTML = `<li class="reflection-card"><p>No reflections found.</p></li>`;
      return;
    }
    refs.forEach(ref => renderReflection(ref, reflectionsList));
  }

  renderReflections(savedReflections);

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

    renderReflections(filtered);
    filterModal.classList.add('hidden');
  });

    })