document.addEventListener('DOMContentLoaded', function () {
    const userName = document.querySelector('#userName');
    const userPassword = document.querySelector('#userPassword');
    const button = document.querySelector('#js-button');

    button.addEventListener('click', (event) => {
        event.preventDefault();
        const name = userName.value.trim();
        const password = userPassword.value.trim();
        if (!name || !password) {
            alert('Please fill your personal info to continue');
            return;
        }
        localStorage.setItem('name', name);
        localStorage.setItem('password', password)
        
        const user = {
            userName: localStorage.getItem('name'),
            userPassword: localStorage.getItem('password')
        };


        //SENDING DATA TO SERVER//
        fetch('http://127.0.0.1:5050/login_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        .then(response => response.json())  // 👈 сначала преобразуем ответ в JSON
        .then(data => {
          console.log('Server response:', data); // теперь ты увидишь строку "Name Error!" или "Recieved user..."
          
          if (data === "Name Error!") {
            alert("❌ Password or name is incorrect. Try again");
          } else {
            const userId = data;
            localStorage.setItem('userId', userId);
            window.location.href = "../../main/main.html";
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
        });
    })
})