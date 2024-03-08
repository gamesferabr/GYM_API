document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

    // Coletar os valores do formulário
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;

    // Criar o objeto JSON a partir dos valores coletados
    var userData = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
    };

    // Enviar os dados para um endpoint de API (exemplo)
    fetch('http://127.0.0.1:8000/api/users/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Aqui você pode lidar com a resposta do servidor, como redirecionar o usuário ou mostrar uma mensagem de sucesso
    })
    .catch((error) => {
        console.error('Error:', error);
        // Aqui você pode lidar com erros de rede ou de resposta do servidor
    });
});