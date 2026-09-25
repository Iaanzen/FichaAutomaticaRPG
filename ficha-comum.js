// Logica de tela compartilhada pelo cadastro e pela ficha de edicao:
// bonus do antecedente, modificadores e pericias.
// Carregue depois de regras.js e antes de cadastro.js / ficha.js.

const nivelEL = document.getElementById("nivel")
const classeEL = document.getElementById("classe")
const statusBonusEL = document.getElementById("status-bonus")
const listaPericiasEL = document.getElementById("lista-pericias")
const statusPericiasEL = document.getElementById("status-pericias")
const listaSalvaguardasEL = document.getElementById("lista-salvaguardas")
const racaEL = document.getElementById("raca")
const subracaEL = document.getElementById("subraca")

// as classes vêm dos blocos de regras.js e de conteudo-extra.js, se existir:
// classe nova aparece no wizard e na ficha sem mexer no HTML
preencherSelect(classeEL, listaDeClasses(), "")

/* ---------- Bonus do antecedente ---------- */

// le os seis selects e devolve { forca: 2, destreza: 1, ... }
function lerBonus() {
    const bonus = {}

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        bonus[atributo] = Number(selectEL.value)
    })

    return bonus
}

// joga na tela um bonus que veio salvo
function escreverBonus(bonusSalvo) {
    const bonus = bonusSalvo || {}

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        selectEL.value = String(bonus[atributo] || 0)
    })
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

// atributos que a Dádiva Épica deixou passar de 20; a ficha preenche ao carregar
let atributosAte30 = []

// IDEIA06: cada select de bônus só mostra o que ainda cabe numa forma válida
// (+2/+1 ou +1/+1/+1) e não estoura o teto do atributo. Usar o +2 tira o +2
// dos outros; com a distribuição fechada, os outros ficam só com "—" e travam.
// Quem já tem bônus continua liberado: é por ali que o jogador desfaz a escolha.
function atualizarOpcoesBonus() {
    const bonus = lerBonus()

    ATRIBUTOS.forEach(function(atributo) {
        const selectEL = document.getElementById(`bonus-${atributo}`)
        const campoBaseEL = document.getElementById(atributo)
        // Sprint 6.5: a classe pode liberar teto maior (ex: Bárbaro no 20, até 25)
        const teto = tetoDoAtributo(
            atributo,
            atributosAte30,
            tetosDaClasse(classeEL.value, Number(nivelEL.value))
        )

        // no wizard o valor base pode estar vazio: ainda não há o que limitar
        const base = campoBaseEL.value === "" ? 0 : Number(campoBaseEL.value)
        const permitidos = valoresPermitidos(
            bonus,
            atributo,
            FORMAS_BONUS_ANTECEDENTE,
            teto - base
        )

        Array.from(selectEL.options).forEach(function(opcao) {
            const valor = Number(opcao.value)
            // o valor escolhido nunca some, senão o select mostraria outra coisa
            const some = !permitidos.includes(valor) && valor !== bonus[atributo]
            opcao.hidden = some
            opcao.disabled = some
        })

        selectEL.disabled = permitidos.length === 1 && bonus[atributo] === 0

        // na ficha o valor base é digitado: o teto entra na validação ao salvar
        if (campoBaseEL.tagName === "INPUT") {
            campoBaseEL.max = teto - bonus[atributo]
        }
    })
}

/* ---------- RF07: modificadores ---------- */

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
        // no array padrao o atributo comeca sem valor: nao da pra calcular nada ainda
        const semValor = document.getElementById(atributo).value === ""

        // so o numero; o rotulo "Total" vem do CSS onde faz sentido
        document.getElementById(`total-${atributo}`).textContent =
            semValor ? "—" : calculo.totais[atributo]
        document.getElementById(`mod-${atributo}`).textContent =
            semValor ? "—" : formatarModificador(calculo.modificadores[atributo])
    })
}

// RF08 na tela; so a ficha tem esse bloco, o cadastro nao
function atualizarProficiencia() {
    const proficienciaEL = document.getElementById("valor-proficiencia")

    if (proficienciaEL === null) {
        return
    }

    proficienciaEL.textContent =
        formatarModificador(bonusDeProficiencia(Number(nivelEL.value)))
}

/* ---------- RF04, RF11, RF12: o que a raça concede ---------- */

