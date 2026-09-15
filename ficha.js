// As tabelas de regras vivem em regras.js.
// Bonus, modificadores e pericias vivem em ficha-comum.js.
// Este arquivo cuida so de carregar e salvar um personagem existente.

const formFicha = document.getElementById("form-ficha")
const mensagemErroEl = document.getElementById("mensagem-erro")

// nivelEL e classeEL vem de ficha-comum.js
const subclasseEL = document.getElementById("subclasse")
const blocoSubclasseEL = document.getElementById("bloco-subclasse")
// racaEL e subracaEL vem de ficha-comum.js

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

    // a sub-raca acabou de mudar de valor; deslocamento e traços dependem dela
    atualizarRaca()
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

/* ---------- RF23, RF42 a RF44: descanso ---------- */

const pvAtualEL = document.getElementById("pv-atual")
const pvTemporarioEL = document.getElementById("pv-temporario")
const painelDescansoEL = document.getElementById("painel-descanso")
const tituloDescansoEL = document.getElementById("titulo-descanso")
const resultadoDescansoEL = document.getElementById("resultado-descanso")
const pendenciasDescansoEL = document.getElementById("pendencias-descanso")
const acaoDadosVidaEL = document.getElementById("acao-dados-vida")
const acaoDescansoLongoEL = document.getElementById("acao-descanso-longo")
const dadosDisponiveisEL = document.getElementById("dados-disponiveis")
const btnGastarDadoEL = document.getElementById("btn-gastar-dado")
const acaoPactoEL = document.getElementById("acao-pacto")

// quantos dados de vida ja foram gastos desde o ultimo descanso longo
let dadosVidaGastos = 0

function dadosVidaTotais() {
    return Number(nivelEL.value)
}

function dadosVidaDisponiveis() {
    return dadosVidaTotais() - dadosVidaGastos
}

function definirPvAtual(valor) {
    const maximo = calcularPvMaximo()
    // nunca passa do maximo nem fica negativo
    pvAtualEL.value = Math.min(maximo, Math.max(0, valor))

    // mexer nos PV liga ou desliga os testes de morte
    atualizarTestesDeMorte()

    // cura mudou o PV por código: sem isso o próximo dano seria calculado errado
    lembrarPv()
}

function atualizarDadosDeVida() {
    dadosDisponiveisEL.textContent =
        `${dadosVidaDisponiveis()} de ${dadosVidaTotais()} disponíveis`

    btnGastarDadoEL.disabled = dadosVidaDisponiveis() <= 0
}

// RF23: gastar um dado de vida recupera 1 dado + modificador de Constituição
function gastarDadoDeVida() {
    if (dadosVidaDisponiveis() <= 0) {
        return
    }

    const dado = dadoDeVidaPorClasse[classeEL.value]
    const modificador = calcularAtributos().modificadores.constituicao
    const rolagem = rolarDado(dado)

    // uma Constituição negativa nunca tira PV de quem está descansando
    const recuperado = Math.max(0, rolagem + modificador)

    dadosVidaGastos++
    definirPvAtual(Number(pvAtualEL.value) + recuperado)
    atualizarDadosDeVida()

    resultadoDescansoEL.textContent =
        `Rolou ${rolagem} no d${dado} ${formatarModificador(modificador)} = ${recuperado} PV recuperados.`
}

// RF27: espaços de magia voltam ao total; atualizarEspacosDeMagia fica mais abaixo
function recuperarEspacosDeMagia() {
    espacosGastos = {}
    atualizarEspacosDeMagia()
}

// RF27: Bruxo recupera a Magia de Pacto ao fim do descanso curto
function recuperarEspacosDePacto() {
    recuperarEspacosDeMagia()
    resultadoDescansoEL.textContent = "Espaços de Pacto recuperados."
}

