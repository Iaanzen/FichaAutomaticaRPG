// A leitura das fichas passa por armazenamento.js, que hoje usa o navegador
// e na Fase 2 passa a usar o banco. Por isso a página espera a resposta.

const listaEl = document.getElementById("lista-personagens")
const listaVaziaEl = document.getElementById("mensagem-vazio")

/* ---------- RF40: exportar e importar ---------- */

const blocoBackupEL = document.getElementById("bloco-backup")
const statusBackupEL = document.getElementById("status-backup")
const btnExportarTudoEL = document.getElementById("btn-exportar-tudo")
const btnImportarEL = document.getElementById("btn-importar")
const arquivoImportarEL = document.getElementById("arquivo-importar")

// as fichas carregadas, guardadas para exportar sem ir ao banco de novo
let fichasNaTela = []

function avisarBackup(texto, deuCerto) {
    statusBackupEL.textContent = texto
    statusBackupEL.className = deuCerto ? "backup-ok" : "backup-erro"
}

// nome de arquivo sem acento nem espaço, que todo sistema aceita
function nomeDeArquivo(texto) {
    return texto
        .normalize("NFD")
        // tira os acentos que o normalize separou da letra
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "ficha"
}

function baixarJson(nome, dados) {
    const texto = JSON.stringify(dados, null, 2)
    const url = URL.createObjectURL(new Blob([texto], { type: "application/json" }))

    const link = document.createElement("a")
    link.href = url
    link.download = nome
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // o navegador já copiou o conteúdo; segurar o endereço só gasta memória
    URL.revokeObjectURL(url)
}

function exportarUma(ficha) {
    baixarJson(`${nomeDeArquivo(ficha.nome)}.json`, Armazenamento.paraBackup([ficha]))
    avisarBackup(`${ficha.nome} exportado.`, true)
}

function exportarTudo() {
    if (fichasNaTela.length === 0) {
        avisarBackup("Não há personagens para exportar.", false)
        return
    }

    const dia = new Date().toISOString().slice(0, 10)
    baixarJson(`forja-de-criacao-${dia}.json`, Armazenamento.paraBackup(fichasNaTela))
    avisarBackup(`${fichasNaTela.length} personagem(ns) exportado(s).`, true)
}

function importarArquivo(arquivo) {
    avisarBackup("Lendo o arquivo...", true)

    const leitor = new FileReader()

    leitor.onload = function () {
        let quantas

        try {
            quantas = Armazenamento.fichasDoBackup(leitor.result).length
        } catch (erro) {
            avisarBackup(`Não deu certo: ${erro.message}`, false)
            return
        }

        // importar cria fichas NOVAS; nada do que existe é sobrescrito
        Armazenamento.importarFichas(leitor.result)
            .then(function (total) {
                avisarBackup(`${total} personagem(ns) importado(s). Recarregando...`, true)
                window.location.reload()
            })
            .catch(function (erro) {
                avisarBackup(`Não deu certo: ${erro.message}`, false)
            })
    }

    leitor.onerror = function () {
        avisarBackup("Não deu para ler o arquivo.", false)
    }

    leitor.readAsText(arquivo)
}

btnExportarTudoEL.addEventListener("click", exportarTudo)
btnImportarEL.addEventListener("click", function () {
    arquivoImportarEL.click()
})

arquivoImportarEL.addEventListener("change", function () {
    if (arquivoImportarEL.files.length > 0) {
        importarArquivo(arquivoImportarEL.files[0])
    }

    // permite escolher o mesmo arquivo de novo depois de um erro
    arquivoImportarEL.value = ""
})

function montarLista(dados) {
    fichasNaTela = dados

    if (dados.length === 0) {
        listaEl.style.display = "none"
        listaVaziaEl.style.display = "block"
        return
    }

    listaEl.style.display = "block"
    listaVaziaEl.style.display = "none"

    dados.forEach(function (item) {
        const nome = document.createElement("li")
        listaEl.appendChild(nome)

        const link = document.createElement("a")
        link.textContent = item.nome
        link.href = "ficha.html?id=" + item.id
        nome.appendChild(link)

        const exportar = document.createElement("button")
        exportar.textContent = "Exportar"
        exportar.className = "botao-exportar"
        exportar.addEventListener("click", function () {
            exportarUma(item)
        })
        nome.appendChild(exportar)

        const excluir = document.createElement("button")
        excluir.textContent = "Excluir"
        nome.appendChild(excluir)

        excluir.addEventListener("click", function () {
            Armazenamento.excluirFicha(item.id).then(function () {
                window.location.reload()
            })
        })
    })
}

/* ---------- Etapa 3: fichas que ficaram no navegador ---------- */

const blocoMigracaoEL = document.getElementById("bloco-migracao")
const textoMigracaoEL = document.getElementById("texto-migracao")
const btnMigrarEL = document.getElementById("btn-migrar")
const btnDispensarEL = document.getElementById("btn-dispensar-migracao")

function oferecerMigracao() {
    const locais = Armazenamento.fichasDoNavegador()

    if (locais.length === 0) {
        return
    }

    textoMigracaoEL.textContent =
        `Há ${locais.length} personagem(ns) guardado(s) só neste navegador, de antes do login. ` +
        `Enviar para a sua conta faz com que apareçam em qualquer aparelho.`

    blocoMigracaoEL.hidden = false
}

btnMigrarEL.addEventListener("click", function () {
    btnMigrarEL.disabled = true
    textoMigracaoEL.textContent = "Enviando..."

    Armazenamento.enviarParaAConta()
        .then(function (quantas) {
            // só esquece o navegador depois que o envio deu certo
            Armazenamento.esquecerNavegador()
            textoMigracaoEL.textContent = `${quantas} personagem(ns) enviado(s). Recarregando...`
            window.location.reload()
        })
        .catch(function (erro) {
            textoMigracaoEL.textContent =
                `Não deu para enviar: ${erro.message}. Os personagens continuam no navegador.`
            btnMigrarEL.disabled = false
        })
})

btnDispensarEL.addEventListener("click", function () {
    blocoMigracaoEL.hidden = true
})

// sem conta, a guarda manda para o login antes de qualquer coisa
Auth.protegerPagina()
    // pacotes liberados para a conta, antes da tela montar
    .then(Conteudo.carregar)
    .then(function () {
        return Armazenamento.carregarFichas()
    })
    .then(function (fichas) {
        montarLista(fichas)
        oferecerMigracao()
    })
