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
const botoesDadoVidaEL = document.getElementById("botoes-dado-vida")
const acaoConcluirCurtoEL = document.getElementById("acao-concluir-curto")

// quantos dados de vida já foram gastos desde o último descanso longo,
// por classe ({ guerreiro: 2 }): cada classe tem o dado dela
let dadosVidaGastos = {}

function classePadraoDoPersonagem() {
    return classesParaCalculo.length ? classesParaCalculo[0].classe : classeEL.value
}

function dadosVidaTotais() {
    return Number(nivelEL.value)
}

function dadosVidaDisponiveis() {
    return totalDeDadosDisponiveis(classesParaCalculo, dadosVidaGastos, classePadraoDoPersonagem())
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

    const grupos = dadosDeVidaDisponiveis(
        classesParaCalculo,
        dadosVidaGastos,
        classePadraoDoPersonagem()
    )

    botoesDadoVidaEL.innerHTML = ""

    grupos.forEach(function (grupo) {
        const botao = document.createElement("button")
        botao.type = "button"

        // com uma classe só o texto continua o de sempre
        botao.textContent = grupos.length > 1
            ? `Gastar d${grupo.dado} (${nomeDaClasse(grupo.classe)}) — ${grupo.disponiveis} de ${grupo.total}`
            : "Gastar dado de vida"

        botao.disabled = grupo.disponiveis <= 0

        botao.addEventListener("click", function () {
            gastarDadoDeVida(grupo.classe)
        })

        botoesDadoVidaEL.appendChild(botao)
    })
}

// RF23: gastar um dado de vida recupera 1 dado + modificador de Constituição.
// Com multiclasse, o jogador escolhe de qual classe é o dado.
function gastarDadoDeVida(classe) {
    const gastos = normalizarDadosGastos(dadosVidaGastos, classePadraoDoPersonagem())

    const grupo = dadosDeVidaDisponiveis(
        classesParaCalculo,
        gastos,
        classePadraoDoPersonagem()
    ).find(function (item) {
        return item.classe === classe
    })

    if (!grupo || grupo.disponiveis <= 0) {
        return
    }

    const modificador = calcularAtributos().modificadores.constituicao
    const rolagem = rolarDado(grupo.dado)

    // uma Constituição negativa nunca tira PV de quem está descansando
    const recuperado = Math.max(0, rolagem + modificador)

    gastos[classe] = (gastos[classe] || 0) + 1
    dadosVidaGastos = gastos

    definirPvAtual(Number(pvAtualEL.value) + recuperado)
    atualizarDadosDeVida()

    const deQuem = classesParaCalculo.length > 1 ? ` de ${nomeDaClasse(classe)}` : ""

    resultadoDescansoEL.textContent =
        `Rolou ${rolagem} no d${grupo.dado}${deQuem} ${formatarModificador(modificador)} = ${recuperado} PV recuperados.`
}

// RF27: espaços de magia voltam ao total; atualizarEspacosDeMagia fica mais abaixo
function recuperarEspacosDeMagia() {
    espacosGastos = {}
    atualizarEspacosDeMagia()
}

// RF23, RF27, RF31: fim do descanso curto. Voltam os recursos que recuperam no
// curto e, no Bruxo, a Magia de Pacto. atualizarRecursos fica mais abaixo.
function concluirDescansoCurto() {
    const recursos = recursosAtuais()
    const antes = recursosGastosValidos()

    recursosGastos = recuperarRecursos(antes, recursos, "curto")
    atualizarRecursos()

    const recuperados = []

    if (recuperaMagiaEmDescansoCurto(classeEL.value)) {
        recuperarEspacosDeMagia()
        recuperados.push("espaços de Pacto")
    }

    recursos.forEach(function (recurso) {
        const devolvidos = (antes[recurso.valor] || 0) - recursosGastos[recurso.valor]

        if (devolvidos > 0) {
            recuperados.push(`${recurso.nome} (+${devolvidos})`)
        }
    })

    resultadoDescansoEL.textContent = recuperados.length
        ? `Recuperado: ${recuperados.join(", ")}.`
        : "Nada para recuperar neste descanso curto."
}

// RF23: descanso longo devolve tudo, inclusive todos os dados de vida (regra 2024)
function concluirDescansoLongo() {
    const devolvidos = dadosVidaTotais() - dadosVidaDisponiveis()
    const conjura = classesConjuradoras(classesParaCalculo).length > 0

    definirPvAtual(calcularPvMaximo())
    pvTemporarioEL.value = 0
    lembrarPv()
    dadosVidaGastos = {}

    atualizarDadosDeVida()

    // RF27: no descanso longo toda classe conjuradora recupera os espaços
    if (conjura) {
        recuperarEspacosDeMagia()
    }

    // RF31: e todo recurso de classe volta ao total
    const temRecursos = recursosAtuais().length > 0
    recursosGastos = {}
    atualizarRecursos()

    const extras = [
        conjura ? "espaços de magia recuperados" : null,
        temRecursos ? "recursos de classe recuperados" : null
    ].filter(Boolean)

    const espacos = extras.length ? `, ${extras.join(", ")}` : ""

    // RF30: a troca liberada fica guardada até ser usada na aba de magias.
    // Com multiclasse, cada classe conjuradora libera a troca dela.
    trocasMagia = liberarTrocasMulticlasse(trocasMagia, classesParaCalculo, "descansoLongo")

    const porClasse = classesConjuradoras(classesParaCalculo)
        .map(function (entrada) {
            const troca = descreverTrocas(trocasLiberadas(entrada.classe, "descansoLongo"))
            return troca
                ? (classesConjuradoras(classesParaCalculo).length > 1
                    ? `${nomeDaClasse(entrada.classe)}: ${troca}`
                    : troca)
                : null
        })
        .filter(Boolean)

    const textoTroca = porClasse.length
        ? ` Troca liberada: ${porClasse.join("; ")} (aba Magias).`
        : ""

    resultadoDescansoEL.textContent =
        `PV no máximo, temporários zerados${espacos} e ${devolvidos} dado(s) de vida recuperado(s).${textoTroca}`
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
    acaoConcluirCurtoEL.hidden = !curto

    // o que o descanso vai trazer, para o jogador saber antes de concluir
    const pendencias = []
    const recursos = recursosAtuais()

    if (curto) {
        const voltam = recursos
            .filter(function (recurso) {
                return recurso.recupera !== "longo"
            })
            .map(function (recurso) {
                return recurso.recupera === "umNoCurto" ? `${recurso.nome} (1 uso)` : recurso.nome
            })

        if (recuperaMagiaEmDescansoCurto(classeEL.value)) {
            voltam.unshift("espaços de Pacto")
        }

        if (voltam.length) {
            pendencias.push(`Ao concluir, recupera: ${voltam.join(", ")}.`)
        }
    } else {
        const troca = descreverTrocas(trocasLiberadas(classeEL.value, "descansoLongo"))

        if (troca) {
            pendencias.push(`Ao concluir, libera a troca de ${troca} na aba Magias.`)
        }

        if (recursos.length) {
            pendencias.push("Ao concluir, todos os recursos de classe voltam ao total.")
        }
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


document
    .getElementById("btn-concluir-curto")
    .addEventListener("click", concluirDescansoCurto)

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
// Pacto e comum podem ser do mesmo círculo: cada um tem sua contagem
function chaveDoEspaco(espaco) {
    return espaco.pacto ? `pacto${espaco.circulo}` : String(espaco.circulo)
}

function espacosGastosValidos() {
    const validos = {}

    espacosDeMagiaMulticlasse(classesDoCalculo()).forEach(function (espaco) {
        const chave = chaveDoEspaco(espaco)
        validos[chave] = Math.min(espacosGastos[chave] || 0, espaco.total)
    })

    return validos
}

function atualizarEspacosDeMagia() {
    // multiclasse: níveis somados na tabela de conjurador, Pacto à parte
    const espacos = espacosDeMagiaMulticlasse(classesDoCalculo())
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
        const chave = chaveDoEspaco(espaco)
        const gasto = gastos[chave]

        const linha = document.createElement("div")
        linha.className = "linha-espaco"

        const rotulo = document.createElement("span")
        rotulo.className = "espaco-rotulo"
        rotulo.textContent = espaco.pacto
            ? `${espaco.circulo}º círculo (Pacto)`
            : `${espaco.circulo}º círculo`

        const circulosEL = document.createElement("div")
        circulosEL.className = "espaco-circulos"

        montarCirculos(circulosEL, espaco.total, gasto, false, function (novo) {
            espacosGastos[chave] = novo
            atualizarEspacosDeMagia()
        })

        const restantes = document.createElement("span")
        restantes.className = "espaco-restantes"
        restantes.textContent = `${espaco.total - gasto} de ${espaco.total}`

        linha.appendChild(rotulo)
        linha.appendChild(circulosEL)
        linha.appendChild(restantes)
        listaEspacosEL.appendChild(linha)
    })
}

