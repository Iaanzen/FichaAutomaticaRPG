// RF09: tela dedicada de level up.
// Usa so regras.js; nao carrega ficha-comum.js porque esta tela nao tem os
// campos da ficha (pericias, salvaguardas, PV) que aquele arquivo espera.

const telaEL = document.getElementById("tela-levelup")
const mensagemErroEL = document.getElementById("mensagem-erro")
const subclasseEL = document.getElementById("subclasse")
const atributoDadivaEL = document.getElementById("atributo-dadiva")

const parametros = new URLSearchParams(window.location.search)
const idDaUrl = Number(parametros.get("id"))

const personagens = JSON.parse(localStorage.getItem("fichas")) || []

const personagem = personagens.find(function (item) {
    return item.id === idDaUrl
})

/* ---------- Estado da escolha ---------- */

// "asi", "talento" ou null enquanto o jogador nao decidiu.
// Dadiva Epica conta como "talento": ela e um talento de uma lista propria.
let escolhaAtual = null
let talentoEscolhido = null
let atributoDadiva = ""
const melhoria = {}

ATRIBUTOS.forEach(function (atributo) {
    melhoria[atributo] = 0
})

function nivelNovo() {
    return personagem.nivel + 1
}

function temEscolha() {
    return nivelTemEscolha(personagem.classe, nivelNovo())
}

function nivelDaDadiva() {
    return nivelNovo() === NIVEL_DADIVA_EPICA
}

function escolheuDadiva() {
    return talentoEscolhido !== null && dadivaPorValor(talentoEscolhido) !== undefined
}

// sem subclasse salva, o nivel 3 (ou qualquer um acima) pede a escolha aqui
function precisaSubclasse() {
    const lista = subclassesPorClasse[personagem.classe] || []

    return (
        nivelNovo() >= NIVEL_SUBCLASSE &&
        !personagem.subclasse &&
        lista.length > 0
    )
}

// total atual do atributo, ja contando o bonus do antecedente
function totalAtual(atributo) {
    const bonus = (personagem.bonusAntecedente || {})[atributo] || 0
    return personagem[atributo] + bonus
}

/* ---------- Como o personagem fica depois de confirmar ---------- */

// a melhoria so conta quando e o caminho escolhido e ja esta completa
function melhoriaAplicada() {
    return escolhaAtual === "asi" && melhoriaAtributoValida(melhoria)
}

// o +1 da dadiva so conta com a dadiva escolhida e o atributo definido
function dadivaAplicada() {
    return escolhaAtual === "talento" && escolheuDadiva() && atributoDadiva !== ""
}

function totalDepois(atributo) {
    let total = totalAtual(atributo)

    if (melhoriaAplicada()) {
        total += melhoria[atributo]
    }

    if (dadivaAplicada() && atributoDadiva === atributo) {
        total += 1
    }

    return total
}

function talentosDepois() {
    const talentos = personagem.talentos || []

    if (escolhaAtual === "talento" && talentoEscolhido !== null) {
        return talentos.concat(talentoEscolhido)
    }

    return talentos
}

function pvMaximoAntes() {
    return pontosDeVida(
        personagem.classe,
        personagem.nivel,
        modificadorDe(totalAtual("constituicao")),
        personagem.talentos || []
    )
}

// +Constituicao, Robusto e Fortitude valem para todos os niveis, entao a conta e refeita
function pvMaximoDepois() {
    return pontosDeVida(
        personagem.classe,
        nivelNovo(),
        modificadorDe(totalDepois("constituicao")),
        talentosDepois()
    )
}

/* ---------- O que o nível traz ---------- */

