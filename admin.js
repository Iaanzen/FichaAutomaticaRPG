// Fase 2b: tela do mestre. Libera pacotes de conteúdo por conta e mostra as
// fichas dos jogadores.
//
// A tela só aparece para o administrador, mas isso é conforto, não segurança:
// quem protege são as regras do Firestore. Se outra pessoa abrir esta página,
// o banco recusa tudo.

const telaEL = document.getElementById("tela-admin")
const mensagemErroEL = document.getElementById("mensagem-erro")
const listaPacotesEL = document.getElementById("lista-pacotes")
const listaContasEL = document.getElementById("lista-contas")
const listaFichasEL = document.getElementById("lista-fichas-todas")
const statusPacotesEL = document.getElementById("status-pacotes")
const ajudaEnvioEL = document.getElementById("ajuda-envio")
const btnEnviarEL = document.getElementById("btn-enviar-pacotes")
const btnCriarPerfilEL = document.getElementById("btn-criar-perfil")
const uidNovoEL = document.getElementById("uid-novo")
const emailNovoEL = document.getElementById("email-novo")

const bd = firebase.firestore()

// Uma chamada ao banco que não responde deixaria a tela parada para sempre,
// sem dizer nada. Com isto, ela desiste e conta o que aconteceu.
const ESPERA_MAXIMA_MS = 15000

function comLimiteDeTempo(promessa, oQue) {
    const desistir = new Promise(function (_, falhar) {
        setTimeout(function () {
            falhar(new Error(`${oQue}: o banco não respondeu em ${ESPERA_MAXIMA_MS / 1000}s`))
        }, ESPERA_MAXIMA_MS)
    })

    return Promise.race([promessa, desistir])
}

// pacotes que já estão no banco
let pacotes = []

function avisar(texto, deuCerto) {
    statusPacotesEL.textContent = texto
    statusPacotesEL.className = deuCerto ? "status-bonus status-ok" : "status-bonus status-erro"
}

/* ---------- Pacotes ---------- */

function carregarPacotes() {
    return bd.collection("pacotes").get().then(function (resposta) {
        pacotes = resposta.docs.map(function (documento) {
            return Object.assign({ id: documento.id }, documento.data())
        })

        listaPacotesEL.innerHTML = ""

        if (pacotes.length === 0) {
            const vazio = document.createElement("p")
            vazio.className = "vazio-texto"
            vazio.textContent = "Nenhum pacote no banco ainda."
            listaPacotesEL.appendChild(vazio)
        }

        pacotes.forEach(function (pacote) {
            const item = document.createElement("p")
            item.className = "magias-grupo"
            item.textContent = `${pacote.nome} (${pacote.id})`
            listaPacotesEL.appendChild(item)
        })
    })
}

// As classes fora do SRD que existem NESTA máquina, vindas do conteudo-extra.js.
// É assim que o conteúdo sai do arquivo local e vai para o banco, sem passar
// pelo repositório público.
function pacotesDaMaquina() {
    // classes inteiras (Pugilista, Artífice)
    const classes = classesForaDoSrd().map(function (valor) {
        return { id: valor, nome: CLASSES[valor].nome, tipo: "classe", valor: valor, bloco: CLASSES[valor] }
    })

    // subclasses acrescentadas a classes do SRD (Cavaleiro Arcano, Trapaceiro
    // Arcano). O id leva a classe junto porque duas classes podem ter
    // subclasses de mesmo nome.
    const subclasses = subclassesForaDoSrd().map(function (achada) {
        return {
            id: `${achada.classe}-${achada.subclasse.valor}`,
            nome: `${achada.subclasse.nome} (${nomeDaClasse(achada.classe)})`,
            tipo: "subclasse",
            classe: achada.classe,
            valor: achada.subclasse.valor,
            bloco: achada.subclasse
        }
    })

    return classes.concat(subclasses)
}

