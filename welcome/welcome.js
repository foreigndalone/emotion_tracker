document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;

  // === STEP 1 ===
  if (path.includes('welcome_step1.html')) {
    const userName = document.querySelector('#userName');
    const userAge = document.querySelector('#userAge');
    const button = document.querySelector('#js-button');

    // если данные уже есть — вставляем их
    if (localStorage.getItem('name') !== null) {
      userName.value = localStorage.getItem('name');
    }
    if (localStorage.getItem('age') !== null) {
      userAge.value = localStorage.getItem('age');
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();

      const name = userName.value.trim();
      const age = userAge.value.trim();

      if (!name || !age) {
        alert('Please fill your personal info to continue');
        return;
      }

      localStorage.setItem('name', name);
      localStorage.setItem('age', age);
      window.location.href = 'welcome_step2.html';
    });
  }

  // === STEP 2 ===
  if (path.includes('welcome_step2.html')) {
    const button = document.querySelector('#js-button');
    const select = document.querySelector('#userReason');

    // если пользователь уже выбирал — восстановим
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

  // === функция подсветки центра ===
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

    // обработчик скролла
    let timeout;
    list.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        highlightCenter();
      }, 100);
    });

    // начальное состояние — подсвечиваем первый элемент
    list.scrollTop = 0;
    setTimeout(highlightCenter, 50);
  }

  attachScroll(hoursList, 'reminderHour');
  attachScroll(minutesList, 'reminderMinute');

  // === сохранённые напоминания ===
  let reminders = JSON.parse(localStorage.getItem('reminderTimes')) || [];

  function renderReminders() {
    reminderList.innerHTML = '';
    reminders.forEach((time, index) => {
      const li = document.createElement('li');
      li.classList.add('reminder-item');
      li.innerHTML = `${time} <button data-index="${index}">×</button>`;
      reminderList.appendChild(li);
    });
    reminderBox.classList.toggle('hidden', reminders.length === 0);
  }
  renderReminders();

  // === кнопка Save ===
  saveBtn.addEventListener('click', () => {
    const hour = localStorage.getItem('reminderHour') || '08';
    const minute = localStorage.getItem('reminderMinute') || '00';
    const time = `${hour}:${minute}`;

    if (!reminders.includes(time)) {
      reminders.push(time);
      localStorage.setItem('reminderTimes', JSON.stringify(reminders));
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
  });

  // === удаление отдельного напоминания ===
  reminderList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.dataset.index;
      reminders.splice(index, 1);
      localStorage.setItem('reminderTimes', JSON.stringify(reminders));
      renderReminders();
    }
  });

  // === Cancel — очистка всех напоминаний ===
  cancelBtn.addEventListener('click', () => {
    if (confirm('Clear all reminders?')) {
      reminders = [];
      localStorage.removeItem('reminderTimes');
      renderReminders();
    }
  });

  // === Continue — переход на step 4 ===
  continueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (reminders.length === 0) {
      alert('Please add at least one reminder time before continuing.');
      return;
    }
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




// // welcome/welcome.js
// document.addEventListener("DOMContentLoaded", () => {
//   const path = window.location.pathname;
//   const button = document.querySelector("footer button");

//   /* === STEP 1: Name + Age === */
//   if (path.endsWith("welcome_step1.html")) {
//     button?.addEventListener("click", (e) => {
//       e.preventDefault();
//       const name = document.querySelector('input[name="userName"]')?.value.trim();
//       const age = document.querySelector('input[name="userAge"]')?.value.trim();

//       if (!name || !age) {
//         alert("Please enter your name and age.");
//         return;
//       }

//       localStorage.setItem("userName", name);
//       localStorage.setItem("userAge", age);
//       window.location.href = "welcome_step2.html";
//     });
//   }




//   /* === STEP 2: Goal === */
//   if (path.endsWith("welcome_step2.html")) {
//     button?.addEventListener("click", (e) => {
//       e.preventDefault();
//       const goal = document.querySelector('select[name="userReason"]')?.value;
//       if (!goal) {
//         alert("Please select your goal.");
//         return;
//       }

