async function refreshToken() {
    let refreshToken = localStorage.getItem('refresh_token');
    
    let response = await fetch(`http://localhost:8000/api/auth/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
        let data = await response.json();
        localStorage.setItem('access_token', data.access);
        console.log('Token refreshed successfully.');

    } else {
        console.error('Erro ao atualizar o token.');

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // window.location.href = 'login.html';
        return false; // Falha na atualização do token
    }
}

async function checkAndRefreshToken() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        // window.location.href = 'login.html';
        return;
    }

    // Decodifica o token para verificar a expiração
    let decodedToken = jwt_decode(accessToken);
    let currentTime = Date.now() / 1000; // Converte para segundos

    if (decodedToken.exp < currentTime) {
        // Token expirado, tenta renovar
        await refreshToken();
    }
}

// Quando o usuário clicar no botão back ele será redirecionado para o diet.html com a div carousel-item active que contém o id "breakfastcontainer" ativa.
//Antes da tela carregar, ele se comunica com o back end para retornar as informações do café da manhã. Do dia atual
document.addEventListener("DOMContentLoaded", async function () {
    await checkAndRefreshToken();
    // Configura a data atual como valor padrão do seletor de data
    document.getElementById('date-selector').value = new Date().toISOString().slice(0, 10);

    // Busca as informações da dieta para a data atual
    let data = await fetchDietData();

    // Evento para buscar as informações da dieta para a nova data selecionada
    document.getElementById('date-selector').addEventListener('change', fetchDietData);

    document.getElementById('back').addEventListener('click', function () {
        window.location.href = 'diet.html#breakfastcontainer';
    });

    let accessToken = localStorage.getItem('access_token');

    let currentmeal = "lunch";
    
    let response = await fetch(`http://localhost:8000/api/diets/${data}/${currentmeal}/${accessToken}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    console.log(response);

    if (response.status === 200) {

        let data = await response.json();
        
        console.log(data);

        updateFoodList(data);

    } else {
        console.error('Erro ao buscar o café da manhã:', response.status);
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    // Verifica e possivelmente atualiza o token antes de prosseguir
    await checkAndRefreshToken();

    let accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        window.location.href = 'login.html';

    } else {
        // Opcional: Valida o token com o servidor
        validateToken(accessToken).then(isValid => {
            if (!isValid) {
                
                localStorage.removeItem('access_token');
                
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

async function fetchDietData() {
    let date = document.getElementById('date-selector').value; // Pega a data selecionada
    console.log(date);

    return date;
}

function updateFoodList(data) {    
    
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let food = data[i];
            let foodElement = document.createElement('li');
            foodElement.textContent = food.name;
            foodElement.innerHTML = food.description;

            foodElement.className = 'list-group-item';
            
            foodElement.style = 'background-color: #f8f9fa';
            foodElement.style = 'border: 1px solid #dee2e6';
            foodElement.style = 'border-radius: 0.25rem';
            foodElement.style = 'margin-top: 5px';
            foodElement.style = 'margin-bottom: 5px';
            foodElement.style = 'padding: 10px';
            foodElement.style = 'text-align: left';
            foodElement.style = 'font-size: 20px';
            foodElement.style = 'color: #6c757d';
            foodElement.style = 'justify-content: space-between';

            // Arrumar o height para uma altura fixa menor
            foodElement.style = 'height: 100px';

            // Arrumar o width para uma largura fixa maior
            foodElement.style = 'width: 100%';
            document.getElementById('foodlist').appendChild(foodElement);
        }
    } else {
        alert('No data found for this date. Please select another date.');
    }
}

document.getElementById("btn-date").addEventListener('click', async function(event){
    event.preventDefault();
    // Se a data selecionada for diferente da data atual, busca as informações da dieta para a nova data
    let date = document.getElementById('date-selector').value;
    
    if (date !== new Date().toISOString().slice(0, 10)) {
        // Busca as informações da dieta para a data atual
        let accessToken = localStorage.getItem('access_token');
        let currentmeal = "lunch";
        let response = await fetch(`http://localhost:8000/api/diets/${date}/${currentmeal}/${accessToken}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        console.log(response);

        if (response.status === 200) {
            
            let data = await response.json();

            updateFoodList(data);
    
        }
        else {
            alert('No data found for this date. Please select another date.');
        }
    }

    else{
        // Continua com o mesmo template e não busca as informações da dieta para a nova data
        alert('Data is already selected. Please select another date.');
    }
});