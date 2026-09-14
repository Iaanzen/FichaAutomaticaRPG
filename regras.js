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

/* ---------- RF04, RF11, RF12: deslocamento, traços e idiomas da raça ---------- */

// Deslocamento em metros. Tracos e idiomas sao texto fixo do livro.
const dadosPorRaca = {
    humano: {
        deslocamento: 9,
        idiomas: ["Comum", "Um idioma à sua escolha"],
        tracos: [
            "Versátil: aprende um idioma adicional além do Comum."
        ]
    },
    anao: {
        deslocamento: 7.5,
        idiomas: ["Comum", "Anão"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Resiliência Anã: vantagem em salvaguardas contra veneno e resistência a dano de veneno.",
            "Treinamento Anão em Combate: proficiência com machado de batalha, machadinha, martelo leve e martelo de guerra.",
            "Especialização em Pedra: dobra a proficiência em testes de História sobre trabalhos em pedra."
        ]
    },
    elfo: {
        deslocamento: 9,
        idiomas: ["Comum", "Élfico"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Sentidos Aguçados: proficiência em Percepção.",
            "Ancestral Feérico: vantagem contra ser enfeitiçado e imunidade a sono mágico.",
            "Transe: medita 4 horas em vez de dormir 8."
        ]
    },
    halfling: {
        deslocamento: 7.5,
        idiomas: ["Comum", "Halfling"],
        tracos: [
            "Sortudo: pode rolar de novo um 1 natural no d20 de ataque, teste ou salvaguarda.",
            "Bravura: vantagem em salvaguardas contra ficar amedrontado.",
            "Agilidade Halfling: move-se pelo espaço de criaturas de tamanho maior que o seu."
        ]
    },
    draconato: {
        deslocamento: 9,
        idiomas: ["Comum", "Dracônico"],
        tracos: [
            "Ancestralidade Dracônica: escolha um tipo de dragão, que define seu sopro e sua resistência.",
            "Arma de Sopro: ataque em área com o tipo de dano do seu ancestral.",
            "Resistência a Dano: resistência ao tipo de dano do seu ancestral."
        ]
    },
    gnomo: {
        deslocamento: 7.5,
        idiomas: ["Comum", "Gnômico"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Astúcia Gnômica: vantagem em salvaguardas de Inteligência, Sabedoria e Carisma contra magia."
        ]
    },
    "meio-elfo": {
        deslocamento: 9,
        idiomas: ["Comum", "Élfico", "Um idioma à sua escolha"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Ancestral Feérico: vantagem contra ser enfeitiçado e imunidade a sono mágico.",
            "Versatilidade em Perícias: proficiência em duas perícias à sua escolha."
        ]
    },
    "meio-orc": {
        deslocamento: 9,
        idiomas: ["Comum", "Orc"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Ameaçador: proficiência em Intimidação.",
            "Aguentar Firme: ao cair a 0 pontos de vida, fica com 1 em vez disso (uma vez por descanso longo).",
            "Ataques Selvagens: rola um dado de dano extra em acertos críticos com arma corpo a corpo."
        ]
    },
    tiefling: {
        deslocamento: 9,
        idiomas: ["Comum", "Infernal"],
        tracos: [
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Resistência Infernal: resistência a dano de fogo.",
            "Legado Infernal: conhece o truque Taumaturgia e ganha magias conforme sobe de nível."
        ]
    }
}

// O que a sub-raca acrescenta. Deslocamento aqui substitui o da raca.
const dadosPorSubRaca = {
    anaoColina: {
        tracos: ["Tenacidade Anã: +1 ponto de vida por nível."]
    },
    anaoMontanha: {
        tracos: ["Treinamento com Armaduras Anãs: proficiência com armaduras leves e médias."]
    },
    elfoAlto: {
        idiomas: ["Um idioma à sua escolha"],
        tracos: ["Truque Adicional: conhece um truque da lista do Mago, usando Inteligência."]
    },
    elfoFloresta: {
        deslocamento: 10.5,
        tracos: ["Máscara da Natureza: pode se esconder mesmo levemente encoberto por folhagem ou chuva."]
    },
    elfoNegro: {
        tracos: [
            "Visão no Escuro Superior: enxerga a até 36 metros na penumbra.",
            "Sensibilidade à Luz Solar: desvantagem sob luz solar direta.",
            "Magia Drow: conhece o truque Luzes Dançantes e ganha magias conforme sobe de nível."
        ]
    },
    halflingPesLeves: {
        tracos: ["Furtividade Natural: pode se esconder atrás de criaturas de tamanho maior que o seu."]
    },
    halflingRobusto: {
        tracos: ["Resiliência Robusta: vantagem em salvaguardas contra veneno e resistência a dano de veneno."]
    },
    gnomoFloresta: {
        tracos: [
            "Ilusionista Nato: conhece o truque Ilusão Menor, usando Inteligência.",
            "Falar com Pequenos Animais: comunica ideias simples a animais Pequenos ou menores."
        ]
    },
    gnomoRocha: {
        tracos: [
            "Conhecimento de Artífice: bônus dobrado em testes de História sobre itens mágicos e tecnológicos.",
            "Brinquedista: proficiência com ferramentas de funileiro."
        ]
    }
}