// roda a cada mudanca: a previa de PV acompanha a escolha do jogador
function montarGanhos() {
    const ganhos = []

    const dado = dadoDeVidaPorClasse[personagem.classe]

    if (dado) {
        const antes = pvMaximoAntes()
        const depois = pvMaximoDepois()
        ganhos.push(`Pontos de vida máximos: ${antes} → ${depois} (+${depois - antes}).`)
        ganhos.push(`Dados de vida: ${nivelNovo()}d${dado}.`)
    }

    const proficienciaAntes = bonusDeProficiencia(personagem.nivel)
    const proficienciaDepois = bonusDeProficiencia(nivelNovo())

    if (proficienciaDepois > proficienciaAntes) {
        ganhos.push(
            `Bônus de proficiência sobe para ${formatarModificador(proficienciaDepois)}.`
        )
    }

    // só aparece quando a tabela muda; quem não conjura tem lista vazia nos dois
    const espacosAntes = descreverEspacos(espacosDeMagia(personagem.classe, personagem.nivel))
    const espacosDepois = descreverEspacos(espacosDeMagia(personagem.classe, nivelNovo()))

    if (espacosDepois !== espacosAntes) {
        ganhos.push(`Espaços de magia por círculo: ${espacosDepois}.`)
    }

    if (precisaSubclasse()) {
        ganhos.push("Escolha de subclasse.")
    }

    if (nivelDaDadiva()) {
        ganhos.push("Dádiva Épica, Talento ou Melhoria de Atributo.")
    } else if (temEscolha()) {
        ganhos.push("Melhoria de Atributo ou Talento.")
    }

    ganhos.push("Habilidades de classe deste nível entram com o RF13.")

    preencherListaSimples(document.getElementById("lista-ganhos"), ganhos)
}

function preencherListaSimples(listaEL, itens) {
    listaEL.innerHTML = ""

    itens.forEach(function (texto) {
        const item = document.createElement("li")
        item.textContent = texto
        listaEL.appendChild(item)
    })
}

/* ---------- Subclasse ---------- */

function subclasseCompleta() {
    return !precisaSubclasse() || subclasseEL.value !== ""
}

/* ---------- Coluna 1: Melhoria de Atributo ---------- */

function montarGradeAsi() {
    const gradeEL = document.getElementById("grade-asi")
    gradeEL.innerHTML = ""

    ATRIBUTOS.forEach(function (atributo) {
        const campo = document.createElement("div")
        campo.className = "campo"

        const selectEL = document.createElement("select")
        selectEL.id = `asi-${atributo}`
        selectEL.className = "select-bonus"

        // so oferece o que nao estoura o teto de 20
        const espaco = ATRIBUTO_MAXIMO - totalAtual(atributo)
        const opcoes = [0, 1, 2].filter(function (valor) {
            return valor <= espaco
        })

        opcoes.forEach(function (valor) {
            const opcao = document.createElement("option")
            opcao.value = valor
            opcao.textContent = valor === 0 ? "—" : `+${valor}`
            selectEL.appendChild(opcao)
        })

        selectEL.addEventListener("change", function () {
            melhoria[atributo] = Number(selectEL.value)
            escolhaAtual = "asi"
            atualizarTela()
        })

        const rotulo = document.createElement("span")
        rotulo.className = "rotulo"
        rotulo.textContent = `${NOME_ATRIBUTO[atributo]} (${totalAtual(atributo)})`

        campo.appendChild(selectEL)
        campo.appendChild(rotulo)
        gradeEL.appendChild(campo)
    })
}

function atualizarStatusAsi() {
    const statusEL = document.getElementById("status-asi")

    if (melhoriaAtributoValida(melhoria)) {
        const partes = []

        ATRIBUTOS.forEach(function (atributo) {
            if (melhoria[atributo] > 0) {
                const novo = totalAtual(atributo) + melhoria[atributo]
                partes.push(`${NOME_ATRIBUTO[atributo]} ${novo}`)
            }
        })

        statusEL.textContent = partes.join(", ")
        statusEL.className = "status-bonus status-ok"
        return
    }

    statusEL.textContent = "Escolha +2 num atributo ou +1 em dois."
    statusEL.className = "status-bonus status-erro"
}

/* ---------- Coluna 2: Talentos e Dádivas Épicas ---------- */

function criarBotaoTalento(talento, jaTem) {
    const item = document.createElement("button")
    item.type = "button"
    item.className = "talento"
    item.dataset.valor = talento.valor

    // talento nao se repete
    item.disabled = jaTem.includes(talento.valor)

    const nome = document.createElement("span")
    nome.className = "talento-nome"
    nome.textContent = item.disabled
        ? `${talento.nome} (já possui)`
        : talento.nome

    const descricao = document.createElement("span")
    descricao.className = "talento-descricao"
    descricao.textContent = talento.descricao

    item.appendChild(nome)
    item.appendChild(descricao)

    item.addEventListener("click", function () {
        talentoEscolhido = talento.valor
        escolhaAtual = "talento"
        // cada dadiva tem sua lista de atributos, entao a escolha anterior nao vale
        atributoDadiva = ""
        montarAtributoDadiva()
        atualizarTela()
    })

    return item
}

