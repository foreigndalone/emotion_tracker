// export function renderReflection(reflection, reflectionsList) {
//   if (!reflectionsList) return;

//   const li = document.createElement('li');
//   li.classList.add('reflection-card');

//   let moodEmoji = '📝';
//   let moodText = 'Reflection';
//   switch (reflection.userMood) {
//     case 'happy': moodEmoji = '😊'; moodText = 'Happy'; break;
//     case 'calm': moodEmoji = '😌'; moodText = 'Calm'; break;
//     case 'neutral': moodEmoji = '😐'; moodText = 'Neutral'; break;
//     case 'sad': moodEmoji = '😔'; moodText = 'Sad'; break;
//     case 'angry': moodEmoji = '😠'; moodText = 'Angry'; break;
//   }

//   li.innerHTML = `
//     <div class="reflection-card__mood">
//       <span class="reflection-card__emoji">${moodEmoji} ${moodText}</span>
//       <p class="reflection-card__date">${reflection.dateOfReflection}</p>
//     </div>
//     <p class="reflection-card__text">${reflection.userText || '(no text)'}</p>
//     <button class="js-delete"><img src="../../items/Delete.svg" alt="Delete reflection"></button>
//   `;

//   // обработчик удаления
//   li.querySelector('.js-delete').addEventListener('click', () => {
    
//     if (confirm('Delete this reflection?')) {
//       const userIdRefId = {
//         Id: reflection.id,
//         userId: localStorage.getItem("userId")
//       }
//       fetch('http://127.0.0.1:5050/api/delete_reflection', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(userIdRefId)
//       })
//         .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
//           .then(data => {
//             console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user..."
//             const reflections = data
//             localStorage.setItem('reflections', JSON.stringify(reflections))
//           })
//           .catch(error => {
//             console.error("Fetch error:", error);
//       });
//       li.remove();
//     }
//   });
  

// // стало — всегда добавляем карточку в начало списка
// reflectionsList.appendChild(li);
// }

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
    <button class="js-delete"><img src="../../items/Delete.svg" alt="Delete reflection"></button>
  `;

  reflectionsList.appendChild(li);
}