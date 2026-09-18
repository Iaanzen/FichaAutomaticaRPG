// Sprint 5b: aba de magias.
// Passo 1: lista as magias da classe. Passo 2: equipar respeitando o limite.
// Magias e limites vêm da API do D&D 5e (dnd5eapi.co, regras de 2024), ao vivo.

const API_BASE = "https://www.dnd5eapi.co"
const API_MAGIAS = `${API_BASE}/graphql/2024`

const telaEL = document.getElementById("tela-magias")
const mensagemErroEL = document.getElementById("mensagem-erro")
const listaEL = document.getElementById("lista-magias")
const statusEL = document.getElementById("status-magias")
const avisoEL = document.getElementById("aviso-magias")
const buscaEL = document.getElementById("busca-magia")
const filtroCirculoEL = document.getElementById("filtro-circulo")
const soEquipadasEL = document.getElementById("so-equipadas")
const contadorTruquesEL = document.getElementById("contador-truques")
const contadorMagiasEL = document.getElementById("contador-magias")
const btnTentarEL = document.getElementById("btn-tentar-de-novo")

const parametros = new URLSearchParams(window.location.search)
const idDaUrl = Number(parametros.get("id"))

const personagens = JSON.parse(localStorage.getItem("fichas")) || []

const personagem = personagens.find(function (item) {
    return item.id === idDaUrl
})

// lista que veio da API, já ordenada
let magias = []

// quantos truques e magias preparadas o nível permite (vem da API)
let limites = { truques: 0, magias: 0 }

// o que vai para a ficha: { valor, nome, circulo, concentracao }.
// Guarda mais que o código para a ficha funcionar sem internet.
let equipadas = []

/* ---------- O que o personagem alcança ---------- */

// maior círculo com espaço de magia; truques (círculo 0) valem sempre
function circuloMaximo() {
    const espacos = espacosDeMagia(personagem.classe, personagem.nivel)

    if (espacos.length === 0) {
        return 0
    }

    return espacos[espacos.length - 1].circulo
}

/* ---------- API ---------- */

async function buscarMagias() {
    const classeApi = classeNaApi(personagem.classe)

    // uma requisição só traz a lista inteira da classe; a descrição de cada
    // magia é buscada depois, ao abrir (passo 3)
    const consulta = `{
        spells(class: "${classeApi}", limit: 400) {
            index
            name
            level
            concentration
            ritual
            school { name }
        }
    }`

    const resposta = await fetch(API_MAGIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: consulta })
    })

    if (!resposta.ok) {
        throw new Error(`A API respondeu ${resposta.status}`)
    }

    const dados = await resposta.json()

    if (dados.errors) {
        throw new Error(dados.errors[0].message)
    }

    return dados.data.spells.slice().sort(function (a, b) {
        return a.level - b.level || a.name.localeCompare(b.name)
    })
}

// RF29: a tabela de cada classe diz quantos truques e magias preparadas cabem
async function buscarLimites() {
    const classeApi = classeNaApi(personagem.classe)
    const resposta = await fetch(
        `${API_BASE}/api/2024/classes/${classeApi}/levels/${personagem.nivel}`
    )

    if (!resposta.ok) {
        throw new Error(`A API respondeu ${resposta.status}`)
    }

    const conjuracao = (await resposta.json()).spellcasting || {}

    return {
        truques: conjuracao.cantrips_known || 0,
        magias: conjuracao.prepared_spells || 0
    }
}

/* ---------- Equipar (RF26, RF29) ---------- */

function estaEquipada(valor) {
    return equipadas.some(function (magia) {
        return magia.valor === valor
    })
}

function contarTruques() {
    return equipadas.filter(function (magia) {
        return magia.circulo === 0
    }).length
}

function contarMagias() {
    return equipadas.length - contarTruques()
}

// truque e magia de círculo têm limites separados
function limiteAtingido(circulo) {
    if (circulo === 0) {
        return contarTruques() >= limites.truques
    }

    return contarMagias() >= limites.magias
}

// grava direto no personagem: a aba não tem botão de salvar
function salvar() {
    personagem.magiasEquipadas = equipadas
    localStorage.setItem("fichas", JSON.stringify(personagens))
}

function alternarMagia(magia) {
    if (estaEquipada(magia.index)) {
        equipadas = equipadas.filter(function (item) {
            return item.valor !== magia.index
        })
    } else {
        if (limiteAtingido(magia.level)) {
            return
        }

        equipadas.push({
            valor: magia.index,
            nome: magia.name,
            circulo: magia.level,
            concentracao: magia.concentration
        })
    }

    salvar()
    renderizar()
}

// Magia equipada que não está mais na lista (a classe mudou na ficha, por
// exemplo) sai da ficha, com aviso para o jogador saber o que aconteceu.
function removerForaDaLista() {
    const validas = equipadas.filter(function (equipada) {
        return magias.some(function (magia) {
            return magia.index === equipada.valor && magia.level <= circuloMaximo()
        })
    })

    const removidas = equipadas.length - validas.length

    if (removidas > 0) {
        equipadas = validas
        salvar()
        avisoEL.textContent =
            `${removidas} magia(s) equipada(s) não pertencem mais à lista da classe e foram removidas da ficha.`
        avisoEL.hidden = false
    }
}

/* ---------- Filtros ---------- */