//       localStorage.setItem("userGoal", goal);
//       window.location.href = "welcome_step3.html";
//     });
//   }





  
//   /* === STEP 3: Reminder Time === */
//   if (path.endsWith("welcome_step3.html")) {
//     const hoursList = document.querySelector("#hours");
//     const minutesList = document.querySelector("#minutes");
//     const continueBtn = document.querySelector("footer button");
//     const saveBtn = document.querySelector(".save-btn");
//     const cancelBtn = document.querySelector(".cancel-btn");

//     let reminderTimes = JSON.parse(localStorage.getItem("reminderTimes")) || [];

//     function makeInfiniteScroll(list, key) {
//       const spans = Array.from(list.querySelectorAll("span"));
//       const itemHeight = spans[0].offsetHeight;

//       // клонируем вверх и вниз
//       const topClone = spans.map(s => s.cloneNode(true));
//       const bottomClone = spans.map(s => s.cloneNode(true));
//       topClone.forEach(c => list.insertBefore(c, list.firstChild));
//       bottomClone.forEach(c => list.appendChild(c));

//       // ставим скролл в середину
//       const startPosition = spans.length * itemHeight;
//       list.scrollTop = startPosition;

//       let scrollTimeout;

//       list.addEventListener("scroll", () => {
//         clearTimeout(scrollTimeout);
//         const totalHeight = itemHeight * spans.length;

//         // если дошли до края → возвращаемся в середину
//         if (list.scrollTop <= itemHeight) {
//           list.scrollTop += totalHeight;
//         } else if (list.scrollTop >= totalHeight * 2) {
//           list.scrollTop -= totalHeight;
//         }

//         // ищем ближайший к центру элемент
//         const allSpans = list.querySelectorAll("span");
//         const center = list.scrollTop + list.clientHeight / 2;
//         let closestSpan = null;
//         let closestDiff = Infinity;

//         allSpans.forEach(span => {
//           const spanCenter = span.offsetTop + itemHeight / 2;
//           const diff = Math.abs(spanCenter - center);
//           if (diff < closestDiff) {
//             closestDiff = diff;
//             closestSpan = span;
//           }
//         });

//         // подсветка выбранного
//         allSpans.forEach(s => s.classList.remove("selected"));
//         if (closestSpan) {
//           closestSpan.classList.add("selected");
//           localStorage.setItem(key, closestSpan.textContent);
//         }

//         // snap к ближайшему значению
//         scrollTimeout = setTimeout(() => {
//           list.scrollTo({
//             top: closestSpan.offsetTop - list.clientHeight / 2 + itemHeight / 2,
//             behavior: "smooth"
//           });
//         }, 150);
//       });
//     }

//     // применяем скролл
//     makeInfiniteScroll(hoursList, "reminderHour");
//     makeInfiniteScroll(minutesList, "reminderMinute");

//     // Save — добавляем время
//     saveBtn.addEventListener("click", () => {
//       const hour = localStorage.getItem("reminderHour") || "08";
//       const minute = localStorage.getItem("reminderMinute") || "00";
//       const newTime = `${hour}:${minute}`;

//       if (!reminderTimes.includes(newTime)) {
//         reminderTimes.push(newTime);
//         localStorage.setItem("reminderTimes", JSON.stringify(reminderTimes));
//         saveBtn.textContent = "Added!";
//         saveBtn.style.background = "#f4f4ff";
//         setTimeout(() => {
//           saveBtn.textContent = "Save";
//           saveBtn.style.background = "#fff";
//         }, 800);
//       } else {
//         alert(`You already added ${newTime}`);
//       }
//     });

//     // Cancel — очистить всё
//     cancelBtn.addEventListener("click", () => {
//       if (confirm("Clear all reminders?")) {
//         reminderTimes = [];
//         localStorage.removeItem("reminderTimes");
//         alert("All reminders cleared.");
//       }
//     });

//     // Continue — на step 4
//     continueBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       if (reminderTimes.length === 0) {
//         alert("Please add at least one reminder time before continuing.");
//         return;
//       }
//       window.location.href = "welcome_step4.html";
//     });
//   }

//   /* === STEP 4: Final screen === */
//   if (path.endsWith("welcome_step4.html")) {
//     const name = localStorage.getItem("userName");
//     const title = document.querySelector("h1");
//     const button = document.querySelector("footer button");

//     if (name && title) {
//       title.textContent = `You’re all set, ${name}.`;
//     }

//     button?.addEventListener("click", (e) => {
//       e.preventDefault();
//       window.location.href = "../main/main.html";
//     });
//   }
// });