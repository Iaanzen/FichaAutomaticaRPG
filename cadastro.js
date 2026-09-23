const formFicha = document.getElementById("form-personagem");

// sem conta, a guarda manda para o login
Auth.protegerPagina()


// As tabelas de regras vivem em regras.js.
// Bonus, modificadores e pericias vivem em ficha-comum.js.
// Este arquivo cuida so do que eh do wizard.

const TOTAL_ETAPAS = 8

// etapas com regra propria de validacao
const ETAPA_BONUS = 4
const ETAPA_PERICIAS = 7

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
        // offsetParent nulo = campo escondido na tela
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
    esconderAvisoEtapa()
    focarPrimeiroCampo(etapa)
    proximaEtapa++

    // passou da ultima etapa: nao ha mais o que liberar, libera o salvar
    if (proximaEtapa > TOTAL_ETAPAS) {
        btnProximo.disabled = true
        btnSalvar.disabled = false
    }
})

/* ---------- IDEIA07: aviso para avançar ---------- */

const avisoEtapaEL = document.getElementById("aviso-etapa")

// quanto tempo o aviso fica na tela
const TEMPO_AVISO_MS = 4000

// cada etapa avisa uma vez só, para não piscar a cada tecla
let etapaAvisada = 0
let timerAviso = null

// mesma regra de etapaValida, mas sem balões nem mensagens: só responde
function etapaCompleta(numeroEtapa) {
    if (numeroEtapa === ETAPA_BONUS) {
        return bonusValido()
    }

    if (numeroEtapa === ETAPA_PERICIAS) {
        return periciasCompletas()
    }

    const etapa = document.getElementById(`etapa-${numeroEtapa}`)

    if (etapa === null) {
        return false
    }

    return Array.from(etapa.querySelectorAll("input, select")).every(function(campo) {
        return campo.checkValidity()
    })
}

function esconderAvisoEtapa() {
    clearTimeout(timerAviso)
    avisoEtapaEL.hidden = true
}

function mostrarAvisoEtapa(texto) {
    avisoEtapaEL.textContent = texto
    avisoEtapaEL.hidden = false

    clearTimeout(timerAviso)
    timerAviso = setTimeout(esconderAvisoEtapa, TEMPO_AVISO_MS)
}

function verificarEtapaCompleta() {
    const etapaAtual = proximaEtapa - 1

    if (etapaAvisada === etapaAtual || !etapaCompleta(etapaAtual)) {
        return
    }

    etapaAvisada = etapaAtual

    // depois da última etapa não há Próximo: o que resta é salvar
    const ultima = proximaEtapa > TOTAL_ETAPAS

    mostrarAvisoEtapa(
        ultima
            ? "Tudo pronto! Aperte Salvar Personagem ou Enter para criar a ficha."
            : "Etapa completa! Aperte Próximo ou Enter para continuar."
    )
}

// os campos atualizam o estado primeiro; o evento chega no formulário depois
formFicha.addEventListener("input", verificarEtapaCompleta)
formFicha.addEventListener("change", verificarEtapaCompleta)

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

// racaEL e subracaEL vem de ficha-comum.js

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

    // a sub-raca acabou de mudar de valor; a previa precisa ser refeita depois disso
    atualizarRaca()
})

formFicha.addEventListener('submit', function (evento) {
    evento.preventDefault()

    const nome = document.getElementById("nome").value
    const raca = document.getElementById("raca").value
    const subraca = document.getElementById("subraca").value
    const classe = document.getElementById("classe").value
    // todo personagem nasce no nível 1, ainda sem subclasse (ela vem no nível 3,
    // pela tela de level up)
    const subclasse = ""
    const nivel = 1
    const antecedente = document.getElementById("antecedente").value
    const alinhamento = document.getElementById("alinhamento").value
    const forca = Number(document.getElementById("forca").value)
    const destreza = Number(document.getElementById("destreza").value)
    const inteligencia = Number(document.getElementById("inteligencia").value)
    const constituicao = Number(document.getElementById("constituicao").value)
    const sabedoria = Number(document.getElementById("sabedoria").value)
    const carisma = Number(document.getElementById("carisma").value)

    const calculo = calcularAtributos()
    const dadosRaca = dadosDaRaca(raca, subraca)
    const pvMaximo = pontosDeVida(classe, nivel, calculo.modificadores.constituicao)

    const listaFichas = {
        nome: nome,
        raca: raca,
        subraca: subraca,
        classe: classe,
        subclasse: subclasse,
        nivel: nivel,
        // multiclasse: a lista de classes começa com a classe inicial no nível 1;
        // classe/nivel/subclasse acima ficam como espelho dela
        classes: [{ classe: classe, nivel: nivel, subclasse: subclasse }],
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
        // derivados de classe e raça, mas salvos pra ficha ser lida sem recalcular
        salvaguardas: salvaguardasDaClasse(classe, nivel),
        deslocamento: dadosRaca ? dadosRaca.deslocamento : null,
        tracos: dadosRaca ? dadosRaca.tracos : [],
        idiomas: dadosRaca ? dadosRaca.idiomas : [],
        pvMaximo: pvMaximo,
        // personagem novo comeca com a vida cheia
        pvAtual: pvMaximo,
        pvTemporario: 0,
        dadosVidaGastos: 0,
        sucessosMorte: 0,
        falhasMorte: 0,
        id: Armazenamento.novoId()
    }

    // o armazenamento responde com espera: só sai da página depois de gravar
    Armazenamento.gravarFicha(listaFichas).then(function () {
        window.location.href = "index.html"
    })
})