function mostrarAjudaDeEnvio() {
    const locais = pacotesDaMaquina()

    if (locais.length === 0) {
        ajudaEnvioEL.textContent =
            "Nenhuma classe fora do SRD carregada nesta máquina: o conteudo-extra.js não está aqui."
        btnEnviarEL.disabled = true
        return
    }

    const nomes = locais.map(function (p) { return p.nome }).join(", ")
    ajudaEnvioEL.textContent = `Carregadas nesta máquina: ${nomes}. Enviar substitui o que estiver no banco.`
}

function enviarPacotes() {
    const locais = pacotesDaMaquina()

    if (locais.length === 0) {
        return
    }

    btnEnviarEL.disabled = true
    avisar("Enviando...", true)

    let envios

    // O Firestore recusa alguns formatos LANÇANDO ERRO na hora, não pela
    // promessa — foi assim que "Enviando..." ficava para sempre. Daqui para
    // frente qualquer falha aparece na tela.
    try {
        envios = locais.map(function (pacote) {
            return bd.collection("pacotes").doc(pacote.id).set({
                nome: pacote.nome,
                tipo: pacote.tipo,
                // só a subclasse tem classe de destino
                classe: pacote.classe || null,
                valor: pacote.valor,
                // O bloco vai como TEXTO. O Firestore não aceita array dentro
                // de array, e a tabela de espaços por nível é exatamente isso.
                // Como o app nunca consulta dentro do bloco, guardar o JSON
                // inteiro evita essa e qualquer outra restrição de formato.
                blocoJson: JSON.stringify(pacote.bloco)
            })
        })
    } catch (erro) {
        avisar(`Não deu certo: ${erro.message}`, false)
        btnEnviarEL.disabled = false
        return
    }

    comLimiteDeTempo(Promise.all(envios), "envio dos pacotes")
        .then(function () {
            avisar(`${locais.length} pacote(s) gravado(s). Atualizando a lista...`, true)
            return comLimiteDeTempo(carregarPacotes(), "leitura dos pacotes")
        })
        .then(function () {
            avisar(`${locais.length} pacote(s) no banco.`, true)
            return montarContas()
        })
        .catch(function (erro) {
            // o console guarda o erro inteiro; a tela mostra o resumo
            console.error("Falha ao enviar pacotes:", erro)
            avisar(`Não deu certo: ${erro.message}`, false)
        })
        .then(function () {
            btnEnviarEL.disabled = false
        })
}

/* ---------- Contas ---------- */

function alternarPacote(uid, pacoteId, liberar) {
    const campo = firebase.firestore.FieldValue
    const mudanca = liberar
        ? { pacotes: campo.arrayUnion(pacoteId) }
        : { pacotes: campo.arrayRemove(pacoteId) }

    return bd.collection("perfis").doc(uid).update(mudanca)
}

function montarConta(uid, perfil) {
    const bloco = document.createElement("div")
    bloco.className = "conta-linha"

    const email = document.createElement("span")
    email.className = "conta-linha-email"
    email.textContent = perfil.email || "(sem e-mail)"

    const identificador = document.createElement("span")
    identificador.className = "conta-linha-uid"
    identificador.textContent = uid === Conteudo.UID_ADMIN ? "mestre" : uid

    bloco.appendChild(email)
    bloco.appendChild(identificador)

    const marcados = perfil.pacotes || []

    pacotes.forEach(function (pacote) {
        const rotulo = document.createElement("label")
        rotulo.className = "pericia"

        const caixa = document.createElement("input")
        caixa.type = "checkbox"
        caixa.checked = marcados.includes(pacote.id)

        caixa.addEventListener("change", function () {
            caixa.disabled = true

            alternarPacote(uid, pacote.id, caixa.checked)
                .then(function () {
                    avisar(`${perfil.email}: ${pacote.nome} ${caixa.checked ? "liberado" : "removido"}.`, true)
                })
                .catch(function (erro) {
                    caixa.checked = !caixa.checked
                    avisar(`Não deu certo: ${erro.message}`, false)
                })
                .then(function () {
                    caixa.disabled = false
                })
        })

        const nome = document.createElement("span")
        nome.className = "pericia-nome"
        nome.textContent = pacote.nome

        rotulo.appendChild(caixa)
        rotulo.appendChild(nome)
        bloco.appendChild(rotulo)
    })

    return bloco
}

