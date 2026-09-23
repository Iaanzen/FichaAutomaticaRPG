// RF09: tela dedicada de level up.
// Usa so regras.js; nao carrega ficha-comum.js porque esta tela nao tem os
// campos da ficha (pericias, salvaguardas, PV) que aquele arquivo espera.
//
// Multiclasse: o jogador escolhe em QUAL classe o nível entra (ou começa uma
// classe nova). Quase tudo aqui é por nível DA CLASSE escolhida; o bônus de
// proficiência, o PV e os espaços de magia olham o personagem inteiro.

const telaEL = document.getElementById("tela-levelup")
const mensagemErroEL = document.getElementById("mensagem-erro")
const subclasseEL = document.getElementById("subclasse")
const atributoDadivaEL = document.getElementById("atributo-dadiva")
const listaClassesEL = document.getElementById("lista-classes-levelup")
const classeNovaEL = document.getElementById("classe-nova")
const avisoClasseEL = document.getElementById("aviso-classe")

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

// classes que o personagem já tem e qual delas recebe este nível
const classes = personagem ? classesDoPersonagem(personagem).map(function (entrada) {
    return Object.assign({}, entrada)
}) : []

let classeEmFoco = classes.length ? classes[0].classe : ""

/* ---------- Multiclasse: a classe que sobe ---------- */

function entradaEmFoco() {
    return classes.find(function (entrada) {
        return entrada.classe === classeEmFoco
    }) || null
}

// é uma classe nova quando o personagem ainda não tem nível nela
function ehClasseNova() {
    return entradaEmFoco() === null
}

function nivelAtualDaClasse() {
    const entrada = entradaEmFoco()
    return entrada ? entrada.nivel : 0
}

// nível DA CLASSE escolhida depois de confirmar
function nivelNovo() {
    return nivelAtualDaClasse() + 1
}

function nivelTotalAtual() {
    return nivelTotal(classes)
}

function nivelTotalNovo() {
    return nivelTotalAtual() + 1
}

function subclasseEmFoco() {
    const entrada = entradaEmFoco()
    return entrada ? entrada.subclasse || "" : ""
}

// como fica a lista de classes se o jogador confirmar
function classesDepois() {
    const copia = classes.map(function (entrada) {
        return Object.assign({}, entrada)
    })

    const entrada = copia.find(function (item) {
        return item.classe === classeEmFoco
    })

    if (entrada) {
        entrada.nivel += 1
    } else {
        copia.push({ classe: classeEmFoco, nivel: 1, subclasse: "" })
    }

    return copia
}

function temEscolha() {
    return nivelTemEscolha(classeEmFoco, nivelNovo())
}

// a Dádiva Épica é do nível 19 DA CLASSE
function nivelDaDadiva() {
    return nivelNovo() === NIVEL_DADIVA_EPICA
}

function escolheuDadiva() {
    return talentoEscolhido !== null && dadivaPorValor(talentoEscolhido) !== undefined
}

