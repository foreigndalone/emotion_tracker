document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;

  // === STEP 1 ===
  if (path.includes('welcome_step1.html')) {
    const userName = document.querySelector('#userName');
    const userPassword = document.querySelector('#userPassword')
    const userAge = document.querySelector('#userAge');
    const button = document.querySelector('#js-button');

    // IF WE ALREADY HAVE DATA
    if (localStorage.getItem('name') !== null) {
      userName.value = localStorage.getItem('name');
    }

    if (localStorage.getItem('password') !== null) {
      userPassword.value = localStorage.getItem('password');
    }
    
    if (localStorage.getItem('age') !== null) {
      userAge.value = localStorage.getItem('age');
    }


    button.addEventListener('click', function (event) {
      event.preventDefault();

      const name = userName.value.trim();
      const password = userPassword.value.trim();
      const age = userAge.value.trim();

      if (!name || !age || !password) {
        alert('Please fill your personal info to continue');
        return;
      }


      localStorage.setItem('name', name);
      localStorage.setItem('password', password)
      localStorage.setItem('age', age);

      //SENDING DATA TO SERVER//
      const user = {
        userName: localStorage.getItem('name'),
        userPassword: localStorage.getItem('password'),
        userAge: localStorage.getItem('age')
      };

      fetch('http://127.0.0.1:5050/api/add_user_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
        .then(data => {
          console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user..."
          
          if (data === "Name Error!") {
            alert("❌ That name already exists. Please choose another one.");
          } else {
            const userId = data;
            localStorage.setItem('userId', userId);
            window.location.href = "welcome_step2.html";
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
        });
    });
  }

  // === STEP 2 ===
  if (path.includes('welcome_step2.html')) {
    const button = document.querySelector('#js-button');
    const select = document.querySelector('#userReason');

    // IF WE ALREADY HAVE DATA
    if (localStorage.getItem('goal')) {
      select.value = localStorage.getItem('goal');
    }

    button.addEventListener('click', function () {
      const userGoal = select.value;

      if (userGoal === '') {
        alert('Please choose your option before continuing.');
        return;
      }

      localStorage.setItem('goal', userGoal);
      
      //SENDING DATA TO SERVER//
      const goal = {
        userGoal: localStorage.getItem('goal'),
      };

      fetch('http://127.0.0.1:5050/api/add_user_goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      })
      window.location.href = 'welcome_step3.html';
    });
  }

  //STEP3//

  if (path.includes('welcome_step3.html')) {
  const hoursList = document.querySelector('#hours');
  const minutesList = document.querySelector('#minutes');
  const saveBtn = document.querySelector('.save-btn');
  const cancelBtn = document.querySelector('.cancel-btn');
  const continueBtn = document.querySelector('footer button');
  const reminderBox = document.querySelector('#savedReminders');
  const reminderList = document.querySelector('#reminderList');

  // === TO GLOW THE TiME PICKER ===
  function attachScroll(list, key) {
    const spans = list.querySelectorAll('span');
    const itemHeight = spans[0].offsetHeight;

    // функция подсветки ближайшего элемента к центру
    function highlightCenter() {
      const center = list.scrollTop + list.clientHeight / 2;
      let closest = null;
      let diff = Infinity;

      spans.forEach(span => {
        const centerSpan = span.offsetTop + itemHeight / 2;
        const d = Math.abs(centerSpan - center);
        if (d < diff) {
          diff = d;
          closest = span;
        }
      });

      spans.forEach(s => s.classList.remove('selected'));
      if (closest) {
        closest.classList.add('selected');
        localStorage.setItem(key, closest.textContent);
      }
    }

    // SCROLL HANDLER
    let timeout;
    list.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        highlightCenter();
      }, 100);
    });

    // PRIOR CONDITION
    list.scrollTop = 0;
    setTimeout(highlightCenter, 50);
  }

  attachScroll(hoursList, 'reminderHour');
  attachScroll(minutesList, 'reminderMinute');

  // === SAVED REMINDERS ===
  let reminders = JSON.parse(localStorage.getItem('reminderTimes')) || [];

  function renderReminders() {
    reminders = JSON.parse(localStorage.getItem('reminderTimes')) || [];
    console.log(reminders)
    reminderList.innerHTML = '';
    reminders.forEach((time, index) => {
      const li = document.createElement('li');
      li.classList.add('reminder-item');
      li.innerHTML = `${time} <button data-index="${index}">×</button>`;
      reminderList.appendChild(li);
    });
    reminderBox.classList.toggle('hidden', reminders.length === 0);
  }

  fetch('http://127.0.0.1:5050/api/get_user_reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: localStorage.getItem("userId")})
      })
      .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
        .then(data => {
          console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user..."
          const db_reminders = data
          localStorage.setItem('reminderTimes', JSON.stringify(db_reminders))
          renderReminders();
        })
        .catch(error => {
          console.error("Fetch error:", error);
      });

  // === кнопка Save ===
  saveBtn.addEventListener('click', () => {
    const hour = localStorage.getItem('reminderHour') || '08';
    const minute = localStorage.getItem('reminderMinute') || '00';
    const time = `${hour}:${minute}`;

    if (!reminders.includes(time)) {
      const userIdReminderJSON = {
        userId: localStorage.getItem("userId"),
        reminder: time
      }
      //SENDING DATA TO SERVER//
      fetch('http://127.0.0.1:5050/api/add_user_reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userIdReminderJSON)
      })
      .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
        .then(data => {
          console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user...
          const db_reminders = data
          localStorage.setItem('reminderTimes', JSON.stringify(db_reminders))
          renderReminders();
          saveBtn.textContent = 'Added!';
          saveBtn.style.background = '#f4f4ff';
          setTimeout(() => {
            saveBtn.textContent = 'Save';
            saveBtn.style.background = '#fff';
          }, 700);
        })
        .catch(error => {
          console.error("Fetch error:", error);
      });
    } else {
      alert(`You already added ${time}`);
    }
  });

  // === удаление отдельного напоминания ===
  reminderList.addEventListener('click', (e) => {
    console.log(e)
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.dataset.index;
      const reminder_to_delete = reminders[index];
      const userIdReminderToDeleteJSON = {
        userId: localStorage.getItem("userId"),
        reminder: reminder_to_delete
      }

      fetch('http://127.0.0.1:5050/api/delete_reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userIdReminderToDeleteJSON)
      })
      .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
        .then(data => {
          console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user...
          const db_reminders = data
          localStorage.setItem('reminderTimes', JSON.stringify(db_reminders))
          renderReminders();
        })
        .catch(error => {
          console.error("Fetch error:", error);
      });
    }
  });


  // === Cancel — очистка всех напоминаний ===
  cancelBtn.addEventListener('click', () => {
    if (confirm('Clear all reminders?')) {
      fetch('http://127.0.0.1:5050/api/delete_all_reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: localStorage.getItem("userId")})
      })
      localStorage.removeItem('reminderTimes');
      renderReminders();
    }
  });

  // === Continue — переход на step 4 ===
  continueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    reminders = JSON.parse(localStorage.getItem("reminderTimes"));
    // сохраняем последнее выбранное время (для удобства)
    const lastTime = reminders[reminders.length - 1];
    localStorage.setItem('reminderTime', lastTime);

    window.location.href = 'welcome_step4.html';
  });
}
//STEP4//
 if (path.includes('welcome_step4.html')) {
    const button = document.querySelector('.last_button');

    if (button) {
      button.addEventListener('click', function () {
        // переход из welcome/ в main/
        window.location.href = '../main/main.html';
      });
    }
  }
});