// RF23: descanso longo devolve tudo, inclusive todos os dados de vida (regra 2024)
function concluirDescansoLongo() {
    const devolvidos = dadosVidaGastos
    const conjura = conjuracaoDaClasse(classeEL.value) !== null

    definirPvAtual(calcularPvMaximo())
    pvTemporarioEL.value = 0
    lembrarPv()
    dadosVidaGastos = 0

    atualizarDadosDeVida()

    // RF27: no descanso longo toda classe conjuradora recupera os espaços
    if (conjura) {
        recuperarEspacosDeMagia()
    }

    const espacos = conjura ? ", espaços de magia recuperados" : ""

    resultadoDescansoEL.textContent =
        `PV no máximo, temporários zerados${espacos} e ${devolvidos} dado(s) de vida recuperado(s).`
}

// RF42, RF43: o modo destaca o que dá pra fazer naquele descanso
function entrarNoDescanso(tipo) {
    painelDescansoEL.hidden = false
    resultadoDescansoEL.textContent = ""

    const curto = tipo === "curto"

    tituloDescansoEL.textContent = curto
        ? "Modo Descanso Curto — 1 hora"
        : "Modo Descanso Longo — 8 horas"

    acaoDadosVidaEL.hidden = !curto
    acaoDescansoLongoEL.hidden = curto
    acaoPactoEL.hidden = !(curto && recuperaMagiaEmDescansoCurto(classeEL.value))

    // o que ainda não existe no app, mas o jogador precisa lembrar na mesa
    const pendencias = []

    if (curto) {
        pendencias.push("Recursos de classe que voltam em descanso curto (Sprint 6).")
    } else {
        if (conjuracaoDaClasse(classeEL.value) !== null) {
            pendencias.push("Troca de magias preparadas (Sprint 5b).")
        }
        pendencias.push("Recursos de classe são zerados (Sprint 6).")
    }

    preencherLista(pendenciasDescansoEL, pendencias, "")
    atualizarDadosDeVida()
}

// RF44: fora do modo, a ficha funciona normalmente
function sairDoDescanso() {
    painelDescansoEL.hidden = true
    resultadoDescansoEL.textContent = ""
}

document
    .getElementById("btn-descanso-curto")
    .addEventListener("click", function () {
        entrarNoDescanso("curto")
    })

document
    .getElementById("btn-descanso-longo")
    .addEventListener("click", function () {
        entrarNoDescanso("longo")
    })

btnGastarDadoEL.addEventListener("click", gastarDadoDeVida)

document
    .getElementById("btn-recuperar-pacto")
    .addEventListener("click", recuperarEspacosDePacto)

document
    .getElementById("btn-concluir-longo")
    .addEventListener("click", concluirDescansoLongo)

document
    .getElementById("btn-sair-descanso")
    .addEventListener("click", sairDoDescanso)

// subir de nível muda o total de dados de vida
nivelEL.addEventListener("input", atualizarDadosDeVida)

/* ---------- RF24: testes de morte ---------- */

const blocoMortesEL = document.getElementById("bloco-mortes")
const sucessosMorteEL = document.getElementById("sucessos-morte")
const falhasMorteEL = document.getElementById("falhas-morte")
const statusMorteEL = document.getElementById("status-morte")
const btnRolarMorteEL = document.getElementById("btn-rolar-morte")

let sucessosMorte = 0
let falhasMorte = 0

function estaCaido() {
    return Number(pvAtualEL.value) === 0
}

// monta uma linha de circulos; clicar marca ou desmarca.
// Serve para testes de morte e para espacos de magia.
function montarCirculos(containerEL, total, marcados, bloqueado, aoClicar) {
    containerEL.innerHTML = ""

    for (let posicao = 1; posicao <= total; posicao++) {
        const circulo = document.createElement("button")
        circulo.type = "button"
        circulo.className = "circulo"
        circulo.disabled = bloqueado

        if (posicao <= marcados) {
            circulo.classList.add("circulo-cheio")
        }

        // clicar no que ja esta marcado desmarca ate ali
        circulo.addEventListener("click", function () {
            aoClicar(posicao === marcados ? posicao - 1 : posicao)
        })

        containerEL.appendChild(circulo)
    }
}

