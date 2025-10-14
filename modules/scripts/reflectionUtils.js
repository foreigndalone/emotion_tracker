export function renderReflection(reflection, reflectionsList) {
  if (!reflectionsList) return;

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
    <button class="js-delete"><img src="../items/Delete.svg" alt="Delete reflection"></button>
  `;

  // обработчик удаления
  li.querySelector('.js-delete').addEventListener('click', () => {
    if (confirm('Delete this reflection?')) {
      const saved = JSON.parse(localStorage.getItem('reflections')) || [];
      const updated = saved.filter(r =>
        !(r.userText === reflection.userText &&
          r.userMood === reflection.userMood &&
          r.dateOfReflection === reflection.dateOfReflection)
      );
      localStorage.setItem('reflections', JSON.stringify(updated));
      li.remove();
    }
  });

// стало — всегда добавляем карточку в начало списка
reflectionsList.appendChild(li);
}