// trocar de classe muda a tabela de espacos (ou tira ela)
classeEL.addEventListener("change", atualizarEspacosDeMagia)

/* ---------- Sprint 7: defesa (RF32, RF33) ---------- */

const armaduraEL = document.getElementById("armadura")
const escudoEL = document.getElementById("escudo")

const NOME_DA_CATEGORIA = { leve: "leve", media: "média", pesada: "pesada" }

function montarSelectDeArmaduras() {
    armaduraEL.innerHTML = ""

    const semArmadura = document.createElement("option")
    semArmadura.value = ""
    semArmadura.textContent = "Sem armadura"
    armaduraEL.appendChild(semArmadura)

    ARMADURAS.forEach(function (armadura) {
        // o escudo não é "vestido": entra pela caixa ao lado
        if (armadura.categoria === "escudo") {
            return
        }

        const opcao = document.createElement("option")
        opcao.value = armadura.valor
        opcao.textContent = `${armadura.nome} (${NOME_DA_CATEGORIA[armadura.categoria]})`
        armaduraEL.appendChild(opcao)
    })
}

// RF32 e RF33: iniciativa e CA, com o melhor cálculo que a classe permite
function atualizarDefesa() {
    const calculo = calcularAtributos()
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))

    // multiclasse: vale o melhor cálculo entre as classes
    const ca = calcularCAMulticlasse(
        classesDoCalculo(),
        armaduraEL.value,
        escudoEL.checked,
        calculo.modificadores,
        calculo.totais.forca
    )

    document.getElementById("valor-ca").textContent = ca.total
    document.getElementById("formula-ca").textContent =
        escudoEL.checked ? `${ca.formula} + escudo` : ca.formula
    document.getElementById("avisos-armadura").textContent = ca.avisos.join(" ")

    const iniciativa = calcularIniciativa(
        calculo.modificadores.destreza,
        proficiencia,
        talentosDoPersonagem
    )

    document.getElementById("valor-iniciativa").textContent = formatarModificador(iniciativa)
    document.getElementById("detalhe-iniciativa").textContent =
        iniciativa === calculo.modificadores.destreza ? "Destreza" : "Destreza + Alerta"
}

armaduraEL.addEventListener("change", atualizarDefesa)
escudoEL.addEventListener("change", atualizarDefesa)
classeEL.addEventListener("change", atualizarDefesa)

/* ---------- RF03: personalidade (texto livre) ---------- */

// id do campo na tela -> campo salvo no personagem
const CAMPOS_DE_PERSONALIDADE = [
    ["tracos-personalidade", "tracosPersonalidade"],
    ["ideais", "ideais"],
    ["vinculos", "vinculos"],
    ["defeitos", "defeitos"]
]

function escreverPersonalidade() {
    CAMPOS_DE_PERSONALIDADE.forEach(function (campo) {
        document.getElementById(campo[0]).value = personagem[campo[1]] || ""
    })
}

function lerPersonalidade() {
    CAMPOS_DE_PERSONALIDADE.forEach(function (campo) {
        personagem[campo[1]] = document.getElementById(campo[0]).value
    })
}

/* ---------- Sprint 8: moedas e inventário (RF36, RF37) ---------- */

const linhaMoedasEL = document.getElementById("linha-moedas")
const listaItensEL = document.getElementById("lista-itens")
const itemNomeEL = document.getElementById("item-nome")
const itemQuantidadeEL = document.getElementById("item-quantidade")
const itemPesoEL = document.getElementById("item-peso")

// { pc: 0, pp: 0, ... } e [{ nome, quantidade, peso }]
let moedasDoPersonagem = {}
let itensDoPersonagem = []

function montarCamposDeMoedas() {
    linhaMoedasEL.innerHTML = ""

    MOEDAS.forEach(function (moeda) {
        const campo = document.createElement("div")
        campo.className = "campo campo-moeda"

        const entrada = document.createElement("input")
        entrada.type = "number"
        entrada.min = 0
        entrada.id = `moeda-${moeda.valor}`
        entrada.value = moedasDoPersonagem[moeda.valor] || 0
        entrada.title = moeda.nomeCompleto

        entrada.addEventListener("change", function () {
            moedasDoPersonagem[moeda.valor] = Math.max(0, Number(entrada.value) || 0)
            entrada.value = moedasDoPersonagem[moeda.valor]
            atualizarTotalDeMoedas()
        })

        const rotulo = document.createElement("span")
        rotulo.className = "rotulo"
        rotulo.textContent = moeda.nome

        campo.appendChild(entrada)
        campo.appendChild(rotulo)
        linhaMoedasEL.appendChild(campo)
    })
}