function atualizarTestesDeMorte() {
    const caido = estaCaido()

    // fora do estado de 0 PV os testes nem existem
    if (!caido) {
        sucessosMorte = 0
        falhasMorte = 0
    }

    blocoMortesEL.classList.toggle("bloco-vazio", !caido)
    btnRolarMorteEL.disabled = !caido

    montarCirculos(sucessosMorteEL, TESTES_DE_MORTE, sucessosMorte, !caido, function (novo) {
        sucessosMorte = novo
        atualizarTestesDeMorte()
    })

    montarCirculos(falhasMorteEL, TESTES_DE_MORTE, falhasMorte, !caido, function (novo) {
        falhasMorte = novo
        atualizarTestesDeMorte()
    })

    if (!caido) {
        statusMorteEL.textContent = "Só entra em jogo com 0 PV."
        statusMorteEL.className = "morte-status"
        return
    }

    if (sucessosMorte >= TESTES_DE_MORTE) {
        statusMorteEL.textContent = "Estabilizado."
        statusMorteEL.className = "morte-status status-ok"
        return
    }

    if (falhasMorte >= TESTES_DE_MORTE) {
        statusMorteEL.textContent = "Morreu."
        statusMorteEL.className = "morte-status status-erro"
        return
    }

    statusMorteEL.textContent = "Role no início de cada turno."
    statusMorteEL.className = "morte-status"
}

function rolarTesteDeMorte() {
    if (!estaCaido()) {
        return
    }

    const rolagem = rolarDado(20)
    const resultado = resultadoTesteDeMorte(rolagem)

    if (resultado.tipo === "revive") {
        // 20 natural: volta com 1 PV e os testes somem junto
        definirPvAtual(1)
        atualizarTestesDeMorte()
        statusMorteEL.textContent = "20 natural: voltou com 1 PV."
        statusMorteEL.className = "morte-status status-ok"
        return
    }

    sucessosMorte = Math.min(TESTES_DE_MORTE, sucessosMorte + resultado.sucessos)
    falhasMorte = Math.min(TESTES_DE_MORTE, falhasMorte + resultado.falhas)

    atualizarTestesDeMorte()

    const descricao = resultado.tipo === "sucesso" ? "sucesso" : "falha"
    const dobrada = rolagem === 1 ? " (1 natural conta duas)" : ""

    statusMorteEL.textContent = `Rolou ${rolagem}: ${descricao}${dobrada}.`
}

btnRolarMorteEL.addEventListener("click", rolarTesteDeMorte)

// o bloco só vale a 0 PV, então acompanha qualquer mudança nos PV atuais
pvAtualEL.addEventListener("input", atualizarTestesDeMorte)

/* ---------- Sprint 5a: espaços de magia (RF25, RF27) ---------- */

const listaEspacosEL = document.getElementById("lista-espacos")

// quantos espacos de cada circulo ja foram gastos: { "1": 2, "3": 1 }
let espacosGastos = {}

// o que foi marcado, limitado ao que a classe e o nivel atuais permitem
function espacosGastosValidos() {
    const validos = {}

    espacosDeMagia(classeEL.value, Number(nivelEL.value)).forEach(function (espaco) {
        validos[espaco.circulo] = Math.min(espacosGastos[espaco.circulo] || 0, espaco.total)
    })

    return validos
}

function atualizarEspacosDeMagia() {
    const espacos = espacosDeMagia(classeEL.value, Number(nivelEL.value))
    const conjuracao = conjuracaoDaClasse(classeEL.value)
    const gastos = espacosGastosValidos()

    listaEspacosEL.innerHTML = ""

    if (espacos.length === 0) {
        return
    }

    const ajuda = document.createElement("p")
    ajuda.className = "descanso-ajuda"
    ajuda.textContent = "Espaços de magia: marque os que já foram gastos."
    listaEspacosEL.appendChild(ajuda)

    espacos.forEach(function (espaco) {
        const linha = document.createElement("div")
        linha.className = "linha-espaco"

        const rotulo = document.createElement("span")
        rotulo.className = "espaco-rotulo"
        rotulo.textContent = conjuracao.tipo === "pacto"
            ? `${espaco.circulo}º círculo (Pacto)`
            : `${espaco.circulo}º círculo`

        const circulosEL = document.createElement("div")
        circulosEL.className = "espaco-circulos"

        montarCirculos(circulosEL, espaco.total, gastos[espaco.circulo], false, function (novo) {
            espacosGastos[espaco.circulo] = novo
            atualizarEspacosDeMagia()
        })

        const restantes = document.createElement("span")
        restantes.className = "espaco-restantes"
        restantes.textContent = `${espaco.total - gastos[espaco.circulo]} de ${espaco.total}`

        linha.appendChild(rotulo)
        linha.appendChild(circulosEL)
        linha.appendChild(restantes)
        listaEspacosEL.appendChild(linha)
    })
}

