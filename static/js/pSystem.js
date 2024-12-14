// Função para o botão "Sistema"
document.getElementById("home-button").addEventListener("click", function () {
    // Redireciona para o arquivo pag-Sistema.html
    window.location.href = "/";
});

// Função para o botão "Sistema"
document.getElementById("system-button").addEventListener("click", function () {
    // Redireciona para o arquivo pag-Sistema.html
    window.location.href = "/system";
});

// Função para o botão "Equipamento"
document.getElementById("equipment-button").addEventListener("click", function () {
    // Redireciona para o arquivo pag-Sistema.html
    window.location.href = "/equipment";
});



// Seleciona os elementos: Introdução
const introductionSection = document.getElementById("introduction-section");
const introductionText = document.getElementById("introduction-text");

// Adiciona o evento de clique
introductionSection.addEventListener("click", () => {
    // Alterna entre mostrar e esconder o texto
    if (introductionText.style.display === "none") {
        introductionText.style.display = "block"; // Exibe o texto
    } else {
        introductionText.style.display = "none"; // Oculta o texto
    }
});


// Seleciona os elementos: Combate
const combatSection = document.getElementById("combat-section");
const combatText = document.getElementById("combat-text");

// Adiciona o evento de clique
combatSection.addEventListener("click", () => {
    // Alterna entre mostrar e esconder o texto
    if (combatText.style.display === "none") {
        combatText.style.display = "block"; // Exibe o texto
    } else {
        combatText.style.display = "none"; // Oculta o texto
    }
});


// Seleciona os elementos: Confronto Social
const socialConfrontationSection = document.getElementById("socialConfrontation-section");
const socialConfrontationText = document.getElementById("socialConfrontation-text");

// Adiciona o evento de clique
socialConfrontationSection.addEventListener("click", () => {
    // Alterna entre mostrar e esconder o texto
    if (socialConfrontationText.style.display === "none") {
        socialConfrontationText.style.display = "block"; // Exibe o texto
    } else {
        socialConfrontationText.style.display = "none"; // Oculta o texto
    }
});


// Seleciona os elementos: Outros
const othersSection = document.getElementById("others-section");
const othersText = document.getElementById("others-text");

// Adiciona o evento de clique
othersSection.addEventListener("click", () => {
    // Alterna entre mostrar e esconder o texto
    if (othersText.style.display === "none") {
        othersText.style.display = "block"; // Exibe o texto
    } else {
        othersText.style.display = "none"; // Oculta o texto
    }
});