const formFicha = document.getElementById("form-personagem");


// As tabelas de regras vivem em regras.js.
// Bonus, modificadores e pericias vivem em ficha-comum.js.
// Este arquivo cuida so do que eh do wizard.

const TOTAL_ETAPAS = 9

// etapas com regra propria de validacao
const ETAPA_BONUS = 5
const ETAPA_PERICIAS = 8

const btnProximo = document.getElementById("btn-proximo")
const btnSalvar = document.getElementById("btn-salvar")

// guarda qual etapa o Proximo vai liberar no proximo clique
let proximaEtapa = 2

// bonus e pericias tem regra propria; as outras usam a validacao nativa do HTML
function etapaValida(numeroEtapa) {
    if (numeroEtapa === ETAPA_BONUS) {
        mostrarStatusBonus()
        return bonusValido()
    }

    if (numeroEtapa === ETAPA_PERICIAS) {
        atualizarPericias()
        return periciasCompletas()
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

/* ---------- Array padrão: 15, 14, 13, 12, 10, 8 ---------- */

const statusArrayEL = document.getElementById("status-array")

// valores do array que ja foram colocados em algum atributo
function valoresUsados() {
    const usados = []

    ATRIBUTOS.forEach(function(atributo) {
        const valor = document.getElementById(atributo).value

        if (valor !== "") {
            usados.push(valor)
        }
    })

    return usados
}

// cada valor so pode aparecer uma vez: desabilita nos outros selects o que ja foi usado
function atualizarArrayPadrao() {
    const usados = valoresUsados()

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(atributo)

        Array.from(selectEL.options).forEach(function(opcao) {
            if (opcao.value === "") {
                return
            }

            // o proprio valor escolhido continua liberado, senao ele sumiria do select
            opcao.disabled = opcao.value !== selectEL.value && usados.includes(opcao.value)
        })
    })

    const faltam = ARRAY_PADRAO.length - usados.length

    if (faltam === 0) {
        statusArrayEL.textContent = "Array distribuído."
        statusArrayEL.className = "status-array status-ok"
        return
    }

    statusArrayEL.textContent = `Faltam ${faltam} de ${ARRAY_PADRAO.length} valores para distribuir.`
    statusArrayEL.className = "status-array status-erro"
}

ATRIBUTOS.forEach(function(atributo) {
    document
        .getElementById(atributo)
        .addEventListener("change", atualizarArrayPadrao)
})

atualizarArrayPadrao()

// nivelEL e classeEL vem de ficha-comum.js
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
        pericias: lerPericias(),
        bonusProficiencia: bonusDeProficiencia(nivel),
        // derivado da classe, mas salvo pra ficha poder ser lida sem recalcular
        salvaguardas: salvaguardasDaClasse(classe),
        id: Date.now()
    }


    const personagens = JSON.parse(localStorage.getItem("fichas")) || [];
    personagens.push(listaFichas);
    localStorage.setItem("fichas", JSON.stringify(personagens));

    window.location.href = "index.html"
})