// preenche um <ul> com uma lista de textos fixos
function preencherLista(listaEL, itens, textoVazio) {
    listaEL.innerHTML = ""

    if (itens.length === 0) {
        const vazio = document.createElement("li")
        vazio.className = "item-vazio"
        vazio.textContent = textoVazio
        listaEL.appendChild(vazio)
        return
    }

    itens.forEach(function(texto) {
        const item = document.createElement("li")
        item.textContent = texto
        listaEL.appendChild(item)
    })
}

// deslocamento, tracos e idiomas saem da tabela; nada aqui e escolhido
/* ---------- IDEIA04: raça própria ---------- */

const BLOCOS_RACA_PROPRIA = [
    "bloco-raca-propria",
    "bloco-raca-propria-deslocamento",
    "bloco-raca-propria-tracos",
    "bloco-raca-propria-idiomas"
]

function usandoRacaPropria() {
    return racaEL.value === RACA_PROPRIA
}

// lê o que o jogador escreveu nos campos da raça inventada
function lerRacaPropria() {
    const nomeEL = document.getElementById("raca-propria-nome")

    if (nomeEL === null) {
        return null
    }

    return {
        nome: nomeEL.value.trim(),
        deslocamento: Number(document.getElementById("raca-propria-deslocamento").value),
        tracos: listaDeLinhas(document.getElementById("raca-propria-tracos").value),
        idiomas: listaDeItens(document.getElementById("raca-propria-idiomas").value)
    }
}

function escreverRacaPropria(definicao) {
    const nomeEL = document.getElementById("raca-propria-nome")

    if (nomeEL === null || !definicao) {
        return
    }

    nomeEL.value = definicao.nome || ""
    document.getElementById("raca-propria-deslocamento").value =
        definicao.deslocamento || DESLOCAMENTO_PADRAO
    document.getElementById("raca-propria-tracos").value = (definicao.tracos || []).join("\n")
    document.getElementById("raca-propria-idiomas").value = (definicao.idiomas || []).join(", ")
}

// os campos da raça inventada e o de sub-raça nunca aparecem juntos
function atualizarCamposDaRaca() {
    const propria = usandoRacaPropria()

    BLOCOS_RACA_PROPRIA.forEach(function(id) {
        const bloco = document.getElementById(id)

        if (bloco !== null) {
            bloco.hidden = !propria
        }
    })

    const blocoSubracaEL = document.getElementById("bloco-subraca")

    if (blocoSubracaEL !== null) {
        blocoSubracaEL.hidden = propria
    }
}

function atualizarRaca() {
    atualizarCamposDaRaca()

    const dados = usandoRacaPropria()
        ? dadosDaRacaPropria(lerRacaPropria())
        : dadosDaRaca(racaEL.value, subracaEL.value)

    const deslocamentoEL = document.getElementById("valor-deslocamento")
    const tracosEL = document.getElementById("lista-tracos")
    const idiomasEL = document.getElementById("lista-idiomas")

    if (deslocamentoEL !== null) {
        deslocamentoEL.textContent = dados ? `${dados.deslocamento} m` : "—"
    }

    if (tracosEL !== null) {
        preencherLista(
            tracosEL,
            dados ? dados.tracos : [],
            "Escolha uma raça para ver os traços."
        )
    }

    if (idiomasEL !== null) {
        // a raça dá alguns; antecedente, classe e o que se aprende em jogo
        // entram pelo campo ao lado, que só a ficha tem
        const daRaca = dados ? dados.idiomas : []

        preencherLista(
            idiomasEL,
            daRaca.concat(lerIdiomasExtras()),
            "Escolha uma raça para ver os idiomas."
        )
    }
}

// "Anão, Ferramentas de ladrão" vira lista; vazio quando a página não tem o campo
function lerIdiomasExtras() {
    const campo = document.getElementById("idiomas-extras")
    return campo === null ? [] : listaDeItens(campo.value)
}

/* ---------- RF21, RF22: pontos de vida ---------- */

// talentos vem do level up: a ficha preenche ao carregar, o cadastro fica vazio
let talentosDoPersonagem = []

// Multiclasse: a ficha preenche com [{ classe, nivel, subclasse }] ao carregar.
// Vazio (wizard, ou antes de carregar) = uma classe só, lida dos campos da tela.
let classesParaCalculo = []

function classesDoCalculo() {
    if (classesParaCalculo.length > 0) {
        return classesParaCalculo
    }

    return [{ classe: classeEL.value, nivel: Number(nivelEL.value), subclasse: "" }]
}

