// Regras e tabelas de D&D usadas pelo cadastro e pela ficha.
// Carregue este arquivo ANTES de cadastro.js / ficha.js no HTML.
//
// Regras 2024: bonus de atributo vem do antecedente, escolhido pelo jogador.
// As tabelas bonusPorRaca / bonusPorSubRaca do modelo 2014 foram removidas.
// A raca continua valendo para tracos e pericias, em sprints futuros.

const ATRIBUTOS = [
    "forca",
    "destreza",
    "constituicao",
    "inteligencia",
    "sabedoria",
    "carisma"
]

// nivel minimo em que a classe escolhe subclasse (regra geral do PHB 2024)
const NIVEL_SUBCLASSE = 3

const subracasPorRaca = {
    anao: [
        { valor: "anaoColina", nome: "Anão da Colina" },
        { valor: "anaoMontanha", nome: "Anão da Montanha" }
    ],
    elfo: [
        { valor: "elfoAlto", nome: "Elfo Alto" },
        { valor: "elfoFloresta", nome: "Elfo da Floresta" },
        { valor: "elfoNegro", nome: "Elfo Negro" }
    ],
    halfling: [
        { valor: "halflingPesLeves", nome: "Halfling Pés-Leves" },
        { valor: "halflingRobusto", nome: "Halfling Robusto" }
    ],
    gnomo: [
        { valor: "gnomoFloresta", nome: "Gnomo da Floresta" },
        { valor: "gnomoRocha", nome: "Gnomo das Rochas" }
    ]
};

// mesma estrutura de subracasPorRaca: chave = valor do select de classe
const subclassesPorClasse = {
    barbaro: [
        { valor: "berserker", nome: "Caminho do Berserker" },
        { valor: "guerreiroTotemico", nome: "Caminho do Guerreiro Totêmico" }
    ],
    bardo: [
        { valor: "colegioConhecimento", nome: "Colégio do Conhecimento" },
        { valor: "colegioBravura", nome: "Colégio da Bravura" }
    ],
    bruxo: [
        { valor: "arquifada", nome: "O Arquifada" },
        { valor: "corruptor", nome: "O Corruptor" },
        { valor: "grandeAntigo", nome: "O Grande Antigo" }
    ],
    clerigo: [
        { valor: "dominioVida", nome: "Domínio da Vida" },
        { valor: "dominioLuz", nome: "Domínio da Luz" },
        { valor: "dominioGuerra", nome: "Domínio da Guerra" }
    ],
    druida: [
        { valor: "circuloTerra", nome: "Círculo da Terra" },
        { valor: "circuloLua", nome: "Círculo da Lua" }
    ],
    feiticeiro: [
        { valor: "linhagemDraconica", nome: "Linhagem Dracônica" },
        { valor: "magiaSelvagem", nome: "Magia Selvagem" }
    ],
    guerreiro: [
        { valor: "campeao", nome: "Campeão" },
        { valor: "mestreBatalha", nome: "Mestre de Batalha" },
        { valor: "cavaleiroArcano", nome: "Cavaleiro Arcano" }
    ],
    ladino: [
        { valor: "trapaceiro", nome: "Trapaceiro" },
        { valor: "assassino", nome: "Assassino" },
        { valor: "trapaceiroArcano", nome: "Trapaceiro Arcano" }
    ],
    mago: [
        { valor: "evocacao", nome: "Escola de Evocação" },
        { valor: "abjuracao", nome: "Escola de Abjuração" },
        { valor: "ilusao", nome: "Escola de Ilusão" }
    ],
    monge: [
        { valor: "maoAberta", nome: "Caminho da Mão Aberta" },
        { valor: "sombras", nome: "Caminho das Sombras" },
        { valor: "quatroElementos", nome: "Caminho dos Quatro Elementos" }
    ],
    paladino: [
        { valor: "juramentoDevocao", nome: "Juramento da Devoção" },
        { valor: "juramentoAnciaos", nome: "Juramento dos Anciãos" },
        { valor: "juramentoVinganca", nome: "Juramento da Vingança" }
    ],
    patrulheiro: [
        { valor: "cacador", nome: "Caçador" },
        { valor: "senhorFeras", nome: "Senhor das Feras" }
    ]
};

/* ---------- RF07: modificadores ---------- */

// regra do PHB: (valor final - 10) / 2, sempre arredondado para baixo
function modificadorDe(valor) {
    return Math.floor((valor - 10) / 2)
}

// modificador se mostra com sinal: +2, -1, +0
function formatarModificador(modificador) {
    if (modificador >= 0) {
        return `+${modificador}`
    }

    return `${modificador}`
}

// so duas formas valem: +2/+1 em dois atributos, ou +1 em tres
function distribuicaoBonusValida(bonus) {
    const valores = []

    ATRIBUTOS.forEach(function(atributo) {
        if (bonus[atributo] > 0) {
            valores.push(bonus[atributo])
        }
    })

    if (valores.length === 2) {
        return valores.includes(2) && valores.includes(1)
    }

    if (valores.length === 3) {
        return valores.every(function(valor) {
            return valor === 1
        })
    }

    return false
}

// preenche um select a partir de uma lista [{ valor, nome }]
function preencherSelect(selectEL, lista, valorSelecionado) {
    selectEL.innerHTML = ""

    const opcaoVazia = document.createElement("option")
    opcaoVazia.value = ""
    opcaoVazia.textContent = "Selecione..."
    selectEL.appendChild(opcaoVazia)

    lista.forEach(function(item) {
        const opcao = document.createElement("option")
        opcao.value = item.valor
        opcao.textContent = item.nome
        selectEL.appendChild(opcao)
    })

    if (valorSelecionado) {
        selectEL.value = valorSelecionado
    }
}
