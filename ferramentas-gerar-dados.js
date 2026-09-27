// Gera os arquivos de dados do app a partir da API do D&D 5e.
//
// Rode de novo quando quiser atualizar o conteúdo. Os dados congelam na data
// da geração — o que é proposital: hoje uma mudança na API entra no app sem
// ninguém saber.
//
//   node gerar-dados.js "C:/caminho/do/projeto"

const vm = require("vm"), fs = require("fs"), path = require("path")
const pasta = process.argv[2]
const ler = (f) => fs.readFileSync(path.join(pasta, f), "utf8")
const escrever = (f, texto) => fs.writeFileSync(path.join(pasta, f), texto, "utf8")

const c = vm.createContext({ console })
vm.runInContext(ler("regras.js"), c)
const r = (e) => vm.runInContext(e, c)

const HOJE = new Date().toISOString().slice(0, 10)

// quebra o texto da API em parágrafos, sem linhas vazias
function paragrafos(texto) {
    if (Array.isArray(texto)) {
        return texto
    }

    return String(texto || "")
        .split(String.fromCharCode(10))
        .map(function (linha) { return linha.trim() })
        .filter(function (linha) { return linha !== "" })
}

async function graphql(consulta) {
    const resposta = await fetch("https://www.dnd5eapi.co/graphql/2024", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: consulta })
    })
    const d = await resposta.json()
    if (d.errors) throw new Error(d.errors[0].message)
    return d.data
}

function cabecalho(oQue, quantos) {
    return `// ${oQue} — ${quantos} itens, gerado da API do D&D 5e em ${HOJE}.
//
// ARQUIVO GERADO: não edite à mão. Para atualizar, rode gerar-dados.js.
//
// Conteúdo do System Reference Document, sob CC-BY-4.0 (ver README).

`
}

/* ---------- 1. Magias ---------- */

async function gerarMagias() {
    const dados = await graphql(`{ spells(limit: 400) {
        index name level concentration ritual
        casting_time range duration components material
        school { name } description
        classes { index }
    } }`)

    const magias = dados.spells
        .map(function (m) {
            return {
                index: m.index,
                name: m.name,
                level: m.level,
                concentration: m.concentration === true,
                ritual: m.ritual === true,
                school: { name: m.school ? m.school.name : "" },
                casting_time: m.casting_time || "",
                range: m.range || "",
                duration: m.duration || "",
                components: m.components || [],
                material: m.material || null,
                // um parágrafo por item: a tela desenha um <p> para cada.
                // A API devolve tudo num texto só, e as quebras de linha
                // sumiriam dentro de um parágrafo único.
                description: paragrafos(m.description),
                // de quais listas de classe esta magia faz parte
                classes: (m.classes || []).map((k) => k.index)
            }
        })
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))

    const linhas = magias.map((m) => "    " + JSON.stringify(m)).join(",\n")

    escrever("dados-magias.js",
        cabecalho("Magias do SRD", magias.length) +
        "const MAGIAS_SRD = [\n" + linhas + "\n]\n")

    console.log(`dados-magias.js: ${magias.length} magias`)
    return magias
}

/* ---------- 2. Habilidades de classe e subclasse ---------- */

async function gerarHabilidades() {
    // só as que o app referencia
    const codigos = new Set()

    r("CLASSES_SRD").forEach(function (classe) {
        JSON.parse(r(`JSON.stringify(habilidadesDaClasse(${JSON.stringify(classe)}, 20))`))
            .forEach((h) => { if (h.api) codigos.add(h.api) })

        JSON.parse(r(`JSON.stringify(subclassesPorClasse[${JSON.stringify(classe)}])`))
            .forEach(function (sub) {
                Object.values(sub.habilidadesPorNivel || {}).forEach(function (lista) {
                    lista.forEach((h) => { if (h.api) codigos.add(h.api) })
                })
            })
    })

    const todas = (await graphql(`{ features(limit: 500) { index description } }`)).features
    const mapa = {}
    const faltando = []

    codigos.forEach(function (codigo) {
        const achada = todas.find((f) => f.index === codigo)

        if (!achada) {
            faltando.push(codigo)
            return
        }

        const texto = Array.isArray(achada.description)
            ? achada.description.join("\n\n")
            : String(achada.description || "")

        mapa[codigo] = texto
    })

    const linhas = Object.keys(mapa).sort()
        .map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(mapa[k])}`)
        .join(",\n")

    escrever("dados-habilidades.js",
        cabecalho("Descrições das habilidades de classe e subclasse", Object.keys(mapa).length) +
        "const DESCRICOES_HABILIDADES = {\n" + linhas + "\n}\n")

    console.log(`dados-habilidades.js: ${Object.keys(mapa).length} habilidades` +
        (faltando.length ? ` (${faltando.length} sem descrição: ${faltando.join(", ")})` : ""))
}

/* ---------- 3. Condições ---------- */

async function gerarCondicoes() {
    const mapa = {}

    for (const cond of r("CONDICOES")) {
        const resposta = await fetch(`https://www.dnd5eapi.co/api/2024/conditions/${cond.valor}`)

        if (!resposta.ok) {
            console.log(`  !! condição ${cond.valor} não existe na API`)
            continue
        }

        const d = await resposta.json()
        const texto = d.description || d.desc

        mapa[cond.valor] = Array.isArray(texto) ? texto.join("\n\n") : String(texto || "")
    }

    const linhas = Object.keys(mapa).sort()
        .map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(mapa[k])}`)
        .join(",\n")

    escrever("dados-condicoes.js",
        cabecalho("Descrições das condições", Object.keys(mapa).length) +
        "const DESCRICOES_CONDICOES = {\n" + linhas + "\n}\n")

    console.log(`dados-condicoes.js: ${Object.keys(mapa).length} condições`)
}

/* ---------- 4. Limites de truques e magias preparadas ---------- */

async function gerarLimites() {
    const limites = {}

    for (const classe of r("CLASSES_SRD")) {
        const api = r(`classeNaApi(${JSON.stringify(classe)})`)

        if (!api) {
            continue
        }

        const porNivel = {}

        for (let nivel = 1; nivel <= 20; nivel++) {
            const resposta = await fetch(`https://www.dnd5eapi.co/api/2024/classes/${api}/levels/${nivel}`)

            if (!resposta.ok) {
                continue
            }

            const conjuracao = (await resposta.json()).spellcasting

            if (conjuracao) {
                porNivel[nivel] = {
                    truques: conjuracao.cantrips_known || 0,
                    magias: conjuracao.prepared_spells || 0
                }
            }
        }

        if (Object.keys(porNivel).length) {
            limites[classe] = porNivel
        }
    }

    const linhas = Object.keys(limites).sort().map(function (classe) {
        const niveis = Object.keys(limites[classe]).sort((a, b) => a - b)
            .map((n) => `${n}: { truques: ${limites[classe][n].truques}, magias: ${limites[classe][n].magias} }`)
            .join(",\n        ")

        return `    ${classe}: {\n        ${niveis}\n    }`
    }).join(",\n")

    escrever("dados-limites-magias.js",
        cabecalho("Truques e magias preparadas por classe e nível", Object.keys(limites).length) +
        "const LIMITES_DE_MAGIAS = {\n" + linhas + "\n}\n")

    console.log(`dados-limites-magias.js: ${Object.keys(limites).length} classes conjuradoras`)
}

async function principal() {
    await gerarMagias()
    await gerarHabilidades()
    await gerarCondicoes()
    await gerarLimites()
    console.log("\nPronto.")
}

principal().catch((e) => { console.log("ERRO:", e.message); process.exit(1) })