function atualizarTotalDeMoedas() {
    const total = totalEmOuro(moedasDoPersonagem)

    // o total some quando a bolsa está vazia, para não poluir a ficha
    document.getElementById("total-moedas").textContent = total > 0
        ? `Total: ${total.toFixed(2).replace(".", ",")} PO`
        : ""
}

function adicionarItem() {
    const nome = itemNomeEL.value.trim()

    if (nome === "") {
        itemNomeEL.focus()
        return
    }

    itensDoPersonagem.push({
        nome: nome,
        quantidade: Math.max(1, Number(itemQuantidadeEL.value) || 1),
        peso: Math.max(0, Number(itemPesoEL.value) || 0)
    })

    itemNomeEL.value = ""
    itemQuantidadeEL.value = 1
    itemPesoEL.value = 0
    itemNomeEL.focus()

    atualizarInventario()
}

function criarLinhaDeItem(item, indice) {
    const linha = document.createElement("div")
    linha.className = "ataque"

    const quantidade = document.createElement("input")
    quantidade.type = "number"
    quantidade.min = 1
    quantidade.className = "item-quantidade"
    quantidade.value = item.quantidade
    quantidade.title = "Quantidade"
    quantidade.addEventListener("change", function () {
        item.quantidade = Math.max(1, Number(quantidade.value) || 1)
        atualizarInventario()
    })

    const nome = document.createElement("span")
    nome.className = "ataque-nome"
    nome.textContent = item.nome

    const peso = document.createElement("span")
    peso.className = "ataque-aviso"
    peso.textContent = item.peso
        ? `${(item.peso * item.quantidade).toFixed(1).replace(".", ",")} kg`
        : ""

    const remover = document.createElement("button")
    remover.type = "button"
    remover.className = "ataque-remover"
    remover.textContent = "×"
    remover.title = "Remover este item"
    remover.addEventListener("click", function () {
        itensDoPersonagem.splice(indice, 1)
        atualizarInventario()
    })

    linha.appendChild(quantidade)
    linha.appendChild(nome)
    linha.appendChild(peso)
    linha.appendChild(remover)
    return linha
}

function atualizarInventario() {
    listaItensEL.innerHTML = ""

    if (itensDoPersonagem.length === 0) {
        const vazio = document.createElement("p")
        vazio.className = "vazio-texto"
        vazio.textContent = "Inventário vazio."
        listaItensEL.appendChild(vazio)
    } else {
        itensDoPersonagem.forEach(function (item, indice) {
            listaItensEL.appendChild(criarLinhaDeItem(item, indice))
        })
    }

    const peso = pesoDoInventario(itensDoPersonagem)
    const capacidade = capacidadeDeCarga(calcularAtributos().totais.forca)
    const pesoEL = document.getElementById("peso-total")

    if (peso === 0) {
        pesoEL.textContent = `Capacidade de carga: ${capacidade.toFixed(1).replace(".", ",")} kg (7,5 kg por ponto de Força).`
        pesoEL.classList.remove("status-erro")
        return
    }

    const numeros = `${peso.toFixed(1).replace(".", ",")} kg de ${capacidade.toFixed(1).replace(".", ",")} kg`

    pesoEL.textContent = estaSobrecarregado(peso, capacidade)
        ? `Sobrecarregado: ${numeros}.`
        : `Peso carregado: ${numeros}.`
    pesoEL.classList.toggle("status-erro", estaSobrecarregado(peso, capacidade))
}

document.getElementById("btn-adicionar-item").addEventListener("click", adicionarItem)

// Enter no nome do item adiciona, em vez de enviar a ficha
itemNomeEL.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault()
        adicionarItem()
    }
})

/* ---------- Sprint 7: condições (RF35) ---------- */

const API_CONDICOES = "https://www.dnd5eapi.co/api/2024/conditions"
const listaCondicoesEL = document.getElementById("lista-condicoes")
const exaustaoEL = document.getElementById("exaustao")
const detalheCondicaoEL = document.getElementById("detalhe-condicao")

// condições ligadas agora; a exaustão é à parte, porque tem níveis
let condicoesAtivas = []
let nivelDeExaustao = 0

const descricoesDeCondicoes = {}

function fecharCondicao() {
    detalheCondicaoEL.hidden = true
    detalheCondicaoEL.innerHTML = ""
}

// a lista funciona sem internet; só a descrição vem da API
async function mostrarCondicao(condicao) {
    detalheCondicaoEL.hidden = false
    detalheCondicaoEL.innerHTML = ""

    const fechar = document.createElement("button")
    fechar.type = "button"
    fechar.className = "detalhe-fechar"
    fechar.textContent = "Fechar"
    fechar.addEventListener("click", fecharCondicao)

    const titulo = document.createElement("span")
    titulo.className = "detalhe-titulo"
    titulo.textContent = condicao.nome

    const texto = document.createElement("p")
    texto.className = "detalhe-descricao"
    texto.textContent = "Buscando a descrição..."

    detalheCondicaoEL.appendChild(fechar)
    detalheCondicaoEL.appendChild(titulo)
    detalheCondicaoEL.appendChild(texto)

    try {
        if (!descricoesDeCondicoes[condicao.valor]) {
            const resposta = await fetch(`${API_CONDICOES}/${condicao.valor}`)

            if (!resposta.ok) {
                throw new Error(`A API respondeu ${resposta.status}`)
            }

            const dados = await resposta.json()
            const descricao = dados.description || dados.desc || "Sem descrição."

            descricoesDeCondicoes[condicao.valor] = Array.isArray(descricao)
                ? descricao.join("\n\n")
                : descricao
        }

        texto.textContent = descricoesDeCondicoes[condicao.valor]
    } catch (erro) {
        texto.textContent = "Sem conexão para buscar a descrição. Tente de novo."
        console.error(erro)
    }
}

function alternarCondicao(condicao) {
    if (condicoesAtivas.includes(condicao.valor)) {
        condicoesAtivas = condicoesAtivas.filter(function (valor) {
            return valor !== condicao.valor
        })
        fecharCondicao()
    } else {
        condicoesAtivas.push(condicao.valor)
        // ligar a condição já mostra o que ela faz
        mostrarCondicao(condicao)
    }

    atualizarCondicoes()
}

function montarSelectDeExaustao() {
    exaustaoEL.innerHTML = ""

    for (let nivel = 0; nivel <= EXAUSTAO_MAXIMA; nivel++) {
        const opcao = document.createElement("option")
        opcao.value = nivel
        opcao.textContent = nivel === 0 ? "Sem exaustão" : `Nível ${nivel}`
        exaustaoEL.appendChild(opcao)
    }
}

