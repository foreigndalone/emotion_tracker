import { renderReflection } from '../modules/scripts/reflectionUtils.js';
document.addEventListener("DOMContentLoaded", ()=>{

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
        window.location.href = '../profile/profile_personal_info.html'
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

})