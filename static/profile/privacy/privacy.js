document.addEventListener("DOMContentLoaded", () => {
  // === NAVBAR ===
  const button_home = document.querySelector('#js-home');
  const button_profile = document.querySelector('#js-profile');
  const button_history = document.querySelector('#js-history');
  const button_insights = document.querySelector('#js-insights');

  button_home?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../main/main.html';
  });

  button_profile?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../personalInfo/personalInfo.html';
  });

  button_history?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../history/history.html';
  });

  button_insights?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../insights/insights.html';
  });

  // === ASIDE ===
  const personalBtn = document.querySelector('#js-personal');
  const remindersBtn = document.querySelector('#js-reminders');
  const privacyBtn = document.querySelector('#js-privacy');

  personalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../personalInfo/personalInfo.html'; // сюда имя страницы с личными данными
  });

  remindersBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../reminders/reminders.html'; // текущая страница
  });

  privacyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'privacy.html';
  });


  // === DELETE ALL DATA ===
  const deleteBtn = document.querySelector('.button--danger');

  deleteBtn?.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to delete all your data? This action cannot be undone.');
    if (!confirmed) return;

    // очищаем localStorage полностью
    localStorage.clear();
    

    // устанавливаем дефолтные значения
    localStorage.setItem('user', 'GREAT DEV ELVIS');
    localStorage.setItem('age', '1000');
    localStorage.setItem('goal', 'forElvis');

    // сообщение и перезагрузка страницы
    alert('All data deleted. Default values restored.');
    window.location.reload();
  })
});