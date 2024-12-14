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
function toggleDescription() {
    const description = document.getElementById("introduction-section");
    description.style.display = description.style.display === "none" ? "block" : "none";
}
