

document.addEventListener("DOMContentLoaded", function() {
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
                window.location.href = 'login.html';
            
            } else {
            
                console.log("Acesso ao Dashboard permitido.");
            
            }
        }).catch(error => {
            console.error('Erro ao validar o token:', error);
        });
    }
});

async function validateToken(token) {
    try {
        
        let response = await fetch('http://localhost:8000/api/users/dashboard', {
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
    
    await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

    }).then(response => {
        if(response) {
            // Redireciona para a página de login após o logout bem-sucedido
            window.location.href = 'login.html';
        } else {
            console.error('Falha ao realizar logout');
        }
    }).catch(error => {
        console.error('Erro na request de logout:', error);
    });
});