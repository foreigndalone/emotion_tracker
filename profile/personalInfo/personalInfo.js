document.addEventListener("DOMContentLoaded", () => {
  // === NAVBAR ===
  const button_home = document.querySelector('#js-home');
  const button_profile = document.querySelector('#js-profile');
  const button_history = document.querySelector('#js-history');
  const button_insights = document.querySelector('#js-insights');


  //PERSONAL INFO//

  const userName = document.querySelector('#userName')
  const userAge = document.querySelector('#userAge')
  const userGoal = document.querySelector('#userGoal')

  const saveBtn = document.querySelector('#js-save')

  button_home?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../../main/main.html';
  });

  button_profile?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'personalInfo.html';
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
    window.location.href = 'personalInfo.html'; // сюда имя страницы с личными данными
  });

  remindersBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../reminders/reminders.html'; // текущая страница
  });

  privacyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../privacy/privacy.html';
  });


  //SET NAME||AGE||GOAL//

    if (localStorage.getItem('name') !== null) {
    userName.value = localStorage.getItem('name');
    }
    if (localStorage.getItem('age') !== null) {
        userAge.value = localStorage.getItem('age');
    }

  saveBtn.addEventListener('click', ()=>{
    const name = userName.value
    const age = userAge.value
    const goal = userGoal.value
    if(name){
        localStorage.setItem('name',name)
    }
    if(age){
        localStorage.setItem('age',age)
    }
    if(goal){
        localStorage.setItem('goal',goal)
    }
  })


});