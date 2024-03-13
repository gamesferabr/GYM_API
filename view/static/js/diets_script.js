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

//Lógica para liberar o html para ser visualizado pelo usuário
document.addEventListener("DOMContentLoaded", async function() {
    // Verifica e possivelmente atualiza o token antes de prosseguir
    await checkAndRefreshToken();
    
    let accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = '../login.html';

    } else {

        // Opcional: Valida o token com o servidor
        validateToken(accessToken).then(isValid => {
            
            if (!isValid) {
                
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');

                window.location.href = '../login.html';
            
            } 

        }).catch(error => {

            console.error('Erro ao validar o token:', error);

        });
    }
});


//Lógica de validar o token
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


// Lógica de procurar a dieta ao usuário
$(document).ready(function() {
    $('.add-food-btn').click(function() {
        
        const mealType = $(this).data('meal');
        const queryInput = $(`#searchinput-${mealType}`);

        const query = queryInput.val();
        
        if (query) {
            $.ajax({
                url: 'https://api.nal.usda.gov/fdc/v1/foods/search',
                type: 'GET',
                dataType: 'json',
                data: {

                    api_key: 'HDg87qCY7kJPk3ozteKzgRarv7qGnpCAcDPLj8GZ', // Substitua YOUR_API_KEY pela sua chave de API real
                    query: query,
                },

                success: function(result) {
                    if (result.foods && result.foods.length > 0) {
                        const selectfood = $('.addSelectedFoods');

                        selectfood.css('display', 'flex');

                        const resultsContainer = $(`#food-results-${mealType}`);
                        resultsContainer.empty(); // Limpa resultados anteriores
            
                        result.foods.forEach((food, index) => {
                            const checkBoxHtml = `
                                <div class="form-check">
                                    <input class="form-check-input food-checkbox" type="checkbox" data-fdcid="${food.fdcId}" id="food-${mealType}-${food.fdcId}">
                                    <label class="form-check-label" for="food-${mealType}-${food.fdcId}">
                                        ${food.description}
                                    </label>
                                    <input type="number" class="food-quantity" placeholder="Quantidade (g)" id="quantity-${mealType}-${food.fdcId}">
                                </div>
                            `;
                            resultsContainer.append(checkBoxHtml);
                        });
                        // Mostra o contêiner de resultados quando houver resultados
                        resultsContainer.css('display', 'block');
                    
                    } else {

                        alert("No food found for this query.");
                        
                        // Se nenhum alimento for encontrado, oculta o contêiner de resultados
                        container.empty(); // Limpa resultados anteriores
                        container.css('display', 'none');
                    }
                },
                error: function(error) {
                    alert('Error: ' + error.message);
                }
            });
        }
    });
    

    //Lógica para adicionar a dieta ao banco de dados
    $(document).ready(function() {

        // Quando um botão é clicado para adicionar a dieta
        $('.addSelectedFoods').on('click', function() {

            $('.food-checkbox:checked').each(function() {
                const fdcId = $(this).data('fdcid');
                                
                const quantityInputId = `quantity-${$(this).attr('id').split('-')[1]}-${fdcId}`;
                const quantity = $(`#${quantityInputId}`).val();
                
                console.log(`FDC ID: ${fdcId}, Quantity: ${quantity}g`);

                // Mostrar a comida, quantidade, carboidratos, proteínas, gorduras e calorias
                // Substitua o bloco abaixo pela chamada AJAX real para obter informações nutricionais
                // Certifique-se de enviar o token de acesso no cabeçalho da solicitação
                // e tratar a resposta e os erros adequadamente
                $.ajax({
                    url: `https://api.nal.usda.gov/fdc/v1/food/${fdcId}`,
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        api_key: 'HDg87qCY7kJPk3ozteKzgRarv7qGnpCAcDPLj8GZ', // Substitua YOUR_API_KEY pela sua chave de API real
                    },

                    success: async function(result) {
                        console.log('Informações nutricionais:', result);
                        const result2 = result.labelNutrients;

                        const nome = result.description;
                        const calorias = result2.calories.value;
                        const proteinas = result2.protein.value;
                        const gorduras = result2.fat.value;
                        const carboidratos = result2.carbohydrates.value;
                        const fibra = result2.fiber.value;
                        const acucar = result2.sugars.value;
                        const sodio = result2.sodium.value;
                        const colesterol = result2.cholesterol.value;
                        const gordura_saturada = result2.saturatedFat.value;

                        const dietData = {
                            nome,
                            quantity,
                            calorias,
                            proteinas,
                            gorduras,
                            carboidratos,
                            fibra,
                            acucar,
                            sodio,
                            colesterol,
                            gordura_saturada,
                        };

                        console.log(dietData);
                        
                        let dietDataSend = {
                             name: nome,
                             description: `"Calorias: ${calorias}g, 
                                Proteínas: ${proteinas}g, 
                                Gorduras: ${gorduras}g, 
                                Carboidratos: ${carboidratos}g, 
                                Fibra: ${fibra}g, 
                                Açúcar: ${acucar}g, 
                                Sódio: ${sodio}g, 
                                Colesterol: ${colesterol}g, 
                                Gordura Saturada: ${gordura_saturada}g"`,
                                
                                //Lógica para pegar o dia atual
                                date: new Date().toISOString().slice(0, 10),       
                        };
                        
                        let accessToken = localStorage.getItem('access_token');
                    
                        console.log(accessToken);

                        let response = await fetch(`http://localhost:8000/api/diets/add/${accessToken}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify(dietDataSend),
                        });
                        
                        console.log(response);
                    }
                });
            });
        });
    });
});


$(document).ready(function() {
    $('#btn-reset-view').click(function() {
        const container = $(this).closest('.meal-container');

        const selectfood = $('.addSelectedFoods');

        selectfood.css('display', 'none');
        
        // Oculta o perfil de alimentos e qualquer mensagem de erro ou resultado de pesquisa
        container.find('.user-food-profile').hide();
        container.find('.food-results').empty().hide();

        // Limpa o input de pesquisa
        container.find('.inputsearch').val('');

        // Esconde o botão "Ver Perfil" e mostra o botão "Pesquisar Alimentos"
        container.find('.btn-toggle[data-target="profile"]').hide();
        container.find('.btn-toggle[data-target="search"]').show();
    });
});