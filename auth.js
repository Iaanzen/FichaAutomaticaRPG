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

    /* ---------- Fase 2b: perfil da conta ---------- */

    // Cada conta tem um documento com o e-mail e os pacotes de conteúdo
    // liberados. Ele nasce vazio: quem libera pacote é a conta administradora,
    // pela tela de administração. As regras do Firestore impedem que alguém
    // crie o próprio perfil já com pacotes dentro.
    perfilAtual: null,

    garantirPerfil: function (usuario) {
        const documento = firebase.firestore().collection("perfis").doc(usuario.uid)

        return documento.get().then(function (resposta) {
            if (resposta.exists) {
                Auth.perfilAtual = resposta.data()
                return Auth.perfilAtual
            }

            const novo = { email: usuario.email, pacotes: [] }

            return documento.set(novo).then(function () {
                Auth.perfilAtual = novo
                return novo
            })
        })
    },

    pacotesLiberados: function () {
        return (Auth.perfilAtual && Auth.perfilAtual.pacotes) || []
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

            // o perfil decide quais pacotes de conteúdo a conta enxerga
            return Auth.garantirPerfil(usuario).then(function () {
                document.documentElement.classList.remove("verificando-login")
                Auth.montarBarraDaConta(usuario)
                return usuario
            })
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

        // o atalho da administração só existe para o mestre; quem protege de
        // verdade são as regras do Firestore
        if (typeof Conteudo !== "undefined" && Conteudo.ehAdmin()) {
            const admin = document.createElement("a")
            admin.href = "admin.html"
            admin.className = "botao-sair"
            admin.textContent = "Mestre"
            barraEL.appendChild(admin)
        }

        barraEL.appendChild(sair)
    }
}