// o maximo e calculado; o PV atual e do jogador e so ele mexe
function calcularPvMaximo() {
    const calculo = calcularAtributos()
    const classes = classesDoCalculo()

    if (!classes[0].classe) {
        return null
    }

    return pontosDeVidaMulticlasse(
        classes,
        calculo.modificadores.constituicao,
        talentosDoPersonagem
    )
}

function atualizarPontosDeVida() {
    const pvMaximoEL = document.getElementById("valor-pv-maximo")

    if (pvMaximoEL === null) {
        return
    }

    const maximo = calcularPvMaximo()
    pvMaximoEL.textContent = maximo === null ? "—" : maximo

    const dadoEL = document.getElementById("valor-dado-vida")

    if (dadoEL !== null) {
        // com multiclasse são vários grupos: "3d10 + 2d8"
        const dados = descreverDadosDeVida(classesDoCalculo())
        dadoEL.textContent = dados || "—"
    }

    const pvAtualEL = document.getElementById("pv-atual")

    // PV atual nunca passa do maximo nem fica negativo
    if (pvAtualEL !== null && maximo !== null) {
        pvAtualEL.max = maximo

        if (pvAtualEL.value === "" || Number(pvAtualEL.value) > maximo) {
            pvAtualEL.value = maximo
        }
    }
}

/* ---------- RF19: salvaguardas ---------- */

// Nao tem escolha nem limite: a classe define as duas proficientes.
// So a ficha tem esse bloco; o wizard nao, porque nao ha o que decidir.
function atualizarSalvaguardas() {
    if (listaSalvaguardasEL === null) {
        return
    }

    const calculo = calcularAtributos()
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))
    // multiclasse: as salvaguardas vêm só da classe inicial
    const proficientes = salvaguardasMulticlasse(classesDoCalculo())

    listaSalvaguardasEL.innerHTML = ""

    ATRIBUTOS.forEach(function(atributo) {
        const proficiente = proficientes.includes(atributo)

        const bonus = bonusComProficiencia(
            calculo.modificadores[atributo],
            proficiente,
            proficiencia
        )

        const item = document.createElement("div")
        item.className = "salvaguarda"

        if (proficiente) {
            item.classList.add("salvaguarda-proficiente")
        }

        const marcador = document.createElement("span")
        marcador.className = "salvaguarda-marcador"

        const bonusEL = document.createElement("span")
        bonusEL.className = "salvaguarda-bonus"
        bonusEL.textContent = formatarModificador(bonus)

        const nome = document.createElement("span")
        nome.className = "salvaguarda-nome"
        nome.textContent = NOME_ATRIBUTO[atributo]

        item.appendChild(marcador)
        item.appendChild(bonusEL)
        item.appendChild(nome)
        listaSalvaguardasEL.appendChild(item)
    })
}

/* ---------- RF17 a RF20: pericias ---------- */

let periciasEscolhidas = []

function lerPericias() {
    return periciasEscolhidas.slice()
}

// usada ao abrir uma ficha ja salva
function escreverPericias(periciasSalvas) {
    periciasEscolhidas = (periciasSalvas || []).slice()
    renderizarPericias()
}

function periciasCompletas() {
    return periciasEscolhidas.length === limiteDePericias(classeEL.value)
}

function alternarPericia(valor, marcada) {
    if (marcada) {
        if (!periciasEscolhidas.includes(valor)) {
            periciasEscolhidas.push(valor)
        }
    } else {
        periciasEscolhidas = periciasEscolhidas.filter(function(item) {
            return item !== valor
        })
    }

    atualizarPericias()
}

// A ficha mostra as 18 pericias (o jogador precisa do bonus de todas em jogo).
// O wizard mostra so as que a classe permite escolher.
function mostrarTodasAsPericias() {
    return listaPericiasEL.dataset.modo === "todas"
}