// trocar de classe muda a tabela de espacos (ou tira ela)
classeEL.addEventListener("change", atualizarEspacosDeMagia)

/* ---------- Sprint 5a: concentração (RF28) ---------- */

const blocoConcentracaoEL = document.getElementById("bloco-concentracao")
const magiaConcentracaoEL = document.getElementById("magia-concentracao")
const concentracaoAtivaEL = document.getElementById("concentracao-ativa")
const statusConcentracaoEL = document.getElementById("status-concentracao")
const btnConcentrarEL = document.getElementById("btn-concentrar")
const btnEncerrarConcentracaoEL = document.getElementById("btn-encerrar-concentracao")

// nome da magia; vazio = sem concentração. No 5b passa a ser uma das magias equipadas.
let concentracaoAtual = ""

function atualizarConcentracao(mensagem) {
    blocoConcentracaoEL.hidden = conjuracaoDaClasse(classeEL.value) === null

    const ativa = concentracaoAtual !== ""

    concentracaoAtivaEL.textContent = ativa
        ? `Concentrando em: ${concentracaoAtual}`
        : "Nenhuma magia de concentração ativa."
    concentracaoAtivaEL.classList.toggle("concentracao-ligada", ativa)

    btnConcentrarEL.textContent = ativa ? "Trocar" : "Concentrar"
    btnEncerrarConcentracaoEL.disabled = !ativa
    statusConcentracaoEL.textContent = mensagem || ""
}

// RF28: só uma por vez; começar outra encerra a anterior, com aviso
function concentrar() {
    const magia = magiaConcentracaoEL.value.trim()

    if (magia === "") {
        atualizarConcentracao("Digite o nome da magia.")
        magiaConcentracaoEL.focus()
        return
    }

    const anterior = concentracaoAtual
    concentracaoAtual = magia
    magiaConcentracaoEL.value = ""

    if (anterior !== "" && anterior !== magia) {
        atualizarConcentracao(
            `Concentração em ${anterior} encerrada: só uma magia de concentração por vez.`
        )
        return
    }

    atualizarConcentracao("")
}

function encerrarConcentracao(motivo) {
    const magia = concentracaoAtual
    concentracaoAtual = ""
    atualizarConcentracao(magia === "" ? "" : `${motivo || "Concentração"} em ${magia} encerrada.`)
}

// Último PV visto, para saber quanto dano entrou. Usa "change" e não "input":
// apagar o campo para digitar outro número não pode contar como cair a 0 PV.
let pvVisto = 0
let temporarioVisto = 0

function lembrarPv() {
    pvVisto = Number(pvAtualEL.value)
    temporarioVisto = Number(pvTemporarioEL.value)
}

function aoMudarPv() {
    // dano nos PV temporários também exige salvaguarda
    const dano =
        Math.max(0, pvVisto - Number(pvAtualEL.value)) +
        Math.max(0, temporarioVisto - Number(pvTemporarioEL.value))

    lembrarPv()

    if (concentracaoAtual === "") {
        return
    }

    // a 0 PV o personagem fica inconsciente, e a concentração acaba
    if (estaCaido()) {
        encerrarConcentracao("Caiu a 0 PV: concentração")
        return
    }

    if (dano > 0) {
        atualizarConcentracao(
            `Sofreu ${dano} de dano: salvaguarda de Constituição CD ${cdConcentracao(dano)} para manter ${concentracaoAtual}.`
        )
    }
}

btnConcentrarEL.addEventListener("click", concentrar)

btnEncerrarConcentracaoEL.addEventListener("click", function () {
    encerrarConcentracao()
})

