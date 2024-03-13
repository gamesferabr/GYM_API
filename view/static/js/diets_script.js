document.addEventListener("DOMContentLoaded", function() {
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

    $(document).ready(function() {

        // Quando um botão é clicado para adicionar a dieta
        $('.add-food-btn').on('click', function() {
            // const dietData = {
            //     name: "Nome da Dieta",
            //     description: "Descrição da Dieta",
            //     date: "2023-01-01", // Exemplo de data, ajuste conforme necessário
            // };

            // $.ajax({
            //     url: '/api/diets/add', // Endpoint da sua API para adicionar dieta
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify(dietData),
            //     beforeSend: function(xhr) {
            //         xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("refresh_token")); // Supondo que você tenha uma função getCookie definida
            //     },
            //     success: function(response) {
            //         console.log('Dieta adicionada com sucesso:', response);
            //         // Opcional: redirecionar para a página de preview ou atualizar a UI aqui
            //     },
            //     error: function(error) {
            //         console.log('Erro ao adicionar dieta:', error);
            //     }
            // });
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