// monta a lista de checkboxes conforme a classe escolhida
function renderizarPericias() {
    if (listaPericiasEL === null) {
        return
    }

    const opcoes = opcoesDePericias(classeEL.value)

    // classe nova pode nao permitir uma pericia ja marcada
    periciasEscolhidas = periciasEscolhidas.filter(function(valor) {
        return opcoes.includes(valor)
    })

    listaPericiasEL.innerHTML = ""

    PERICIAS.forEach(function(pericia) {
        if (!mostrarTodasAsPericias() && !opcoes.includes(pericia.valor)) {
            return
        }

        const item = document.createElement("label")
        item.className = "pericia"
        item.id = `pericia-${pericia.valor}`

        const caixa = document.createElement("input")
        caixa.type = "checkbox"
        caixa.value = pericia.valor
        caixa.checked = periciasEscolhidas.includes(pericia.valor)

        caixa.addEventListener("change", function() {
            alternarPericia(pericia.valor, caixa.checked)
        })

        const bonusEL = document.createElement("span")
        bonusEL.className = "pericia-bonus"
        bonusEL.id = `pericia-bonus-${pericia.valor}`

        const nome = document.createElement("span")
        nome.className = "pericia-nome"
        nome.textContent = pericia.nome

        const atributoEL = document.createElement("span")
        atributoEL.className = "pericia-atributo"
        atributoEL.textContent = `(${ABREVIACAO_ATRIBUTO[pericia.atributo]})`

        item.appendChild(caixa)
        item.appendChild(bonusEL)
        item.appendChild(nome)
        item.appendChild(atributoEL)
        listaPericiasEL.appendChild(item)
    })

    // IDEIA05: a lista é remontada a cada mudança de classe, então o cadeado
    // da ficha precisa ser reaplicado. O wizard não define esse gancho.
    if (typeof aoAtualizarFicha === "function") {
        aoAtualizarFicha()
    }

    atualizarPericias()
}

// recalcula os bonus e aplica o limite da classe
function atualizarPericias() {
    if (listaPericiasEL === null) {
        return
    }

    const calculo = calcularAtributos()
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))
    const opcoes = opcoesDePericias(classeEL.value)
    const limite = limiteDePericias(classeEL.value)
    const limiteAtingido = periciasEscolhidas.length >= limite

    const caixas = listaPericiasEL.querySelectorAll("input[type=checkbox]")

    caixas.forEach(function(caixa) {
        const pericia = periciaPorValor(caixa.value)
        const proficiente = periciasEscolhidas.includes(pericia.valor)

        // a classe nem oferece essa pericia; o bonus aparece, a escolha nao
        const disponivel = opcoes.includes(pericia.valor)
        // mesma ideia dos bonus: cheio o limite, quem nao foi escolhida trava
        const travada = disponivel && limiteAtingido && !proficiente

        const bonus = bonusComProficiencia(
            calculo.modificadores[pericia.atributo],
            proficiente,
            proficiencia
        )

        document.getElementById(`pericia-bonus-${pericia.valor}`).textContent =
            formatarModificador(bonus)

        caixa.checked = proficiente
        caixa.disabled = !disponivel || travada

        const item = document.getElementById(`pericia-${pericia.valor}`)
        item.classList.toggle("pericia-escolhida", proficiente)
        item.classList.toggle("pericia-indisponivel", !disponivel)
        item.classList.toggle("pericia-travada", travada)
    })

    // marcar ou desmarcar perícia muda as passivas
    atualizarPassivas()

    if (limite === 0) {
        statusPericiasEL.textContent = "Escolha uma classe para liberar as perícias."
        statusPericiasEL.className = "status-pericias status-erro"
        return
    }

    statusPericiasEL.textContent =
        `${periciasEscolhidas.length} de ${limite} perícias escolhidas.`
    statusPericiasEL.className = periciasCompletas()
        ? "status-pericias status-ok"
        : "status-pericias status-erro"
}

/* ---------- Sprint 5a: conjuração ---------- */

// So a ficha tem esse bloco. Classe que nao conjura deixa o bloco como espaco vazio.
function atualizarConjuracao() {
    const blocoEL = document.getElementById("bloco-conjuracao")

    if (blocoEL === null) {
        return
    }

    const atributoEL = document.getElementById("valor-atributo-conjuracao")
    const cdEL = document.getElementById("valor-cd-magia")
    const ataqueEL = document.getElementById("valor-ataque-magico")
    const tipoEL = document.getElementById("tipo-conjuracao")

    // a conjuração pode vir da subclasse (Cavaleiro Arcano, Trapaceiro Arcano)
    const subclasseAtual = typeof subclasseEL !== "undefined" && subclasseEL ? subclasseEL.value : ""
    const conjuracao = conjuracaoEfetiva(classeEL.value, subclasseAtual)
    blocoEL.classList.toggle("bloco-vazio", conjuracao === null)

    if (conjuracao === null) {
        atributoEL.textContent = "—"
        cdEL.textContent = "—"
        ataqueEL.textContent = "—"
        tipoEL.textContent = classeEL.value === ""
            ? "Escolha uma classe."
            : "Esta classe não conjura magias."
        return
    }

    const modificador = calcularAtributos().modificadores[conjuracao.atributo]
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))

    atributoEL.textContent = ABREVIACAO_ATRIBUTO[conjuracao.atributo]
    cdEL.textContent = cdDeMagia(proficiencia, modificador)
    ataqueEL.textContent = formatarModificador(ataqueMagico(proficiencia, modificador))
    tipoEL.textContent =
        `${NOME_TIPO_CONJURADOR[conjuracao.tipo]} · usa ${NOME_ATRIBUTO[conjuracao.atributo]}`
}