function atualizarCondicoes() {
    listaCondicoesEL.innerHTML = ""

    CONDICOES.forEach(function (condicao) {
        const ativa = condicoesAtivas.includes(condicao.valor)

        const botao = document.createElement("button")
        botao.type = "button"
        botao.className = "condicao"
        botao.classList.toggle("condicao-ativa", ativa)
        botao.textContent = condicao.nome
        botao.title = ativa ? "Clique para tirar a condição" : "Clique para marcar e ver o efeito"
        botao.addEventListener("click", function () {
            alternarCondicao(condicao)
        })

        listaCondicoesEL.appendChild(botao)
    })

    const efeitos = efeitosDaExaustao(nivelDeExaustao)
    const efeitoEL = document.getElementById("efeito-exaustao")

    if (nivelDeExaustao === 0) {
        efeitoEL.textContent = ""
    } else if (efeitos.morre) {
        efeitoEL.textContent = "Nível 6: o personagem morre."
    } else {
        efeitoEL.textContent =
            `Testes de d20 ${efeitos.testes}, deslocamento ${efeitos.deslocamento} m.`
    }
}

exaustaoEL.addEventListener("change", function () {
    nivelDeExaustao = Number(exaustaoEL.value)
    atualizarCondicoes()
})

/* ---------- Sprint 7: ataques (RF34) ---------- */

const armaNovaEL = document.getElementById("arma-nova")
const listaAtaquesEL = document.getElementById("lista-ataques")

// armas que o jogador pôs na ficha: [{ valor, duasMaos }]
let armasDoPersonagem = []

function montarSelectDeArmas() {
    armaNovaEL.innerHTML = ""

    armasParaEscolher().forEach(function (arma) {
        const opcao = document.createElement("option")
        opcao.value = arma.valor
        opcao.textContent = arma.valor === ARMA_DESARMADA.valor
            ? arma.nome
            : `${arma.nome} (${arma.categoria === "simples" ? "simples" : "marcial"})`
        armaNovaEL.appendChild(opcao)
    })
}

function adicionarArma() {
    armasDoPersonagem.push({ valor: armaNovaEL.value, duasMaos: false })
    atualizarAtaques()
}

function criarLinhaDeAtaque(item, indice, modificadores, proficiencia) {
    const arma = armaPorValor(item.valor)

    if (arma === null) {
        return null
    }

    // multiclasse: basta uma classe dar proficiência; o dado da classe usa o nível dela
    const ataque = ataqueComArmaMulticlasse(
        classesDoCalculo(),
        arma,
        modificadores,
        proficiencia,
        item.duasMaos
    )

    const linha = document.createElement("div")
    linha.className = "ataque"

    const nome = document.createElement("span")
    nome.className = "ataque-nome"
    nome.textContent = arma.nome

    const bonus = document.createElement("span")
    bonus.className = "ataque-valor"
    bonus.textContent = formatarModificador(ataque.bonusDeAtaque)
    bonus.title = `Ataque: ${NOME_ATRIBUTO[ataque.atributo]}${ataque.proficiente ? " + proficiência" : " (sem proficiência)"}`

    const dano = document.createElement("span")
    dano.className = "ataque-dano"
    const somaDoDano = ataque.modificadorDeDano
        ? formatarModificador(ataque.modificadorDeDano)
        : ""
    dano.textContent = `${ataque.dadoDeDano}${somaDoDano} ${ataque.tipoDeDano}`

    linha.appendChild(nome)
    linha.appendChild(bonus)
    linha.appendChild(dano)

    // versátil: a mesma arma muda de dado nas duas mãos
    if (arma.danoDuasMaos) {
        const duasMaos = document.createElement("label")
        duasMaos.className = "ataque-marca"

        const caixa = document.createElement("input")
        caixa.type = "checkbox"
        caixa.checked = item.duasMaos === true
        caixa.addEventListener("change", function () {
            item.duasMaos = caixa.checked
            atualizarAtaques()
        })

        duasMaos.appendChild(caixa)
        duasMaos.appendChild(document.createTextNode("2 mãos"))
        linha.appendChild(duasMaos)
    }

    const avisos = []

    if (!ataque.proficiente) {
        avisos.push("sem proficiência")
    }

    if (ataque.dadoDaClasse) {
        avisos.push("dado da classe")
    }

    if (avisos.length) {
        const aviso = document.createElement("span")
        aviso.className = "ataque-aviso"
        aviso.textContent = avisos.join(", ")
        linha.appendChild(aviso)
    }

    const remover = document.createElement("button")
    remover.type = "button"
    remover.className = "ataque-remover"
    remover.textContent = "×"
    remover.title = "Remover este ataque"
    remover.addEventListener("click", function () {
        armasDoPersonagem.splice(indice, 1)
        atualizarAtaques()
    })

    linha.appendChild(remover)
    return linha
}

function atualizarAtaques() {
    const calculo = calcularAtributos()
    const proficiencia = bonusDeProficiencia(Number(nivelEL.value))

    listaAtaquesEL.innerHTML = ""

    if (armasDoPersonagem.length === 0) {
        const vazio = document.createElement("p")
        vazio.className = "vazio-texto"
        vazio.textContent = "Nenhum ataque. Escolha uma arma acima e clique em Adicionar."
        listaAtaquesEL.appendChild(vazio)
        return
    }

    armasDoPersonagem.forEach(function (item, indice) {
        const linha = criarLinhaDeAtaque(item, indice, calculo.modificadores, proficiencia)

        if (linha !== null) {
            listaAtaquesEL.appendChild(linha)
        }
    })
}

document.getElementById("btn-adicionar-arma").addEventListener("click", adicionarArma)

// trocar de classe muda proficiência e o dado da classe (Fisticuffs)
classeEL.addEventListener("change", atualizarAtaques)

/* ---------- Sprint 6: recursos de classe (RF31) ---------- */

const listaRecursosEL = document.getElementById("lista-recursos")

// quanto de cada recurso já foi gasto: { furia: 1, curaPelasMaos: 15, ... }
let recursosGastos = {}

// até este total os usos viram bolinhas; acima (Pontos de Foco, Cura pelas Mãos)
// o jogador digita quanto resta
const MAXIMO_DE_BOLINHAS = 8

function recursosAtuais() {
    // multiclasse: junta os recursos de cada classe, pelo nível dela
    return recursosMulticlasse(classesDoCalculo(), calcularAtributos().modificadores)
}

// o que foi marcado, limitado ao total que a classe e o nível atuais dão
function recursosGastosValidos() {
    const validos = {}

    recursosAtuais().forEach(function (recurso) {
        validos[recurso.valor] = Math.min(recursosGastos[recurso.valor] || 0, recurso.total)
    })

    return validos
}

function criarContadorDeRecurso(recurso, gasto) {
    const campo = document.createElement("input")
    campo.type = "number"
    campo.min = 0
    campo.max = recurso.total
    campo.value = recurso.total - gasto
    campo.className = "recurso-restante"
    campo.title = "Quanto ainda resta"

    campo.addEventListener("change", function () {
        const restante = Math.min(recurso.total, Math.max(0, Number(campo.value) || 0))
        recursosGastos[recurso.valor] = recurso.total - restante
        atualizarRecursos()
    })

    return campo
}

