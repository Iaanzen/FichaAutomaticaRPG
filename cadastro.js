const formFicha = document.getElementById("form-personagem");


// As tabelas de regras (subracas, subclasses, ATRIBUTOS, NIVEL_SUBCLASSE) e os
// calculos de modificador vivem em regras.js, compartilhado com a ficha.

const TOTAL_ETAPAS = 8

// etapa onde o jogador distribui os bonus do antecedente
const ETAPA_BONUS = 5

const btnProximo = document.getElementById("btn-proximo")
const btnSalvar = document.getElementById("btn-salvar")

// guarda qual etapa o Proximo vai liberar no proximo clique
let proximaEtapa = 2

// a etapa de bonus tem regra propria; as outras usam a validacao nativa do HTML
function etapaValida(numeroEtapa) {
    if (numeroEtapa === ETAPA_BONUS) {
        mostrarStatusBonus()
        return bonusValido()
    }

    const etapa = document.getElementById(`etapa-${numeroEtapa}`)
    if (etapa === null) {
        return false
    }

    const campos = etapa.querySelectorAll("input, select")

    for (const campo of campos) {
        if (!campo.checkValidity()) {
            // mostra o balaozinho nativo do navegador e foca o campo
            campo.reportValidity()
            return false
        }
    }

    return true
}

// leva o cursor pro primeiro campo utilizavel da etapa recem liberada
function focarPrimeiroCampo(etapa) {
    const campos = etapa.querySelectorAll("input, select")

    for (const campo of campos) {
        // offsetParent nulo = campo escondido na tela (ex: subclasse antes do nivel 3)
        if (!campo.disabled && campo.offsetParent !== null) {
            campo.scrollIntoView({ block: "center", behavior: "smooth" })
            // o scroll acima ja posiciona; sem isso o foco daria um segundo pulo
            campo.focus({ preventScroll: true })
            return
        }
    }
}

btnProximo.addEventListener("click", function() {
    // a etapa que o jogador esta deixando eh a ultima ja liberada
    const etapaAtual = proximaEtapa - 1
    if (!etapaValida(etapaAtual)) {
        return
    }

    const etapa = document.getElementById(`etapa-${proximaEtapa}`)
    if (etapa === null) {
        return
    }

    etapa.disabled = false
    focarPrimeiroCampo(etapa)
    proximaEtapa++

    // passou da ultima etapa: nao ha mais o que liberar, libera o salvar
    if (proximaEtapa > TOTAL_ETAPAS) {
        btnProximo.disabled = true
        btnSalvar.disabled = false
    }
})

// Enter avança a etapa em vez de enviar o formulario
formFicha.addEventListener("keydown", function(evento) {
    if (evento.key !== "Enter") {
        return
    }

    // em textarea o Enter serve pra quebrar linha
    if (evento.target.tagName === "TEXTAREA") {
        return
    }

    evento.preventDefault()

    if (!btnProximo.disabled) {
        // reaproveita o mesmo caminho do clique: validacao inclusa
        btnProximo.click()
        return
    }

    // wizard terminado: ai sim o Enter salva
    if (!btnSalvar.disabled) {
        formFicha.requestSubmit()
    }
})

const statusBonusEL = document.getElementById("status-bonus")

// le os seis selects e devolve { forca: 2, destreza: 1, ... }
function lerBonus() {
    const bonus = {}

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        bonus[atributo] = Number(selectEL.value)
    })

    return bonus
}

// a regra em si vive em regras.js; aqui so lemos a tela e perguntamos
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

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        selectEL.disabled = distribuicaoFechada && bonus[atributo] === 0
    })
}

ATRIBUTOS.forEach(function(atributo) {
    const selectEL = document.getElementById(`bonus-${atributo}`)

    selectEL.addEventListener("change", function() {
        mostrarStatusBonus()
        atualizarTravaBonus()
        // o bonus entra na conta do modificador, entao a etapa 7 muda junto
        atualizarModificadores()
    })
})

/* ---------- RF07: modificadores ---------- */
// modificadorDe e formatarModificador vem de regras.js

// junta valor base + bonus do antecedente e devolve totais e modificadores
function calcularAtributos() {
    const bonus = lerBonus()
    const totais = {}
    const modificadores = {}

    ATRIBUTOS.forEach(function(atributo) {
        const base = Number(document.getElementById(atributo).value)
        totais[atributo] = base + bonus[atributo]
        modificadores[atributo] = modificadorDe(totais[atributo])
    })

    return { totais: totais, modificadores: modificadores }
}

function atualizarModificadores() {
    const calculo = calcularAtributos()

    ATRIBUTOS.forEach(function(atributo) {
        const totalEL = document.getElementById(`total-${atributo}`)
        const modEL = document.getElementById(`mod-${atributo}`)

        totalEL.textContent = `Total ${calculo.totais[atributo]}`
        modEL.textContent = formatarModificador(calculo.modificadores[atributo])
    })
}

ATRIBUTOS.forEach(function(atributo) {
    const inputEL = document.getElementById(atributo)
    inputEL.addEventListener("input", atualizarModificadores)
})

atualizarModificadores()

const nivelEL = document.getElementById("nivel")
const classeEL = document.getElementById("classe")
const subclasseEL = document.getElementById("subclasse")
const blocoSubclasseEL = document.getElementById("bloco-subclasse")

function atualizarSubclasse() {
    const nivel = Number(nivelEL.value)
    const classeEscolha = classeEL.value
    const subclassesLista = subclassesPorClasse[classeEscolha] || []

    // so aparece a partir do nivel 3 e se a classe ja tiver sido escolhida
    const podeEscolher = nivel >= NIVEL_SUBCLASSE && subclassesLista.length > 0
    blocoSubclasseEL.hidden = !podeEscolher

    // so eh obrigatoria enquanto visivel: campo escondido e required trava o envio
    subclasseEL.required = podeEscolher

    if (!podeEscolher) {
        // some da tela e some do dado: ninguem salva subclasse que nao escolheu
        subclasseEL.value = ""
        return
    }

    subclasseEL.innerHTML = ""

    const opcaoVazia = document.createElement("option")
    opcaoVazia.value = ""
    opcaoVazia.textContent = "Selecione..."
    subclasseEL.appendChild(opcaoVazia)

    subclassesLista.forEach(function(subclasseItem) {
        const opcao = document.createElement("option")
        opcao.value = subclasseItem.valor
        opcao.textContent = subclasseItem.nome
        subclasseEL.appendChild(opcao)
    })
}

nivelEL.addEventListener("input", atualizarSubclasse)
classeEL.addEventListener("change", atualizarSubclasse)
atualizarSubclasse()

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

    const calculo = calcularAtributos()

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
        bonusAntecedente: lerBonus(),
        // os seis campos acima guardam o valor base; abaixo o resultado da conta
        atributosTotais: calculo.totais,
        modificadores: calculo.modificadores,
        id: Date.now()
    }


    const personagens = JSON.parse(localStorage.getItem("fichas")) || [];
    personagens.push(listaFichas);
    localStorage.setItem("fichas", JSON.stringify(personagens));

    window.location.href = "index.html"
})