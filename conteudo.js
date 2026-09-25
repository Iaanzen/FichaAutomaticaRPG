// Fase 2b: conteúdo fora do SRD entregue por conta.
//
// O site é público, então Pugilista e Artífice não podem ser servidos como
// arquivo (qualquer um baixaria). Eles ficam no banco, na coleção "pacotes", e
// as REGRAS do Firestore só entregam o pacote a quem o tem listado no perfil.
// Pedir um pacote não liberado devolve erro de permissão — não é o JavaScript
// daqui que decide.
//
// Na máquina do dono, o conteudo-extra.js local continua funcionando e carrega
// antes disto; um pacote já registrado não é registrado de novo.

const Conteudo = {
    UID_ADMIN: "bBAhU94qMPP1vM6r11U6HTpjbck2",

    ehAdmin: function () {
        const usuario = firebase.auth().currentUser
        return usuario !== null && usuario.uid === Conteudo.UID_ADMIN
    },

    // Chamado depois da guarda de login e antes da página montar, porque os
    // selects de classe precisam já conhecer o que a conta pode usar.
    carregar: function () {
        const liberados = Auth.pacotesLiberados()

        if (liberados.length === 0) {
            return Promise.resolve([])
        }

        const buscas = liberados.map(function (id) {
            return firebase.firestore().collection("pacotes").doc(id).get()
        })

        return Promise.all(buscas)
            .then(function (respostas) {
                const registrados = []

                respostas.forEach(function (resposta) {
                    if (!resposta.exists) {
                        return
                    }

                    const pacote = resposta.data()

                    // O bloco é guardado como texto (ver admin.js). Pacotes
                    // enviados antes dessa mudança ainda trazem o objeto.
                    const bloco = pacote.blocoJson
                        ? JSON.parse(pacote.blocoJson)
                        : pacote.bloco

                    // o conteudo-extra.js local pode já ter registrado isto;
                    // registrar de novo não faz mal, mas evitamos o retrabalho
                    if (pacote.tipo === "classe" && !CLASSES[pacote.valor]) {
                        registrarClasse(pacote.valor, bloco)
                        registrados.push(pacote.valor)
                    }

                    // subclasse acrescentada a uma classe que já existe
                    // (Cavaleiro Arcano no Guerreiro)
                    if (pacote.tipo === "subclasse") {
                        registrarSubclasse(pacote.classe, bloco)
                        registrados.push(pacote.valor)
                    }
                })

                Conteudo.atualizarSelectDeClasse()
                return registrados
            })
            .catch(function (erro) {
                // sem o conteúdo extra o app continua inteiro, só com o SRD
                console.warn("Não deu para carregar os pacotes:", erro.message)
                return []
            })
    },

    // O select de classe é montado por ficha-comum.js quando a página carrega,
    // antes de sabermos quem está conectado. Com pacote novo ele precisa ser
    // remontado, mantendo o que já estava escolhido.
    atualizarSelectDeClasse: function () {
        if (typeof classeEL === "undefined" || classeEL === null) {
            return
        }

        preencherSelect(classeEL, listaDeClasses(), classeEL.value)
    }
}