/* ---------- RF05: valores passivos ---------- */

// So a ficha tem esse bloco; o wizard nao.
// talentosDoPersonagem (mais acima) traz o Observador, que soma +5.
function atualizarPassivas() {
    const linhaEL = document.getElementById("linha-passivas")

    if (linhaEL === null) {
        return
    }

    const calculo = calcularAtributos()
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))

    linhaEL.innerHTML = ""

    PASSIVAS.forEach(function(passiva) {
        const pericia = periciaPorValor(passiva.pericia)

        const bonus = bonusComProficiencia(
            calculo.modificadores[pericia.atributo],
            periciasEscolhidas.includes(passiva.pericia),
            proficiencia
        )

        const campo = document.createElement("div")
        campo.className = "campo-passiva"

        const valor = document.createElement("span")
        valor.className = "valor-destaque"
        valor.textContent = valorPassivo(passiva, bonus, talentosDoPersonagem)

        const rotulo = document.createElement("span")
        rotulo.className = "rotulo"
        rotulo.textContent = passiva.nome

        campo.appendChild(valor)
        campo.appendChild(rotulo)
        linhaEL.appendChild(campo)
    })
}

/* ---------- Ligacoes ---------- */

// Tudo que e derivado sai daqui. Bloco novo entra nesta funcao e passa a
// reagir a qualquer mudanca, sem precisar ser ligado em cada evento.
function recalcularDerivados() {
    // base e bônus mudam o que cada atributo ainda pode receber
    atualizarOpcoesBonus()
    atualizarModificadores()
    atualizarProficiencia()
    atualizarPericias()
    atualizarSalvaguardas()
    atualizarPontosDeVida()
    atualizarConjuracao()
    atualizarPassivas()

    // IDEIA05: as regras acima ligam e desligam campos (bônus que somem,
    // perícias acima do limite); com a ficha travada o cadeado vale mais
    if (typeof aoAtualizarFicha === "function") {
        aoAtualizarFicha()
    }
}

// atualizarRaca fica de fora: traços e idiomas só dependem de raça e sub-raça,
// que têm listener próprio. Remontar essas listas a cada tecla era desperdício.

ATRIBUTOS.forEach(function(atributo) {
    document
        .getElementById(`bonus-${atributo}`)
        .addEventListener("change", function() {
            mostrarStatusBonus()
            recalcularDerivados()
        })

    document
        .getElementById(atributo)
        .addEventListener("input", recalcularDerivados)
})

nivelEL.addEventListener("input", recalcularDerivados)

// a classe muda a lista inteira de pericias, entao remonta em vez de so recalcular
classeEL.addEventListener("change", function() {
    renderizarPericias()
    recalcularDerivados()
})

racaEL.addEventListener("change", atualizarRaca)
subracaEL.addEventListener("change", atualizarRaca)

// estado inicial da tela; a ficha de edicao sobrescreve depois de carregar o personagem
renderizarPericias()
recalcularDerivados()
atualizarRaca()

// a prévia de deslocamento, traços e idiomas acompanha o que está sendo escrito
;["raca-propria-nome", "raca-propria-deslocamento", "raca-propria-tracos", "raca-propria-idiomas"]
    .forEach(function(id) {
        const campo = document.getElementById(id)

        if (campo !== null) {
            campo.addEventListener("input", atualizarRaca)
        }
    })

// a lista de idiomas acompanha o que está sendo digitado
;(function() {
    const campo = document.getElementById("idiomas-extras")

    if (campo !== null) {
        campo.addEventListener("input", atualizarRaca)
    }
})()
