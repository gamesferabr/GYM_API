document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão de envio do formulário

    // Chama a função de cadastro
    let response = signup();

    if (response) {
        // Redirecionar o usuário para a página de login
        window.location.href = 'login.html';
    } 
});


async function signup(){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('first_name').value;
    let lastName = document.getElementById('last_name').value;
    
    // Criar o objeto JSON a partir dos valores coletados
     var userData = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName
    };

    let response = await  fetch('http://localhost:8000/api/users/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),})

        
    return response.json(); 
}