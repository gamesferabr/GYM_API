const accessToken = localStorage.getItem('access_token');

document.addEventListener("DOMContentLoaded", function() {
    if (!accessToken) {
        // Se não houver token, redireciona para a página de login
        window.location.href = 'login.html';

    } else {
        // Opcional: Valida o token com o servidor
        validateToken(accessToken).then(isValid => {
            if (!isValid) {
                // Se o token não for válido, limpa o token armazenado e redireciona
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
            
            } else {
            
                // Se o token for válido, permite o acesso ao dashboard
                console.log("Acesso ao Dashboard permitido.");
                // Aqui você pode continuar a inicializar o dashboard
            
            }
        }).catch(error => {
            console.error('Erro ao validar o token:', error);
            // Tratar erros de rede ou de resposta do servidor aqui
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

        // Supondo que o endpoint de validação retorne um status de sucesso se o token for válido
        // Ajuste conforme a lógica de resposta do seu backend
        return true;

    } catch (error) {
        console.error('Erro ao validar o token:', error);
        return false;
    }
}

document.getElementById("logoutButton").addEventListener("click", function(event){
    event.preventDefault();

    logoutresponse();
})

async function logoutresponse(){
    let response = await fetch('http://localhost:8000/api/users/logout',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })


}