function atualizarRecursos() {
    const recursos = recursosAtuais()
    const gastos = recursosGastosValidos()

    document.getElementById("bloco-recursos").hidden = recursos.length === 0
    listaRecursosEL.innerHTML = ""

    recursos.forEach(function (recurso) {
        const gasto = gastos[recurso.valor]

        const item = document.createElement("div")
        item.className = "recurso"

        const linha = document.createElement("div")
        linha.className = "linha-espaco"

        const nome = document.createElement("span")
        nome.className = "espaco-rotulo"
        nome.textContent = recurso.nome
        linha.appendChild(nome)

        if (recurso.total <= MAXIMO_DE_BOLINHAS) {
            // bolinha cheia = uso gasto, igual aos espaços de magia
            const circulosEL = document.createElement("div")
            circulosEL.className = "espaco-circulos"

            montarCirculos(circulosEL, recurso.total, gasto, false, function (novo) {
                recursosGastos[recurso.valor] = novo
                atualizarRecursos()
            })

            linha.appendChild(circulosEL)
        } else {
            linha.appendChild(criarContadorDeRecurso(recurso, gasto))
        }

        const restantes = document.createElement("span")
        restantes.className = "espaco-restantes"
        restantes.textContent = `${recurso.total - gasto} de ${recurso.total}`
        linha.appendChild(restantes)

        const ajuda = document.createElement("p")
        ajuda.className = "recurso-ajuda"
        ajuda.textContent = recurso.detalhe
            ? `${recurso.detalhe} · ${COMO_RECUPERA[recurso.recupera]}`
            : COMO_RECUPERA[recurso.recupera]

        item.appendChild(linha)
        item.appendChild(ajuda)
        listaRecursosEL.appendChild(item)
    })
}

// classe e atributos mudam os totais (a Inspiração de Bardo usa o Carisma)
classeEL.addEventListener("change", atualizarRecursos)

formFicha.addEventListener("input", function (evento) {
    const id = evento.target.id

    if (ATRIBUTOS.includes(id) || id.startsWith("bonus-")) {
        atualizarRecursos()
        atualizarDefesa()
        atualizarAtaques()
        // a Força muda a capacidade de carga
        atualizarInventario()
    }
})

/* ---------- Sprint 6.5: habilidades por nível (RF13) ---------- */

const API_HABILIDADES = "https://www.dnd5eapi.co/api/2024/features"
const listaHabilidadesEL = document.getElementById("lista-habilidades")
const detalheHabilidadeEL = document.getElementById("detalhe-habilidade")

// descrições já buscadas, para não pedir a mesma habilidade duas vezes
const descricoesDeHabilidades = {}
let habilidadeAberta = null

function fecharHabilidade() {
    habilidadeAberta = null
    detalheHabilidadeEL.hidden = true
    detalheHabilidadeEL.innerHTML = ""
}

// a lista funciona sem internet; só a descrição vem da API, ao clicar
async function abrirHabilidade(habilidade, rotulo) {
    if (habilidadeAberta === habilidade.api) {
        fecharHabilidade()
        return
    }

    habilidadeAberta = habilidade.api
    detalheHabilidadeEL.hidden = false
    detalheHabilidadeEL.innerHTML = ""

    const fechar = document.createElement("button")
    fechar.type = "button"
    fechar.className = "detalhe-fechar"
    fechar.textContent = "Fechar"
    fechar.addEventListener("click", fecharHabilidade)

    const titulo = document.createElement("span")
    titulo.className = "detalhe-titulo"
    titulo.textContent = rotulo

    const texto = document.createElement("p")
    texto.className = "detalhe-descricao"
    texto.textContent = "Buscando a descrição..."

    detalheHabilidadeEL.appendChild(fechar)
    detalheHabilidadeEL.appendChild(titulo)
    detalheHabilidadeEL.appendChild(texto)

    try {
        if (!descricoesDeHabilidades[habilidade.api]) {
            const resposta = await fetch(`${API_HABILIDADES}/${habilidade.api}`)

            if (!resposta.ok) {
                throw new Error(`A API respondeu ${resposta.status}`)
            }

            const dados = await resposta.json()
            const descricao = dados.description || dados.desc || "Sem descrição."

            descricoesDeHabilidades[habilidade.api] = Array.isArray(descricao)
                ? descricao.join("\n\n")
                : descricao
        }

        // o jogador pode ter clicado em outra habilidade enquanto isso
        if (habilidadeAberta === habilidade.api) {
            texto.textContent = descricoesDeHabilidades[habilidade.api]
        }
    } catch (erro) {
        texto.textContent = "Sem conexão para buscar a descrição. Tente de novo."
        console.error(erro)
    }
}

// uma linha por nível, do 1 até o nível atual, com as da subclasse escolhida
function atualizarHabilidades() {
    const classe = classeEL.value
    // multiclasse: as habilidades de cada classe, pelo nível dela
    const habilidades = habilidadesMulticlasse(classesDoCalculo())

    listaHabilidadesEL.innerHTML = ""
    fecharHabilidade()

    if (habilidades.length === 0) {
        const vazio = document.createElement("p")
        vazio.className = "vazio-texto"
        vazio.textContent = classe === ""
            ? "Escolha uma classe."
            : "Nenhuma habilidade registrada para esta classe."
        listaHabilidadesEL.appendChild(vazio)
        return
    }

    const classes = classesDoCalculo()

    // com mais de uma classe, cada uma ganha um título antes dos níveis dela
    classes.forEach(function (entrada) {
        const daClasse = habilidades.filter(function (habilidade) {
            return habilidade.classe === entrada.classe
        })

        if (daClasse.length === 0) {
            return
        }

        if (classes.length > 1) {
            const titulo = document.createElement("p")
            titulo.className = "habilidades-classe"
            titulo.textContent = `${nomeDaClasse(entrada.classe)} ${entrada.nivel}`
            listaHabilidadesEL.appendChild(titulo)
        }

        montarHabilidadesDaClasse(daClasse)
    })
}

function montarHabilidadesDaClasse(habilidades) {
    const niveis = []

    habilidades.forEach(function (habilidade) {
        if (!niveis.includes(habilidade.nivel)) {
            niveis.push(habilidade.nivel)
        }
    })

    niveis.forEach(function (nivel) {
        const linha = document.createElement("p")
        linha.className = "habilidades-nivel"

        const titulo = document.createElement("strong")
        titulo.textContent = `Nível ${nivel}: `
        linha.appendChild(titulo)

        habilidades
            .filter(function (habilidade) {
                return habilidade.nivel === nivel
            })
            .forEach(function (habilidade, posicao) {
                if (posicao > 0) {
                    linha.appendChild(document.createTextNode(", "))
                }

                // sem código da API (conteúdo extra, marca de subclasse) não há descrição
                if (!habilidade.api) {
                    linha.appendChild(document.createTextNode(habilidade.rotulo))
                    return
                }

                const botao = document.createElement("button")
                botao.type = "button"
                botao.className = "magia-abrir"
                botao.textContent = habilidade.rotulo
                botao.addEventListener("click", function () {
                    abrirHabilidade(habilidade, habilidade.rotulo)
                })
                linha.appendChild(botao)
            })

        listaHabilidadesEL.appendChild(linha)
    })
}

