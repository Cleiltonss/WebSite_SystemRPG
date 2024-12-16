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

// Função para o botão "Personagem"
document.getElementById("character-button").addEventListener("click", function () {
    // Redireciona para o arquivo pag-Sistema.html
    window.location.href = "/character";
});

// Alternar exibição das seções fixas
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
        const sectionContainer = header.nextElementSibling; // Subcategorias ou cards
        if (sectionContainer.style.display === 'none' || sectionContainer.style.display === '') {
            sectionContainer.style.display = 'block';
        } else {
            sectionContainer.style.display = 'none';
        }
    });
});

// Alternar exibição dos cards das subcategorias
document.querySelectorAll('.subcategory-header').forEach(header => {
    header.addEventListener('click', () => {
        const cardsContainer = header.nextElementSibling;
        if (cardsContainer.style.display === 'none' || cardsContainer.style.display === '') {
            cardsContainer.style.display = 'flex';
        } else {
            cardsContainer.style.display = 'none';
        }
    });
});

// Alternar visibilidade das descrições nos cards
document.querySelectorAll(".description-button").forEach(button => {
    button.addEventListener("click", (event) => {
        const description = event.target.nextElementSibling;

        if (description.style.display === "none" || description.style.display === "") {
            description.style.display = "block";
        } else {
            description.style.display = "none";
        }
    });
});
