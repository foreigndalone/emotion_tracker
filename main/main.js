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



    // === при загрузке показываем старые ===
    const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
    reflectionsList.innerHTML = '';
    savedReflections.slice(0, 2).forEach(ref => renderReflection(ref, reflectionsList));
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

        const reflection = {
            userText: text || '',
            userMood: mood || 'neutral',
            dateOfReflection: new Date().toLocaleString(),
            ts: Date.now()
        };

        const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
        reflections.unshift(reflection);

        // saving updated list
        localStorage.setItem('reflections', JSON.stringify(reflections));

        // отрисовываем заново (новая — сверху)
        reflectionsList.innerHTML = '';
        reflections.slice(0, 2).forEach(ref => renderReflection(ref, reflectionsList));
        
        
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