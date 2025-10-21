import { renderReflection } from '../modules/scripts/reflectionUtils.js';
document.addEventListener("DOMContentLoaded", ()=>{
      // === PERSONALIZED GREETING ===
    const introTitle = document.querySelector('.intro__title');
    const savedName = localStorage.getItem('name');
    const now = new Date()
    const hour = now.getHours()
    let greeting
    const br = '<br>'

    if (hour>=5&&hour<12){
        greeting = '☀️ Good morning'
    }else if(hour>=12&&hour<18){
        greeting = '🌞 Good afternoon'
    }else{
        greeting = '🌙 Good evening'
    }
    if (savedName && introTitle) {
    introTitle.innerHTML = `${greeting}, ${savedName}!${br} How are you feeling today?`;
    }


    const path = window.location.pathname;

    // === NAVBAR ===
    const button_home = document.querySelector('#js-home')
    const button_profile = document.querySelector('#js-profile')
    const button_history = document.querySelector('#js-history')
    const button_insights = document.querySelector('#js-insights')
    const button_viewAll = document.getElementById('view-all-js')

    button_home.addEventListener('click',()=>{
        window.location.href = 'main.html'
    })
    button_profile.addEventListener('click', ()=>{
        window.location.href = '../profile/personalInfo/personalInfo.html'
    })
    button_history.addEventListener('click', ()=>{
        window.location.href = '../history/history.html'
    })
    button_insights.addEventListener('click', ()=>{
        window.location.href = '../insights/insights.html'
    })
    button_viewAll.addEventListener('click', ()=>{
        window.location.href = '../history/history.html'
    })


    // === REFLECTIONS ===
    const openModalBtn = document.querySelector('#openModalBtn')
    const reflectionModal = document.querySelector('#newReflectionModal')
    const closeModalBtn = document.querySelector('#closeModalBtn')
    const saveReflectionBtn = document.querySelector('#saveReflectionBtn')
    const reflectionText = document.querySelector('#reflectionText');
    const moodSelect = document.querySelector('#mood')
    const reflectionsList = document.querySelector('#reflections__list');


    fetch('http://127.0.0.1:5050/api/get_reflections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId: localStorage.getItem("userId")})
    })
    .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
      .then(data => {
        const reflections = data
        localStorage.setItem('reflections', JSON.stringify(reflections))
        // === LOADING PREVIOUS REFLECTIONS ===
        const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
        reflectionsList.innerHTML = '';
        savedReflections.slice(0, 2).forEach(ref => renderReflection(ref, reflectionsList));
      })
      .catch(error => {
        console.error("Fetch error:", error);
    });
    // === OPEN AND CLOSE MODAL ===
    openModalBtn.addEventListener('click',()=>{
        reflectionModal.classList.remove('hidden')
    })

    closeModalBtn.addEventListener('click',()=>{
        reflectionModal.classList.add('hidden')
    })



    // === SAVE REFLECTION ===
    saveReflectionBtn.addEventListener('click',()=>{
        const text = reflectionText.value.trim();
        const mood = moodSelect.value;

        if(!text&&!mood){
            alert('Please write something before saving.');
            return;
        }

        // SENDING REFLECTION TO SERVER
        const userId = localStorage.getItem('userId')
        
        const reflection = {
            userId: userId,
            userText: text || '',
            userMood: mood,
            dateOfReflection: new Date().toLocaleString()
        };

        fetch('http://127.0.0.1:5050/api/add_reflection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reflection)
        })
        .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                const reflections = data;
                console.log(reflections)
                localStorage.setItem('reflections', JSON.stringify(reflections))
                // отрисовываем заново (новая — сверху)
                const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
                reflectionsList.innerHTML = '';
                savedReflections.slice(0, 2).forEach(ref => renderReflection(ref, reflectionsList));
            })
        .catch(error => {
        console.error("Fetch error:", error);
        });
        
        function parseToMs(ref) {
        if (typeof ref.ts === 'number') return ref.ts;
        // fallback для старых записей без ts:
        // попытаемся распарсить "DD.MM.YYYY, HH:MM:SS"
        const m = String(ref.dateOfReflection || '').match(/^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}):(\d{2})(?::(\d{2}))?$/);
        if (m) {
            const [_, dd, mm, yyyy, hh, min, ss] = m;
            return new Date(+yyyy, +mm - 1, +dd, +hh, +min, +(ss || 0)).getTime();
        }
        // если всё совсем криво — отправим в самый конец
        return 0;
        }

        // closing modal and cleaning modal options
        reflectionModal.classList.add('hidden');
        reflectionText.value = '';
        moodSelect.value = 'neutral';
    })

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
            localStorage.setItem('reflections', JSON.stringify(data));
            // перерисовываем последние 2 элемента
            reflectionsList.innerHTML = '';
            const updated = data.slice(0, 2);
            updated.forEach(ref => renderReflection(ref, reflectionsList));
        })
        .catch(err => console.error(err));
        });


    // THROWING REFLECTION MODAL BY TIME USER SET//
      // === AUTO OPEN REFLECTION MODAL BY REMINDER ===
    const reminders = JSON.parse(localStorage.getItem('reminderTimes')) || [];

    // функция для получения текущего времени в формате HH:MM
    function getCurrentTime() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    // чтобы не показывать окно несколько раз в одну минуту
    let lastOpenedAt = null;

    function checkReminders() {
        const current = getCurrentTime();
        if (reminders.includes(current) && lastOpenedAt !== current) {
        reflectionModal.classList.remove('hidden');
        lastOpenedAt = current;
        }
    }

    // проверяем каждую минуту
    checkReminders();
    setInterval(checkReminders, 60 * 1000);
})