// Enter no campo concentra, em vez de enviar o formulário da ficha
magiaConcentracaoEL.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault()
        concentrar()
    }
})

pvAtualEL.addEventListener("change", aoMudarPv)
pvTemporarioEL.addEventListener("change", aoMudarPv)

// classe que não conjura esconde o bloco
classeEL.addEventListener("change", function () {
    atualizarConcentracao()
})

/* ---------- RF09: talentos escolhidos no level up ---------- */

function mostrarTalentos() {
    const textos = talentosDoPersonagem.map(function (valor) {
        const talento = talentoPorValor(valor)
        return talento ? `${talento.nome}: ${talento.descricao}` : valor
    })

    preencherLista(
        document.getElementById("lista-talentos"),
        textos,
        "Nenhum talento. Eles são escolhidos ao subir de nível."
    )
}

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
    atualizarProficiencia()

    // renderizarPericias roda dentro de escreverPericias
    escreverPericias(personagem.pericias)

    // precisa vir antes do recálculo: o talento Robusto muda o PV máximo
    talentosDoPersonagem = personagem.talentos || []
    mostrarTalentos()

    // ficha-comum.js montou tudo antes da classe e da raça serem preenchidas aqui
    recalcularDerivados()

    // o PV atual é do jogador, então vem do que foi salvo em vez de recalculado
    if (personagem.pvAtual !== undefined) {
        document.getElementById("pv-atual").value = personagem.pvAtual
    }

    document.getElementById("pv-temporario").value = personagem.pvTemporario || 0

    dadosVidaGastos = personagem.dadosVidaGastos || 0
    atualizarDadosDeVida()

    sucessosMorte = personagem.sucessosMorte || 0
    falhasMorte = personagem.falhasMorte || 0
    atualizarTestesDeMorte()

    espacosGastos = personagem.espacosGastos || {}
    atualizarEspacosDeMagia()

    concentracaoAtual = personagem.concentracao || ""
    atualizarConcentracao()

    // ponto de partida para medir dano; os PV já foram carregados acima
    lembrarPv()

    // o nível só muda por aqui (o campo na ficha é somente leitura),
    // para ninguém pular a Melhoria de Atributo ou o Talento
    const linkLevelupEL = document.getElementById("link-levelup")
    linkLevelupEL.href = `levelup.html?id=${personagem.id}`
    linkLevelupEL.hidden = personagem.nivel >= NIVEL_MAXIMO

    formFicha.addEventListener("submit", function (evento) {
        evento.preventDefault()

        if (!bonusValido()) {
            mostrarStatusBonus()
            return
        }

        if (!periciasCompletas()) {
            atualizarPericias()
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
        personagem.pericias = lerPericias()
        personagem.bonusProficiencia = bonusDeProficiencia(personagem.nivel)
        // derivado da classe, mas salvo pra ficha poder ser lida sem recalcular
        personagem.salvaguardas = salvaguardasDaClasse(personagem.classe)

        const dadosRaca = dadosDaRaca(personagem.raca, personagem.subraca)
        personagem.deslocamento = dadosRaca ? dadosRaca.deslocamento : null
        personagem.tracos = dadosRaca ? dadosRaca.tracos : []
        personagem.idiomas = dadosRaca ? dadosRaca.idiomas : []

        personagem.pvMaximo = calcularPvMaximo()
        personagem.pvAtual = Number(document.getElementById("pv-atual").value)
        personagem.pvTemporario = Number(
            document.getElementById("pv-temporario").value
        )
        personagem.dadosVidaGastos = dadosVidaGastos
        personagem.sucessosMorte = sucessosMorte
        personagem.falhasMorte = falhasMorte
        // guarda só o que ainda existe na tabela da classe e do nível atuais
        personagem.espacosGastos = espacosGastosValidos()
        // classe que não conjura não guarda concentração
        personagem.concentracao =
            conjuracaoDaClasse(personagem.classe) === null ? "" : concentracaoAtual

        localStorage.setItem("fichas", JSON.stringify(personagens))

        window.location.href = "index.html"
    })
}
