document.addEventListener("DOMContentLoaded", function () {
    
    let username = localStorage.getItem('username');
    
    if (username) {
        document.getElementById('username').textContent = ', '+username; // Certifique-se de ter um elemento com id="username" no seu HTML
    }

    let accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        window.location.href = 'login.html';

    } else {
        // Opcional: Valida o token com o servidor
        validateToken(accessToken).then(isValid => {
            if (!isValid) {
                
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');

                window.location.href = 'login.html';
            }

        }).catch(error => {

            console.error('Erro ao validar o token:', error);

        });
    }
});

async function validateToken(token) {
    try {
        
        let response = await fetch(`http://localhost:8000/api/users/dashboard/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha na validação do token');
        }

        return true;

    } catch (error) {
        console.error('Erro ao validar o token:', error);
        return false;
    }
}

document.getElementById("logoutForm").addEventListener('submit', async function(event){
    event.preventDefault();

    let token = localStorage.getItem('access_token');
    
    console.log(token);
    
    let response = await fetch(`http://localhost:8000/api/users/logout/${token}`, {
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    console.log(response)

    if (response.ok){

        console.log(response);
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');

            // Redireciona para a página de login após o logout bem-sucedido
            // window.location.href = 'login.html';
    }
});