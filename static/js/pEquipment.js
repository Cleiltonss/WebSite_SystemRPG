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

// Função para alternar a visibilidade da descrição no card
function toggleDescription(event) {
    // Encontra o botão clicado e localiza a descrição associada
    const button = event.target; // Botão que disparou o evento
    const description = button.nextElementSibling; // A descrição está logo após o botão

    // Alterna a visibilidade da descrição
    if (description.style.display === "none" || description.style.display === "") {
        description.style.display = "block";
    } else {
        description.style.display = "none";
    }
}

// Adiciona evento a todos os botões de "Ver Descrição"
document.querySelectorAll(".description-button").forEach(button => {
    button.addEventListener("click", toggleDescription);
});
