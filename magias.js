// Sprint 5b: aba de magias.
// Passo 1: lista as magias da classe. Passo 2: equipar respeitando o limite.
// Passo 3: descrição ao abrir a magia.
// Multiclasse (passo 3): a aba trabalha numa classe de cada vez. Cada classe
// tem a lista, os limites, as magias equipadas e as trocas dela; os espaços de
// magia, que são compartilhados, ficam na ficha.
// O conteúdo das magias aparece como vem da API, em inglês (decisão do 5b).
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
const detalheEL = document.getElementById("detalhe-magia")
const textoTrocasEL = document.getElementById("texto-trocas")
const btnConcluirTrocaEL = document.getElementById("btn-concluir-troca")
const listaClassesEL = document.getElementById("lista-classes-magias")
const blocoClassesEL = document.getElementById("bloco-classes-magias")

const parametros = new URLSearchParams(window.location.search)
const idDaUrl = Number(parametros.get("id"))

const personagens = JSON.parse(localStorage.getItem("fichas")) || []

const personagem = personagens.find(function (item) {
    return item.id === idDaUrl
})

// as classes que conjuram e a que está aberta na tela
const classes = personagem ? classesDoPersonagem(personagem) : []
const conjuradoras = classesConjuradoras(classes)
const classePadrao = (classeInicial(classes) || {}).classe
let classeAtiva = conjuradoras.length ? conjuradoras[0].classe : ""

// lista que veio da API, já ordenada
let magias = []

// quantos truques e magias preparadas o nível permite (vem da API)
let limites = { truques: 0, magias: 0 }

// o que vai para a ficha: { valor, nome, circulo, concentracao, classe }.
// Guarda mais que o código para a ficha funcionar sem internet.
// "todasEquipadas" é a ficha inteira; "equipadas" é só a classe aberta.
let todasEquipadas = []
let equipadas = []

// RF30: trocas liberadas pelo descanso longo ou pelo level up ({ magias, truques })
let trocas = { magias: 0, truques: 0 }

// Equipada nesta visita à aba pode ser desfeita sem gastar troca:
// é correção de engano, não troca de magia. Zera ao trocar de classe.
let equipadasNestaVisita = []

// descrições já buscadas, para não pedir a mesma magia duas vezes
const detalhes = {}

// qual magia está aberta no painel de detalhe
let magiaAberta = null

/* ---------- A classe aberta na tela ---------- */

function entradaAtiva() {
    return conjuradoras.find(function (entrada) {
        return entrada.classe === classeAtiva
    }) || conjuradoras[0]
}

function nivelAtivo() {
    return entradaAtiva() ? entradaAtiva().nivel : 0
}

function subclasseAtiva() {
    return entradaAtiva() ? entradaAtiva().subclasse || "" : ""
}

/* ---------- O que o personagem alcança ---------- */

// Maior círculo que ESTA classe prepara, pela tabela dela. Com multiclasse os
// espaços podem chegar mais alto (eles somam), mas a magia preparada continua
// limitada pelo nível na classe; truques (círculo 0) valem sempre.
function circuloMaximo() {
    return circuloMaximoDaClasse(classeAtiva, nivelAtivo())
}

/* ---------- API ---------- */

async function consultar(consulta) {
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

    return dados.data
}

// campos da lista, sem descrição: assim a aba abre rápido.
// A descrição vem depois, magia por magia.
const CAMPOS_DA_LISTA = "index name level concentration ritual school { name }"

// magia da lista local que não existe na API, no mesmo formato das outras
function magiaForaDaApi(magia) {
    return {
        index: magia.valor,
        name: magia.nome,
        level: magia.circulo,
        concentration: magia.concentracao,
        ritual: magia.ritual,
        school: { name: magia.escola },
        foraDaApi: true
    }
}

