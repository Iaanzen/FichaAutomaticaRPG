// A leitura das fichas passa por armazenamento.js, que hoje usa o navegador
// e na Fase 2 passa a usar o banco. Por isso a página espera a resposta.

const listaEl = document.getElementById("lista-personagens")
const listaVaziaEl = document.getElementById("mensagem-vazio")

function montarLista(dados) {
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
