const subracasPorRaca = {
    anao: [
        { valor: "anaoColina", nome: "Anão da Colina" },
        { valor: "anaoMontanha", nome: "Anão da Montanha" }
    ],
    elfo: [
        { valor: "elfoAlto", nome: "Elfo Alto" },
        { valor: "elfoFloresta", nome: "Elfo da Floresta" },
        { valor: "elfoNegro", nome: "Elfo Negro" }
    ],
    halfling: [
        { valor: "halflingPesLeves", nome: "Halfling Pés-Leves" },
        { valor: "halflingRobusto", nome: "Halfling Robusto" }
    ],
    gnomo: [
        { valor: "gnomoFloresta", nome: "Gnomo da Floresta" },
        { valor: "gnomoRocha", nome: "Gnomo das Rochas" }
    ]
};

const formFicha = document.getElementById("form-ficha")
const mensagemErroEl = document.getElementById("mensagem-erro")
const racaEL = document.getElementById("raca")
const subracaEL = document.getElementById("subraca")

// Descobre qual personagem abrir pelo "?id=" da URL
const parametros = new URLSearchParams(window.location.search)
const idDaUrl = Number(parametros.get("id"))

const personagens = JSON.parse(localStorage.getItem("fichas")) || []

const personagem = personagens.find(function (item) {
    return item.id === idDaUrl
})

// Preenche o select de sub-raça conforme a raça escolhida
function preencherSubracas(raca, valorSelecionado) {
    subracaEL.innerHTML = ""
    const subracasLista = subracasPorRaca[raca] || []

    subracasLista.forEach(function (subracaItem) {
        const opcao = document.createElement("option")
        opcao.value = subracaItem.valor
        opcao.textContent = subracaItem.nome
        subracaEL.appendChild(opcao)
    })

    if (valorSelecionado) {
        subracaEL.value = valorSelecionado
    }
}

racaEL.addEventListener("change", function () {
    preencherSubracas(racaEL.value, "")
})

if (!personagem) {
    formFicha.style.display = "none"
    mensagemErroEl.style.display = "block"
} else {
    document.title = personagem.nome + " - Ficha"

    document.getElementById("nome").value = personagem.nome
    document.getElementById("classe").value = personagem.classe
    document.getElementById("subclasse").value = personagem.subclasse
    document.getElementById("raca").value = personagem.raca
    preencherSubracas(personagem.raca, personagem.subraca)
    document.getElementById("nivel").value = personagem.nivel
    document.getElementById("antecedente").value = personagem.antecedente
    document.getElementById("alinhamento").value = personagem.alinhamento
    document.getElementById("forca").value = personagem.forca
    document.getElementById("destreza").value = personagem.destreza
    document.getElementById("constituicao").value = personagem.constituicao
    document.getElementById("inteligencia").value = personagem.inteligencia
    document.getElementById("sabedoria").value = personagem.sabedoria
    document.getElementById("carisma").value = personagem.carisma

    formFicha.addEventListener("submit", function (evento) {
        evento.preventDefault()

        // Sobrescreve os campos do personagem, mantendo o mesmo id
        personagem.nome = document.getElementById("nome").value
        personagem.raca = document.getElementById("raca").value
        personagem.subraca = document.getElementById("subraca").value
        personagem.classe = document.getElementById("classe").value
        personagem.subclasse = document.getElementById("subclasse").value
        personagem.nivel = Number(document.getElementById("nivel").value)
        personagem.antecedente = document.getElementById("antecedente").value
        personagem.alinhamento = document.getElementById("alinhamento").value
        personagem.forca = Number(document.getElementById("forca").value)
        personagem.destreza = Number(document.getElementById("destreza").value)
        personagem.constituicao = Number(document.getElementById("constituicao").value)
        personagem.inteligencia = Number(document.getElementById("inteligencia").value)
        personagem.sabedoria = Number(document.getElementById("sabedoria").value)
        personagem.carisma = Number(document.getElementById("carisma").value)

        localStorage.setItem("fichas", JSON.stringify(personagens))

        window.location.href = "index.html"
    })
}