function criarTituloGrupo(texto) {
    const titulo = document.createElement("span")
    titulo.className = "talento-grupo"
    titulo.textContent = texto
    return titulo
}

function montarTalentos() {
    const listaEL = document.getElementById("lista-talentos")
    listaEL.innerHTML = ""

    const jaTem = personagem.talentos || []

    if (nivelDaDadiva()) {
        listaEL.appendChild(criarTituloGrupo("Dádivas Épicas"))

        DADIVAS_EPICAS.forEach(function (dadiva) {
            listaEL.appendChild(criarBotaoTalento(dadiva, jaTem))
        })

        listaEL.appendChild(criarTituloGrupo("Talentos"))
    }

    TALENTOS.forEach(function (talento) {
        listaEL.appendChild(criarBotaoTalento(talento, jaTem))
    })
}

// a dadiva da +1 num atributo; algumas so aceitam certos atributos
function montarAtributoDadiva() {
    const blocoEL = document.getElementById("bloco-dadiva-atributo")
    const dadiva = escolheuDadiva() ? dadivaPorValor(talentoEscolhido) : undefined

    blocoEL.hidden = dadiva === undefined

    if (dadiva === undefined) {
        return
    }

    const permitidos = (dadiva.atributos || ATRIBUTOS).filter(function (atributo) {
        return totalAtual(atributo) < ATRIBUTO_MAXIMO_DADIVA
    })

    const opcoes = permitidos.map(function (atributo) {
        const total = totalAtual(atributo)
        return {
            valor: atributo,
            nome: `${NOME_ATRIBUTO[atributo]} (${total} → ${total + 1})`
        }
    })

    preencherSelect(atributoDadivaEL, opcoes, "")
}

/* ---------- Estado geral da tela ---------- */

function escolhaCompleta() {
    if (!temEscolha()) {
        return true
    }

    if (escolhaAtual === "asi") {
        return melhoriaAtributoValida(melhoria)
    }

    if (escolhaAtual === "talento") {
        return talentoEscolhido !== null && (!escolheuDadiva() || atributoDadiva !== "")
    }

    return false
}

function tudoPronto() {
    return subclasseCompleta() && escolhaCompleta()
}

function atualizarTela() {
    const colunaAsiEL = document.getElementById("coluna-asi")
    const colunaTalentoEL = document.getElementById("coluna-talento")

    // a coluna escolhida ganha destaque; a outra apaga, mas continua clicável
    colunaAsiEL.classList.toggle("coluna-ativa", escolhaAtual === "asi")
    colunaTalentoEL.classList.toggle("coluna-ativa", escolhaAtual === "talento")
    colunaAsiEL.classList.toggle("coluna-apagada", escolhaAtual === "talento")
    colunaTalentoEL.classList.toggle("coluna-apagada", escolhaAtual === "asi")

    montarGanhos()
    atualizarStatusAsi()

    document.querySelectorAll("#lista-talentos .talento").forEach(function (item) {
        item.classList.toggle(
            "talento-escolhido",
            escolhaAtual === "talento" && talentoEscolhido === item.dataset.valor
        )
    })

    // a mensagem tem que dizer o que falta AGORA, não repetir o passo já dado
    const statusEL = document.getElementById("status-levelup")
    statusEL.className = "status-bonus status-erro"

    if (tudoPronto()) {
        statusEL.textContent = ""
    } else if (!subclasseCompleta()) {
        statusEL.textContent = "Falta escolher a subclasse."
    } else if (escolhaAtual === "asi") {
        statusEL.textContent =
            "Falta distribuir: +2 num atributo, ou +1 em dois atributos."
    } else if (escolhaAtual === "talento" && escolheuDadiva()) {
        statusEL.textContent = "Falta escolher o atributo da Dádiva Épica."
    } else if (escolhaAtual === "talento") {
        statusEL.textContent = "Falta escolher um talento da lista."
    } else {
        statusEL.textContent = "Escolha entre Melhoria de Atributo e Talento."
    }

    document.getElementById("btn-confirmar-nivel").disabled = !tudoPronto()
}