async function buscarMagias() {
    const locais = magiasLocaisDaClasse(classeAtiva)
    let lista

    if (locais) {
        // classe fora da API: pede todas as magias e fica só com as da lista local
        const dados = await consultar(`{ spells(limit: 400) { ${CAMPOS_DA_LISTA} } }`)

        lista = dados.spells
            .filter(function (magia) {
                return locais.daApi.includes(magia.index)
            })
            .concat((locais.foraDaApi || []).map(magiaForaDaApi))
    } else {
        // uma requisição só traz a lista inteira da classe
        const classeApi = classeNaApi(classeAtiva)
        const dados = await consultar(
            `{ spells(class: "${classeApi}", limit: 400) { ${CAMPOS_DA_LISTA} } }`
        )

        lista = dados.spells
    }

    return lista.slice().sort(function (a, b) {
        return a.level - b.level || a.name.localeCompare(b.name)
    })
}

/* ---------- Sprint 6.5: magias da subclasse ---------- */

// Sempre preparadas: não contam no limite e não saem na troca.
function magiasDaSubclasseDoPersonagem() {
    return magiasDaSubclasse(
        classeAtiva,
        subclasseAtiva(),
        nivelAtivo(),
        personagem.opcaoMagiasSubclasse
    )
}

function ehDaSubclasse(valor) {
    return magiasDaSubclasseDoPersonagem().some(function (magia) {
        return magia.valor === valor
    })
}

// A subclasse pode dar magia de fora da lista da classe (o Patrono Corruptor dá
// Burning Hands ao Bruxo): essas entram na lista com os dados salvos no app.
function misturarMagiasDaSubclasse(lista) {
    const extras = magiasDaSubclasseDoPersonagem()
        .filter(function (magia) {
            return !lista.some(function (item) {
                return item.index === magia.valor
            })
        })
        .map(function (magia) {
            return {
                index: magia.valor,
                name: magia.nome,
                level: magia.circulo,
                concentration: magia.concentracao,
                ritual: magia.ritual === true,
                school: { name: magia.escola || "—" },
                foraDaApi: magia.foraDaApi === true
            }
        })

    return lista.concat(extras).sort(function (a, b) {
        return a.level - b.level || a.name.localeCompare(b.name)
    })
}

// total do atributo, já contando o bônus do antecedente
function totalDoAtributo(atributo) {
    const bonus = (personagem.bonusAntecedente || {})[atributo] || 0
    return personagem[atributo] + bonus
}