// sem subclasse salva, o nivel da escolha (ou qualquer um acima) pede a escolha aqui
function precisaSubclasse() {
    const lista = subclassesPorClasse[classeEmFoco] || []

    return (
        nivelNovo() >= nivelDaEscolhaDeSubclasse(classeEmFoco) &&
        subclasseEmFoco() === "" &&
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

    return total + aumentoDeClasse(atributo)
}

// Sprint 6.5: aumento automático do nível (Primal Champion, Peak Physical
// Condition). Conta depois da melhoria e da dádiva, e nunca passa do teto dele.
function aumentoDeClasse(atributo) {
    const aumento = aumentoDeAtributoDoNivel(classeEmFoco, nivelNovo())

    if (!aumento || !aumento.atributos.includes(atributo)) {
        return 0
    }

    let antes = totalAtual(atributo)

    if (melhoriaAplicada()) {
        antes += melhoria[atributo]
    }

    if (dadivaAplicada() && atributoDadiva === atributo) {
        antes += 1
    }

    return valorDoAumento(aumento, antes)
}

function talentosDepois() {
    const talentos = personagem.talentos || []

    if (escolhaAtual === "talento" && talentoEscolhido !== null) {
        return talentos.concat(talentoEscolhido)
    }

    return talentos
}

function pvMaximoAntes() {
    return pontosDeVidaMulticlasse(
        classes,
        modificadorDe(totalAtual("constituicao")),
        personagem.talentos || []
    )
}

// +Constituicao, Robusto e Fortitude valem para todos os niveis, entao a conta e refeita
function pvMaximoDepois() {
    return pontosDeVidaMulticlasse(
        classesDepois(),
        modificadorDe(totalDepois("constituicao")),
        talentosDepois()
    )
}

/* ---------- O que o nível traz ---------- */

// "1º: 4 · 2º: 3" e, se houver, os espaços de Pacto à parte
function descreverEspacosDaLista(lista) {
    const comuns = lista.filter(function (espaco) {
        return !espaco.pacto
    })

    const doPacto = lista.filter(function (espaco) {
        return espaco.pacto
    })

    const partes = []

    if (comuns.length) {
        partes.push(descreverEspacos(comuns))
    }

    if (doPacto.length) {
        partes.push(`Pacto ${descreverEspacos(doPacto)}`)
    }

    return partes.join(" · ")
}

// roda a cada mudanca: a previa de PV acompanha a escolha do jogador
function montarGanhos() {
    const ganhos = []
    const depois = classesDepois()

    const dado = dadoDeVidaPorClasse[classeEmFoco]

    if (dado) {
        const pvAntes = pvMaximoAntes()
        const pvDepois = pvMaximoDepois()
        ganhos.push(`Pontos de vida máximos: ${pvAntes} → ${pvDepois} (+${pvDepois - pvAntes}).`)
        ganhos.push(`Dados de vida: ${descreverDadosDeVida(depois)}.`)
    }

    // o bônus de proficiência é pelo nível total, não pelo da classe
    const proficienciaAntes = bonusDeProficiencia(nivelTotalAtual())
    const proficienciaDepois = bonusDeProficiencia(nivelTotalNovo())

    if (proficienciaDepois > proficienciaAntes) {
        ganhos.push(
            `Bônus de proficiência sobe para ${formatarModificador(proficienciaDepois)}.`
        )
    }

    // só aparece quando a tabela muda; quem não conjura tem lista vazia nos dois
    const espacosAntes = descreverEspacosDaLista(espacosDeMagiaMulticlasse(classes))
    const espacosDepois = descreverEspacosDaLista(espacosDeMagiaMulticlasse(depois))

    if (espacosDepois !== espacosAntes) {
        ganhos.push(`Espaços de magia por círculo: ${espacosDepois}.`)
    }

    // Sprint 6.5: aumento de atributo da classe (ex: Bárbaro no 20)
    const aumento = aumentoDeAtributoDoNivel(classeEmFoco, nivelNovo())

    if (aumento) {
        const detalhes = aumento.atributos.map(function (atributo) {
            return `${NOME_ATRIBUTO[atributo]} +${aumentoDeClasse(atributo)} (fica ${totalDepois(atributo)})`
        })

        ganhos.push(`${aumento.nome}: ${detalhes.join(", ")}; teto ${aumento.teto}.`)
    }

    // Sprint 6.5: magias que a subclasse dá neste nível (sempre preparadas)
    const subclasseDasMagias = precisaSubclasse() ? subclasseEL.value : subclasseEmFoco()
    const escolhaDeMagias = escolhaDeMagiasDaSubclasse(classeEmFoco, subclasseDasMagias)
    const magiasNovas = magiasDaSubclasse(
        classeEmFoco,
        subclasseDasMagias,
        nivelNovo(),
        personagem.opcaoMagiasSubclasse
    ).filter(function (magia) {
        return magia.nivel === nivelNovo()
    })

    if (magiasNovas.length) {
        const nomes = magiasNovas.map(function (magia) {
            return magia.nome
        })
        ganhos.push(`Magias da subclasse (sempre preparadas): ${nomes.join(", ")}.`)
    } else if (
        escolhaDeMagias &&
        !personagem.opcaoMagiasSubclasse &&
        escolhaDeMagias.opcoes.some(function (opcao) {
            return opcao.porNivel[nivelNovo()]
        })
    ) {
        ganhos.push(`Magias da subclasse: escolha na ficha (${escolhaDeMagias.rotulo.toLowerCase()}).`)
    }

    // Sprint 6.5: proficiência nova em salvaguarda (só a classe inicial dá)
    const salvaguardasAntes = salvaguardasMulticlasse(classes)
    const salvaguardasNovas = salvaguardasMulticlasse(depois)
        .filter(function (atributo) {
            return !salvaguardasAntes.includes(atributo)
        })
        .map(function (atributo) {
            return NOME_ATRIBUTO[atributo]
        })

    if (salvaguardasNovas.length) {
        ganhos.push(`Proficiência nova em salvaguardas: ${salvaguardasNovas.join(", ")}.`)
    }

    // RF31: recursos novos ou que mudam neste nível
    const modificadores = {}

    ATRIBUTOS.forEach(function (atributo) {
        modificadores[atributo] = modificadorDe(totalDepois(atributo))
    })

    const recursosAntes = recursosDaClasse(classeEmFoco, nivelAtualDaClasse(), modificadores)

    recursosDaClasse(classeEmFoco, nivelNovo(), modificadores).forEach(function (recurso) {
        const antes = recursosAntes.find(function (item) {
            return item.valor === recurso.valor
        })

        if (!antes) {
            ganhos.push(`Novo recurso: ${recurso.nome} (${recurso.total}).`)
        } else if (recurso.total !== antes.total) {
            ganhos.push(`${recurso.nome}: ${antes.total} → ${recurso.total}.`)
        } else if (recurso.recupera !== antes.recupera) {
            ganhos.push(`${recurso.nome} agora ${COMO_RECUPERA[recurso.recupera]}.`)
        }
    })

    if (ehClasseNova()) {
        ganhos.push(`Primeiro nível de ${nomeDaClasse(classeEmFoco)}: as salvaguardas e as perícias continuam vindo da classe inicial.`)
    }

    if (precisaSubclasse()) {
        ganhos.push("Escolha de subclasse.")
    }

    if (nivelDaDadiva()) {
        ganhos.push("Dádiva Épica, Talento ou Melhoria de Atributo.")
    } else if (temEscolha()) {
        ganhos.push("Melhoria de Atributo ou Talento.")
    }

    // RF13: habilidades que o nível novo traz. Melhoria de Atributo e Dádiva
    // Épica ficam de fora porque já aparecem como escolha logo abaixo.
    const subclasseDepois = precisaSubclasse() ? subclasseEL.value : subclasseEmFoco()
    const novas = habilidadesParaMostrar(classeEmFoco, subclasseDepois, nivelNovo(), nivelNovo())
        .map(function (habilidade) {
            return habilidade.rotulo
        })
        .filter(function (rotulo) {
            return !["Ability Score Improvement", "Epic Boon"].includes(rotulo)
        })

    if (novas.length) {
        ganhos.push(`Habilidades novas: ${novas.join(", ")}.`)
    }

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

/* ---------- Magias do nível (RF09, RF30) ---------- */

function circuloMaximoDaLista(lista) {
    const espacos = espacosDeMagiaMulticlasse(lista)
    return espacos.length === 0 ? 0 : Math.max.apply(null, espacos.map(function (espaco) {
        return espaco.circulo
    }))
}

// Aparece em todo nível de quem conjura, com ou sem escolha de ASI/talento.
// As escolhas em si (vagas novas, trocas) são feitas na aba de magias.
function montarMagiasDoNivel() {
    const blocoEL = document.getElementById("bloco-magias-levelup")

    if (conjuracaoDaClasse(classeEmFoco) === null) {
        blocoEL.hidden = true
        return
    }

    const itens = []
    const circuloAntes = circuloMaximoDaLista(classes)
    const circuloDepois = circuloMaximoDaLista(classesDepois())

    if (circuloDepois > circuloAntes) {
        itens.push(`Novo círculo liberado: ${nomeDoCirculo(circuloDepois)}.`)
    }

    const troca = descreverTrocas(trocasLiberadas(classeEmFoco, "nivel"))

    if (troca) {
        itens.push(`Ao confirmar, libera a troca de ${troca}.`)
    } else {
        itens.push(
            `Este nível não libera troca de magias: ${nomeDaClasse(classeEmFoco)} ${explicarRegraDeTroca(classeEmFoco)}.`
        )
    }

    itens.push("Vagas novas de truques e magias podem ser preenchidas na aba Magias depois de confirmar.")

    preencherListaSimples(document.getElementById("lista-magias-levelup"), itens)
    blocoEL.hidden = false
}

/* ---------- Subclasse ---------- */

function subclasseCompleta() {
    return !precisaSubclasse() || subclasseEL.value !== ""
}

function montarSubclasse() {
    const blocoEL = document.getElementById("bloco-subclasse")

    blocoEL.hidden = !precisaSubclasse()

    if (precisaSubclasse()) {
        preencherSelect(subclasseEL, subclassesPorClasse[classeEmFoco], "")
    } else {
        subclasseEL.value = ""
    }
}

/* ---------- Multiclasse: escolher a classe do nível ---------- */

// avisa (sem impedir) quando falta o 13 do pré-requisito de 2024
function avisoDoPreRequisito() {
    if (!ehClasseNova()) {
        return ""
    }

    const totais = {}

    ATRIBUTOS.forEach(function (atributo) {
        totais[atributo] = totalAtual(atributo)
    })

    const faltaNova = faltaParaMulticlasse(classeEmFoco, totais)
    const inicial = classeInicial(classes)
    const faltaAtual = inicial ? faltaParaMulticlasse(inicial.classe, totais) : []

    const avisos = []

    if (faltaNova.length) {
        avisos.push(`${nomeDaClasse(classeEmFoco)} pede 13 em ${faltaNova.map(function (a) {
            return NOME_ATRIBUTO[a]
        }).join(" e ")}`)
    }

    if (faltaAtual.length) {
        avisos.push(`sair de ${nomeDaClasse(inicial.classe)} pede 13 em ${faltaAtual.map(function (a) {
            return NOME_ATRIBUTO[a]
        }).join(" e ")}`)
    }

    return avisos.length
        ? `Pré-requisito de multiclasse: ${avisos.join("; ")}. O app não impede: combine com o mestre.`
        : ""
}

function trocarClasse(classe) {
    classeEmFoco = classe

    // a escolha anterior era de outra classe: recomeça
    escolhaAtual = null
    talentoEscolhido = null
    atributoDadiva = ""

    ATRIBUTOS.forEach(function (atributo) {
        melhoria[atributo] = 0
    })

    montarGradeAsi()
    montarTalentos()
    montarAtributoDadiva()
    montarSubclasse()
    montarMagiasDoNivel()
    montarEscolhaDeClasse()
    atualizarCabecalho()
    atualizarTela()
}

function montarEscolhaDeClasse() {
    listaClassesEL.innerHTML = ""

    classes.forEach(function (entrada) {
        const botao = document.createElement("button")
        botao.type = "button"
        botao.className = "classe-opcao"
        botao.classList.toggle("classe-escolhida", entrada.classe === classeEmFoco)
        botao.textContent = `${nomeDaClasse(entrada.classe)} ${entrada.nivel} → ${entrada.nivel + 1}`
        botao.addEventListener("click", function () {
            trocarClasse(entrada.classe)
        })
        listaClassesEL.appendChild(botao)
    })

    // classes que o personagem ainda não tem
    const novas = listaDeClasses().filter(function (classe) {
        return !classes.some(function (entrada) {
            return entrada.classe === classe.valor
        })
    })

    preencherSelect(classeNovaEL, novas, ehClasseNova() ? classeEmFoco : "")

    avisoClasseEL.textContent = avisoDoPreRequisito()
    avisoClasseEL.hidden = avisoClasseEL.textContent === ""
}

function atualizarCabecalho() {
    document.getElementById("classe-personagem").textContent = descreverClasses(classesDepois())
    document.getElementById("nivel-atual").textContent = nivelTotalAtual()
    document.getElementById("nivel-novo").textContent = nivelTotalNovo()
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

// IDEIA06: +2 num atributo fecha a Melhoria, então os outros ficam só com "—";
// com um +1 escolhido, o +2 some dos outros (a forma passa a ser +1/+1)
function atualizarOpcoesAsi() {
    ATRIBUTOS.forEach(function (atributo) {
        const selectEL = document.getElementById(`asi-${atributo}`)
        const permitidos = valoresPermitidos(
            melhoria,
            atributo,
            FORMAS_MELHORIA_ATRIBUTO,
            ATRIBUTO_MAXIMO - totalAtual(atributo)
        )

        Array.from(selectEL.options).forEach(function (opcao) {
            const valor = Number(opcao.value)
            const some = !permitidos.includes(valor) && valor !== melhoria[atributo]
            opcao.hidden = some
            opcao.disabled = some
        })

        selectEL.disabled = permitidos.length === 1 && melhoria[atributo] === 0
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
    return classeEmFoco !== "" && subclasseCompleta() && escolhaCompleta()
}

function atualizarTela() {
    const colunaAsiEL = document.getElementById("coluna-asi")
    const colunaTalentoEL = document.getElementById("coluna-talento")
    const colunasEL = document.getElementById("colunas-escolha")
    const instrucaoEL = document.getElementById("instrucao-escolha")

    // a coluna escolhida ganha destaque; a outra apaga, mas continua clicável
    colunaAsiEL.classList.toggle("coluna-ativa", escolhaAtual === "asi")
    colunaTalentoEL.classList.toggle("coluna-ativa", escolhaAtual === "talento")
    colunaAsiEL.classList.toggle("coluna-apagada", escolhaAtual === "talento")
    colunaTalentoEL.classList.toggle("coluna-apagada", escolhaAtual === "asi")

    // a classe escolhida decide se este nível tem escolha
    colunasEL.hidden = !temEscolha()

    if (nivelDaDadiva()) {
        instrucaoEL.textContent =
            "Nível 19 da classe: além da Melhoria de Atributo e dos talentos, você pode escolher uma Dádiva Épica."
    } else if (temEscolha()) {
        instrucaoEL.textContent =
            "Este nível permite uma escolha. Compare as opções e decida."
    } else {
        instrucaoEL.textContent =
            "Este nível não tem escolha a fazer. Confira o que ele traz e confirme."
    }

    montarGanhos()
    atualizarOpcoesAsi()
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
    } else if (classeEmFoco === "") {
        statusEL.textContent = "Escolha em qual classe o nível entra."
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
    const subclasseNova = subclasseEL.value

    // Sprint 6.5: aumento automático do nível, calculado antes de mexer nos valores
    const aumentos = {}

    ATRIBUTOS.forEach(function (atributo) {
        aumentos[atributo] = aumentoDeClasse(atributo)
    })

    // RF30: a troca do level up fica guardada até ser usada na aba de magias,
    // e vale só para a classe que subiu
    personagem.trocasMagia = guardarTrocasDaClasse(
        personagem.trocasMagia,
        classeEmFoco,
        juntarTrocas(
            trocasDaClasse(personagem.trocasMagia, classeEmFoco, classeInicial(classes).classe),
            trocasLiberadas(classeEmFoco, "nivel")
        ),
        classeInicial(classes).classe
    )

    // o nível entra na classe escolhida (ou abre uma classe nova)
    const entrada = entradaEmFoco()

    if (entrada) {
        entrada.nivel += 1
    } else {
        classes.push({ classe: classeEmFoco, nivel: 1, subclasse: "" })
    }

    if (escolheuSubclasse) {
        entradaEmFoco().subclasse = subclasseNova
    }

    personagem.classes = classes
    personagem.talentos = talentos

    // espelhos, para o resto do app: classe inicial e nível total
    const inicial = classeInicial(classes)
    personagem.classe = inicial.classe
    personagem.subclasse = inicial.subclasse || ""
    personagem.nivel = nivelTotal(classes)

    // melhoria e dadiva entram no valor base, que é o que a ficha guarda
    if (aplicarMelhoria) {
        ATRIBUTOS.forEach(function (atributo) {
            personagem[atributo] += melhoria[atributo]
        })
    }

    if (aplicarDadiva) {
        personagem[atributoDadiva] += 1

        // IDEIA06: só este atributo pode passar de 20 na ficha
        const ate30 = personagem.atributosAte30 || []

        if (!ate30.includes(atributoDadiva)) {
            personagem.atributosAte30 = ate30.concat(atributoDadiva)
        }
    }

    // entra no valor base, como a melhoria e a dádiva
    ATRIBUTOS.forEach(function (atributo) {
        personagem[atributo] += aumentos[atributo]
    })

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
    personagem.salvaguardas = salvaguardasMulticlasse(classes)
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
} else if (nivelTotal(classes) >= NIVEL_MAXIMO) {
    telaEL.style.display = "none"
    mensagemErroEL.textContent = "Este personagem já está no nível 20."
    mensagemErroEL.style.display = "block"
} else {
    document.title = `${personagem.nome} - Subir de Nível`

    document.getElementById("nome-personagem").textContent = personagem.nome
    document.getElementById("link-cancelar").href = `ficha.html?id=${personagem.id}`

    montarGradeAsi()
    montarTalentos()
    montarSubclasse()
    montarMagiasDoNivel()
    montarEscolhaDeClasse()
    atualizarCabecalho()

    atributoDadivaEL.addEventListener("change", function () {
        atributoDadiva = atributoDadivaEL.value
        atualizarTela()
    })

    subclasseEL.addEventListener("change", atualizarTela)

    // começar uma classe nova
    classeNovaEL.addEventListener("change", function () {
        if (classeNovaEL.value !== "") {
            trocarClasse(classeNovaEL.value)
        }
    })

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
