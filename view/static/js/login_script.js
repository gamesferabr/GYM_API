document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    let { ok, data, status } = await login();

    let errorMessageDiv = document.getElementById('errorMessage');

    if(ok){
        // Armazenar o first_name e tokens no localStorage
        localStorage.setItem('username', data.username); // Armazenando o first_name como 'username'
        window.location.href = 'dashboard.html';
    }
    else {
        // Se houver erro, mostrar a mensagem de erro
        errorMessageDiv.style.display = 'block';

        if(status == 401 || status == 422){
            errorMessageDiv.innerHTML = 'Invalid credentials. Please try again.';
        }

        else if(status == 500){
            errorMessageDiv.innerHTML = 'Internal server error. Please try again later.';
        }

        else{
            errorMessageDiv.innerHTML = 'Unknown error. Please try again later.';
        }
    }
});


async function login(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    var userData = {
        email: email,
        password: password
    };

    let response = await fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

    let data = await response.json(); // Converte a resposta para JSON

    return { ok: response.ok, status: response.status, data: data };
}