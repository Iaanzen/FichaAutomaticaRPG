const formFicha = document.getElementById("form-personagem");

const bonusPorRaca = {
    humano: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1 },
    anao: { constituicao: 2 },
    elfo: { destreza: 2 },
    halfling: { destreza: 2 },
    draconato: { forca: 2, carisma: 1 },
    gnomo: { inteligencia: 2 },
    meioelfo: { carisma: 2 },
    meioorc: { forca: 2, constituicao: 1 },
    tiefling: { carisma: 2, inteligencia: 1 }
}

const bonusPorSubRaca = {
    anaoMontanha: {forca: 2},
    anaoColina: {sabedoria: 1},
    elfoAlto: {inteligencia: 1},
    elfoFloresta: {sabedoria: 1},
    elfoNegro: {carisma: 1},
    halflingPesLeves: {carisma: 1},
    halflingRobusto: {constituicao: 1},
    gnomoFloresta: {inteligencia: 2, destreza: 1},
    gnomoRocha: {inteligencia: 2, constituicao: 1}
}

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
    ], 
};

const racaEL = document.getElementById("raca")
const subracaEL = document.getElementById("subraca")

racaEL.addEventListener("change", function() {
    const racaEscolha = racaEL.value

    subracaEL.innerHTML = ""
    const subracasLista = subracasPorRaca[racaEscolha] || []

    subracasLista.forEach(function(subracaItem){
        const opcao = document.createElement("option");
        opcao.value = subracaItem.valor
        opcao.textContent = subracaItem.nome
        subracaEL.appendChild(opcao)
    })

})

formFicha.addEventListener('submit', function (evento) {
    evento.preventDefault()

    const nome = document.getElementById("nome").value
    const raca = document.getElementById("raca").value
    const subraca = document.getElementById("subraca").value
    const classe = document.getElementById("classe").value
    const subclasse = document.getElementById("subclasse").value
    const nivel = Number(document.getElementById("nivel").value)
    const antecedente = document.getElementById("antecedente").value
    const alinhamento = document.getElementById("alinhamento").value
    const forca = Number(document.getElementById("forca").value)
    const destreza = Number(document.getElementById("destreza").value)
    const inteligencia = Number(document.getElementById("inteligencia").value)
    const constituicao = Number(document.getElementById("constituicao").value)
    const sabedoria = Number(document.getElementById("sabedoria").value)
    const carisma = Number(document.getElementById("carisma").value)

    const listaFichas = {
        nome: nome,
        raca: raca,
        subraca: subraca,
        classe: classe,
        subclasse: subclasse,
        nivel: nivel,
        antecedente: antecedente,
        alinhamento: alinhamento,
        forca: forca,
        destreza: destreza,
        inteligencia: inteligencia,
        constituicao: constituicao,
        sabedoria: sabedoria,
        carisma: carisma,
        id: Date.now()
    }





    const personagens = JSON.parse(localStorage.getItem("fichas")) || [];
    personagens.push(listaFichas);
    localStorage.setItem("fichas", JSON.stringify(personagens));

    window.location.href = "index.html"
})