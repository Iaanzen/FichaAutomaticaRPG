// Tela de entrada. Um formulário só, que alterna entre entrar e criar conta.
// O cadastro é aberto: qualquer pessoa cria a conta e usa o conteúdo gratuito.

const formLogin = document.getElementById("form-login")
const emailEL = document.getElementById("email")
const senhaEL = document.getElementById("senha")
const statusEL = document.getElementById("status-login")
const btnPrincipalEL = document.getElementById("btn-principal")
const btnAlternarEL = document.getElementById("btn-alternar")
const btnEsqueciEL = document.getElementById("btn-esqueci")

let criandoConta = false

function mostrarErro(texto) {
    statusEL.textContent = texto
    statusEL.className = "status-bonus status-erro"
}

function mostrarAviso(texto) {
    statusEL.textContent = texto
    statusEL.className = "status-bonus status-ok"
}

function limparStatus() {
    statusEL.textContent = ""
    statusEL.className = "status-bonus"
}

function alternarModo() {
    criandoConta = !criandoConta
    limparStatus()

    btnPrincipalEL.textContent = criandoConta ? "Criar conta" : "Entrar"
    btnAlternarEL.textContent = criandoConta
        ? "Já tenho conta. Entrar"
        : "Não tem conta? Criar uma"

    // o navegador guarda senha nova e senha atual em lugares diferentes
    senhaEL.autocomplete = criandoConta ? "new-password" : "current-password"
}

formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault()
    limparStatus()

    btnPrincipalEL.disabled = true

    const acao = criandoConta
        ? Auth.criarConta(emailEL.value, senhaEL.value)
        : Auth.entrar(emailEL.value, senhaEL.value)

    acao
        .then(function () {
            window.location.href = "index.html"
        })
        .catch(function (erro) {
            mostrarErro(Auth.recado(erro))
            btnPrincipalEL.disabled = false
        })
})

btnAlternarEL.addEventListener("click", alternarModo)

btnEsqueciEL.addEventListener("click", function () {
    if (emailEL.value.trim() === "") {
        mostrarErro("Escreva o e-mail acima para receber o link de troca de senha.")
        return
    }

    Auth.recuperarSenha(emailEL.value)
        .then(function () {
            mostrarAviso("Link enviado. Veja a sua caixa de entrada (e o spam).")
        })
        .catch(function (erro) {
            mostrarErro(Auth.recado(erro))
        })
})

// Quem já está conectado não precisa ver esta tela.
Auth.quandoDecidir().then(function (usuario) {
    if (usuario) {
        window.location.href = "index.html"
    }
})