/* ---------- Confirmar ---------- */

function confirmarNivel() {
    if (!tudoPronto()) {
        return
    }

    // tudo que depende do estado antigo e lido antes de mexer no personagem
    const pvAntes = pvMaximoAntes()
    const pvDepois = pvMaximoDepois()
    const talentos = talentosDepois()
    const aplicarMelhoria = melhoriaAplicada()
    const aplicarDadiva = dadivaAplicada()
    const escolheuSubclasse = precisaSubclasse()

    personagem.nivel = nivelNovo()
    personagem.talentos = talentos

    // melhoria e dadiva entram no valor base, que é o que a ficha guarda
    if (aplicarMelhoria) {
        ATRIBUTOS.forEach(function (atributo) {
            personagem[atributo] += melhoria[atributo]
        })
    }

    if (aplicarDadiva) {
        personagem[atributoDadiva] += 1
    }

    if (escolheuSubclasse) {
        personagem.subclasse = subclasseEL.value
    }

    // derivados salvos acompanham, igual o salvar da ficha faz
    const totais = {}
    const modificadores = {}

    ATRIBUTOS.forEach(function (atributo) {
        totais[atributo] = totalAtual(atributo)
        modificadores[atributo] = modificadorDe(totais[atributo])
    })

    personagem.atributosTotais = totais
    personagem.modificadores = modificadores
    personagem.bonusProficiencia = bonusDeProficiencia(personagem.nivel)
    personagem.pvMaximo = pvDepois

    // subir de nível só aumenta o máximo; o PV atual fica como estava
    // e sobe com descanso ou cura
    const pvAtual =
        personagem.pvAtual === undefined ? pvAntes : personagem.pvAtual
    personagem.pvAtual = Math.min(pvDepois, pvAtual)

    localStorage.setItem("fichas", JSON.stringify(personagens))
    window.location.href = `ficha.html?id=${personagem.id}`
}

/* ---------- Início ---------- */

if (!personagem) {
    telaEL.style.display = "none"
    mensagemErroEL.style.display = "block"
} else if (personagem.nivel >= NIVEL_MAXIMO) {
    telaEL.style.display = "none"
    mensagemErroEL.textContent = "Este personagem já está no nível 20."
    mensagemErroEL.style.display = "block"
} else {
    document.title = `${personagem.nome} - Subir de Nível`

    document.getElementById("nome-personagem").textContent = personagem.nome
    document.getElementById("classe-personagem").textContent =
        personagem.classe
    document.getElementById("nivel-atual").textContent = personagem.nivel
    document.getElementById("nivel-novo").textContent = nivelNovo()

    document.getElementById("link-cancelar").href = `ficha.html?id=${personagem.id}`

    montarGradeAsi()
    montarTalentos()

    atributoDadivaEL.addEventListener("change", function () {
        atributoDadiva = atributoDadivaEL.value
        atualizarTela()
    })

    if (precisaSubclasse()) {
        document.getElementById("bloco-subclasse").hidden = false
        preencherSelect(subclasseEL, subclassesPorClasse[personagem.classe], "")
        subclasseEL.addEventListener("change", atualizarTela)
    }

    const instrucaoEL = document.getElementById("instrucao-escolha")
    const colunasEL = document.getElementById("colunas-escolha")

    if (nivelDaDadiva()) {
        instrucaoEL.textContent =
            "Nível 19: além da Melhoria de Atributo e dos talentos, você pode escolher uma Dádiva Épica."
    } else if (temEscolha()) {
        instrucaoEL.textContent =
            "Este nível permite uma escolha. Compare as opções e decida."
    } else {
        // nível sem escolha: o jogador só confirma o que vem automático
        instrucaoEL.textContent =
            "Este nível não tem escolha a fazer. Confira o que ele traz e confirme."
        colunasEL.hidden = true
    }

    // clicar no título da coluna já escolhe aquele caminho
    document.getElementById("escolher-asi").addEventListener("click", function () {
        escolhaAtual = "asi"
        atualizarTela()
    })

    document
        .getElementById("escolher-talento")
        .addEventListener("click", function () {
            escolhaAtual = "talento"
            atualizarTela()
        })

    document
        .getElementById("btn-confirmar-nivel")
        .addEventListener("click", confirmarNivel)

    atualizarTela()
}