// classe e subclasse mudam a lista (o nível só muda pelo level up)
classeEL.addEventListener("change", atualizarHabilidades)
subclasseEL.addEventListener("change", atualizarHabilidades)

/* ---------- Sprint 5a: concentração (RF28) ---------- */

const blocoConcentracaoEL = document.getElementById("bloco-concentracao")
const magiaConcentracaoEL = document.getElementById("magia-concentracao")
const outraConcentracaoEL = document.getElementById("magia-concentracao-outra")

// valor da opção que libera o campo de texto
const OUTRA_MAGIA = "__outra"
const concentracaoAtivaEL = document.getElementById("concentracao-ativa")
const statusConcentracaoEL = document.getElementById("status-concentracao")
const btnConcentrarEL = document.getElementById("btn-concentrar")
const btnEncerrarConcentracaoEL = document.getElementById("btn-encerrar-concentracao")

// nome da magia; vazio = sem concentração
let concentracaoAtual = ""

// Sprint 5b: a lista traz as magias equipadas que pedem concentração.
// "Outra magia..." cobre o que não vem da classe (raça, talento, item mágico).
function montarOpcoesConcentracao() {
    // equipadas e as da subclasse (Bless do Domínio da Vida, por exemplo)
    const deConcentracao = magiasParaMostrar()
        .filter(function (magia) {
            return magia.concentracao
        })
        .map(function (magia) {
            return { valor: magia.nome, nome: magia.nome }
        })
        .sort(function (a, b) {
            return a.nome.localeCompare(b.nome)
        })

    deConcentracao.push({ valor: OUTRA_MAGIA, nome: "Outra magia..." })

    preencherSelect(magiaConcentracaoEL, deConcentracao, "")
    outraConcentracaoEL.hidden = true
}

// o nome escolhido na lista, ou o digitado quando for "Outra magia..."
function lerMagiaEscolhida() {
    if (magiaConcentracaoEL.value === OUTRA_MAGIA) {
        return outraConcentracaoEL.value.trim()
    }

    return magiaConcentracaoEL.value
}

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
    const magia = lerMagiaEscolhida()

    if (magia === "") {
        const digitando = magiaConcentracaoEL.value === OUTRA_MAGIA
        atualizarConcentracao(digitando ? "Digite o nome da magia." : "Escolha a magia.")
        ;(digitando ? outraConcentracaoEL : magiaConcentracaoEL).focus()
        return
    }

    const anterior = concentracaoAtual
    concentracaoAtual = magia

    // volta ao estado inicial, pronto para a próxima escolha
    magiaConcentracaoEL.value = ""
    outraConcentracaoEL.value = ""
    outraConcentracaoEL.hidden = true

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

// "Outra magia..." abre o campo de texto; as demais opções escondem
magiaConcentracaoEL.addEventListener("change", function () {
    const outra = magiaConcentracaoEL.value === OUTRA_MAGIA
    outraConcentracaoEL.hidden = !outra

    if (outra) {
        outraConcentracaoEL.focus()
    }
})