// junta o que vem da raca com o que a sub-raca acrescenta
function dadosDaRaca(raca, subraca) {
    const base = dadosPorRaca[raca]

    if (!base) {
        return null
    }

    const extra = dadosPorSubRaca[subraca] || {}

    return {
        // a sub-raca so muda o deslocamento quando ela traz um proprio
        deslocamento: extra.deslocamento || base.deslocamento,
        tracos: base.tracos.concat(extra.tracos || []),
        idiomas: base.idiomas.concat(extra.idiomas || [])
    }
}

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

/* ---------- RF16 a RF20: pericias ---------- */

// cada pericia usa o modificador de um atributo fixo
const PERICIAS = [
    { valor: "acrobacia", nome: "Acrobacia", atributo: "destreza" },
    { valor: "adestrarAnimais", nome: "Adestrar Animais", atributo: "sabedoria" },
    { valor: "arcanismo", nome: "Arcanismo", atributo: "inteligencia" },
    { valor: "atletismo", nome: "Atletismo", atributo: "forca" },
    { valor: "atuacao", nome: "Atuação", atributo: "carisma" },
    { valor: "enganacao", nome: "Enganação", atributo: "carisma" },
    { valor: "furtividade", nome: "Furtividade", atributo: "destreza" },
    { valor: "historia", nome: "História", atributo: "inteligencia" },
    { valor: "intimidacao", nome: "Intimidação", atributo: "carisma" },
    { valor: "intuicao", nome: "Intuição", atributo: "sabedoria" },
    { valor: "investigacao", nome: "Investigação", atributo: "inteligencia" },
    { valor: "medicina", nome: "Medicina", atributo: "sabedoria" },
    { valor: "natureza", nome: "Natureza", atributo: "inteligencia" },
    { valor: "percepcao", nome: "Percepção", atributo: "sabedoria" },
    { valor: "persuasao", nome: "Persuasão", atributo: "carisma" },
    { valor: "prestidigitacao", nome: "Prestidigitação", atributo: "destreza" },
    { valor: "religiao", nome: "Religião", atributo: "inteligencia" },
    { valor: "sobrevivencia", nome: "Sobrevivência", atributo: "sabedoria" }
]

// quantas pericias cada classe escolhe, e de qual lista.
// opcoes "todas" = o Bardo escolhe de qualquer pericia.
const periciasPorClasse = {
    barbaro: {
        limite: 2,
        opcoes: ["adestrarAnimais", "atletismo", "intimidacao", "natureza", "percepcao", "sobrevivencia"]
    },
    bardo: {
        limite: 3,
        opcoes: "todas"
    },
    bruxo: {
        limite: 2,
        opcoes: ["arcanismo", "enganacao", "historia", "intimidacao", "investigacao", "natureza", "religiao"]
    },
    clerigo: {
        limite: 2,
        opcoes: ["historia", "intuicao", "medicina", "persuasao", "religiao"]
    },
    druida: {
        limite: 2,
        opcoes: ["arcanismo", "adestrarAnimais", "intuicao", "medicina", "natureza", "percepcao", "religiao", "sobrevivencia"]
    },
    feiticeiro: {
        limite: 2,
        opcoes: ["arcanismo", "enganacao", "intuicao", "intimidacao", "persuasao", "religiao"]
    },
    guerreiro: {
        limite: 2,
        opcoes: ["acrobacia", "adestrarAnimais", "atletismo", "historia", "intuicao", "intimidacao", "percepcao", "sobrevivencia"]
    },
    ladino: {
        limite: 4,
        opcoes: ["acrobacia", "atletismo", "atuacao", "enganacao", "furtividade", "intimidacao", "intuicao", "investigacao", "percepcao", "persuasao", "prestidigitacao"]
    },
    mago: {
        limite: 2,
        opcoes: ["arcanismo", "historia", "intuicao", "investigacao", "medicina", "religiao"]
    },
    monge: {
        limite: 2,
        opcoes: ["acrobacia", "atletismo", "furtividade", "historia", "intuicao", "religiao"]
    },
    paladino: {
        limite: 2,
        opcoes: ["atletismo", "intimidacao", "intuicao", "medicina", "persuasao", "religiao"]
    },
    patrulheiro: {
        limite: 3,
        opcoes: ["adestrarAnimais", "atletismo", "furtividade", "intuicao", "investigacao", "natureza", "percepcao", "sobrevivencia"]
    }
}

// abreviacao mostrada ao lado da pericia, como na folha oficial
const ABREVIACAO_ATRIBUTO = {
    forca: "For",
    destreza: "Des",
    constituicao: "Con",
    inteligencia: "Int",
    sabedoria: "Sab",
    carisma: "Car"
}

// array padrao do PHB: seis valores fixos, cada um usado uma vez so
const ARRAY_PADRAO = [15, 14, 13, 12, 10, 8]