// RF29: a tabela de cada classe diz quantos truques e magias preparadas cabem
async function buscarLimites() {
    const locais = magiasLocaisDaClasse(classeAtiva)

    // classe fora da API: truques pela tabela local, preparadas pela regra dela
    if (locais) {
        const atributo = locais.preparadas.atributo

        return limitesDeMagiasLocais(
            locais,
            nivelAtivo(),
            modificadorDe(totalDoAtributo(atributo))
        )
    }

    const classeApi = classeNaApi(classeAtiva)
    const resposta = await fetch(
        `${API_BASE}/api/2024/classes/${classeApi}/levels/${nivelAtivo()}`
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

async function buscarDetalhe(valor) {
    if (detalhes[valor]) {
        return detalhes[valor]
    }

    // magia que a API não tem: mostra o que a lista local sabe e manda ao livro
    const daLista = magias.find(function (magia) {
        return magia.index === valor
    })

    if (daLista && daLista.foraDaApi) {
        detalhes[valor] = Object.assign({}, daLista, {
            casting_time: "—",
            range: "—",
            duration: "—",
            components: [],
            description: "Magia fora do conteúdo gratuito da API: consulte o livro para a descrição completa."
        })
        return detalhes[valor]
    }

    const dados = await consultar(`{
        spell(index: "${valor}") {
            index
            name
            level
            concentration
            ritual
            casting_time
            range
            duration
            components
            material
            school { name }
            description
        }
    }`)

    detalhes[valor] = dados.spell
    return dados.spell
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

// grava direto no personagem: a aba não tem botão de salvar.
// As magias das outras classes ficam intocadas.
function salvar() {
    const deOutrasClasses = todasEquipadas.filter(function (magia) {
        return magia.classe !== classeAtiva
    })

    todasEquipadas = deOutrasClasses.concat(equipadas)

    personagem.magiasEquipadas = todasEquipadas
    personagem.trocasMagia = guardarTrocasDaClasse(
        personagem.trocasMagia,
        classeAtiva,
        trocas,
        classePadrao
    )

    localStorage.setItem("fichas", JSON.stringify(personagens))
}

/* ---------- Troca de magias (RF30, regra 2024) ---------- */

function categoria(circulo) {
    return circulo === 0 ? "truques" : "magias"
}

// Tirar uma magia só vale com troca liberada; preencher vaga livre é sempre permitido.
function podeRemover(magia) {
    return (
        equipadasNestaVisita.includes(magia.index) ||
        trocas[categoria(magia.level)] !== 0
    )
}

// troca de 1 é gasta ao tirar a magia; "todas" dura até o jogador concluir
function gastarTroca(magia) {
    const tipo = categoria(magia.level)

    if (trocas[tipo] === 1) {
        trocas[tipo] = 0
    }
}

function concluirTroca() {
    trocas.magias = 0
    salvar()
    renderizar()
}

function atualizarTrocas() {
    const liberado = descreverTrocas(trocas)

    btnConcluirTrocaEL.hidden = trocas.magias !== "todas"

    if (liberado) {
        textoTrocasEL.textContent =
            `Troca liberada: ${liberado}. Remova uma magia e equipe outra no lugar.`
        textoTrocasEL.className = "status-bonus status-ok"
        return
    }

    const regra = explicarRegraDeTroca(classeAtiva)

    textoTrocasEL.textContent =
        `Nenhuma troca liberada agora: vagas livres podem ser preenchidas, mas ` +
        `para tirar uma magia é preciso troca. Sua classe ${regra}.`
    textoTrocasEL.className = "status-bonus"
}

function alternarMagia(magia) {
    if (estaEquipada(magia.index)) {
        if (!podeRemover(magia)) {
            return
        }

        const posicao = equipadasNestaVisita.indexOf(magia.index)

        if (posicao >= 0) {
            // desfazer o que acabou de equipar não gasta troca
            equipadasNestaVisita.splice(posicao, 1)
        } else {
            gastarTroca(magia)
        }

        equipadas = equipadas.filter(function (item) {
            return item.valor !== magia.index
        })
    } else {
        if (limiteAtingido(magia.level)) {
            return
        }

        equipadasNestaVisita.push(magia.index)

        equipadas.push({
            valor: magia.index,
            nome: magia.name,
            circulo: magia.level,
            concentracao: magia.concentration,
            classe: classeAtiva
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

/* ---------- Multiclasse: escolher a classe (passo 3) ---------- */

// Abre a aba numa classe de cada vez: a lista, os limites e as trocas são dela.
function montarEscolhaDeClasse() {
    // com uma classe conjuradora só, o bloco nem aparece
    blocoClassesEL.hidden = conjuradoras.length < 2

    listaClassesEL.innerHTML = ""

    conjuradoras.forEach(function (entrada) {
        const botao = document.createElement("button")
        botao.type = "button"
        botao.className = "classe-opcao"
        botao.classList.toggle("classe-escolhida", entrada.classe === classeAtiva)
        botao.textContent = `${nomeDaClasse(entrada.classe)} ${entrada.nivel}`
        botao.addEventListener("click", function () {
            trocarClasseAtiva(entrada.classe)
        })
        listaClassesEL.appendChild(botao)
    })
}

function trocarClasseAtiva(classe) {
    if (classe === classeAtiva) {
        return
    }

    classeAtiva = classe

    // cada classe tem as suas: lista, limites, equipadas e trocas
    magias = []
    limites = { truques: 0, magias: 0 }
    equipadasNestaVisita = []
    equipadas = magiasEquipadasDaClasse(todasEquipadas, classeAtiva, classePadrao)
    trocas = trocasDaClasse(personagem.trocasMagia, classeAtiva, classePadrao)

    avisoEL.hidden = true
    montarEscolhaDeClasse()
    atualizarCabecalho()
    carregar()
}

function atualizarCabecalho() {
    document.getElementById("classe-personagem").textContent =
        conjuradoras.length > 1
            ? `${descreverClasses(classes)} · magias de ${nomeDaClasse(classeAtiva)} (nível ${nivelAtivo()})`
            : `${nomeDaClasse(classeAtiva)} · nível ${nivelAtivo()}`

    document.getElementById("circulo-maximo").textContent = nomeDoCirculo(circuloMaximo())
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
        if (magia.level > circuloMaximo() && !ehDaSubclasse(magia.index)) {
            return false
        }

        if (circulo !== "todos" && magia.level !== Number(circulo)) {
            return false
        }

        if (soEquipadasEL.checked && !estaEquipada(magia.index) && !ehDaSubclasse(magia.index)) {
            return false
        }

        return magia.name.toLowerCase().includes(busca)
    })
}

/* ---------- Detalhe da magia ---------- */

function criarLinhaDetalhe(rotulo, valor) {
    const linha = document.createElement("p")
    linha.className = "detalhe-linha"

    const titulo = document.createElement("strong")
    titulo.textContent = `${rotulo}: `

    linha.appendChild(titulo)
    linha.appendChild(document.createTextNode(valor))
    return linha
}

function montarDetalhe(magia) {
    detalheEL.innerHTML = ""

    const fechar = document.createElement("button")
    fechar.type = "button"
    fechar.className = "detalhe-fechar"
    fechar.textContent = "Fechar"
    fechar.addEventListener("click", fecharDetalhe)

    const titulo = document.createElement("span")
    titulo.className = "detalhe-titulo"
    titulo.textContent = magia.name

    const subtitulo = document.createElement("p")
    subtitulo.className = "detalhe-subtitulo"
    subtitulo.textContent = `${nomeDoCirculo(magia.level)} · ${magia.school.name}`

    detalheEL.appendChild(fechar)
    detalheEL.appendChild(titulo)
    detalheEL.appendChild(subtitulo)

    // a API gruda "Component: V, S" no alcance de algumas magias; os
    // componentes já aparecem na linha própria
    const alcance = magia.range.replace(/\s*Component:.*$/i, "")

    detalheEL.appendChild(criarLinhaDetalhe("Tempo", magia.casting_time))
    detalheEL.appendChild(criarLinhaDetalhe("Alcance", alcance))
    detalheEL.appendChild(criarLinhaDetalhe("Duração", magia.duration))
    detalheEL.appendChild(
        criarLinhaDetalhe("Componentes", (magia.components || []).join(", "))
    )

    if (magia.material) {
        detalheEL.appendChild(criarLinhaDetalhe("Material", magia.material))
    }

    const partes = Array.isArray(magia.description)
        ? magia.description
        : [magia.description || ""]

    partes.forEach(function (parte) {
        const paragrafo = document.createElement("p")
        paragrafo.className = "detalhe-descricao"
        paragrafo.textContent = parte
        detalheEL.appendChild(paragrafo)
    })
}

function fecharDetalhe() {
    magiaAberta = null
    detalheEL.hidden = true
    detalheEL.innerHTML = ""
}

async function abrirMagia(magia) {
    // clicar de novo na mesma magia fecha o detalhe
    if (magiaAberta === magia.index) {
        fecharDetalhe()
        return
    }

    magiaAberta = magia.index
    detalheEL.hidden = false
    detalheEL.innerHTML = ""

    const carregando = document.createElement("p")
    carregando.className = "detalhe-descricao"
    carregando.textContent = "Buscando a descrição..."
    detalheEL.appendChild(carregando)

    try {
        const completa = await buscarDetalhe(magia.index)

        // o jogador pode ter clicado em outra magia enquanto isso
        if (magiaAberta !== magia.index) {
            return
        }

        montarDetalhe(completa)
        detalheEL.scrollIntoView({ block: "nearest", behavior: "smooth" })
    } catch (erro) {
        carregando.textContent = "Não foi possível buscar a descrição. Tente de novo."
        console.error(erro)
    }
}

/* ---------- Lista ---------- */

function criarEtiqueta(texto) {
    const etiqueta = document.createElement("span")
    etiqueta.className = "etiqueta"
    etiqueta.textContent = texto
    return etiqueta
}

function criarCartao(magia) {
    const equipada = estaEquipada(magia.index)
    const daSubclasse = ehDaSubclasse(magia.index)

    const cartao = document.createElement("div")
    cartao.className = "magia"
    cartao.classList.toggle("magia-equipada", equipada || daSubclasse)

    const nome = document.createElement("button")
    nome.type = "button"
    nome.className = "magia-nome magia-abrir"
    nome.textContent = magia.name
    nome.addEventListener("click", function () {
        abrirMagia(magia)
    })

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

    if (daSubclasse) {
        cartao.appendChild(criarEtiqueta("Da subclasse"))
    }

    const botao = document.createElement("button")
    botao.type = "button"
    botao.className = "magia-botao"

    if (daSubclasse && !equipada) {
        // Sprint 6.5: vem da subclasse; não ocupa vaga e não sai
        botao.textContent = "Sempre preparada"
        botao.disabled = true
        botao.title = "Magia dada pela subclasse: não conta no limite."
    } else if (equipada && podeRemover(magia)) {
        botao.textContent = "Remover"
    } else if (equipada) {
        // RF30: sem troca liberada a magia fica fixa na ficha
        botao.textContent = "Sem troca"
        botao.disabled = true
        botao.title = "Tirar esta magia exige uma troca liberada pela regra da classe."
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

    atualizarTrocas()

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
    fecharDetalhe()

    // classe de conteúdo extra ainda sem lista: as outras continuam abrindo
    if (classeNaApi(classeAtiva) === null && magiasLocaisDaClasse(classeAtiva) === null) {
        statusEL.textContent =
            `As magias de ${nomeDaClasse(classeAtiva)} ainda não estão disponíveis: ` +
            `a classe não existe na API e a lista local dela ainda não foi feita.`
        statusEL.className = "status-bonus status-erro"
        renderizar()
        return
    }

    try {
        // as duas consultas são independentes, então vão juntas
        const resultados = await Promise.all([buscarMagias(), buscarLimites()])
        magias = misturarMagiasDaSubclasse(resultados[0])
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
} else if (conjuradoras.length === 0) {
    telaEL.style.display = "none"
    mensagemErroEL.innerHTML =
        `Esta classe não conjura magias. <a href="ficha.html?id=${personagem.id}">Voltar à ficha</a>`
    mensagemErroEL.style.display = "block"
} else if (
    conjuradoras.every(function (entrada) {
        return classeNaApi(entrada.classe) === null && magiasLocaisDaClasse(entrada.classe) === null
    })
) {
    // classe fora da API (ex: conteúdo extra) ainda sem lista local de magias
    telaEL.style.display = "none"
    mensagemErroEL.innerHTML =
        `As magias de ${nomeDaClasse(classeAtiva)} ainda não estão disponíveis: ` +
        `a classe não existe na API de magias e a lista local dela ainda não foi feita. ` +
        `<a href="ficha.html?id=${personagem.id}">Voltar à ficha</a>`
    mensagemErroEL.style.display = "block"
} else {
    document.title = `${personagem.nome} - Magias`

    // classe sem lista de magias não abre: começa numa que abra
    const utilizavel = conjuradoras.find(function (entrada) {
        return classeNaApi(entrada.classe) !== null || magiasLocaisDaClasse(entrada.classe) !== null
    })

    classeAtiva = utilizavel.classe

    todasEquipadas = normalizarMagiasEquipadas(personagem.magiasEquipadas, classePadrao)
    equipadas = magiasEquipadasDaClasse(todasEquipadas, classeAtiva, classePadrao)
    trocas = trocasDaClasse(personagem.trocasMagia, classeAtiva, classePadrao)

    document.getElementById("nome-personagem").textContent = personagem.nome
    montarEscolhaDeClasse()
    atualizarCabecalho()

    document.getElementById("link-ficha").href = `ficha.html?id=${personagem.id}`

    buscaEL.addEventListener("input", renderizar)
    filtroCirculoEL.addEventListener("change", renderizar)
    soEquipadasEL.addEventListener("change", renderizar)
    btnTentarEL.addEventListener("click", carregar)
    btnConcluirTrocaEL.addEventListener("click", concluirTroca)

    carregar()
}