function montarFiltroCirculo() {
    const opcoes = [{ valor: "todos", nome: "Todos" }]

    for (let circulo = 0; circulo <= circuloMaximo(); circulo++) {
        opcoes.push({ valor: String(circulo), nome: nomeDoCirculo(circulo) })
    }

    filtroCirculoEL.innerHTML = ""

    opcoes.forEach(function (opcao) {
        const elemento = document.createElement("option")
        elemento.value = opcao.valor
        elemento.textContent = opcao.nome
        filtroCirculoEL.appendChild(elemento)
    })
}

function magiasVisiveis() {
    const busca = buscaEL.value.trim().toLowerCase()
    const circulo = filtroCirculoEL.value

    return magias.filter(function (magia) {
        // magia de círculo alto demais nem aparece: o personagem não pode usar
        if (magia.level > circuloMaximo()) {
            return false
        }

        if (circulo !== "todos" && magia.level !== Number(circulo)) {
            return false
        }

        if (soEquipadasEL.checked && !estaEquipada(magia.index)) {
            return false
        }

        return magia.name.toLowerCase().includes(busca)
    })
}

/* ---------- Tela ---------- */

function criarEtiqueta(texto) {
    const etiqueta = document.createElement("span")
    etiqueta.className = "etiqueta"
    etiqueta.textContent = texto
    return etiqueta
}

function criarCartao(magia) {
    const equipada = estaEquipada(magia.index)

    const cartao = document.createElement("div")
    cartao.className = "magia"
    cartao.classList.toggle("magia-equipada", equipada)

    const nome = document.createElement("span")
    nome.className = "magia-nome"
    nome.textContent = magia.name

    const info = document.createElement("span")
    info.className = "magia-info"
    info.textContent = `${nomeDoCirculo(magia.level)} · ${magia.school.name}`

    cartao.appendChild(nome)
    cartao.appendChild(info)

    if (magia.concentration) {
        cartao.appendChild(criarEtiqueta("Concentração"))
    }

    if (magia.ritual) {
        cartao.appendChild(criarEtiqueta("Ritual"))
    }

    const botao = document.createElement("button")
    botao.type = "button"
    botao.className = "magia-botao"

    if (equipada) {
        botao.textContent = "Remover"
    } else if (limiteAtingido(magia.level)) {
        // o jogador vê por que não dá: tem que remover outra antes
        botao.textContent = "Limite atingido"
        botao.disabled = true
    } else {
        botao.textContent = "Equipar"
    }

    botao.addEventListener("click", function () {
        alternarMagia(magia)
    })

    cartao.appendChild(botao)
    return cartao
}

function atualizarContador(elemento, rotulo, usados, limite) {
    elemento.textContent = `${rotulo}: ${usados} de ${limite}`
    elemento.classList.toggle("contador-cheio", limite > 0 && usados >= limite)
}

function renderizar() {
    atualizarContador(contadorTruquesEL, "Truques", contarTruques(), limites.truques)
    atualizarContador(contadorMagiasEL, "Magias preparadas", contarMagias(), limites.magias)

    // classe sem truques (Paladino, Patrulheiro) nem mostra o contador
    contadorTruquesEL.hidden = limites.truques === 0

    const visiveis = magiasVisiveis()

    listaEL.innerHTML = ""
    visiveis.forEach(function (magia) {
        listaEL.appendChild(criarCartao(magia))
    })

    const disponiveis = magias.filter(function (magia) {
        return magia.level <= circuloMaximo()
    }).length

    statusEL.className = "status-bonus"

    if (visiveis.length === 0) {
        statusEL.textContent = "Nenhuma magia com esse filtro."
        return
    }

    statusEL.textContent = `${visiveis.length} de ${disponiveis} magias disponíveis.`
}

async function carregar() {
    statusEL.className = "status-bonus"
    statusEL.textContent = "Buscando magias..."
    btnTentarEL.hidden = true
    listaEL.innerHTML = ""

    try {
        // as duas consultas são independentes, então vão juntas
        const resultados = await Promise.all([buscarMagias(), buscarLimites()])
        magias = resultados[0]
        limites = resultados[1]

        removerForaDaLista()
        montarFiltroCirculo()
        renderizar()
    } catch (erro) {
        // sem internet ou API fora do ar: a ficha continua funcionando
        statusEL.textContent = "Sem conexão com a lista de magias. Tente de novo."
        statusEL.className = "status-bonus status-erro"
        btnTentarEL.hidden = false
        console.error(erro)
    }
}

/* ---------- Início ---------- */

if (!personagem) {
    telaEL.style.display = "none"
    mensagemErroEL.style.display = "block"
} else if (conjuracaoDaClasse(personagem.classe) === null) {
    telaEL.style.display = "none"
    mensagemErroEL.innerHTML =
        `Esta classe não conjura magias. <a href="ficha.html?id=${personagem.id}">Voltar à ficha</a>`
    mensagemErroEL.style.display = "block"
} else {
    document.title = `${personagem.nome} - Magias`

    equipadas = (personagem.magiasEquipadas || []).slice()

    document.getElementById("nome-personagem").textContent = personagem.nome
    document.getElementById("classe-personagem").textContent =
        `${personagem.classe} · nível ${personagem.nivel}`
    document.getElementById("circulo-maximo").textContent =
        nomeDoCirculo(circuloMaximo())

    document.getElementById("link-ficha").href = `ficha.html?id=${personagem.id}`

    buscaEL.addEventListener("input", renderizar)
    filtroCirculoEL.addEventListener("change", renderizar)
    soEquipadasEL.addEventListener("change", renderizar)
    btnTentarEL.addEventListener("click", carregar)

    carregar()
}
