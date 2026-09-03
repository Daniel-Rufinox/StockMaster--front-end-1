// =========================
// LOGIN
// =========================

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Preencha o usuário e a senha.");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("system").style.display = "block";
}


// =========================
// SAIR
// =========================

function logout() {
    document.getElementById("system").style.display = "none";
    document.getElementById("login").style.display = "block";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    showScreen("dashboard");
}


// =========================
// NAVEGAÇÃO
// =========================

function showScreen(screenId, button) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(function(screen) {
        screen.classList.remove("active");
    });

    const selectedScreen = document.getElementById(screenId);

    if (selectedScreen) {
        selectedScreen.classList.add("active");
    }

    // Remove o estado ativo de todos os botões
    const buttons = document.querySelectorAll(".nav button");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Ativa o botão selecionado
    if (button) {
        button.classList.add("active");
    }
}


// =========================
// CADASTRAR PRODUTO
// =========================

function addProduct(event) {

    event.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;

    if (!name || !category || !price || !stock) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const table = document.querySelector("#productTable tbody");

    const row = document.createElement("tr");

    let status = "Normal";
    let statusClass = "badge";

    if (Number(stock) <= 3) {
        status = "Crítico";
        statusClass = "badge danger";
    } else if (Number(stock) <= 10) {
        status = "Baixo";
        statusClass = "badge warn";
    }

    row.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>R$ ${Number(price).toFixed(2).replace(".", ",")}</td>
        <td>${stock}</td>
        <td>
            <span class="${statusClass}">
                ${status}
            </span>
        </td>
    `;

    table.appendChild(row);

    alert("Produto cadastrado com sucesso!");

    document.querySelector(".form").reset();

    showScreen("products");
}


// =========================
// BUSCA DE PRODUTOS
// =========================

function searchProducts(value) {

    const search = value.toLowerCase();

    const rows = document.querySelectorAll("#productTable tbody tr");

    rows.forEach(function(row) {

        const text = row.textContent.toLowerCase();

        if (text.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}


// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("login").style.display = "block";
    document.getElementById("system").style.display = "none";

});