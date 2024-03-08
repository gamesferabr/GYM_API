document.addEventListener("DOMContentLoaded", function() {
    // Substitua 'API_ENDPOINT' pelo endpoint correto do seu servidor
    const API_ENDPOINT = '/api/diets/';
    const token = getCookie("refresh_token"); // Função para obter o cookie do token

    fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Substitua conforme a necessidade de autenticação
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(diets => {
        const dietsContainer = document.querySelector('.diets-container'); // Certifique-se de que há um container com esta classe no seu HTML
        diets.forEach(diet => {
            const dietElement = document.createElement('div');
            dietElement.classList.add('diet');
            dietElement.innerHTML = `
                <h3>${diet.name}</h3>
                <p>${diet.description || ''}</p>
                <small>Date: ${new Date(diet.date).toLocaleDateString()}</small>
            `;
            dietsContainer.appendChild(dietElement);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}