const NOME_ATRIBUTO = {
    forca: "Força",
    destreza: "Destreza",
    constituicao: "Constituição",
    inteligencia: "Inteligência",
    sabedoria: "Sabedoria",
    carisma: "Carisma"
}

/* ---------- RF21, RF22: pontos de vida ---------- */

// dado de vida de cada classe
const dadoDeVidaPorClasse = {
    barbaro: 12,
    bardo: 8,
    bruxo: 8,
    clerigo: 8,
    druida: 8,
    feiticeiro: 6,
    guerreiro: 10,
    ladino: 8,
    mago: 6,
    monge: 8,
    paladino: 10,
    patrulheiro: 10
}

// media do dado arredondada para cima: d6 = 4, d8 = 5, d10 = 6, d12 = 7
function mediaDoDado(dado) {
    return Math.floor(dado / 2) + 1
}

// Nivel 1 leva o dado cheio; os seguintes levam a media.
// O modificador de Constituicao entra em todos os niveis.
function pontosDeVida(classe, nivel, modificadorConstituicao) {
    const dado = dadoDeVidaPorClasse[classe]

    if (!dado || nivel < 1) {
        return null
    }

    const primeiroNivel = dado + modificadorConstituicao
    const demaisNiveis = (nivel - 1) * (mediaDoDado(dado) + modificadorConstituicao)

    // um personagem nunca fica abaixo de 1 PV por causa de Constituicao baixa
    return Math.max(1, primeiroNivel + demaisNiveis)
}

/* ---------- RF23: descanso ---------- */

function rolarDado(lados) {
    return Math.floor(Math.random() * lados) + 1
}

// no descanso longo volta metade dos dados de vida totais, no minimo 1
function dadosRecuperadosEmDescansoLongo(nivel) {
    return Math.max(1, Math.floor(nivel / 2))
}

// Bruxo e a excecao: recupera espacos de magia em descanso curto (RF27).
// Ainda nao ha magias no app, mas o modo de descanso ja avisa o jogador.
function recuperaMagiaEmDescansoCurto(classe) {
    return classe === "bruxo"
}

/* ---------- RF24: testes de morte ---------- */

const TESTES_DE_MORTE = 3

// 10 ou mais e sucesso; 20 natural volta com 1 PV; 1 natural conta duas falhas
function resultadoTesteDeMorte(rolagem) {
    if (rolagem === 20) {
        return { tipo: "revive", sucessos: 0, falhas: 0 }
    }

    if (rolagem === 1) {
        return { tipo: "falha", sucessos: 0, falhas: 2 }
    }

    if (rolagem >= 10) {
        return { tipo: "sucesso", sucessos: 1, falhas: 0 }
    }

    return { tipo: "falha", sucessos: 0, falhas: 1 }
}

/* ---------- RF19: salvaguardas ---------- */

// Salvaguarda nao se escolhe: cada classe da proficiencia em duas, fixas desde
// o nivel 1. Sempre uma "forte" (For/Des/Con) e uma "fraca" (Int/Sab/Car).
const salvaguardasPorClasse = {
    barbaro: ["forca", "constituicao"],
    bardo: ["destreza", "carisma"],
    bruxo: ["sabedoria", "carisma"],
    clerigo: ["sabedoria", "carisma"],
    druida: ["inteligencia", "sabedoria"],
    feiticeiro: ["constituicao", "carisma"],
    guerreiro: ["forca", "constituicao"],
    ladino: ["destreza", "inteligencia"],
    mago: ["inteligencia", "sabedoria"],
    monge: ["forca", "destreza"],
    paladino: ["sabedoria", "carisma"],
    patrulheiro: ["forca", "destreza"]
}

function salvaguardasDaClasse(classe) {
    return salvaguardasPorClasse[classe] || []
}

function periciaPorValor(valor) {
    return PERICIAS.find(function(pericia) {
        return pericia.valor === valor
    })
}

// quantas pericias a classe deixa escolher (0 se nenhuma classe escolhida)
function limiteDePericias(classe) {
    const regra = periciasPorClasse[classe]

    if (!regra) {
        return 0
    }

    return regra.limite
}

// lista de valores que a classe permite escolher
function opcoesDePericias(classe) {
    const regra = periciasPorClasse[classe]

    if (!regra) {
        return []
    }

    if (regra.opcoes === "todas") {
        return PERICIAS.map(function(pericia) {
            return pericia.valor
        })
    }

    return regra.opcoes
}

/* ---------- RF07 e RF08: modificadores e proficiencia ---------- */

// regra do PHB: +2 do nivel 1 ao 4, subindo um degrau a cada 4 niveis
function bonusDeProficiencia(nivel) {
    return 2 + Math.floor((nivel - 1) / 4)
}

// serve para pericia e para salvaguarda: a conta e a mesma nas duas
function bonusComProficiencia(modificador, proficiente, proficiencia) {
    if (proficiente) {
        return modificador + proficiencia
    }

    return modificador
}


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
