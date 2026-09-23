// Fase 2, etapa 1: login.
//
// Nesta etapa as fichas continuam no navegador, de propósito: login e dados são
// dois problemas, e misturar os dois é a receita para não saber qual quebrou.
// A troca do armazenamento vem na etapa 2.

const Auth = {
    // Mensagens do Firebase vêm em inglês e com código técnico. Estas são as
    // que o jogador realmente encontra.
    RECADOS: {
        "auth/invalid-email": "E-mail inválido.",
        "auth/missing-password": "Digite a senha.",
        "auth/weak-password": "A senha precisa de pelo menos 6 caracteres.",
        "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/user-not-found": "Não existe conta com esse e-mail.",
        "auth/wrong-password": "E-mail ou senha incorretos.",
        "auth/too-many-requests": "Muitas tentativas. Espere um pouco e tente de novo.",
        "auth/network-request-failed": "Sem conexão com o servidor."
    },

    recado: function (erro) {
        return Auth.RECADOS[erro.code] || `Não deu certo: ${erro.message}`
    },

    usuarioAtual: function () {
        return firebase.auth().currentUser
    },

    // Promise que resolve com o usuário (ou null) assim que o Firebase decide.
    // É assíncrono porque ele confere a sessão guardada antes de responder.
    quandoDecidir: function () {
        return new Promise(function (pronto) {
            const parar = firebase.auth().onAuthStateChanged(function (usuario) {
                parar()
                pronto(usuario)
            })
        })
    },

    criarConta: function (email, senha) {
        return firebase.auth().createUserWithEmailAndPassword(email, senha)
    },

    entrar: function (email, senha) {
        return firebase.auth().signInWithEmailAndPassword(email, senha)
    },

    recuperarSenha: function (email) {
        return firebase.auth().sendPasswordResetEmail(email)
    },

    sair: function () {
        return firebase.auth().signOut().then(function () {
            window.location.href = "login.html"
        })
    },

    // Guarda das páginas internas: sem conta, volta para o login.
    // A página fica escondida até a resposta chegar, senão o conteúdo pisca
    // na tela antes do redirecionamento.
    protegerPagina: function () {
        document.documentElement.classList.add("verificando-login")

        return Auth.quandoDecidir().then(function (usuario) {
            if (!usuario) {
                window.location.href = "login.html"
                return null
            }

            document.documentElement.classList.remove("verificando-login")
            Auth.montarBarraDaConta(usuario)
            return usuario
        })
    },

    // Mostra quem está conectado e o botão de sair, se a página tiver o espaço
    montarBarraDaConta: function (usuario) {
        const barraEL = document.getElementById("barra-conta")

        if (barraEL === null) {
            return
        }

        const email = document.createElement("span")
        email.className = "conta-email"
        email.textContent = usuario.email

        const sair = document.createElement("button")
        sair.type = "button"
        sair.className = "botao-sair"
        sair.textContent = "Sair"
        sair.addEventListener("click", Auth.sair)

        barraEL.innerHTML = ""
        barraEL.appendChild(email)
        barraEL.appendChild(sair)
    }
}
