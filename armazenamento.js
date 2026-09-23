// Fase 2, etapa 2: o único lugar do app que sabe ONDE as fichas ficam guardadas.
// Agora é o Firestore, uma ficha por documento, com o campo "dono" guardando o
// uid de quem a criou.
//
// Quem garante que ninguém lê a ficha alheia são as REGRAS do Firestore
// (firestore.rules), não o código daqui. Este arquivo só pede os dados certos;
// se pedisse os errados, o banco recusaria.
//
// A API é a mesma da etapa 0 (quando isto era localStorage), por isso as
// páginas não mudaram: tudo devolve Promise e o id é texto opaco.

const COLECAO = "fichas"

// Modo offline: o Firestore guarda uma cópia local e sincroniza quando a
// internet volta — é o que faz o app funcionar na mesa quando a rede do lugar
// cai. Falha quando o app está aberto em várias abas; aí só a primeira tem a
// cópia local, e as outras seguem funcionando online.
firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(function (erro) {
    console.warn("Sem cópia local do banco nesta aba:", erro.code)
})

const Armazenamento = {
    // o id do documento é gerado pelo Firestore; isto só existe para o
    // cadastro, que monta a ficha antes de gravar
    novoId: function () {
        return ""
    },

    mesmoId: function (a, b) {
        return String(a) === String(b)
    },

    uid: function () {
        const usuario = firebase.auth().currentUser
        return usuario ? usuario.uid : null
    },

    colecao: function () {
        return firebase.firestore().collection(COLECAO)
    },

    // O Firestore recusa valores "undefined" e não guarda funções. A ida e
    // volta por JSON limpa os dois de uma vez.
    limpar: function (ficha) {
        const copia = JSON.parse(JSON.stringify(ficha))
        delete copia.id
        return copia
    },

    // o id mora no documento, não dentro dos dados
    comId: function (documento) {
        return Object.assign({}, documento.data(), { id: documento.id })
    },

    carregarFichas: function () {
        const dono = Armazenamento.uid()

        if (!dono) {
            return Promise.resolve([])
        }

        return Armazenamento.colecao()
            .where("dono", "==", dono)
            .get()
            .then(function (resposta) {
                return resposta.docs.map(Armazenamento.comId)
            })
    },

    carregarFicha: function (id) {
        if (!id) {
            return Promise.resolve(null)
        }

        return Armazenamento.colecao()
            .doc(String(id))
            .get()
            .then(function (documento) {
                return documento.exists ? Armazenamento.comId(documento) : null
            })
    },

    // grava UMA ficha: cria se ainda não tem id, substitui se já tem
    gravarFicha: function (ficha) {
        const dono = Armazenamento.uid()

        if (!dono) {
            return Promise.reject(new Error("Ninguém conectado."))
        }

        const dados = Armazenamento.limpar(ficha)
        dados.dono = dono

        if (!ficha.id) {
            return Armazenamento.colecao()
                .add(dados)
                .then(function (documento) {
                    // o resto do app segue usando o mesmo objeto
                    ficha.id = documento.id
                    return ficha
                })
        }

        return Armazenamento.colecao()
            .doc(String(ficha.id))
            .set(dados)
            .then(function () {
                return ficha
            })
    },

    excluirFicha: function (id) {
        return Armazenamento.colecao().doc(String(id)).delete()
    },

    /* ---------- Etapa 3: trazer as fichas que ficaram no navegador ---------- */

    CHAVE_ANTIGA: "fichas",

    // as fichas da época em que tudo morava no navegador
    fichasDoNavegador: function () {
        try {
            return JSON.parse(localStorage.getItem(Armazenamento.CHAVE_ANTIGA)) || []
        } catch (erro) {
            return []
        }
    },

    // Copia para a conta. Não apaga o que está no navegador: se algo der
    // errado no meio, os personagens continuam onde estavam.
    enviarParaAConta: function () {
        const locais = Armazenamento.fichasDoNavegador()

        // cada ficha vira documento novo: o id antigo era do navegador
        const envios = locais.map(function (ficha) {
            const copia = Object.assign({}, ficha)
            delete copia.id
            return Armazenamento.gravarFicha(copia)
        })

        return Promise.all(envios).then(function (enviadas) {
            return enviadas.length
        })
    },

    esquecerNavegador: function () {
        localStorage.removeItem(Armazenamento.CHAVE_ANTIGA)
    }
}