// Enter no campo concentra, em vez de enviar o formulário da ficha
outraConcentracaoEL.addEventListener("keydown", function (evento) {
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

/* ---------- Sprint 5b: magias equipadas (RF26) e trocas (RF30) ---------- */

// trocas liberadas e ainda não usadas, por classe ({ mago: { magias, truques } }):
// o descanso longo acrescenta, a aba de magias gasta
let trocasMagia = {}

// A escolha é feita na aba de magias; a ficha só mostra, agrupado por círculo.
// Usa o que foi salvo junto com a magia, então funciona sem internet.
// Sprint 6.5: escolha que decide as magias da subclasse (Círculo da Terra)
let opcaoMagiasSubclasse = ""
const selectEscolhaMagiasEL = document.getElementById("opcao-magias-subclasse")

// as magias sempre preparadas de cada subclasse, pelo nível NAQUELA classe
function magiasDeTodasAsSubclasses() {
    const lista = []

    classesParaCalculo.forEach(function (entrada) {
        magiasDaSubclasse(
            entrada.classe,
            entrada.subclasse || "",
            entrada.nivel,
            opcaoMagiasSubclasse
        ).forEach(function (magia) {
            if (!lista.some(function (item) { return item.valor === magia.valor })) {
                lista.push(Object.assign({}, magia, { daSubclasse: true, classe: entrada.classe }))
            }
        })
    })

    return lista
}

// equipadas + as sempre preparadas da subclasse, sem repetir
function magiasParaMostrar() {
    const daSubclasse = magiasDeTodasAsSubclasses()

    const equipadas = normalizarMagiasEquipadas(
        personagem.magiasEquipadas,
        classesParaCalculo[0].classe
    ).filter(function (equipada) {
        return !daSubclasse.some(function (magia) {
            return magia.valor === equipada.valor
        })
    })

    return equipadas.concat(daSubclasse)
}

function montarEscolhaDeMagias(escolha) {
    document.getElementById("escolha-magias-subclasse").hidden = escolha === null

    if (escolha === null) {
        return
    }

    document.getElementById("rotulo-escolha-magias").textContent = escolha.rotulo
    preencherSelect(
        selectEscolhaMagiasEL,
        escolha.opcoes.map(function (opcao) {
            return { valor: opcao.valor, nome: opcao.nome }
        }),
        opcaoMagiasSubclasse
    )
}

function mostrarMagiasEquipadas() {
    const blocoEL = document.getElementById("bloco-magias-equipadas")
    const listaEL = document.getElementById("lista-magias-equipadas")
    const notaEL = document.getElementById("nota-magias-subclasse")

    const conjura = classesConjuradoras(classesParaCalculo).length > 0

    // a subclasse que pede escolha (Círculo da Terra) pode ser a da segunda classe
    let escolha = null
    let atributo = null
    let classeDaSubclasse = classeEL.value
    let subclasseDaNota = subclasseEL.value

    classesParaCalculo.forEach(function (entrada) {
        const desta = escolhaDeMagiasDaSubclasse(entrada.classe, entrada.subclasse || "")
        const atributoDesta = atributoDasMagiasDaSubclasse(entrada.classe, entrada.subclasse || "")

        if (escolha === null && desta !== null) {
            escolha = desta
        }

        if (atributo === null && atributoDesta !== null) {
            atributo = atributoDesta
            classeDaSubclasse = entrada.classe
            subclasseDaNota = entrada.subclasse || ""
        }
    })
    const equipadas = magiasParaMostrar()

    // quem não conjura (Pugilista) só vê o bloco se a subclasse der magias
    blocoEL.hidden = !conjura && equipadas.length === 0 && escolha === null
    listaEL.innerHTML = ""

    montarEscolhaDeMagias(escolha)

    notaEL.hidden = atributo === null
    notaEL.textContent = atributo
        ? `As magias de ${nomeDaSubclasse(classeDaSubclasse, subclasseDaNota)} usam ${NOME_ATRIBUTO[atributo]}.`
        : ""

    if (equipadas.length === 0) {
        const vazio = document.createElement("p")
        vazio.className = "vazio-texto"
        vazio.textContent = escolha && !opcaoMagiasSubclasse
            ? "Escolha acima para ver as magias da subclasse."
            : "Nenhuma magia equipada. Escolha na aba Magias."
        listaEL.appendChild(vazio)
        return
    }

    const circulos = []

    equipadas.forEach(function (magia) {
        if (!circulos.includes(magia.circulo)) {
            circulos.push(magia.circulo)
        }
    })

    circulos.sort(function (a, b) {
        return a - b
    })

    circulos.forEach(function (circulo) {
        const grupo = document.createElement("p")
        grupo.className = "magias-grupo"

        const titulo = document.createElement("strong")
        titulo.textContent = circulo === 0 ? "Truques: " : `${nomeDoCirculo(circulo)}: `

        const nomes = equipadas
            .filter(function (magia) {
                return magia.circulo === circulo
            })
            .map(function (magia) {
                // (C) marca concentração, como nas fichas de papel
                const marcas = []

                if (magia.concentracao) {
                    marcas.push("C")
                }

                if (magia.daSubclasse) {
                    marcas.push("subclasse")
                }

                // com duas classes conjuradoras, cada magia diz de onde vem
                if (classesConjuradoras(classesParaCalculo).length > 1 && magia.classe) {
                    marcas.push(nomeDaClasse(magia.classe))
                }

                return marcas.length ? `${magia.nome} (${marcas.join(", ")})` : magia.nome
            })
            .sort()

        grupo.appendChild(titulo)
        grupo.appendChild(document.createTextNode(nomes.join(", ")))
        listaEL.appendChild(grupo)
    })
}

// classe, subclasse e tipo de terra mudam o que aparece (e a lista de concentração)
subclasseEL.addEventListener("change", function () {
    if (personagem) {
        mostrarMagiasEquipadas()
        montarOpcoesConcentracao()
    }
})

selectEscolhaMagiasEL.addEventListener("change", function () {
    opcaoMagiasSubclasse = selectEscolhaMagiasEL.value
    mostrarMagiasEquipadas()
    montarOpcoesConcentracao()
})

// classe que não conjura esconde o bloco
classeEL.addEventListener("change", function () {
    if (personagem) {
        mostrarMagiasEquipadas()
    }
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

/* ---------- RF14: pontos de experiência ---------- */

// O XP é só informação: o app nunca sobe o nível sozinho nem bloqueia o botão
// de subir. Campo em branco = a mesa joga por marco (milestone).
const xpEL = document.getElementById("xp")
const statusXpEL = document.getElementById("status-xp")

function xpDigitado() {
    return xpEL.value.trim() === "" ? null : Number(xpEL.value)
}

function atualizarXp() {
    const xp = xpDigitado()
    const nivelAtual = Number(nivelEL.value)

    if (xp === null) {
        statusXpEL.textContent = "Por marco"
        statusXpEL.className = "xp-status"
        return
    }

    const falta = faltaDeXp(xp, nivelAtual)

    if (falta === null) {
        statusXpEL.textContent = "Nível máximo"
        statusXpEL.className = "xp-status"
        return
    }

    if (falta === 0) {
        statusXpEL.textContent = `Dá para subir para o nível ${nivelAtual + 1}`
        statusXpEL.className = "xp-status xp-pronto"
        return
    }

    statusXpEL.textContent =
        `Faltam ${formatarXp(falta)} para o nível ${nivelAtual + 1}`
    statusXpEL.className = "xp-status"
}

xpEL.addEventListener("input", atualizarXp)

/* ---------- IDEIA05: cadeado de edição ---------- */

// O cadeado protege a CONSTRUÇÃO do personagem. Tudo que muda durante o jogo
// (PV, testes de morte, recursos, espaços, condições, XP, inventário, moedas,
// concentração, armadura) continua editável de propósito.
const btnCadeadoEL = document.getElementById("btn-cadeado")

let fichaTravada = true

const IDS_DE_CONSTRUCAO = [
    "nome", "classe", "subclasse", "raca", "subraca", "alinhamento", "antecedente",
    "forca", "destreza", "constituicao", "inteligencia", "sabedoria", "carisma",
    "bonus-forca", "bonus-destreza", "bonus-constituicao",
    "bonus-inteligencia", "bonus-sabedoria", "bonus-carisma",
    "opcao-magias-subclasse",
    "tracos-personalidade", "ideais", "vinculos", "defeitos"
]

function camposDeConstrucao() {
    const campos = IDS_DE_CONSTRUCAO
        .map(function (id) {
            return document.getElementById(id)
        })
        .filter(Boolean)

    // as perícias são remontadas a cada mudança de classe
    return campos.concat(
        Array.from(document.querySelectorAll("#lista-pericias input"))
    )
}

function aplicarCadeado() {
    camposDeConstrucao().forEach(function (campo) {
        if (campo.tagName === "SELECT" || campo.type === "checkbox") {
            // travar desabilita; destravar devolve a decisão às regras,
            // que rodam logo depois em recalcularDerivados()
            campo.disabled = fichaTravada
        } else {
            campo.readOnly = fichaTravada
        }
    })

    document.body.classList.toggle("ficha-travada", fichaTravada)

    btnCadeadoEL.textContent = fichaTravada ? "🔒 Travada" : "🔓 Liberada"
    btnCadeadoEL.title = fichaTravada
        ? "A construção do personagem está protegida. Clique para editar."
        : "A ficha está editável. Clique para proteger a construção."
}

// Gancho de ficha-comum.js: as regras acabaram de mexer nos campos (a lista de
// perícias foi remontada, os bônus mudaram). Com a ficha travada, o cadeado
// tem a última palavra.
function aoAtualizarFicha() {
    if (fichaTravada) {
        aplicarCadeado()
    }
}

function alternarCadeado() {
    fichaTravada = !fichaTravada
    aplicarCadeado()

    // destravar precisa devolver os limites das regras (bônus que somem,
    // perícias acima do limite da classe)
    if (!fichaTravada) {
        recalcularDerivados()
    }
}

btnCadeadoEL.addEventListener("click", alternarCadeado)

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

    // IDEIA06: teto de 20, menos no atributo que ganhou a Dádiva Épica (até 30).
    // Ficha antiga com dádiva e sem esse registro: libera todos, para não travar.
    const temDadiva = (personagem.talentos || []).some(function (talento) {
        return dadivaPorValor(talento) !== undefined
    })
    atributosAte30 = personagem.atributosAte30 || (temDadiva ? ATRIBUTOS.slice() : [])

    escreverBonus(personagem.bonusAntecedente)
    mostrarStatusBonus()
    atualizarOpcoesBonus()
    atualizarModificadores()
    atualizarProficiencia()

    // renderizarPericias roda dentro de escreverPericias
    escreverPericias(personagem.pericias)

    // multiclasse: a lista de classes manda em quase tudo (PV, espaços, recursos,
    // habilidades). Ficha antiga vira lista de uma classe.
    classesParaCalculo = classesDoPersonagem(personagem).map(function (entrada) {
        return Object.assign({}, entrada)
    })

    const resumoEL = document.getElementById("resumo-classes")
    resumoEL.hidden = classesParaCalculo.length < 2
    resumoEL.textContent = `Classes: ${descreverClasses(classesParaCalculo)} (nível ${nivelTotal(classesParaCalculo)})`

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

    dadosVidaGastos = normalizarDadosGastos(personagem.dadosVidaGastos, classesParaCalculo[0].classe)
    atualizarDadosDeVida()

    sucessosMorte = personagem.sucessosMorte || 0
    falhasMorte = personagem.falhasMorte || 0
    atualizarTestesDeMorte()

    espacosGastos = personagem.espacosGastos || {}
    atualizarEspacosDeMagia()

    recursosGastos = personagem.recursosGastos || {}
    atualizarRecursos()

    atualizarHabilidades()

    montarSelectDeArmaduras()
    armaduraEL.value = personagem.armadura || ""
    escudoEL.checked = personagem.escudo === true
    atualizarDefesa()

    montarSelectDeArmas()
    armasDoPersonagem = (personagem.armas || []).slice()
    atualizarAtaques()

    escreverPersonalidade()

    moedasDoPersonagem = Object.assign({}, personagem.moedas)
    itensDoPersonagem = (personagem.itens || []).slice()
    montarCamposDeMoedas()
    atualizarTotalDeMoedas()
    atualizarInventario()

    montarSelectDeExaustao()
    condicoesAtivas = (personagem.condicoes || []).slice()
    // RF14: em branco quer dizer que a mesa joga por marco
    xpEL.value = personagem.xp === undefined || personagem.xp === null ? "" : personagem.xp
    atualizarXp()

    // IDEIA05: a ficha abre travada, e o estado é lembrado por personagem
    fichaTravada = personagem.fichaTravada !== false
    aplicarCadeado()

    nivelDeExaustao = personagem.exaustao || 0
    exaustaoEL.value = nivelDeExaustao
    atualizarCondicoes()

    // antes da concentração: o tipo de terra decide magias da subclasse
    opcaoMagiasSubclasse = personagem.opcaoMagiasSubclasse || ""

    concentracaoAtual = personagem.concentracao || ""
    montarOpcoesConcentracao()
    atualizarConcentracao()

    mostrarMagiasEquipadas()
    trocasMagia = normalizarTrocas(personagem.trocasMagia, classesParaCalculo[0].classe)

    // ponto de partida para medir dano; os PV já foram carregados acima
    lembrarPv()

    // o nível só muda por aqui (o campo na ficha é somente leitura),
    // para ninguém pular a Melhoria de Atributo ou o Talento
    const linkLevelupEL = document.getElementById("link-levelup")
    linkLevelupEL.href = `levelup.html?id=${personagem.id}`
    linkLevelupEL.hidden = personagem.nivel >= NIVEL_MAXIMO

    // só quem conjura tem o que ver na aba de magias
    const linkMagiasEL = document.getElementById("link-magias")
    linkMagiasEL.href = `magias.html?id=${personagem.id}`
    linkMagiasEL.hidden = conjuracaoDaClasse(personagem.classe) === null

    // Grava a ficha no localStorage. Devolve false se algo impede salvar.
    const salvarFicha = function () {
        if (!bonusValido()) {
            mostrarStatusBonus()
            return false
        }

        if (!periciasCompletas()) {
            atualizarPericias()
            return false
        }

        // Sobrescreve os campos do personagem, mantendo o mesmo id
        personagem.nome = document.getElementById("nome").value
        personagem.raca = racaEL.value
        personagem.subraca = subracaEL.value
        personagem.classe = classeEL.value
        personagem.subclasse = subclasseEL.value
        personagem.nivel = Number(nivelEL.value)

        // multiclasse: a lista manda; classe/nivel/subclasse acima ficam como
        // espelho da classe inicial e do nível total, para o resto do app
        if (classesParaCalculo.length === 1) {
            classesParaCalculo[0].classe = classeEL.value
            classesParaCalculo[0].nivel = Number(nivelEL.value)
            classesParaCalculo[0].subclasse = subclasseEL.value
        }

        personagem.classes = classesParaCalculo
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
        personagem.salvaguardas = salvaguardasDaClasse(personagem.classe, personagem.nivel)

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
        personagem.recursosGastos = recursosGastosValidos()
        personagem.opcaoMagiasSubclasse = opcaoMagiasSubclasse
        personagem.armadura = armaduraEL.value
        personagem.escudo = escudoEL.checked
        personagem.armas = armasDoPersonagem
        personagem.condicoes = condicoesAtivas
        personagem.exaustao = nivelDeExaustao
        personagem.xp = xpDigitado()
        personagem.fichaTravada = fichaTravada
        personagem.moedas = moedasDoPersonagem
        personagem.itens = itensDoPersonagem
        lerPersonalidade()
        // classe que não conjura não guarda concentração
        personagem.concentracao =
            conjuracaoDaClasse(personagem.classe) === null ? "" : concentracaoAtual
        personagem.trocasMagia = trocasMagia

        localStorage.setItem("fichas", JSON.stringify(personagens))
        return true
    }

    formFicha.addEventListener("submit", function (evento) {
        evento.preventDefault()

        if (salvarFicha()) {
            window.location.href = "index.html"
        }
    })

    // Magias e Subir de Nível salvam antes de sair: sem isso, o que foi feito
    // na ficha (um descanso longo, por exemplo) se perdia na troca de página.
    ;[linkMagiasEL, linkLevelupEL].forEach(function (link) {
        link.addEventListener("click", function (evento) {
            evento.preventDefault()

            if (formFicha.reportValidity() && salvarFicha()) {
                window.location.href = link.href
            }
        })
    })
}
