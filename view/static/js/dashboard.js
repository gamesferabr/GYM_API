

document.addEventListener("DOMContentLoaded", function() {
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

document.getElementById("logoutButton").addEventListener('submit', async function(event){
    let accessToken = localStorage.getItem('access_token');
    
    let response = await logoutresponse(accessToken);
        
    if (response.success){
        window.location.href = 'index.html';
    }
    else{
        throw new Error('Falha ao realizar logout');
    }

})

async function logoutresponse(token){
    let response = await fetch('http://localhost:8000/api/users/logout',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    return response
}