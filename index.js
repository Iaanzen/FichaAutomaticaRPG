const dados = JSON.parse(localStorage.getItem("fichas")) || []

const listaEl = document.getElementById("lista-personagens")
const listaVaziaEl = document.getElementById("mensagem-vazio")

if (dados.length === 0) {
    listaEl.style.display = "none"
    listaVaziaEl.style.display = "block"
} else {
    listaEl.style.display = "block"
    listaVaziaEl.style.display = "none"

    dados.forEach(function (item) {
        const nome = document.createElement("li")
        listaEl.appendChild(nome)

        const link = document.createElement("a")
        link.textContent = item.nome
        link.href = "ficha.html?id=" + item.id
        nome.appendChild(link)

        const excluir = document.createElement("button")
        excluir.textContent = "Excluir"
        nome.appendChild(excluir)

        excluir.addEventListener("click", function () {
            const listaExcluir = dados.filter(function (personagem) {
                return personagem.id !== item.id;
            });
            localStorage.setItem("fichas", JSON.stringify(listaExcluir));
            window.location.reload();
        });
    })
}