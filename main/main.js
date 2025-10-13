document.addEventListener("DOMContentLoaded", ()=>{
    const path = window.location.pathname;
    const button_home = document.querySelector('#js-home')
    const button_profile = document.querySelector('#js-profile')
    const button_history = document.querySelector('#js-history')
    const button_insights = document.querySelector('#js-insights')

    //REFLECTIONS//
    const openModalBtn = document.querySelector('#openModalBtn')
    const reflectionModal = document.querySelector('#newReflectionModal')
    const closeModalBtn = document.querySelector('#closeModalBtn')
    const saveReflectionBtn = document.querySelector('#saveReflectionBtn')
    const reflectionText = document.querySelector('#reflectionText');
    const moodSelect = document.querySelector('#mood')
    const reflectionsList = document.querySelector('#reflections__list');
    
    //NAVBAR//
    button_home.addEventListener('click',()=>{
            window.location.href = 'main.html'
        })
    button_profile.addEventListener('click', ()=>{
        window.location.href = '../profile/profile.html'
    })
    button_history.addEventListener('click', ()=>{
        window.location.href = '../history/history.html'
    })
    button_insights.addEventListener('click', ()=>{
        window.location.href = '../insights/insights.html'
    })


    //MAKE_NEW_REFLECTION//

    //OPEN AND CLOSE MODAL//
    openModalBtn.addEventListener('click',()=>{
        reflectionModal.classList.remove('hidden')
    })

    closeModalBtn.addEventListener('click',()=>{
        reflectionModal.classList.add('hidden')
    })
    
    // === функция отрисовки одной карточки ===
  function renderReflection(reflection) {
    const li = document.createElement('li');
    li.classList.add('reflection-card');

    let moodEmoji = '📝';
    let moodText = 'Reflection';
    switch (reflection.userMood) {
      case 'happy': moodEmoji = '😊'; moodText = 'Happy'; break;
      case 'calm': moodEmoji = '😌'; moodText = 'Calm'; break;
      case 'neutral': moodEmoji = '😐'; moodText = 'Neutral'; break;
      case 'sad': moodEmoji = '😔'; moodText = 'Sad'; break;
      case 'angry': moodEmoji = '😠'; moodText = 'Angry'; break;
    }

    li.innerHTML = `
      <div class="reflection-card__mood">
        <span class="reflection-card__emoji">${moodEmoji} ${moodText}</span>
        <p class="reflection-card__date">${reflection.dateOfReflection}</p>
      </div>
      <p class="reflection-card__text">${reflection.userText || '(no text)'}</p>
    `;
    reflectionsList.insertAdjacentElement('afterbegin', li);
  }
    
    //SAVE_REFLECTION//
    saveReflectionBtn.addEventListener('click',()=>{
        const text = reflectionText.value.trim();
        const mood = moodSelect.value;

        if(!text&&!mood){
            alert('Please write something before saving.');
            return
        }
        const reflection = {
            userText: text || '',
            userMood: mood || 'neutral',
            dateOfReflection: new Date().toLocaleString()
        };

        const reflections = JSON.parse(localStorage.getItem('reflections'))||[]
        reflections.unshift(reflection)

        // ограничиваем длину массива до 2 элементов
        if (reflections.length > 2) {
            reflections.pop(); // удаляет старейшую запись (в конце)
        }

        // сохраняем обновлённый массив в localStorage
        localStorage.setItem('reflections', JSON.stringify(reflections));

        // отрисовываем заново
        reflectionsList.innerHTML = ''; // очищаем список
        reflections.slice(0, 2).reverse().forEach(renderReflection);

        // закрываем модалку и чистим поля
        reflectionModal.classList.add('hidden');
        reflectionText.value = '';
        moodSelect.value = 'neutral';

    })
    
        // === функция отрисовки карточки ===
    function renderReflection(reflection) {
        if (!reflectionsList) return;

        const li = document.createElement('li');
        li.classList.add('reflection-card');

        let moodEmoji = '📝';
        let moodText = 'Reflection'
        switch (reflection.userMood) {
        case 'happy': moodEmoji = '😊'; moodText = 'Happy'; break;
        case 'calm': moodEmoji = '😌'; moodText = 'Calm'; break;
        case 'neutral': moodEmoji = '😐'; moodText = 'Neutral'; break;
        case 'sad': moodEmoji = '😔'; moodText = 'Sad'; break;
        case 'angry': moodEmoji = '😠'; moodText = 'Angry'; break;
        }
        
        li.innerHTML = `
            <div class="reflection-card__mood">
            <span class="reflection-card__emoji">${moodEmoji} ${moodText}</span>
            <p class="reflection-card__date">${reflection.dateOfReflection}</p>
            </div>
            <p class="reflection-card__text">${reflection.userText || '(no text)'}</p>
        `;

        reflectionsList.insertAdjacentElement('afterbegin', li);
    }

    // === при загрузке показываем старые ===
    const savedReflections = JSON.parse(localStorage.getItem('reflections')) || [];
    savedReflections.forEach(renderReflection);
  
    })