function montarContas() {
    return bd.collection("perfis").get().then(function (resposta) {
        listaContasEL.innerHTML = ""

        if (resposta.empty) {
            const vazio = document.createElement("p")
            vazio.className = "vazio-texto"
            vazio.textContent = "Nenhuma conta ainda."
            listaContasEL.appendChild(vazio)
            return
        }

        resposta.docs.forEach(function (documento) {
            listaContasEL.appendChild(montarConta(documento.id, documento.data()))
        })
    })
}

function criarPerfil() {
    const uid = uidNovoEL.value.trim()

    if (uid === "") {
        avisar("Escreva o identificador da conta.", false)
        return
    }

    bd.collection("perfis").doc(uid).set({
        email: emailNovoEL.value.trim() || "(ainda não entrou)",
        pacotes: []
    })
        .then(function () {
            uidNovoEL.value = ""
            emailNovoEL.value = ""
            avisar("Perfil criado. Marque os pacotes na lista.", true)
            return montarContas()
        })
        .catch(function (erro) {
            avisar(`Não deu certo: ${erro.message}`, false)
        })
}

/* ---------- Fichas dos jogadores (painel de mestre) ---------- */

function montarFichas() {
    return bd.collection("fichas").get().then(function (resposta) {
        listaFichasEL.innerHTML = ""

        if (resposta.empty) {
            const vazio = document.createElement("p")
            vazio.className = "vazio-texto"
            vazio.textContent = "Nenhuma ficha ainda."
            listaFichasEL.appendChild(vazio)
            return
        }

        // agrupa por dono, para o mestre ver a mesa e não uma lista solta
        const porDono = {}

        resposta.docs.forEach(function (documento) {
            const ficha = documento.data()
            const dono = ficha.dono || "(sem dono)"
            porDono[dono] = porDono[dono] || []
            porDono[dono].push(Object.assign({ id: documento.id }, ficha))
        })

        Object.keys(porDono).forEach(function (dono) {
            const grupo = document.createElement("div")
            grupo.className = "grupo-fichas"

            const titulo = document.createElement("span")
            titulo.className = "grupo-fichas-dono"
            titulo.textContent = nomeDoDono(dono)
            grupo.appendChild(titulo)

            porDono[dono].forEach(function (ficha) {
                const classes = ficha.classes && ficha.classes.length
                    ? descreverClasses(ficha.classes)
                    : `${nomeDaClasse(ficha.classe)} ${ficha.nivel}`

                // abre a ficha normal; ela se trava sozinha por não ser sua
                const link = document.createElement("a")
                link.className = "ficha-do-jogador"
                link.href = `ficha.html?id=${ficha.id}`
                link.textContent = `${ficha.nome} — ${classes}`
                grupo.appendChild(link)
            })

            listaFichasEL.appendChild(grupo)
        })
    })
}

// o e-mail é mais útil que o uid; vem dos perfis já carregados
const emailPorUid = {}

function nomeDoDono(uid) {
    return emailPorUid[uid] || uid
}

/* ---------- Início ---------- */

Auth.protegerPagina()
    .then(function (usuario) {
        if (!usuario) {
            return null
        }

        if (!Conteudo.ehAdmin()) {
            telaEL.style.display = "none"
            mensagemErroEL.style.display = "block"
            return null
        }

        mostrarAjudaDeEnvio()

        return bd.collection("perfis").get()
            .then(function (resposta) {
                resposta.docs.forEach(function (documento) {
                    emailPorUid[documento.id] = (documento.data() || {}).email
                })
            })
            .then(carregarPacotes)
            .then(montarContas)
            .then(montarFichas)
            .catch(function (erro) {
                avisar(`Não deu para carregar: ${erro.message}`, false)
            })
    })

btnEnviarEL.addEventListener("click", enviarPacotes)
btnCriarPerfilEL.addEventListener("click", criarPerfil)
