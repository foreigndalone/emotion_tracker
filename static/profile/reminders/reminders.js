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
    window.location.href = '../personalInfo/personalInfo.html';
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
    window.location.href = '../personalInfo/personalInfo.html';
  });
  remindersBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'reminders.html';
  });
  privacyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../privacy/privacy.html';
  });


  // === REMINDERS ===
  const reminderList = document.querySelector('#reminderList');
  let reminders = JSON.parse(localStorage.getItem('reminderTimes')) || [];

  // функция отрисовки списка
  function renderReminders() {
    reminders = JSON.parse(localStorage.getItem("reminderTimes"))
    reminderList.innerHTML = '';

    if (reminders.length === 0) {
      reminderList.innerHTML = `<li class="reminder-item"><span>No reminders yet</span></li>`;
      return;
    }

    reminders.forEach((time, index) => {
      const li = document.createElement('li');
      li.classList.add('reminder-item');
      li.innerHTML = `
        <span>${time}</span>
        <div class="reminder-actions">
          <button class="button button--danger" data-index="${index}">✕</button>
        </div>
      `;
      reminderList.appendChild(li);
    });

    // === удаление ===
    const deleteButtons = reminderList.querySelectorAll('.button--danger');
    deleteButtons.forEach(btn => {
      // btn.addEventListener('click', () => {
      //   const i = btn.dataset.index;
      //   reminders.splice(i, 1);
      //   localStorage.setItem('reminderTimes', JSON.stringify(reminders));
      //   renderReminders();
      // });
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        const reminder_to_delete = reminders[i];
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
      });
    });
    
  }
  renderReminders();


  // === MODAL ===
  const addBtn = document.querySelector('#add-btn');
  const modal = document.querySelector('.form-container');
  const cancelBtn = document.querySelector('#cancel-btn');
  const saveBtn = document.querySelector('#save-btn');

  addBtn.addEventListener('click', () => modal.style.display = 'flex');
  cancelBtn.addEventListener('click', () => modal.style.display = 'none');

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
      renderReminders();
      saveBtn.textContent = 'Added!';
      saveBtn.style.background = '#f4f4ff';
      setTimeout(() => {
        saveBtn.textContent = 'Save';
        saveBtn.style.background = '#fff';
      }, 700);
    } else {
      alert(`You already added ${time}`);
    }

    modal.style.display = 'none';
  });


  // === TIME PICKER ===
  const hoursList = document.querySelector('#hours');
  const minutesList = document.querySelector('#minutes');

  // функция подсветки выбранного элемента
  function attachScroll(list, key) {
    const spans = list.querySelectorAll('span');
    const itemHeight = spans[0].offsetHeight;

    function highlightCenter() {
      const center = list.scrollTop + list.clientHeight / 2;
      let closest = null;
      let diff = Infinity;

      spans.forEach(span => {
        const spanCenter = span.offsetTop + itemHeight / 2;
        const distance = Math.abs(spanCenter - center);
        if (distance < diff) {
          diff = distance;
          closest = span;
        }
      });

      spans.forEach(s => s.classList.remove('selected'));
      if (closest) {
        closest.classList.add('selected');
        localStorage.setItem(key, closest.textContent);
      }
    }

    let timeout;
    list.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(highlightCenter, 80);
    });

    // клик мышкой по конкретному числу
    spans.forEach(span => {
      span.addEventListener('click', () => {
        spans.forEach(s => s.classList.remove('selected'));
        span.classList.add('selected');
        localStorage.setItem(key, span.textContent);
      });
    });

    // начальная подсветка
    setTimeout(highlightCenter, 50);
  }

  attachScroll(hoursList, 'reminderHour');
  attachScroll(minutesList, 'reminderMinute');
});