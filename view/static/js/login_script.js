document.getElementById('loginForm').addEventListener('submit', async function(event){
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    try {
        let response = await login(); // Aguarda a função login completar

        if (response.success) {
            console.log(response); // Exemplo: { refresh_token: "...", access_token: "..." }

            // Armazena os tokens conforme necessário, por exemplo, em localStorage
            localStorage.setItem('access_token', response.tokens.data.access);
            window.location.href = 'dashboard.html'; // Redireciona para o dashboard

        } else {
            // Trata o caso de login falho
            console.error('Login failed:', response.error);
            // Exibe uma mensagem de erro, se necessário
        }
    } catch (error) {
        console.error('Error during login:', error);
        // Trata erros de rede ou de resposta do servidor
    }
});

async function login(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    var userData = {
        email: email,
        password: password
    };

    try {
        let response = await fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json(); // Converte a resposta para JSON
        return {
            success: true,
            tokens: data // Supondo que a API retorne os tokens nesta etapa
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.toString()
        };
    }
}