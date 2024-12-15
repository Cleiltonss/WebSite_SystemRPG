// Função para os botões do menu
document.getElementById("home-button").addEventListener("click", function () {
    window.location.href = "/";
});

document.getElementById("system-button").addEventListener("click", function () {
    window.location.href = "/system";
});

document.getElementById("equipment-button").addEventListener("click", function () {
    window.location.href = "/equipment";
});




// Alternar exibição dos cards da categoria
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
        const cardsContainer = header.nextElementSibling; // Seleciona o próximo elemento (cards-container)

        // Alterna a visibilidade entre 'flex' (mostrar) e 'none' (esconder)
        if (cardsContainer.style.display === 'none' || cardsContainer.style.display === '') {
            cardsContainer.style.display = 'flex'; // Mostra os cards
        } else {
            cardsContainer.style.display = 'none'; // Esconde os cards
        }
    });
});



// Alternar visibilidade das descrições nos cards
document.querySelectorAll(".description-button").forEach(button => {
    button.addEventListener("click", (event) => {
        const description = event.target.nextElementSibling; // Encontra a descrição após o botão

        // Alterna a visibilidade entre 'block' (mostrar) e 'none' (esconder)
        if (description.style.display === "none" || description.style.display === "") {
            description.style.display = "block"; // Mostra a descrição
        } else {
            description.style.display = "none"; // Esconde a descrição
        }
    });
});