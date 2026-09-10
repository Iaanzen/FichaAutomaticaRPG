// As tabelas de regras e os calculos vivem em regras.js, compartilhado com o cadastro.

const formFicha = document.getElementById("form-ficha")
const mensagemErroEl = document.getElementById("mensagem-erro")
const statusBonusEL = document.getElementById("status-bonus")

const nivelEL = document.getElementById("nivel")
const classeEL = document.getElementById("classe")
const subclasseEL = document.getElementById("subclasse")
const blocoSubclasseEL = document.getElementById("bloco-subclasse")
const racaEL = document.getElementById("raca")
const subracaEL = document.getElementById("subraca")

// Descobre qual personagem abrir pelo "?id=" da URL
const parametros = new URLSearchParams(window.location.search)
const idDaUrl = Number(parametros.get("id"))

const personagens = JSON.parse(localStorage.getItem("fichas")) || []

const personagem = personagens.find(function (item) {
    return item.id === idDaUrl
})

/* ---------- Sub-raça ---------- */

function atualizarSubracas(valorSelecionado) {
    const subracasLista = subracasPorRaca[racaEL.value] || []
    preencherSelect(subracaEL, subracasLista, valorSelecionado)
}

racaEL.addEventListener("change", function () {
    atualizarSubracas("")
})

/* ---------- Subclasse (só a partir do nível 3) ---------- */

function atualizarSubclasse(valorSelecionado) {
    const nivel = Number(nivelEL.value)
    const subclassesLista = subclassesPorClasse[classeEL.value] || []

    const podeEscolher = nivel >= NIVEL_SUBCLASSE && subclassesLista.length > 0
    blocoSubclasseEL.hidden = !podeEscolher

    // so eh obrigatoria enquanto visivel: campo escondido e required trava o envio
    subclasseEL.required = podeEscolher

    if (!podeEscolher) {
        subclasseEL.value = ""
        return
    }

    preencherSelect(subclasseEL, subclassesLista, valorSelecionado)
}

nivelEL.addEventListener("input", function () {
    // mantem a subclasse atual se ela ainda for valida pra classe escolhida
    atualizarSubclasse(subclasseEL.value)
})

classeEL.addEventListener("change", function () {
    // classe nova, subclasse antiga nao vale mais
    atualizarSubclasse("")
})

/* ---------- Bônus do antecedente ---------- */

function lerBonus() {
    const bonus = {}

    ATRIBUTOS.forEach(function (atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        bonus[atributo] = Number(selectEL.value)
    })

    return bonus
}

function escreverBonus(bonusSalvo) {
    const bonus = bonusSalvo || {}

    ATRIBUTOS.forEach(function (atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        selectEL.value = String(bonus[atributo] || 0)
    })
}

function bonusValido() {
    return distribuicaoBonusValida(lerBonus())
}

function mostrarStatusBonus() {
    if (bonusValido()) {
        statusBonusEL.textContent = "Distribuição válida."
        statusBonusEL.className = "status-bonus status-ok"
        return
    }

    statusBonusEL.textContent =
        "Escolha +2 num atributo e +1 em outro, ou +1 em três atributos diferentes."
    statusBonusEL.className = "status-bonus status-erro"
}

// com a distribuicao fechada, quem ficou sem bonus trava.
// quem ja tem bonus continua liberado: eh por ali que o jogador desfaz a escolha.
function atualizarTravaBonus() {
    const bonus = lerBonus()
    const distribuicaoFechada = bonusValido()

    ATRIBUTOS.forEach(function (atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        selectEL.disabled = distribuicaoFechada && bonus[atributo] === 0
    })
}

/* ---------- RF07: modificadores ---------- */

function calcularAtributos() {
    const bonus = lerBonus()
    const totais = {}
    const modificadores = {}

    ATRIBUTOS.forEach(function (atributo) {
        const base = Number(document.getElementById(atributo).value)
        totais[atributo] = base + bonus[atributo]
        modificadores[atributo] = modificadorDe(totais[atributo])
    })

    return { totais: totais, modificadores: modificadores }
}

function atualizarModificadores() {
    const calculo = calcularAtributos()

    ATRIBUTOS.forEach(function (atributo) {
        document.getElementById(`total-${atributo}`).textContent =
            `Total ${calculo.totais[atributo]}`
        document.getElementById(`mod-${atributo}`).textContent =
            formatarModificador(calculo.modificadores[atributo])
    })
}

ATRIBUTOS.forEach(function (atributo) {
    document
        .getElementById(atributo)
        .addEventListener("input", atualizarModificadores)

    document
        .getElementById(`bonus-${atributo}`)
        .addEventListener("change", function () {
            mostrarStatusBonus()
            atualizarTravaBonus()
            atualizarModificadores()
        })
})

/* ---------- Carregar e salvar ---------- */

if (!personagem) {
    formFicha.style.display = "none"
    mensagemErroEl.style.display = "block"
} else {
    document.title = personagem.nome + " - Ficha"

    document.getElementById("nome").value = personagem.nome
    document.getElementById("nivel").value = personagem.nivel
    document.getElementById("classe").value = personagem.classe
    document.getElementById("raca").value = personagem.raca
    document.getElementById("antecedente").value = personagem.antecedente
    document.getElementById("alinhamento").value = personagem.alinhamento

    ATRIBUTOS.forEach(function (atributo) {
        document.getElementById(atributo).value = personagem[atributo]
    })

    // os selects dependentes so podem ser preenchidos depois de classe/raca
    atualizarSubracas(personagem.subraca)
    atualizarSubclasse(personagem.subclasse)

    escreverBonus(personagem.bonusAntecedente)
    mostrarStatusBonus()
    atualizarTravaBonus()
    atualizarModificadores()

    formFicha.addEventListener("submit", function (evento) {
        evento.preventDefault()

        if (!bonusValido()) {
            mostrarStatusBonus()
            return
        }

        // Sobrescreve os campos do personagem, mantendo o mesmo id
        personagem.nome = document.getElementById("nome").value
        personagem.raca = racaEL.value
        personagem.subraca = subracaEL.value
        personagem.classe = classeEL.value
        personagem.subclasse = subclasseEL.value
        personagem.nivel = Number(nivelEL.value)
        personagem.antecedente = document.getElementById("antecedente").value
        personagem.alinhamento = document.getElementById("alinhamento").value

        ATRIBUTOS.forEach(function (atributo) {
            personagem[atributo] = Number(document.getElementById(atributo).value)
        })

        // recalcula em vez de reaproveitar o que estava salvo
        const calculo = calcularAtributos()
        personagem.bonusAntecedente = lerBonus()
        personagem.atributosTotais = calculo.totais
        personagem.modificadores = calculo.modificadores

        localStorage.setItem("fichas", JSON.stringify(personagens))

        window.location.href = "index.html"
    })
}
