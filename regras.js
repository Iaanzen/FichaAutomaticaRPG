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
    ],
    // regra 2024: o legado ínfero do Tiefling funciona como sub-raça
    tiefling: [
        { valor: "tieflingAbissal", nome: "Legado Abissal" },
        { valor: "tieflingCtonico", nome: "Legado Ctônico" },
        { valor: "tieflingInfernal", nome: "Legado Infernal" }
    ],
    // regra 2024: a ancestralidade gigante do Golias funciona como sub-raça
    golias: [
        { valor: "goliasNuvens", nome: "Gigante das Nuvens" },
        { valor: "goliasFogo", nome: "Gigante do Fogo" },
        { valor: "goliasGelo", nome: "Gigante do Gelo" },
        { valor: "goliasColina", nome: "Gigante da Colina" },
        { valor: "goliasPedra", nome: "Gigante da Pedra" },
        { valor: "goliasTempestade", nome: "Gigante da Tempestade" }
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
            // a resistência e as magias vêm do legado (sub-raça); o de 2014 equivale ao Infernal
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Presença Sobrenatural: conhece o truque Taumaturgia.",
            "Legado Ínfero: resistência a um tipo de dano e magias que crescem com o nível (definidos pela sub-raça). As magias de legado são conjuradas uma vez por descanso longo sem gastar espaço, usando Inteligência, Sabedoria ou Carisma."
        ]
    },

    // Raças que entraram no livro de 2024. As de 2014 acima continuam valendo.
    // Em 2024 os idiomas vêm da origem: Comum mais dois à escolha.
    aasimar: {
        deslocamento: 9,
        idiomas: ["Comum", "Dois idiomas à sua escolha"],
        tracos: [
            "Resistência Celestial: resistência a dano necrótico e radiante.",
            "Visão no Escuro: enxerga a até 18 metros na penumbra como se fosse luz plena.",
            "Mãos Curativas: com uma ação de Magia, toca uma criatura que recupera um número de d4 igual ao seu bônus de proficiência (uma vez por descanso longo).",
            "Portador da Luz: conhece o truque Luz, usando Carisma.",
            "Revelação Celestial (nível 3): com uma ação bônus, assume por 1 minuto Asas Celestiais, Radiância Interior ou Mortalha Necrótica, e causa dano extra igual ao bônus de proficiência (uma vez por descanso longo)."
        ]
    },
    golias: {
        deslocamento: 10.5,
        idiomas: ["Comum", "Dois idiomas à sua escolha"],
        tracos: [
            "Ancestralidade Gigante: um poder herdado dos gigantes (definido pela sub-raça), usado um número de vezes igual ao bônus de proficiência por descanso longo.",
            "Forma Grande (nível 5): com uma ação bônus, fica Grande por 10 minutos, com vantagem em testes de Força e +3 metros de deslocamento (uma vez por descanso longo).",
            "Constituição Poderosa: vantagem em testes para escapar de agarrão e conta como um tamanho maior para carregar peso."
        ]
    },
    orc: {
        deslocamento: 9,
        idiomas: ["Comum", "Dois idiomas à sua escolha"],
        tracos: [
            "Surto de Adrenalina: usa Disparada como ação bônus e ganha PV temporários iguais ao bônus de proficiência (usos iguais ao bônus de proficiência, recuperados em descanso curto ou longo).",
            "Visão no Escuro: enxerga a até 36 metros na penumbra como se fosse luz plena.",
            "Resistência Implacável: ao cair a 0 pontos de vida sem morrer, fica com 1 em vez disso (uma vez por descanso longo)."
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
    },
    tieflingAbissal: {
        tracos: [
            "Legado Abissal: resistência a dano de veneno e conhece o truque Rajada de Veneno.",
            "Nível 3: Raio Adoecente. Nível 5: Imobilizar Pessoa."
        ]
    },
    tieflingCtonico: {
        tracos: [
            "Legado Ctônico: resistência a dano necrótico e conhece o truque Toque Arrepiante.",
            "Nível 3: Vida Falsa. Nível 5: Raio do Enfraquecimento."
        ]
    },
    tieflingInfernal: {
        tracos: [
            "Legado Infernal: resistência a dano de fogo e conhece o truque Raio de Fogo.",
            "Nível 3: Repreensão Infernal. Nível 5: Escuridão."
        ]
    },
    goliasNuvens: {
        tracos: ["Salto das Nuvens: com uma ação bônus, teleporta-se até 9 metros para um espaço que consiga ver."]
    },
    goliasFogo: {
        tracos: ["Queimadura do Fogo: ao acertar um ataque, causa 1d10 de dano de fogo extra."]
    },
    goliasGelo: {
        tracos: ["Frio do Gelo: ao acertar um ataque, causa 1d6 de dano de frio extra e reduz o deslocamento do alvo em 3 metros até o início do seu próximo turno."]
    },
    goliasColina: {
        tracos: ["Tombo da Colina: ao acertar uma criatura Grande ou menor, pode derrubá-la."]
    },
    goliasPedra: {
        tracos: ["Resistência da Pedra: com uma reação ao sofrer dano, rola 1d12 + modificador de Constituição e reduz o dano nesse valor."]
    },
    goliasTempestade: {
        tracos: ["Trovão da Tempestade: com uma reação ao sofrer dano de uma criatura a até 18 metros, causa 1d8 de dano trovejante nela."]
    }
}

// junta o que vem da raca com o que a sub-raca acrescenta
/* ---------- IDEIA04: raça própria (homebrew) ---------- */

// Valor reservado no select de raça. Fica separado das raças oficiais de
// propósito: quem abre a ficha precisa saber que aquilo foi inventado na mesa.
const RACA_PROPRIA = "propria"

// Nas regras 2024 a raça não dá bônus de atributo, então a raça inventada não
// interfere na distribuição do antecedente. Ela só traz deslocamento, traços
// e idiomas — e os traços são texto livre, porque o app não tem como saber
// que mecânica a mesa inventou.
const DESLOCAMENTO_PADRAO = 9

// texto com um item por linha vira lista, sem linhas vazias
function listaDeLinhas(texto) {
    return (texto || "")
        .split("\n")
        .map(function(linha) {
            return linha.trim()
        })
        .filter(function(linha) {
            return linha !== ""
        })
}

// "Comum, Élfico" vira lista
function listaDeItens(texto) {
    return (texto || "")
        .split(",")
        .map(function(item) {
            return item.trim()
        })
        .filter(function(item) {
            return item !== ""
        })
}

function dadosDaRacaPropria(definicao) {
    if (!definicao) {
        return null
    }

    return {
        deslocamento: Number(definicao.deslocamento) || DESLOCAMENTO_PADRAO,
        tracos: definicao.tracos || [],
        idiomas: definicao.idiomas || []
    }
}

// nome que aparece na ficha: o inventado, ou o da raça oficial
function nomeDaRaca(raca, definicao) {
    if (raca === RACA_PROPRIA) {
        return (definicao && definicao.nome) || "Raça própria"
    }

    return raca
}

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
//
// Mistura consciente de 2014 e 2024: as subclasses que saíram continuam aqui,
// as renomeadas usam o nome de 2024 e as novas foram acrescentadas.
// Renomear mexe só no "nome": o "valor" fica igual para as fichas salvas não quebrarem.
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const subclassesPorClasse = {}

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
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const periciasPorClasse = {}

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
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const dadoDeVidaPorClasse = {}

// media do dado arredondada para cima: d6 = 4, d8 = 5, d10 = 6, d12 = 7
function mediaDoDado(dado) {
    return Math.floor(dado / 2) + 1
}

// talento Robusto: +2 PV por nivel, contando os niveis ja passados.
// A Dadiva da Fortitude (PV_DADIVA_FORTITUDE) soma +40 fixos.
const PV_POR_NIVEL_ROBUSTO = 2

// Nivel 1 leva o dado cheio; os seguintes levam a media.
// O modificador de Constituicao entra em todos os niveis.
function pontosDeVida(classe, nivel, modificadorConstituicao, talentos) {
    const dado = dadoDeVidaPorClasse[classe]

    if (!dado || nivel < 1) {
        return null
    }

    const primeiroNivel = dado + modificadorConstituicao
    const demaisNiveis = (nivel - 1) * (mediaDoDado(dado) + modificadorConstituicao)

    const lista = talentos || []

    const robusto = lista.includes("robusto") ? PV_POR_NIVEL_ROBUSTO * nivel : 0
    const fortitude = lista.includes("dadivaFortitude") ? PV_DADIVA_FORTITUDE : 0

    // um personagem nunca fica abaixo de 1 PV por causa de Constituicao baixa
    return Math.max(1, primeiroNivel + demaisNiveis) + robusto + fortitude
}

/* ---------- RF23: descanso ---------- */

function rolarDado(lados) {
    return Math.floor(Math.random() * lados) + 1
}

// Bruxo e a excecao: recupera espacos de magia em descanso curto (RF27).
// No descanso longo todas as classes conjuradoras recuperam.
function recuperaMagiaEmDescansoCurto(classe) {
    return classe === "bruxo"
}

/* ---------- RF09: level up ---------- */

const NIVEL_MAXIMO = 20

// niveis que dao Melhoria de Atributo ou Talento.
// Guerreiro e Ladino ganham escolhas extras.
const NIVEIS_DE_ESCOLHA_PADRAO = [4, 8, 12, 16, 19]

// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const niveisDeEscolhaPorClasse = {}

function niveisDeEscolha(classe) {
    return niveisDeEscolhaPorClasse[classe] || NIVEIS_DE_ESCOLHA_PADRAO
}

function nivelTemEscolha(classe, nivel) {
    return niveisDeEscolha(classe).includes(nivel)
}

// teto de atributo: 20, contando o bonus do antecedente
const ATRIBUTO_MAXIMO = 20

/* ---------- Distribuição de pontos: antecedente e Melhoria de Atributo ---------- */

// Cada forma é a lista de valores que a distribuição completa pode ter.
const FORMAS_BONUS_ANTECEDENTE = [[2, 1], [1, 1, 1]]
const FORMAS_MELHORIA_ATRIBUTO = [[2], [1, 1]]

// { forca: 2, destreza: 1, ... } -> [2, 1], só os valores acima de zero
function valoresDistribuidos(distribuicao) {
    return ATRIBUTOS
        .map(function(atributo) {
            return distribuicao[atributo] || 0
        })
        .filter(function(valor) {
            return valor > 0
        })
        .sort(function(a, b) {
            return b - a
        })
}

// ainda cabe: cada valor já distribuído tem lugar em alguma forma
function cabeEmAlgumaForma(valores, formas) {
    return formas.some(function(forma) {
        const sobra = forma.slice()

        return valores.every(function(valor) {
            const posicao = sobra.indexOf(valor)

            if (posicao < 0) {
                return false
            }

            sobra.splice(posicao, 1)
            return true
        })
    })
}

// completa: os valores são exatamente os de uma forma
function distribuicaoCompleta(distribuicao, formas) {
    const valores = valoresDistribuidos(distribuicao)

    return formas.some(function(forma) {
        return forma.length === valores.length && cabeEmAlgumaForma(valores, [forma])
    })
}

// IDEIA06: quais valores (0, +1, +2) o atributo ainda pode receber sem
// quebrar a forma da distribuição nem passar do espaço até o teto.
// Usar o +2 num atributo tira o +2 dos outros.
function valoresPermitidos(distribuicao, atributo, formas, espaco) {
    return [0, 1, 2].filter(function(valor) {
        if (valor === 0) {
            return true
        }

        if (valor > espaco) {
            return false
        }

        const simulada = Object.assign({}, distribuicao)
        simulada[atributo] = valor

        return cabeEmAlgumaForma(valoresDistribuidos(simulada), formas)
    })
}

// Melhoria de Atributo: +2 num atributo OU +1 em dois diferentes
function melhoriaAtributoValida(melhoria) {
    return distribuicaoCompleta(melhoria, FORMAS_MELHORIA_ATRIBUTO)
}

// teto do total (base + bônus): 20, ou 30 no atributo que ganhou a Dádiva Épica
// tetosDaClasse (opcional): o que a classe já liberou acima de 20, ex: { forca: 25 }
function tetoDoAtributo(atributo, atributosAte30, tetosDaClasse) {
    const daDadiva = (atributosAte30 || []).includes(atributo)
        ? ATRIBUTO_MAXIMO_DADIVA
        : ATRIBUTO_MAXIMO

    return Math.max(daDadiva, (tetosDaClasse || {})[atributo] || 0)
}

/* ---------- Sprint 6.5: aumento de atributo da classe, com teto próprio ---------- */

// Campo aumentoDeAtributoPorNivel do bloco da classe:
//   { 20: { nome, atributos: [...], valor, teto } }
// Ex: Bárbaro no 20 (Primal Champion): Força e Constituição +4, até 25.
function aumentoDeAtributoDoNivel(classe, nivel) {
    const bloco = CLASSES[classe]
    return ((bloco && bloco.aumentoDeAtributoPorNivel) || {})[nivel] || null
}

// tetos acima de 20 que a classe já liberou até este nível: { forca: 25, ... }
function tetosDaClasse(classe, nivel) {
    const bloco = CLASSES[classe]
    const porNivel = (bloco && bloco.aumentoDeAtributoPorNivel) || {}
    const tetos = {}

    Object.keys(porNivel).forEach(function(nivelDoAumento) {
        if (nivel >= Number(nivelDoAumento)) {
            const aumento = porNivel[nivelDoAumento]

            aumento.atributos.forEach(function(atributo) {
                tetos[atributo] = Math.max(tetos[atributo] || 0, aumento.teto)
            })
        }
    })

    return tetos
}

// quanto o aumento soma de fato: nunca passa do teto dele
function valorDoAumento(aumento, totalAntes) {
    return Math.max(0, Math.min(aumento.valor, aumento.teto - totalAntes))
}

// Robusto ja entra na conta de PV (pontosDeVida). Os demais sao texto por
// enquanto: dependem de blocos que ainda nao existem (iniciativa no Sprint 7,
// magias no Sprint 5, percepcao passiva no RF05).
const TALENTOS = [
    {
        valor: "alerta",
        nome: "Alerta",
        descricao: "Soma o bônus de proficiência à iniciativa e não pode ser surpreendido enquanto estiver consciente."
    },
    {
        valor: "atiradorElite",
        nome: "Atirador de Elite",
        descricao: "Ignora cobertura leve e média, e pode trocar precisão por dano extra em ataques à distância."
    },
    {
        valor: "mestreArmasGrandes",
        nome: "Mestre em Armas Grandes",
        descricao: "Ataque extra ao derrubar um inimigo, e pode trocar precisão por dano extra com armas pesadas."
    },
    {
        valor: "sentinela",
        nome: "Sentinela",
        descricao: "Ataques de oportunidade param o movimento do alvo e alcançam quem ataca seus aliados."
    },
    {
        valor: "robusto",
        nome: "Robusto",
        descricao: "Pontos de vida máximos aumentam em 2 por nível de personagem."
    },
    {
        valor: "sortudo",
        nome: "Sortudo",
        descricao: "Três pontos de sorte por descanso longo para rolar de novo um d20 seu ou de um inimigo."
    },
    {
        valor: "observador",
        nome: "Observador",
        descricao: "Lê lábios e ganha +5 em Percepção e Investigação passivas."
    },
    {
        valor: "iniciadoMagia",
        nome: "Iniciado em Magia",
        descricao: "Aprende dois truques e uma magia de 1º círculo de uma classe conjuradora."
    },
    {
        valor: "duasArmas",
        nome: "Combatente com Duas Armas",
        descricao: "+1 de CA empunhando duas armas, e pode usar armas sem a propriedade leve."
    },
    {
        valor: "curandeiro",
        nome: "Curandeiro",
        descricao: "Usa kit de medicina para estabilizar com 1 PV e recuperar vida com um gasto de uso."
    }
]

/* ---------- Nível 19: Dádiva Épica (regra 2024) ---------- */

// No 19 o personagem pode pegar uma Dádiva Épica, ou ainda um talento comum
// ou a Melhoria de Atributo. Por isso o 19 continua na lista de níveis de escolha.
const NIVEL_DADIVA_EPICA = 19

// a Dádiva dá +1 num atributo e deixa passar de 20, até 30
const ATRIBUTO_MAXIMO_DADIVA = 30

// "atributos" limita onde o +1 pode entrar; sem ele, vale qualquer um.
// Só a Fortitude tem efeito mecânico na ficha (PV); as demais são texto.
const DADIVAS_EPICAS = [
    {
        valor: "dadivaProezaCombate",
        nome: "Dádiva da Proeza em Combate",
        descricao: "Uma vez por turno, quando erra uma jogada de ataque, pode acertar em vez disso."
    },
    {
        valor: "dadivaViagemDimensional",
        nome: "Dádiva da Viagem Dimensional",
        descricao: "Logo depois de uma ação de Ataque ou de Magia, teleporta-se até 9 metros."
    },
    {
        valor: "dadivaResistenciaEnergia",
        nome: "Dádiva da Resistência a Energia",
        descricao: "Resistência a dois tipos de dano à escolha (trocáveis em descanso longo) e pode desviar esse dano para outra criatura."
    },
    {
        valor: "dadivaDestino",
        nome: "Dádiva do Destino",
        descricao: "Quando alguém a até 18 metros faz um teste de d20, soma ou subtrai 2d4 do resultado. Recarrega na iniciativa ou em descanso."
    },
    {
        valor: "dadivaFortitude",
        nome: "Dádiva da Fortitude",
        descricao: "PV máximos aumentam em 40, e ao recuperar PV recupera também o modificador de Constituição (uma vez por turno)."
    },
    {
        valor: "dadivaAtaqueIrresistivel",
        nome: "Dádiva do Ataque Irresistível",
        descricao: "Dano de concussão, perfurante e cortante ignora resistência; no 20 natural causa dano extra igual ao atributo aumentado.",
        atributos: ["forca", "destreza"]
    },
    {
        valor: "dadivaRecuperacao",
        nome: "Dádiva da Recuperação",
        descricao: "Uma vez por descanso longo, ao cair a 0 PV fica com 1 e recupera metade dos PV máximos. Tem dez d10 para se curar com ação bônus."
    },
    {
        valor: "dadivaPericia",
        nome: "Dádiva da Perícia",
        descricao: "Proficiência em todas as perícias e especialização em uma delas."
    },
    {
        valor: "dadivaVelocidade",
        nome: "Dádiva da Velocidade",
        descricao: "Deslocamento aumenta 9 metros e pode usar Desengajar como ação bônus."
    },
    {
        valor: "dadivaRecordacaoMagia",
        nome: "Dádiva da Recordação de Magia",
        descricao: "Uma vez por descanso longo, conjura uma magia de 1º a 4º círculo sem gastar espaço.",
        atributos: ["inteligencia", "sabedoria", "carisma"]
    },
    {
        valor: "dadivaEspiritoNoturno",
        nome: "Dádiva do Espírito Noturno",
        descricao: "Fica invisível na penumbra ou escuridão com uma ação bônus, e lá resiste a todo dano exceto psíquico e radiante."
    },
    {
        valor: "dadivaVisaoVerdadeira",
        nome: "Dádiva da Visão Verdadeira",
        descricao: "Visão verdadeira a até 18 metros."
    }
]

const PV_DADIVA_FORTITUDE = 40

function dadivaPorValor(valor) {
    return DADIVAS_EPICAS.find(function(dadiva) {
        return dadiva.valor === valor
    })
}

// busca nos talentos comuns e nas dádivas: os dois ficam em personagem.talentos
function talentoPorValor(valor) {
    return TALENTOS.concat(DADIVAS_EPICAS).find(function(talento) {
        return talento.valor === valor
    })
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
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const salvaguardasPorClasse = {}

// Sprint 6.5: algumas classes ganham mais salvaguardas em certos níveis
// (campo salvaguardasPorNivel do bloco: Monge no 14, Ladino no 15, Pugilista no 7).
// Sem nível, devolve só as da base.
function salvaguardasDaClasse(classe, nivel) {
    const todas = (salvaguardasPorClasse[classe] || []).slice()
    const bloco = CLASSES[classe]
    const porNivel = (bloco && bloco.salvaguardasPorNivel) || {}

    Object.keys(porNivel).forEach(function(nivelDoGanho) {
        if (nivel >= Number(nivelDoGanho)) {
            porNivel[nivelDoGanho].forEach(function(atributo) {
                if (!todas.includes(atributo)) {
                    todas.push(atributo)
                }
            })
        }
    })

    return todas
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

/* ---------- Sprint 5a: conjuração ---------- */

// Regra 2024. O tipo decide a tabela de espacos de magia (passo 2 do 5a):
// completo = tabela cheia; meio = Paladino e Patrulheiro, ja com espacos no nivel 1;
// pacto = Magia de Pacto do Bruxo, que recupera em descanso curto.
// Classe fora desta tabela nao conjura.
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const conjuracaoPorClasse = {}

const NOME_TIPO_CONJURADOR = {
    completo: "Conjurador completo",
    meio: "Meio conjurador",
    pacto: "Magia de Pacto"
}

// classe que nao conjura (ou ainda nao escolhida) devolve null
function conjuracaoDaClasse(classe) {
    return conjuracaoPorClasse[classe] || null
}

// como cada classe conjuradora se chama na API de magias (dnd5eapi.co)
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const CLASSE_NA_API = {}

function classeNaApi(classe) {
    return CLASSE_NA_API[classe] || null
}

// CD que o alvo precisa superar: 8 + proficiencia + modificador do atributo
function cdDeMagia(proficiencia, modificador) {
    return 8 + proficiencia + modificador
}

// bonus somado ao d20 nos ataques com magia
function ataqueMagico(proficiencia, modificador) {
    return proficiencia + modificador
}

/* ---------- Sprint 5a: espaços de magia (RF25) ---------- */

// Regra 2024. Cada linha e um nivel de personagem (primeira linha = nivel 1)
// e traz quantos espacos ha em cada circulo, do 1º em diante.
const ESPACOS_CONJURADOR_COMPLETO = [
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1]
]

// Paladino e Patrulheiro: em 2024 ja comecam com 2 espacos no nivel 1
const ESPACOS_MEIO_CONJURADOR = [
    [2],
    [2],
    [3],
    [3],
    [4, 2],
    [4, 2],
    [4, 3],
    [4, 3],
    [4, 3, 2],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2]
]

// Magia de Pacto do Bruxo: todos os espacos sao do mesmo circulo.
// As Arcanas Misticas (6º ao 9º circulo) nao sao espacos e ficam para depois.
const PACTO_POR_NIVEL = [
    { espacos: 1, circulo: 1 },
    { espacos: 2, circulo: 1 },
    { espacos: 2, circulo: 2 },
    { espacos: 2, circulo: 2 },
    { espacos: 2, circulo: 3 },
    { espacos: 2, circulo: 3 },
    { espacos: 2, circulo: 4 },
    { espacos: 2, circulo: 4 },
    { espacos: 2, circulo: 5 },
    { espacos: 2, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 3, circulo: 5 },
    { espacos: 4, circulo: 5 },
    { espacos: 4, circulo: 5 },
    { espacos: 4, circulo: 5 },
    { espacos: 4, circulo: 5 }
]

// devolve [{ circulo: 1, total: 4 }, ...] so com os circulos que tem espaco;
// classe que nao conjura devolve lista vazia
function espacosDeMagia(classe, nivel, subclasse) {
    const conjuracao = conjuracaoEfetiva(classe, subclasse)

    if (conjuracao === null || nivel < 1 || nivel > NIVEL_MAXIMO) {
        return []
    }

    // subclasse conjuradora traz a própria tabela, por nível da classe
    if (conjuracao.espacosPorNivel) {
        return (conjuracao.espacosPorNivel[nivel - 1] || []).map(function(total, indice) {
            return { circulo: indice + 1, total: total }
        })
    }

    if (conjuracao.tipo === "pacto") {
        const pacto = PACTO_POR_NIVEL[nivel - 1]
        return [{ circulo: pacto.circulo, total: pacto.espacos }]
    }

    const tabela = conjuracao.tipo === "meio"
        ? ESPACOS_MEIO_CONJURADOR
        : ESPACOS_CONJURADOR_COMPLETO

    return tabela[nivel - 1].map(function(total, indice) {
        return { circulo: indice + 1, total: total }
    })
}

/* ---------- Subclasse que conjura (Cavaleiro Arcano, Trapaceiro Arcano) ---------- */

// Algumas subclasses dão conjuração a uma classe que não conjura. Quem fornece
// as TABELAS é o bloco da subclasse, não este arquivo: essas subclasses estão
// fora do SRD e o repositório é público. Aqui fica só o motor.
//
// Formato esperado no bloco da subclasse:
//   conjuracao: {
//     atributo: "inteligencia",
//     nomeNaApi: "wizard",            // de qual lista as magias vêm
//     espacosPorNivel: [[], [], [2], ...],   // por nível DA CLASSE, 20 linhas
//     truquesPorNivel: [...],         // opcional
//     preparadasPorNivel: [...],      // opcional
//     divisorDeConjurador: 3          // multiclasse: nível / 3, para baixo
//   }
function subclassePorValor(classe, subclasse) {
    return (subclassesPorClasse[classe] || []).find(function(item) {
        return item.valor === subclasse
    }) || null
}

function conjuracaoDaSubclasse(classe, subclasse) {
    const bloco = subclassePorValor(classe, subclasse)
    return (bloco && bloco.conjuracao) || null
}

// A conjuração que vale para o personagem: a da subclasse quando existe
// (o Guerreiro não conjura, o Cavaleiro Arcano sim), senão a da classe.
function conjuracaoEfetiva(classe, subclasse) {
    return conjuracaoDaSubclasse(classe, subclasse) || conjuracaoDaClasse(classe)
}

function conjuraPorSubclasse(classe, subclasse) {
    return conjuracaoDaSubclasse(classe, subclasse) !== null
}

// de qual lista da API as magias vêm; a subclasse pode apontar para outra classe
function listaDeMagiasNaApi(classe, subclasse) {
    const daSubclasse = conjuracaoDaSubclasse(classe, subclasse)

    if (daSubclasse && daSubclasse.nomeNaApi) {
        return daSubclasse.nomeNaApi
    }

    return classeNaApi(classe)
}

// quantos truques e magias preparadas a subclasse permite neste nível
function limitesDaSubclasse(classe, subclasse, nivel) {
    const conjuracao = conjuracaoDaSubclasse(classe, subclasse)

    if (!conjuracao) {
        return null
    }

    const truques = conjuracao.truquesPorNivel || []
    const preparadas = conjuracao.preparadasPorNivel || []

    return {
        truques: truques[nivel - 1] || 0,
        magias: preparadas[nivel - 1] || 0
    }
}

/* ---------- Sprint 5b: troca de magias (RF30) ---------- */

// Regra 2024, conferida no texto oficial de cada classe (API do D&D 5e).
// Para cada momento, quantas trocas a classe ganha: 1 ou "todas".
// preenchida por registrarClasse, no fim do arquivo (um bloco por classe)
const TROCA_DE_MAGIAS = {}

const SEM_TROCAS = { magias: 0, truques: 0 }

// momento: "descansoLongo" ou "nivel"; classe que não conjura não ganha nada
function trocasLiberadas(classe, momento) {
    const regra = TROCA_DE_MAGIAS[classe]
    const liberadas = (regra && regra[momento]) || {}

    return {
        magias: liberadas.magias || 0,
        truques: liberadas.truques || 0
    }
}

// "todas" vence 1, que vence 0
function maiorTroca(a, b) {
    if (a === "todas" || b === "todas") {
        return "todas"
    }

    return Math.max(a || 0, b || 0)
}

// Não acumula: dois descansos seguidos continuam valendo 1 troca, não 2.
function juntarTrocas(atuais, novas) {
    const base = atuais || SEM_TROCAS

    return {
        magias: maiorTroca(base.magias, novas.magias),
        truques: maiorTroca(base.truques, novas.truques)
    }
}

function descreverUmaTroca(valor, singular, plural) {
    if (valor === "todas") {
        return `todas as ${plural}`
    }

    if (valor > 0) {
        return `${valor} ${singular}`
    }

    return null
}

// "todas as magias preparadas e 1 truque"; vazio quando não há troca
function descreverTrocas(trocas) {
    return [
        descreverUmaTroca(trocas.magias, "magia", "magias preparadas"),
        descreverUmaTroca(trocas.truques, "truque", "truques")
    ]
        .filter(Boolean)
        .join(" e ")
}

// "troca todas as magias preparadas no descanso longo e 1 truque ao subir de nível"
function explicarRegraDeTroca(classe) {
    const partes = []
    const noDescanso = descreverTrocas(trocasLiberadas(classe, "descansoLongo"))
    const aoSubir = descreverTrocas(trocasLiberadas(classe, "nivel"))

    if (noDescanso) {
        partes.push(`${noDescanso} no descanso longo`)
    }

    if (aoSubir) {
        partes.push(`${aoSubir} ao subir de nível`)
    }

    return partes.length === 0 ? "" : `troca ${partes.join(" e ")}`
}

/* ---------- Sprint 6: recursos de classe (RF31) ---------- */

// Cada classe lista os recursos no bloco dela (campo "recursos"). Formato:
//   valor, nome, detalhe (opcional, texto curto)
//   quantidade: lista por nível (20 valores) | número fixo |
//               { atributo, minimo } (modificador do atributo) |
//               { multiplicadorDoNivel } (ex: Cura pelas Mãos = 5 x nível)
//   aPartirDoNivel (opcional)
//   recupera: "longo" (tudo no descanso longo),
//             "curto" (tudo no descanso curto ou longo),
//             "umNoCurto" (1 uso no curto, todos no longo)
//   recuperaCurtoAPartirDoNivel (opcional): passa a recuperar tudo no curto
// Números e regras de recuperação conferidos na API 2024 (backlog, seção 3.12).

const COMO_RECUPERA = {
    longo: "recupera no descanso longo",
    curto: "recupera no descanso curto ou longo",
    umNoCurto: "1 no descanso curto, todos no longo"
}

function totalDoRecurso(recurso, nivel, modificadores) {
    if (nivel < (recurso.aPartirDoNivel || 1)) {
        return 0
    }

    const quantidade = recurso.quantidade

    if (Array.isArray(quantidade)) {
        return quantidade[nivel - 1] || 0
    }

    if (typeof quantidade === "number") {
        return quantidade
    }

    if (quantidade.multiplicadorDoNivel) {
        return quantidade.multiplicadorDoNivel * nivel
    }

    if (quantidade.atributo) {
        return Math.max(quantidade.minimo || 0, (modificadores || {})[quantidade.atributo] || 0)
    }

    return 0
}

function comoRecupera(recurso, nivel) {
    if (recurso.recuperaCurtoAPartirDoNivel && nivel >= recurso.recuperaCurtoAPartirDoNivel) {
        return "curto"
    }

    return recurso.recupera
}

// os recursos que a classe tem neste nível, já com o total calculado
function recursosDaClasse(classe, nivel, modificadores) {
    const bloco = CLASSES[classe]

    return ((bloco && bloco.recursos) || [])
        .map(function(recurso) {
            return {
                valor: recurso.valor,
                nome: recurso.nome,
                detalhe: recurso.detalhe || "",
                total: totalDoRecurso(recurso, nivel, modificadores),
                recupera: comoRecupera(recurso, nivel)
            }
        })
        .filter(function(recurso) {
            return recurso.total > 0
        })
}

// devolve os gastos depois do descanso: { furia: 1, ... }
function recuperarRecursos(gastos, recursos, descanso) {
    const depois = {}

    recursos.forEach(function(recurso) {
        const gasto = Math.min(gastos[recurso.valor] || 0, recurso.total)

        if (descanso === "longo" || recurso.recupera === "curto") {
            depois[recurso.valor] = 0
        } else if (recurso.recupera === "umNoCurto") {
            depois[recurso.valor] = Math.max(0, gasto - 1)
        } else {
            depois[recurso.valor] = gasto
        }
    })

    return depois
}

/* ---------- Sprint 6.5: habilidades por nível (RF13) ---------- */

// Cada classe traz "habilidadesPorNivel": { 1: [...], 2: [...] }. Um item pode ser
// só o nome (texto) ou { nome, api, subclasse }:
//   api: código da habilidade na API (para buscar a descrição);
//   subclasse: true marca o nível em que entra uma habilidade da subclasse.
// Nas classes oficiais os nomes vêm da API 2024, em inglês, como as magias.
function habilidadesDaClasse(classe, nivelMaximo, nivelMinimo) {
    const bloco = CLASSES[classe]
    const porNivel = (bloco && bloco.habilidadesPorNivel) || {}
    const lista = []

    for (let nivel = nivelMinimo || 1; nivel <= nivelMaximo; nivel++) {
        ;(porNivel[nivel] || []).forEach(function(item) {
            const habilidade = typeof item === "string" ? { nome: item } : item

            lista.push({
                nivel: nivel,
                nome: habilidade.nome,
                api: habilidade.api || null,
                subclasse: habilidade.subclasse === true
            })
        })
    }

    return lista
}

// nome de exibição da subclasse escolhida (ou null se ainda não escolheu)
function nomeDaSubclasse(classe, valor) {
    const achada = (subclassesPorClasse[classe] || []).find(function(subclasse) {
        return subclasse.valor === valor
    })

    return achada ? achada.nome : null
}

// nível em que a classe escolhe a subclasse: a primeira marca de subclasse dela
function nivelDaEscolhaDeSubclasse(classe) {
    const marcas = habilidadesDaClasse(classe, NIVEL_MAXIMO).filter(function(habilidade) {
        return habilidade.subclasse
    })

    return marcas.length ? marcas[0].nivel : NIVEL_SUBCLASSE
}

// Como mostrar cada habilidade: a marcação de subclasse vira o nome dela.
// No nível da escolha é a própria subclasse; nos outros, uma habilidade dela.
function rotuloDaHabilidade(habilidade, classe, subclasse) {
    if (!habilidade.subclasse) {
        return habilidade.nome
    }

    const nome = nomeDaSubclasse(classe, subclasse)

    if (habilidade.nivel === nivelDaEscolhaDeSubclasse(classe)) {
        return nome ? `Subclasse: ${nome}` : "Subclasse (a escolher)"
    }

    return nome ? `Habilidade de ${nome}` : "Habilidade da subclasse"
}

// Habilidades de uma subclasse num nível. Só existem para as subclasses com
// dados: as 12 da API (conteúdo gratuito) e as cadastradas no conteúdo extra.
function habilidadesDaSubclasse(classe, subclasse, nivel) {
    const achada = (subclassesPorClasse[classe] || []).find(function(item) {
        return item.valor === subclasse
    })

    const lista = (achada && achada.habilidadesPorNivel && achada.habilidadesPorNivel[nivel]) || []

    return lista.map(function(item) {
        return typeof item === "string"
            ? { nome: item, api: null }
            : { nome: item.nome, api: item.api || null }
    })
}

// O que mostrar, nível a nível: [{ nivel, rotulo, api }].
// Nos níveis de subclasse entram as habilidades da subclasse escolhida, quando
// o app tem os dados dela; senão, a marca de sempre ("Habilidade de ...").
function habilidadesParaMostrar(classe, subclasse, nivelMaximo, nivelMinimo) {
    const daClasse = habilidadesDaClasse(classe, nivelMaximo, nivelMinimo)
    const nome = nomeDaSubclasse(classe, subclasse)
    const escolha = nivelDaEscolhaDeSubclasse(classe)
    const lista = []

    for (let nivel = nivelMinimo || 1; nivel <= nivelMaximo; nivel++) {
        const doNivel = daClasse.filter(function(habilidade) {
            return habilidade.nivel === nivel
        })
        const marcas = doNivel.filter(function(habilidade) {
            return habilidade.subclasse
        })
        const daSubclasse = nome ? habilidadesDaSubclasse(classe, subclasse, nivel) : []
        const ehNivelDaEscolha = nome && nivel === escolha

        if (ehNivelDaEscolha) {
            lista.push({ nivel: nivel, rotulo: `Subclasse: ${nome}`, api: null })
        }

        if (daSubclasse.length) {
            daSubclasse.forEach(function(habilidade) {
                lista.push({ nivel: nivel, rotulo: habilidade.nome, api: habilidade.api })
            })
        } else if (marcas.length && !ehNivelDaEscolha) {
            lista.push({ nivel: nivel, rotulo: rotuloDaHabilidade(marcas[0], classe, subclasse), api: null })
        }

        doNivel
            .filter(function(habilidade) {
                return !habilidade.subclasse
            })
            .forEach(function(habilidade) {
                lista.push({ nivel: nivel, rotulo: habilidade.nome, api: habilidade.api })
            })
    }

    return lista
}

/* ---------- Sprint 7: armaduras e Classe de Armadura (RF33) ---------- */

// Tabela gerada da API 2024 (nomes em inglês, como as magias).
// Correção: a API marca o Hide Armor como leve, mas no livro ele é média.
const ARMADURAS = [
    { valor: "padded-armor", nome: "Padded Armor", categoria: "leve", base: 11, usaDestreza: true, furtividadeComDesvantagem: true },
    { valor: "leather-armor", nome: "Leather Armor", categoria: "leve", base: 11, usaDestreza: true },
    { valor: "studded-leather-armor", nome: "Studded Leather Armor", categoria: "leve", base: 12, usaDestreza: true },
    { valor: "hide-armor", nome: "Hide Armor", categoria: "media", base: 12, usaDestreza: true, limiteDestreza: 2 },
    { valor: "chain-shirt", nome: "Chain Shirt", categoria: "media", base: 13, usaDestreza: true, limiteDestreza: 2 },
    { valor: "scale-mail", nome: "Scale Mail", categoria: "media", base: 14, usaDestreza: true, limiteDestreza: 2, furtividadeComDesvantagem: true },
    { valor: "breastplate", nome: "Breastplate", categoria: "media", base: 14, usaDestreza: true, limiteDestreza: 2 },
    { valor: "half-plate-armor", nome: "Half-Plate Armor", categoria: "media", base: 15, usaDestreza: true, limiteDestreza: 2, furtividadeComDesvantagem: true },
    { valor: "ring-mail", nome: "Ring Mail", categoria: "pesada", base: 14, usaDestreza: false, furtividadeComDesvantagem: true },
    { valor: "chain-mail", nome: "Chain Mail", categoria: "pesada", base: 16, usaDestreza: false, forcaMinima: 13, furtividadeComDesvantagem: true },
    { valor: "splint-armor", nome: "Splint Armor", categoria: "pesada", base: 17, usaDestreza: false, forcaMinima: 15, furtividadeComDesvantagem: true },
    { valor: "plate-armor", nome: "Plate Armor", categoria: "pesada", base: 18, usaDestreza: false, forcaMinima: 15, furtividadeComDesvantagem: true }
]

// o escudo não é "vestido": soma na CA de qualquer cálculo que o aceite
const BONUS_DO_ESCUDO = 2
const CA_SEM_ARMADURA = 10

function armaduraPorValor(valor) {
    return ARMADURAS.find(function(armadura) {
        return armadura.valor === valor
    }) || null
}

// destreza que a armadura deixa somar (a pesada não soma; a média para em +2)
function destrezaNaCA(armadura, modificadorDestreza) {
    if (!armadura) {
        return modificadorDestreza
    }

    if (!armadura.usaDestreza) {
        return 0
    }

    return armadura.limiteDestreza !== undefined
        ? Math.min(modificadorDestreza, armadura.limiteDestreza)
        : modificadorDestreza
}

// Cálculo próprio da classe (campo classeDeArmadura do bloco):
//   { nome, base, atributos: [...], armaduras: ["nenhuma", "leve"], escudo: true|false }
// Ex: Bárbaro 10 + Des + Con sem armadura; Iron Chin do Pugilista 12 + Con com
// armadura leve; Monge 10 + Des + Sab, sem armadura e sem escudo.
function calculoDeCADaClasse(classe) {
    const bloco = CLASSES[classe]
    return (bloco && bloco.classeDeArmadura) || null
}

function aceitaArmadura(calculo, armadura) {
    const permitidas = calculo.armaduras || ["nenhuma"]
    return permitidas.includes(armadura ? armadura.categoria : "nenhuma")
}

// todas as formas de calcular a CA nesta situação, da maior para a menor
function opcoesDeCA(classe, valorDaArmadura, comEscudo, modificadores) {
    const armadura = armaduraPorValor(valorDaArmadura)
    const escudo = comEscudo ? BONUS_DO_ESCUDO : 0
    const opcoes = []

    opcoes.push({
        nome: armadura ? armadura.nome : "Sem armadura",
        total: (armadura ? armadura.base : CA_SEM_ARMADURA) +
            destrezaNaCA(armadura, modificadores.destreza) + escudo
    })

    const calculo = calculoDeCADaClasse(classe)

    // a alternativa da classe só vale com a armadura certa, e às vezes sem escudo
    if (calculo && aceitaArmadura(calculo, armadura) && !(comEscudo && calculo.escudo === false)) {
        const soma = calculo.atributos.reduce(function(total, atributo) {
            return total + (modificadores[atributo] || 0)
        }, 0)

        opcoes.push({ nome: calculo.nome, total: calculo.base + soma + escudo })
    }

    return opcoes.sort(function(a, b) {
        return b.total - a.total
    })
}

// a melhor forma, mais os avisos da armadura equipada
function calcularCA(classe, valorDaArmadura, comEscudo, modificadores, forcaTotal) {
    const opcoes = opcoesDeCA(classe, valorDaArmadura, comEscudo, modificadores)
    const armadura = armaduraPorValor(valorDaArmadura)
    const avisos = []

    if (armadura && armadura.forcaMinima && forcaTotal < armadura.forcaMinima) {
        avisos.push(`Força ${armadura.forcaMinima} exigida: deslocamento -3 m.`)
    }

    if (armadura && armadura.furtividadeComDesvantagem) {
        avisos.push("Desvantagem em Furtividade.")
    }

    return { total: opcoes[0].total, formula: opcoes[0].nome, opcoes: opcoes, avisos: avisos }
}

/* ---------- Sprint 7: armas e ataques (RF34) ---------- */

// Tabela gerada da API 2024: 38 armas, com dano, propriedades e maestria.
// Propriedades usadas: ammunition, finesse, heavy, light, loading, reach,
// thrown, two-handed, versatile.
const ARMAS = [
    { valor: "battleaxe", nome: "Battleaxe", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Slashing", danoDuasMaos: "1d10", propriedades: ["versatile"], maestria: "Topple" },
    { valor: "blowgun", nome: "Blowgun", categoria: "marcial", tipo: "distancia", dano: "1", tipoDeDano: "Piercing", propriedades: ["ammunition", "loading"], alcance: { normal: 25, longo: 100 }, maestria: "Vex" },
    { valor: "club", nome: "Club", categoria: "simples", tipo: "corpo", dano: "1d4", tipoDeDano: "Bludgeoning", propriedades: ["light"], maestria: "Slow" },
    { valor: "dagger", nome: "Dagger", categoria: "simples", tipo: "corpo", dano: "1d4", tipoDeDano: "Piercing", propriedades: ["finesse", "light", "thrown"], maestria: "Nick" },
    { valor: "dart", nome: "Dart", categoria: "simples", tipo: "distancia", dano: "1d4", tipoDeDano: "Piercing", propriedades: ["finesse", "thrown"], alcance: { normal: 20, longo: 60 }, maestria: "Vex" },
    { valor: "flail", nome: "Flail", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Bludgeoning", maestria: "Sap" },
    { valor: "glaive", nome: "Glaive", categoria: "marcial", tipo: "corpo", dano: "1d10", tipoDeDano: "Slashing", propriedades: ["heavy", "reach", "two-handed"], maestria: "Graze" },
    { valor: "greataxe", nome: "Greataxe", categoria: "marcial", tipo: "corpo", dano: "1d12", tipoDeDano: "Slashing", propriedades: ["heavy", "two-handed"], maestria: "Cleave" },
    { valor: "greatclub", nome: "Greatclub", categoria: "simples", tipo: "corpo", dano: "1d8", tipoDeDano: "Bludgeoning", propriedades: ["two-handed"], maestria: "Push" },
    { valor: "greatsword", nome: "Greatsword", categoria: "marcial", tipo: "corpo", dano: "2d6", tipoDeDano: "Slashing", propriedades: ["heavy", "two-handed"], maestria: "Graze" },
    { valor: "halberd", nome: "Halberd", categoria: "marcial", tipo: "corpo", dano: "1d10", tipoDeDano: "Slashing", propriedades: ["heavy", "reach", "two-handed"], maestria: "Cleave" },
    { valor: "hand-crossbow", nome: "Hand Crossbow", categoria: "marcial", tipo: "distancia", dano: "1d6", tipoDeDano: "Piercing", propriedades: ["ammunition", "light", "loading"], alcance: { normal: 30, longo: 120 }, maestria: "Vex" },
    { valor: "handaxe", nome: "Handaxe", categoria: "simples", tipo: "corpo", dano: "1d6", tipoDeDano: "Slashing", propriedades: ["light", "thrown"], maestria: "Vex" },
    { valor: "heavy-crossbow", nome: "Heavy Crossbow", categoria: "marcial", tipo: "distancia", dano: "1d10", tipoDeDano: "Piercing", propriedades: ["ammunition", "heavy", "loading", "two-handed"], alcance: { normal: 100, longo: 400 }, maestria: "Push" },
    { valor: "javelin", nome: "Javelin", categoria: "simples", tipo: "corpo", dano: "1d6", tipoDeDano: "Piercing", propriedades: ["thrown"], maestria: "Slow" },
    { valor: "lance", nome: "Lance", categoria: "marcial", tipo: "corpo", dano: "1d10", tipoDeDano: "Piercing", propriedades: ["heavy", "reach", "two-handed"], maestria: "Topple" },
    { valor: "light-crossbow", nome: "Light Crossbow", categoria: "simples", tipo: "distancia", dano: "1d8", tipoDeDano: "Piercing", propriedades: ["ammunition", "loading", "two-handed"], alcance: { normal: 80, longo: 320 }, maestria: "Slow" },
    { valor: "light-hammer", nome: "Light Hammer", categoria: "simples", tipo: "corpo", dano: "1d4", tipoDeDano: "Bludgeoning", propriedades: ["light", "thrown"], maestria: "Nick" },
    { valor: "longbow", nome: "Longbow", categoria: "marcial", tipo: "distancia", dano: "1d8", tipoDeDano: "Piercing", propriedades: ["ammunition", "heavy", "two-handed"], alcance: { normal: 150, longo: 600 }, maestria: "Slow" },
    { valor: "longsword", nome: "Longsword", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Slashing", danoDuasMaos: "1d10", propriedades: ["versatile"], maestria: "Sap" },
    { valor: "mace", nome: "Mace", categoria: "simples", tipo: "corpo", dano: "1d6", tipoDeDano: "Bludgeoning", maestria: "Sap" },
    { valor: "maul", nome: "Maul", categoria: "marcial", tipo: "corpo", dano: "2d6", tipoDeDano: "Bludgeoning", propriedades: ["heavy", "two-handed"], maestria: "Topple" },
    { valor: "morningstar", nome: "Morningstar", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Piercing", maestria: "Sap" },
    { valor: "musket", nome: "Musket", categoria: "marcial", tipo: "distancia", dano: "1d12", tipoDeDano: "Piercing", propriedades: ["ammunition", "loading", "two-handed"], alcance: { normal: 40, longo: 120 }, maestria: "Slow" },
    { valor: "pike", nome: "Pike", categoria: "marcial", tipo: "corpo", dano: "1d10", tipoDeDano: "Piercing", propriedades: ["heavy", "reach", "two-handed"], maestria: "Push" },
    { valor: "pistol", nome: "Pistol", categoria: "marcial", tipo: "distancia", dano: "1d10", tipoDeDano: "Piercing", propriedades: ["ammunition", "loading"], alcance: { normal: 30, longo: 90 }, maestria: "Vex" },
    { valor: "quarterstaff", nome: "Quarterstaff", categoria: "simples", tipo: "corpo", dano: "1d6", tipoDeDano: "Bludgeoning", danoDuasMaos: "1d8", propriedades: ["versatile"], maestria: "Topple" },
    { valor: "rapier", nome: "Rapier", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Piercing", propriedades: ["finesse"], maestria: "Vex" },
    { valor: "scimitar", nome: "Scimitar", categoria: "marcial", tipo: "corpo", dano: "1d6", tipoDeDano: "Slashing", propriedades: ["finesse", "light"], maestria: "Nick" },
    { valor: "shortbow", nome: "Shortbow", categoria: "simples", tipo: "distancia", dano: "1d6", tipoDeDano: "Piercing", propriedades: ["ammunition", "two-handed"], alcance: { normal: 80, longo: 320 }, maestria: "Vex" },
    { valor: "shortsword", nome: "Shortsword", categoria: "marcial", tipo: "corpo", dano: "1d6", tipoDeDano: "Piercing", propriedades: ["finesse", "light"], maestria: "Vex" },
    { valor: "sickle", nome: "Sickle", categoria: "simples", tipo: "corpo", dano: "1d4", tipoDeDano: "Slashing", propriedades: ["light"], maestria: "Nick" },
    { valor: "sling", nome: "Sling", categoria: "simples", tipo: "distancia", dano: "1d4", tipoDeDano: "Piercing", propriedades: ["ammunition"], alcance: { normal: 30, longo: 120 }, maestria: "Slow" },
    { valor: "spear", nome: "Spear", categoria: "simples", tipo: "corpo", dano: "1d6", tipoDeDano: "Piercing", danoDuasMaos: "1d8", propriedades: ["thrown", "versatile"], maestria: "Sap" },
    { valor: "trident", nome: "Trident", categoria: "marcial", tipo: "corpo", dano: "1d6", tipoDeDano: "Piercing", danoDuasMaos: "1d8", propriedades: ["thrown", "versatile"], maestria: "Topple" },
    { valor: "warhammer", nome: "Warhammer", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Bludgeoning", danoDuasMaos: "1d10", propriedades: ["versatile"], maestria: "Push" },
    { valor: "war-pick", nome: "War Pick", categoria: "marcial", tipo: "corpo", dano: "1d8", tipoDeDano: "Piercing", danoDuasMaos: "1d10", propriedades: ["versatile"], maestria: "Sap" },
    { valor: "whip", nome: "Whip", categoria: "marcial", tipo: "corpo", dano: "1d4", tipoDeDano: "Slashing", propriedades: ["finesse", "reach"], maestria: "Slow" }
]

// o ataque desarmado não está na tabela de armas, mas todo mundo tem
const ARMA_DESARMADA = {
    valor: "desarmado",
    nome: "Unarmed Strike",
    categoria: "simples",
    tipo: "corpo",
    dano: "1",
    tipoDeDano: "Bludgeoning",
    propriedades: []
}

function armaPorValor(valor) {
    if (valor === ARMA_DESARMADA.valor) {
        return ARMA_DESARMADA
    }

    return ARMAS.find(function(arma) {
        return arma.valor === valor
    }) || null
}

function armasParaEscolher() {
    return [ARMA_DESARMADA].concat(ARMAS)
}

// Proficiência de arma da classe (campo proficienciasDeArma do bloco):
//   { simples, marciais, marciaisComPropriedade, especificas: [...] }
// Ex: Monge 2024 = simples + marciais com a propriedade "light".
function proficienteNaArma(classe, arma) {
    const bloco = CLASSES[classe]
    const proficiencias = (bloco && bloco.proficienciasDeArma) || {}
    const propriedades = arma.propriedades || []

    if (arma.valor === ARMA_DESARMADA.valor) {
        return true
    }

    if (proficiencias.simples && arma.categoria === "simples") {
        return true
    }

    if (proficiencias.marciais && arma.categoria === "marcial") {
        return true
    }

    if (
        proficiencias.marciaisComPropriedade &&
        arma.categoria === "marcial" &&
        propriedades.includes(proficiencias.marciaisComPropriedade)
    ) {
        return true
    }

    return (proficiencias.especificas || []).includes(arma.valor)
}

// Força no corpo a corpo e Destreza à distância; com Acuidade (finesse), o melhor
function atributoDoAtaque(arma, modificadores) {
    if (arma.tipo === "distancia") {
        return "destreza"
    }

    if ((arma.propriedades || []).includes("finesse")) {
        return modificadores.destreza > modificadores.forca ? "destreza" : "forca"
    }

    return "forca"
}

// "1d8" -> 8; o ataque desarmado ("1") vale 1
function facesDoDado(dado) {
    const partes = String(dado).split("d")
    return partes.length === 2 ? Number(partes[1]) : Number(dado)
}

// Pugilista: o Fisticuffs troca o dado de dano do ataque desarmado e das "armas
// de pugilista" (simples de corpo a corpo sem duas mãos, chicote e improvisadas).
function armaDePugilista(arma) {
    const propriedades = arma.propriedades || []

    if (arma.valor === ARMA_DESARMADA.valor) {
        return true
    }

    return (
        arma.tipo === "corpo" &&
        (arma.categoria === "simples" || arma.valor === "whip") &&
        !propriedades.includes("two-handed")
    )
}

function dadoDaClasse(classe, nivel, arma) {
    const tabela = (CLASSES[classe] || {}).dadoFisticuffsPorNivel

    if (!tabela || !armaDePugilista(arma)) {
        return null
    }

    return `1d${tabela[nivel - 1]}`
}

// RF34: bônus de ataque e dano de uma arma nas mãos deste personagem
function ataqueComArma(classe, nivel, arma, modificadores, proficiencia, duasMaos) {
    const atributo = atributoDoAtaque(arma, modificadores)
    const modificador = modificadores[atributo] || 0
    const proficiente = proficienteNaArma(classe, arma)

    const versatil = duasMaos && arma.danoDuasMaos ? arma.danoDuasMaos : arma.dano
    const alternativo = dadoDaClasse(classe, nivel, arma)

    // o dado da classe só entra quando é melhor que o da arma
    const usaAlternativo = alternativo !== null && facesDoDado(alternativo) > facesDoDado(versatil)

    return {
        atributo: atributo,
        proficiente: proficiente,
        bonusDeAtaque: modificador + (proficiente ? proficiencia : 0),
        dadoDeDano: usaAlternativo ? alternativo : versatil,
        modificadorDeDano: modificador,
        tipoDeDano: arma.tipoDeDano,
        dadoDaClasse: usaAlternativo
    }
}

/* ---------- Multiclasse ---------- */

// O personagem guarda as classes numa lista:
//   personagem.classes = [{ classe, nivel, subclasse }]
// A PRIMEIRA é a classe inicial: dela vêm as salvaguardas e as perícias, pela
// regra oficial. Ficha antiga (classe/nivel/subclasse soltos) vira lista de uma.
function classesDoPersonagem(personagem) {
    if (Array.isArray(personagem.classes) && personagem.classes.length > 0) {
        return personagem.classes
    }

    return [{
        classe: personagem.classe,
        nivel: personagem.nivel,
        subclasse: personagem.subclasse || ""
    }]
}

function nivelTotal(classes) {
    return (classes || []).reduce(function(total, entrada) {
        return total + (Number(entrada.nivel) || 0)
    }, 0)
}

function nivelDaClasse(classes, classe) {
    const entrada = (classes || []).find(function(item) {
        return item.classe === classe
    })

    return entrada ? entrada.nivel : 0
}

function classeInicial(classes) {
    return (classes || [])[0] || null
}

// "Bárbaro 3 / Ladino 2"
function descreverClasses(classes) {
    return (classes || [])
        .map(function(entrada) {
            return `${nomeDaClasse(entrada.classe)} ${entrada.nivel}`
        })
        .join(" / ")
}

// PV: o nível 1 da classe inicial leva o dado cheio; todo o resto leva a média.
// Robusto e Dádiva da Fortitude entram uma vez só, pelo nível total.
function pontosDeVidaMulticlasse(classes, modificadorConstituicao, talentos) {
    let total = 0

    classes.forEach(function(entrada, posicao) {
        const dado = dadoDeVidaPorClasse[entrada.classe]

        if (!dado || entrada.nivel < 1) {
            return
        }

        const media = mediaDoDado(dado) + modificadorConstituicao

        if (posicao === 0) {
            total += dado + modificadorConstituicao + (entrada.nivel - 1) * media
        } else {
            total += entrada.nivel * media
        }
    })

    const lista = talentos || []
    const niveis = nivelTotal(classes)
    const robusto = lista.includes("robusto") ? PV_POR_NIVEL_ROBUSTO * niveis : 0
    const fortitude = lista.includes("dadivaFortitude") ? PV_DADIVA_FORTITUDE : 0

    return Math.max(1, total) + robusto + fortitude
}

// Salvaguardas: só a classe inicial, com os ganhos por nível dela (Monge no 14...)
function salvaguardasMulticlasse(classes) {
    const inicial = classeInicial(classes)
    return inicial ? salvaguardasDaClasse(inicial.classe, inicial.nivel) : []
}

// Espaços de magia com mais de uma classe conjuradora: soma os níveis
// (conjurador completo conta tudo, meio conjurador conta a metade para baixo)
// e consulta a tabela do conjurador completo. A Magia de Pacto fica de fora.
function nivelDeConjurador(classes) {
    return (classes || []).reduce(function(total, entrada) {
        const conjuracao = conjuracaoEfetiva(entrada.classe, entrada.subclasse)

        if (!conjuracao || conjuracao.tipo === "pacto") {
            return total
        }

        // a subclasse diz por quanto o nível dela é dividido (1/3 conjurador)
        if (conjuracao.divisorDeConjurador) {
            return total + Math.floor(entrada.nivel / conjuracao.divisorDeConjurador)
        }

        return total + (conjuracao.tipo === "meio" ? Math.floor(entrada.nivel / 2) : entrada.nivel)
    }, 0)
}

// [{ circulo, total, pacto }] — os espaços de Pacto vêm marcados, porque
// recuperam em descanso curto e não se misturam com os outros
function espacosDeMagiaMulticlasse(classes) {
    const conjuradoras = (classes || []).filter(function(entrada) {
        return conjuracaoEfetiva(entrada.classe, entrada.subclasse) !== null
    })

    // uma classe só: a tabela dela, exatamente como antes
    if (conjuradoras.length === 1) {
        const unica = conjuradoras[0]
        const doPacto = conjuracaoEfetiva(unica.classe, unica.subclasse).tipo === "pacto"

        return espacosDeMagia(unica.classe, unica.nivel, unica.subclasse).map(function(espaco) {
            return { circulo: espaco.circulo, total: espaco.total, pacto: doPacto }
        })
    }

    const espacos = []
    const nivel = nivelDeConjurador(classes)

    if (nivel >= 1 && nivel <= NIVEL_MAXIMO) {
        ESPACOS_CONJURADOR_COMPLETO[nivel - 1].forEach(function(total, indice) {
            espacos.push({ circulo: indice + 1, total: total, pacto: false })
        })
    }

    // o Bruxo soma os espaços de Pacto dele por fora
    const bruxo = (classes || []).find(function(entrada) {
        const conjuracao = conjuracaoDaClasse(entrada.classe)
        return conjuracao && conjuracao.tipo === "pacto"
    })

    if (bruxo) {
        espacosDeMagia(bruxo.classe, bruxo.nivel).forEach(function(espaco) {
            espacos.push({ circulo: espaco.circulo, total: espaco.total, pacto: true })
        })
    }

    return espacos
}

// Recursos, habilidades e níveis de escolha juntam o que cada classe dá no
// nível dela. O que é por classe continua por classe.
function recursosMulticlasse(classes, modificadores) {
    const lista = []

    ;(classes || []).forEach(function(entrada) {
        recursosDaClasse(entrada.classe, entrada.nivel, modificadores).forEach(function(recurso) {
            lista.push(Object.assign({ classe: entrada.classe }, recurso))
        })
    })

    return lista
}

function habilidadesMulticlasse(classes) {
    const lista = []

    ;(classes || []).forEach(function(entrada) {
        habilidadesParaMostrar(entrada.classe, entrada.subclasse, entrada.nivel).forEach(function(habilidade) {
            lista.push(Object.assign({ classe: entrada.classe }, habilidade))
        })
    })

    return lista
}

// Pré-requisito da regra 2024: 13 no atributo principal das duas classes.
// O app avisa, mas não impede: a mesa decide.
// modo "todos": precisa de 13 nos dois atributos (Monge, Paladino, Patrulheiro)
// modo "um": basta 13 num deles (Guerreiro: Força ou Destreza)
const ATRIBUTO_PRINCIPAL = {
    barbaro: { atributos: ["forca"], modo: "todos" },
    bardo: { atributos: ["carisma"], modo: "todos" },
    bruxo: { atributos: ["carisma"], modo: "todos" },
    clerigo: { atributos: ["sabedoria"], modo: "todos" },
    druida: { atributos: ["sabedoria"], modo: "todos" },
    feiticeiro: { atributos: ["carisma"], modo: "todos" },
    guerreiro: { atributos: ["forca", "destreza"], modo: "um" },
    ladino: { atributos: ["destreza"], modo: "todos" },
    mago: { atributos: ["inteligencia"], modo: "todos" },
    monge: { atributos: ["destreza", "sabedoria"], modo: "todos" },
    paladino: { atributos: ["forca", "carisma"], modo: "todos" },
    patrulheiro: { atributos: ["destreza", "sabedoria"], modo: "todos" }
}

const MINIMO_PARA_MULTICLASSE = 13

// Atributos que ainda faltam para entrar (ou sair) de uma classe. Lista vazia
// = requisito cumprido, ou classe sem requisito (conteúdo extra).
function faltaParaMulticlasse(classe, totais) {
    const regra = ATRIBUTO_PRINCIPAL[classe]

    if (!regra) {
        return []
    }

    const faltando = regra.atributos.filter(function(atributo) {
        return (totais[atributo] || 0) < MINIMO_PARA_MULTICLASSE
    })

    // no modo "um", só falta alguma coisa se nenhum dos atributos serve
    if (regra.modo === "um") {
        return faltando.length === regra.atributos.length ? faltando : []
    }

    return faltando
}

// CA: cada classe pode ter um cálculo próprio; vale o melhor de todos
function calcularCAMulticlasse(classes, valorDaArmadura, comEscudo, modificadores, forcaTotal) {
    let melhor = null

    ;(classes || []).forEach(function(entrada) {
        const ca = calcularCA(entrada.classe, valorDaArmadura, comEscudo, modificadores, forcaTotal)

        if (melhor === null || ca.total > melhor.total) {
            melhor = ca
        }
    })

    return melhor || calcularCA("", valorDaArmadura, comEscudo, modificadores, forcaTotal)
}

// Ataque: proficiente se QUALQUER classe der proficiência na arma; o dado da
// classe (Fisticuffs) usa o nível da classe que o tem.
function ataqueComArmaMulticlasse(classes, arma, modificadores, proficiencia, duasMaos) {
    let melhor = null

    ;(classes || []).forEach(function(entrada) {
        const ataque = ataqueComArma(
            entrada.classe,
            entrada.nivel,
            arma,
            modificadores,
            proficiencia,
            duasMaos
        )

        const ganhou = melhor === null ||
            ataque.bonusDeAtaque > melhor.bonusDeAtaque ||
            (ataque.bonusDeAtaque === melhor.bonusDeAtaque &&
                facesDoDado(ataque.dadoDeDano) > facesDoDado(melhor.dadoDeDano))

        if (ganhou) {
            melhor = ataque
        }
    })

    return melhor || ataqueComArma("", 1, arma, modificadores, proficiencia, duasMaos)
}

/* ---------- Multiclasse: dados de vida por classe (passo 4) ---------- */

// Cada classe tem o dado dela, e o descanso curto gasta um de cada vez.
// [{ classe, dado, total }], na ordem em que o personagem pegou as classes.
function dadosDeVidaMulticlasse(classes) {
    return (classes || [])
        .filter(function(entrada) {
            return dadoDeVidaPorClasse[entrada.classe]
        })
        .map(function(entrada) {
            return {
                classe: entrada.classe,
                dado: dadoDeVidaPorClasse[entrada.classe],
                total: entrada.nivel
            }
        })
}

// "3d10 + 2d8"
function descreverDadosDeVida(classes) {
    const grupos = dadosDeVidaMulticlasse(classes).map(function(grupo) {
        return `${grupo.total}d${grupo.dado}`
    })

    return grupos.length ? grupos.join(" + ") : ""
}

// Ficha antiga guardava um número só; ele vira o gasto da classe inicial.
function normalizarDadosGastos(gastos, classePadrao) {
    if (typeof gastos === "number") {
        const mapa = {}
        mapa[classePadrao] = gastos
        return mapa
    }

    return Object.assign({}, gastos || {})
}

function dadosGastosDaClasse(gastos, classe, classePadrao) {
    return normalizarDadosGastos(gastos, classePadrao)[classe] || 0
}

// quantos dados de cada classe ainda dá para gastar
function dadosDeVidaDisponiveis(classes, gastos, classePadrao) {
    const mapa = normalizarDadosGastos(gastos, classePadrao)

    return dadosDeVidaMulticlasse(classes).map(function(grupo) {
        return Object.assign({}, grupo, {
            disponiveis: Math.max(0, grupo.total - (mapa[grupo.classe] || 0))
        })
    })
}

function totalDeDadosDisponiveis(classes, gastos, classePadrao) {
    return dadosDeVidaDisponiveis(classes, gastos, classePadrao).reduce(function(total, grupo) {
        return total + grupo.disponiveis
    }, 0)
}

/* ---------- Multiclasse: magias por classe (passo 3) ---------- */

// As classes que conjuram, na ordem em que o personagem as pegou.
function classesConjuradoras(classes) {
    return (classes || []).filter(function(entrada) {
        return conjuracaoEfetiva(entrada.classe, entrada.subclasse) !== null
    })
}

// Círculo mais alto que a classe pode PREPARAR. Não é o mesmo que o espaço de
// magia disponível: um Clérigo 1 / Mago 4 lança com espaços de 3º círculo, mas
// só prepara magias de 1º na lista de Clérigo. Cada classe usa a tabela dela.
function circuloMaximoDaClasse(classe, nivelDaClasse, subclasse) {
    const espacos = espacosDeMagia(classe, nivelDaClasse, subclasse)

    if (espacos.length === 0) {
        return 0
    }

    return Math.max.apply(null, espacos.map(function(espaco) {
        return espaco.circulo
    }))
}

// Ficha antiga: magia equipada sem classe pertence à classe inicial.
function normalizarMagiasEquipadas(equipadas, classePadrao) {
    return (equipadas || []).map(function(magia) {
        return magia.classe ? magia : Object.assign({}, magia, { classe: classePadrao })
    })
}

function magiasEquipadasDaClasse(equipadas, classe, classePadrao) {
    return normalizarMagiasEquipadas(equipadas, classePadrao).filter(function(magia) {
        return magia.classe === classe
    })
}

// As trocas passaram a ser por classe: { mago: { magias, truques } }. Uma ficha
// antiga guardava um objeto só ({ magias, truques }), que vira o da classe inicial.
function normalizarTrocas(trocasMagia, classePadrao) {
    if (!trocasMagia) {
        return {}
    }

    const antigo = "magias" in trocasMagia || "truques" in trocasMagia

    if (!antigo) {
        return Object.assign({}, trocasMagia)
    }

    const mapa = {}
    mapa[classePadrao] = juntarTrocas(trocasMagia, SEM_TROCAS)
    return mapa
}

function trocasDaClasse(trocasMagia, classe, classePadrao) {
    const mapa = normalizarTrocas(trocasMagia, classePadrao)
    return juntarTrocas(mapa[classe], SEM_TROCAS)
}

// Devolve o mapa inteiro com a classe atualizada, sem mexer nas outras.
function guardarTrocasDaClasse(trocasMagia, classe, novas, classePadrao) {
    const mapa = normalizarTrocas(trocasMagia, classePadrao)
    mapa[classe] = juntarTrocas(novas, SEM_TROCAS)
    return mapa
}

// Descanso longo e level up liberam troca; o descanso vale para todas as
// classes de uma vez, o level up só para a classe que subiu.
function liberarTrocasMulticlasse(trocasMagia, classes, momento) {
    let mapa = normalizarTrocas(trocasMagia, (classeInicial(classes) || {}).classe)

    classesConjuradoras(classes).forEach(function(entrada) {
        mapa = guardarTrocasDaClasse(
            mapa,
            entrada.classe,
            juntarTrocas(mapa[entrada.classe], trocasLiberadas(entrada.classe, momento))
        )
    })

    return mapa
}

/* ---------- RF14: pontos de experiência ---------- */

// Tabela oficial (igual em 2014 e 2024): o XP necessário para CHEGAR a cada
// nível. O índice é o nível, então a posição 0 não existe.
const XP_POR_NIVEL = [
    null,
    0, 300, 900, 2700, 6500,
    14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000,
    195000, 225000, 265000, 305000, 355000
]

function xpDoNivel(nivel) {
    return XP_POR_NIVEL[nivel] === undefined ? null : XP_POR_NIVEL[nivel]
}

// O maior nível que esse XP alcança. Serve de informação: quem joga por marco
// ignora, e o app nunca sobe o nível sozinho.
function nivelPorXp(xp) {
    let nivel = 1

    for (let n = 2; n <= NIVEL_MAXIMO; n++) {
        if ((xp || 0) >= XP_POR_NIVEL[n]) {
            nivel = n
        }
    }

    return nivel
}

// XP que o próximo nível pede; null no 20, onde não há próximo
function xpDoProximoNivel(nivelAtual) {
    return nivelAtual >= NIVEL_MAXIMO ? null : XP_POR_NIVEL[nivelAtual + 1]
}

// Quanto ainda falta para o próximo nível; 0 quando já dá para subir
function faltaDeXp(xp, nivelAtual) {
    const alvo = xpDoProximoNivel(nivelAtual)

    if (alvo === null) {
        return null
    }

    return Math.max(0, alvo - (xp || 0))
}

// número com separador de milhar, como a tabela do livro mostra
function formatarXp(valor) {
    return (valor || 0).toLocaleString("pt-BR")
}

/* ---------- RF05: valores passivos ---------- */

// Perícias que têm valor passivo na ficha de 2024.
// O talento Observador soma +5 em Percepção e Investigação.
const PASSIVAS = [
    { pericia: "percepcao", nome: "Percepção", talentoObservador: true },
    { pericia: "investigacao", nome: "Investigação", talentoObservador: true },
    { pericia: "intuicao", nome: "Intuição", talentoObservador: false }
]

const BONUS_DO_OBSERVADOR = 5

// 10 + o bônus da perícia (modificador, mais proficiência se houver)
function valorPassivo(passiva, bonusDaPericia, talentos) {
    const observador = passiva.talentoObservador && (talentos || []).includes("observador")
    return 10 + bonusDaPericia + (observador ? BONUS_DO_OBSERVADOR : 0)
}

/* ---------- Sprint 8: moedas e inventário (RF36, RF37) ---------- */

// da menor para a maior, com o valor de cada uma em peças de ouro
const MOEDAS = [
    { valor: "pc", nome: "PC", nomeCompleto: "Cobre", emOuro: 0.01 },
    { valor: "pp", nome: "PP", nomeCompleto: "Prata", emOuro: 0.1 },
    { valor: "pe", nome: "PE", nomeCompleto: "Electro", emOuro: 0.5 },
    { valor: "po", nome: "PO", nomeCompleto: "Ouro", emOuro: 1 },
    { valor: "pl", nome: "PL", nomeCompleto: "Platina", emOuro: 10 }
]

// quanto a bolsa vale em peças de ouro, somando todas as moedas
function totalEmOuro(moedas) {
    return MOEDAS.reduce(function(total, moeda) {
        return total + (Number((moedas || {})[moeda.valor]) || 0) * moeda.emOuro
    }, 0)
}

// capacidade de carga: 7,5 kg por ponto de Força (o equivalente métrico das 15 lb)
const CAPACIDADE_POR_FORCA = 7.5

function capacidadeDeCarga(forcaTotal) {
    return CAPACIDADE_POR_FORCA * forcaTotal
}

// peso de tudo que está no inventário: [{ nome, quantidade, peso }]
function pesoDoInventario(itens) {
    return (itens || []).reduce(function(total, item) {
        return total + (Number(item.quantidade) || 0) * (Number(item.peso) || 0)
    }, 0)
}

function estaSobrecarregado(peso, capacidade) {
    return peso > capacidade
}

/* ---------- Sprint 7: condições (RF35) ---------- */

// Lista da API 2024 (nomes em inglês, como as magias). A exaustão fica de fora
// da lista porque não liga e desliga: ela tem níveis.
const CONDICOES = [
    { valor: "blinded", nome: "Blinded" },
    { valor: "charmed", nome: "Charmed" },
    { valor: "deafened", nome: "Deafened" },
    { valor: "frightened", nome: "Frightened" },
    { valor: "grappled", nome: "Grappled" },
    { valor: "incapacitated", nome: "Incapacitated" },
    { valor: "invisible", nome: "Invisible" },
    { valor: "paralyzed", nome: "Paralyzed" },
    { valor: "petrified", nome: "Petrified" },
    { valor: "poisoned", nome: "Poisoned" },
    { valor: "prone", nome: "Prone" },
    { valor: "restrained", nome: "Restrained" },
    { valor: "stunned", nome: "Stunned" },
    { valor: "unconscious", nome: "Unconscious" }
]

const EXAUSTAO_MAXIMA = 6

// metros perdidos por nível de exaustão (regra 2024: 5 pés = 1,5 m)
const DESLOCAMENTO_POR_EXAUSTAO = 1.5

// regra 2024: cada nível tira 2 dos testes de d20 e 1,5 m de deslocamento
function efeitosDaExaustao(nivel) {
    return {
        testes: -2 * nivel,
        deslocamento: -DESLOCAMENTO_POR_EXAUSTAO * nivel,
        morre: nivel >= EXAUSTAO_MAXIMA
    }
}

/* ---------- Sprint 7: iniciativa (RF32) ---------- */

// Destreza, mais o bônus de proficiência de quem tem o talento Alerta
function calcularIniciativa(modificadorDestreza, proficiencia, talentos) {
    const alerta = (talentos || []).includes("alerta")
    return modificadorDestreza + (alerta ? proficiencia : 0)
}

/* ---------- Sprint 6.5: magias concedidas pela subclasse ---------- */

// Campo "magias" da subclasse:
//   { atributo (opcional), porNivel: { 3: [magia, ...], 5: [...] } }
// ou, quando o jogador escolhe uma variante (Círculo da Terra),
//   { escolha: { rotulo, opcoes: [{ valor, nome, porNivel }] } }
// Cada magia: { valor, nome, circulo, concentracao, ritual, escola, foraDaApi? }.
// São sempre preparadas: não contam no limite e não saem na troca.
function configuracaoDasMagiasDaSubclasse(classe, subclasse) {
    const achada = (subclassesPorClasse[classe] || []).find(function(item) {
        return item.valor === subclasse
    })

    return (achada && achada.magias) || null
}

function escolhaDeMagiasDaSubclasse(classe, subclasse) {
    const configuracao = configuracaoDasMagiasDaSubclasse(classe, subclasse)
    return (configuracao && configuracao.escolha) || null
}

// atributo próprio das magias da subclasse (Hand of Dread usa Constituição)
function atributoDasMagiasDaSubclasse(classe, subclasse) {
    const configuracao = configuracaoDasMagiasDaSubclasse(classe, subclasse)
    return (configuracao && configuracao.atributo) || null
}

// as magias liberadas até o nível, cada uma com o nível em que chegou
function magiasDaSubclasse(classe, subclasse, nivel, opcao) {
    const configuracao = configuracaoDasMagiasDaSubclasse(classe, subclasse)

    if (!configuracao) {
        return []
    }

    let porNivel = configuracao.porNivel || {}

    if (configuracao.escolha) {
        const escolhida = configuracao.escolha.opcoes.find(function(item) {
            return item.valor === opcao
        })
        porNivel = escolhida ? escolhida.porNivel : {}
    }

    const lista = []

    Object.keys(porNivel)
        .map(Number)
        .sort(function(a, b) {
            return a - b
        })
        .forEach(function(nivelDaMagia) {
            if (nivelDaMagia <= nivel) {
                porNivel[nivelDaMagia].forEach(function(magia) {
                    lista.push(Object.assign({ nivel: nivelDaMagia }, magia))
                })
            }
        })

    return lista
}

/* ---------- Magias locais (classe fora da API de magias) ---------- */

// Classe que não existe na API (ex: Artífice, no conteudo-extra.js) traz no
// bloco "magiasLocais": truques por nível e a regra de magias preparadas.
function magiasLocaisDaClasse(classe) {
    return CLASSES[classe] ? CLASSES[classe].magiasLocais || null : null
}

// mesmo formato que a aba de magias usa para os limites vindos da API
function limitesDeMagiasLocais(locais, nivel, modificador) {
    const regra = locais.preparadas
    const metade = regra.metadeDoNivel ? Math.floor(nivel / 2) : 0

    return {
        truques: locais.truquesPorNivel[nivel - 1] || 0,
        magias: Math.max(regra.minimo || 0, modificador + metade)
    }
}

// usado na ficha e na aba de magias: círculo 0 é truque
function nomeDoCirculo(circulo) {
    return circulo === 0 ? "Truque" : `${circulo}º círculo`
}

// texto curto para o level up: "1º: 4 · 2º: 3 · 3º: 2"
function descreverEspacos(espacos) {
    return espacos
        .map(function(espaco) {
            return `${espaco.circulo}º: ${espaco.total}`
        })
        .join(" · ")
}

/* ---------- Dano e CD das magias equipadas ---------- */

// A API de 2024 traz só o dano base; a de 2014 traz as tabelas completas
// (escalonamento por círculo e, nos truques, por nível do personagem). Por
// isso os dados de combate das magias vêm da de 2014.
//
// O que a ficha guarda por magia, para funcionar sem internet:
//   combate: {
//     ataque: "ranged" | "melee" | null,
//     cd: { atributo: "DES", sucesso: "half" } | null,
//     dano: { tipo: "Fire", porCirculo: {...}, porNivel: {...} } | null,
//     cura: { porCirculo: {...} } | null
//   }

// abreviação do atributo como a API escreve, para o nome em português
const ATRIBUTO_DA_API = {
    STR: "forca",
    DEX: "destreza",
    CON: "constituicao",
    INT: "inteligencia",
    WIS: "sabedoria",
    CHA: "carisma"
}

function atributoDaApi(sigla) {
    return ATRIBUTO_DA_API[String(sigla || "").toUpperCase()] || null
}

// Numa tabela { "3": "8d6", "4": "9d6" }, o valor da faixa em que o número
// cai: a maior chave que não passa dele. É assim que truque escala por nível
// do personagem e magia escala por círculo do espaço usado.
function valorDaFaixa(tabela, numero) {
    if (!tabela) {
        return null
    }

    let escolhido = null
    let melhorChave = null

    Object.keys(tabela).forEach(function(chave) {
        const limite = Number(chave)

        if (limite <= numero && (melhorChave === null || limite > melhorChave)) {
            melhorChave = limite
            escolhido = tabela[chave]
        }
    })

    return escolhido
}

// "8d6" no círculo em que a magia for lançada; truque usa o nível do personagem
function danoDaMagia(combate, circulo, nivelDoPersonagem) {
    if (!combate || !combate.dano) {
        return null
    }

    const dano = combate.dano

    // truque: escala com o nível do personagem, não com espaço de magia
    if (dano.porNivel) {
        return valorDaFaixa(dano.porNivel, nivelDoPersonagem)
    }

    return valorDaFaixa(dano.porCirculo, circulo)
}

function curaDaMagia(combate, circulo) {
    if (!combate || !combate.cura) {
        return null
    }

    return valorDaFaixa(combate.cura.porCirculo, circulo)
}

// Uma magia de dano em círculo mais alto sobe o dado. Isto diz se vale a pena
// mostrar a dica de "sobe ao usar espaço maior".
function danoSobeComCirculo(combate) {
    if (!combate || !combate.dano || !combate.dano.porCirculo) {
        return false
    }

    return Object.keys(combate.dano.porCirculo).length > 1
}

// A linha que a ficha mostra embaixo da magia. Devolve as partes já prontas,
// para a tela só desenhar: [{ rotulo, valor }]
function resumoDeCombateDaMagia(magia, combate, proficiencia, modificador, nivelDoPersonagem) {
    const partes = []

    if (!combate) {
        return partes
    }

    if (combate.ataque) {
        partes.push({
            rotulo: combate.ataque === "melee" ? "Ataque corpo a corpo" : "Ataque à distância",
            valor: formatarModificador(ataqueMagico(proficiencia, modificador))
        })
    }

    if (combate.cd) {
        const atributo = atributoDaApi(combate.cd.atributo)
        const nome = atributo ? ABREVIACAO_ATRIBUTO[atributo] : combate.cd.atributo
        const metade = combate.cd.sucesso === "half" ? " (metade se passar)" : ""

        partes.push({
            rotulo: `Salvaguarda de ${nome}`,
            valor: `CD ${cdDeMagia(proficiencia, modificador)}${metade}`
        })
    }

    const dano = danoDaMagia(combate, magia.circulo, nivelDoPersonagem)

    if (dano) {
        const tipo = combate.dano.tipo ? ` de ${combate.dano.tipo}` : ""
        const sobe = danoSobeComCirculo(combate) ? " (sobe em círculo maior)" : ""
        partes.push({ rotulo: "Dano", valor: `${dano}${tipo}${sobe}` })
    }

    const cura = curaDaMagia(combate, magia.circulo)

    if (cura) {
        // a cura soma o modificador de conjuração
        partes.push({ rotulo: "Cura", valor: `${cura} ${formatarModificador(modificador)}` })
    }

    return partes
}

/* ---------- Sprint 5a: concentração (RF28) ---------- */

// Regra 2024: ao sofrer dano concentrado, salvaguarda de Constituição com
// CD 10 ou metade do dano (arredondada para baixo), o que for maior, até 30.
const CD_CONCENTRACAO_MINIMA = 10
const CD_CONCENTRACAO_MAXIMA = 30

function cdConcentracao(dano) {
    return Math.min(
        CD_CONCENTRACAO_MAXIMA,
        Math.max(CD_CONCENTRACAO_MINIMA, Math.floor(dano / 2))
    )
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
    return distribuicaoCompleta(bonus, FORMAS_BONUS_ANTECEDENTE)
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

/* ---------- Classes: um bloco por classe ---------- */

// Tudo o que a app sabe de uma classe fica num bloco só. registrarClasse
// espalha o bloco pelas tabelas que o resto do código consulta
// (dadoDeVidaPorClasse, subclassesPorClasse etc.), então nada fora daqui muda.
//
// Para acrescentar uma classe:
// - conteúdo gratuito (SRD): um bloco aqui;
// - conteúdo que não pode ir para o GitHub (pago ou de terceiros):
//   um bloco em conteudo-extra.js, que fica fora do git (veja conteudo-extra.exemplo.js).
//
// Campos obrigatórios: nome, dadoDeVida, salvaguardas, pericias, subclasses.
// Opcionais: niveisDeEscolha (quando foge do padrão 4/8/12/16/19),
// conjuracao ({ atributo, tipo: "completo" | "meio" | "pacto" }),
// nomeNaApi (nome da classe na API de magias) e trocaDeMagias.
//
// Notas de conteúdo:
// - subclasses: mistura 2014 + 2024; renomear muda só o "nome", nunca o "valor",
//   para as fichas salvas não quebrarem (backlog, seção 3.5);
// - pericias.opcoes "todas": o Bardo escolhe de qualquer perícia;
// - salvaguardas: sempre uma "forte" (For/Des/Con) e uma "fraca" (Int/Sab/Car);
// - trocaDeMagias: regra 2024 conferida no texto oficial (backlog, seção 3.6);
//   o Mago troca truque no descanso longo, e não ao subir de nível.

const CLASSES = {}

const CAMPOS_OBRIGATORIOS_DA_CLASSE = ["nome", "dadoDeVida", "salvaguardas", "pericias", "subclasses"]

function registrarClasse(valor, bloco) {
    CAMPOS_OBRIGATORIOS_DA_CLASSE.forEach(function(campo) {
        if (bloco[campo] === undefined) {
            throw new Error(`Classe "${valor}" sem o campo obrigatório "${campo}".`)
        }
    })

    CLASSES[valor] = bloco

    dadoDeVidaPorClasse[valor] = bloco.dadoDeVida
    salvaguardasPorClasse[valor] = bloco.salvaguardas
    periciasPorClasse[valor] = bloco.pericias
    subclassesPorClasse[valor] = bloco.subclasses

    if (bloco.niveisDeEscolha) {
        niveisDeEscolhaPorClasse[valor] = bloco.niveisDeEscolha
    }

    if (bloco.conjuracao) {
        conjuracaoPorClasse[valor] = bloco.conjuracao
    }

    if (bloco.nomeNaApi) {
        CLASSE_NA_API[valor] = bloco.nomeNaApi
    }

    if (bloco.trocaDeMagias) {
        TROCA_DE_MAGIAS[valor] = bloco.trocaDeMagias
    }
}

// para montar o select de classe, em ordem alfabética
function listaDeClasses() {
    return Object.keys(CLASSES)
        .map(function(valor) {
            return { valor: valor, nome: CLASSES[valor].nome }
        })
        .sort(function(a, b) {
            return a.nome.localeCompare(b.nome, "pt-BR")
        })
}

function nomeDaClasse(valor) {
    return CLASSES[valor] ? CLASSES[valor].nome : valor
}

registrarClasse("barbaro", {
    nome: "Bárbaro",
    dadoDeVida: 12,
    // Defesa sem Armadura: 10 + Destreza + Constituição, escudo permitido
    classeDeArmadura: {
        nome: "Defesa sem Armadura",
        base: 10,
        atributos: ["destreza", "constituicao"],
        armaduras: ["nenhuma"],
        escudo: true
    },
    // Primal Champion (nível 20), conferido no texto oficial da API
    aumentoDeAtributoPorNivel: {
        20: { nome: "Primal Champion", atributos: ["forca", "constituicao"], valor: 4, teto: 25 }
    },
    salvaguardas: [
        "forca",
        "constituicao"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "adestrarAnimais",
            "atletismo",
            "intimidacao",
            "natureza",
            "percepcao",
            "sobrevivencia"
        ]
    },
    subclasses: [
        {
            valor: "berserker",
            nome: "Caminho do Berserker",
            api: "path-of-the-berserker",
            habilidadesPorNivel: {
                3: [{ nome: "Frenzy", api: "berserker-frenzy" }],
                6: [{ nome: "Mindless Rage", api: "berserker-mindless-rage" }],
                10: [{ nome: "Retaliation", api: "berserker-retaliation" }],
                14: [{ nome: "Intimidating Presence", api: "berserker-intimidating-presence" }]
            }
        },
        {
            valor: "guerreiroTotemico",
            nome: "Caminho do Coração Selvagem"
        },
        {
            valor: "arvoreMundo",
            nome: "Caminho da Árvore do Mundo"
        },
        {
            valor: "zelote",
            nome: "Caminho do Zelote"
        }
    ],
    recursos: [
        {
            valor: "furia",
            nome: "Fúria",
            quantidade: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6],
            recupera: "umNoCurto"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Rage", api: "barbarian-rage" },
            { nome: "Unarmored Defense", api: "barbarian-unarmored-defense" },
            { nome: "Weapon Mastery", api: "barbarian-weapon-mastery" }
        ],
        2: [
            { nome: "Danger Sense", api: "barbarian-danger-sense" },
            { nome: "Reckless Attack", api: "barbarian-reckless-attack" }
        ],
        3: [
            { nome: "Barbarian Subclass", api: "barbarian-subclass", subclasse: true },
            { nome: "Primal Knowledge", api: "barbarian-primal-knowledge" }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "barbarian-ability-score-improvement" }
        ],
        5: [
            { nome: "Extra Attack", api: "barbarian-extra-attack" },
            { nome: "Fast Movement", api: "barbarian-fast-movement" }
        ],
        6: [
            { nome: "Barbarian Subclass", api: "barbarian-subclass", subclasse: true }
        ],
        7: [
            { nome: "Feral Instinct", api: "barbarian-feral-instinct" },
            { nome: "Instinctive Pounce", api: "barbarian-instinctive-pounce" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "barbarian-ability-score-improvement" }
        ],
        9: [
            { nome: "Brutal Strike", api: "barbarian-brutal-strike" }
        ],
        10: [
            { nome: "Barbarian Subclass", api: "barbarian-subclass", subclasse: true }
        ],
        11: [
            { nome: "Relentless Rage", api: "barbarian-relentless-rage" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "barbarian-ability-score-improvement" }
        ],
        13: [
            { nome: "Improved Brutal Strike", api: "barbarian-improved-brutal-strike-1" }
        ],
        14: [
            { nome: "Barbarian Subclass", api: "barbarian-subclass", subclasse: true }
        ],
        15: [
            { nome: "Persistent Rage", api: "barbarian-persistent-rage" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "barbarian-ability-score-improvement" }
        ],
        17: [
            { nome: "Improved Brutal Strike", api: "barbarian-improved-brutal-strike-2" }
        ],
        18: [
            { nome: "Indomitable Might", api: "barbarian-indomitable-might" }
        ],
        19: [
            { nome: "Epic Boon", api: "barbarian-epic-boon" }
        ],
        20: [
            { nome: "Primal Champion", api: "barbarian-primal-champion" }
        ]
    },
    proficienciasDeArma: { simples: true, marciais: true }
})

registrarClasse("bardo", {
    nome: "Bardo",
    dadoDeVida: 8,
    salvaguardas: [
        "destreza",
        "carisma"
    ],
    pericias: {
        limite: 3,
        opcoes: "todas"
    },
    subclasses: [
        {
            valor: "colegioConhecimento",
            nome: "Colégio do Conhecimento",
            api: "college-of-lore",
            habilidadesPorNivel: {
                3: [{ nome: "Bonus Proficiencies", api: "lore-bonus-proficiencies" }, { nome: "Cutting Words", api: "lore-cutting-words" }],
                6: [{ nome: "Magical Discoveries", api: "lore-magical-discoveries" }],
                14: [{ nome: "Peerless Skill", api: "lore-peerless-skill" }]
            }
        },
        {
            valor: "colegioBravura",
            nome: "Colégio da Bravura"
        },
        {
            valor: "colegioDanca",
            nome: "Colégio da Dança"
        },
        {
            valor: "colegioGlamour",
            nome: "Colégio do Glamour"
        }
    ],
    conjuracao: {
        atributo: "carisma",
        tipo: "completo"
    },
    nomeNaApi: "bard",
    trocaDeMagias: {
        descansoLongo: {},
        nivel: {
            magias: 1,
            truques: 1
        }
    },
    recursos: [
        {
            valor: "inspiracaoDeBardo",
            nome: "Inspiração de Bardo",
            quantidade: {
                atributo: "carisma",
                minimo: 1
            },
            recupera: "longo",
            recuperaCurtoAPartirDoNivel: 5
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Bardic Inspiration", api: "bard-bardic-inspiration" },
            { nome: "Spellcasting", api: "bard-spellcasting" }
        ],
        2: [
            { nome: "Expertise", api: "bard-expertise" },
            { nome: "Jack of All Trades", api: "bard-jack-of-all-trades" }
        ],
        3: [
            { nome: "Bard Subclass", api: "bard-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "bard-ability-score-improvement" }
        ],
        5: [
            { nome: "Font of Inspiration", api: "bard-font-of-inspiration" }
        ],
        6: [
            { nome: "Bard Subclass", api: "bard-subclass", subclasse: true }
        ],
        7: [
            { nome: "Countercharm", api: "bard-countercharm" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "bard-ability-score-improvement" }
        ],
        9: [
            { nome: "Expertise", api: "bard-expertise" }
        ],
        10: [
            { nome: "Magical Secrets", api: "bard-magical-secrets" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "bard-ability-score-improvement" }
        ],
        14: [
            { nome: "Bard Subclass", api: "bard-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "bard-ability-score-improvement" }
        ],
        18: [
            { nome: "Superior Inspiration", api: "bard-superior-inspiration" }
        ],
        19: [
            { nome: "Epic Boon", api: "bard-epic-boon" }
        ],
        20: [
            { nome: "Words of Creation", api: "bard-words-of-creation" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("bruxo", {
    nome: "Bruxo",
    dadoDeVida: 8,
    salvaguardas: [
        "sabedoria",
        "carisma"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "arcanismo",
            "enganacao",
            "historia",
            "intimidacao",
            "investigacao",
            "natureza",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "arquifada",
            nome: "Patrono Arquifada"
        },
        {
            valor: "corruptor",
            nome: "Patrono Corruptor",
            magias: {
                porNivel: {
                    "3": [
                        { valor: "burning-hands", nome: "Burning Hands", circulo: 1, concentracao: false, ritual: false, escola: "Evocation" },
                        { valor: "command", nome: "Command", circulo: 1, concentracao: false, ritual: false, escola: "Enchantment" },
                        { valor: "scorching-ray", nome: "Scorching Ray", circulo: 2, concentracao: false, ritual: false, escola: "Evocation" },
                        { valor: "suggestion", nome: "Suggestion", circulo: 2, concentracao: true, ritual: false, escola: "Enchantment" }
                    ],
                    "5": [
                        { valor: "fireball", nome: "Fireball", circulo: 3, concentracao: false, ritual: false, escola: "Evocation" },
                        { valor: "stinking-cloud", nome: "Stinking Cloud", circulo: 3, concentracao: true, ritual: false, escola: "Conjuration" }
                    ],
                    "7": [
                        { valor: "fire-shield", nome: "Fire Shield", circulo: 4, concentracao: false, ritual: false, escola: "Evocation" },
                        { valor: "wall-of-fire", nome: "Wall of Fire", circulo: 4, concentracao: true, ritual: false, escola: "Evocation" }
                    ],
                    "9": [
                        { valor: "geas", nome: "Geas", circulo: 5, concentracao: false, ritual: false, escola: "Enchantment" },
                        { valor: "insect-plague", nome: "Insect Plague", circulo: 5, concentracao: true, ritual: false, escola: "Conjuration" }
                    ]
                }
            },
            api: "fiend-patron",
            habilidadesPorNivel: {
                3: [{ nome: "Dark One's Blessing", api: "fiend-patron-dark-ones-blessing" }, { nome: "Fiend Spells", api: "fiend-patron-fiend-spells" }],
                6: [{ nome: "Dark One's Own Luck", api: "fiend-patron-dark-ones-own-luck" }],
                10: [{ nome: "Fiendish Resilience", api: "fiend-patron-fiendish-resilience" }],
                14: [{ nome: "Hurl Through Hell", api: "fiend-patron-hurl-through-hell" }]
            }
        },
        {
            valor: "grandeAntigo",
            nome: "Patrono Grande Antigo"
        },
        {
            valor: "celestial",
            nome: "Patrono Celestial"
        }
    ],
    conjuracao: {
        atributo: "carisma",
        tipo: "pacto"
    },
    nomeNaApi: "warlock",
    trocaDeMagias: {
        descansoLongo: {},
        nivel: {
            magias: 1,
            truques: 1
        }
    },
    recursos: [
        {
            valor: "astuciaMagica",
            nome: "Astúcia Mágica",
            detalhe: "recupera espaços de Pacto (até a metade)",
            quantidade: 1,
            aPartirDoNivel: 2,
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Eldritch Invocations", api: "warlock-eldritch-invocations" },
            { nome: "Pact Magic", api: "warlock-pact-magic" }
        ],
        2: [
            { nome: "Magical Cunning", api: "warlock-magical-cunning" }
        ],
        3: [
            { nome: "Warlock Subclass", api: "warlock-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "warlock-ability-score-improvement" }
        ],
        6: [
            { nome: "Warlock Subclass", api: "warlock-subclass", subclasse: true }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "warlock-ability-score-improvement" }
        ],
        9: [
            { nome: "Contact Patron", api: "warlock-contact-patron" }
        ],
        10: [
            { nome: "Warlock Subclass", api: "warlock-subclass", subclasse: true }
        ],
        11: [
            { nome: "Mystic Arcanum", api: "warlock-mystic-arcanum" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "warlock-ability-score-improvement" }
        ],
        13: [
            { nome: "Mystic Arcanum", api: "warlock-mystic-arcanum" }
        ],
        14: [
            { nome: "Warlock Subclass", api: "warlock-subclass", subclasse: true }
        ],
        15: [
            { nome: "Mystic Arcanum", api: "warlock-mystic-arcanum" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "warlock-ability-score-improvement" }
        ],
        17: [
            { nome: "Mystic Arcanum", api: "warlock-mystic-arcanum" }
        ],
        19: [
            { nome: "Epic Boon", api: "warlock-epic-boon" }
        ],
        20: [
            { nome: "Eldritch Master", api: "warlock-eldritch-master" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("clerigo", {
    nome: "Clérigo",
    dadoDeVida: 8,
    salvaguardas: [
        "sabedoria",
        "carisma"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "historia",
            "intuicao",
            "medicina",
            "persuasao",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "dominioVida",
            nome: "Domínio da Vida",
            magias: {
                porNivel: {
                    "3": [
                        { valor: "aid", nome: "Aid", circulo: 2, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "bless", nome: "Bless", circulo: 1, concentracao: true, ritual: false, escola: "Enchantment" },
                        { valor: "cure-wounds", nome: "Cure Wounds", circulo: 1, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "lesser-restoration", nome: "Lesser Restoration", circulo: 2, concentracao: false, ritual: false, escola: "Abjuration" }
                    ],
                    "5": [
                        { valor: "mass-healing-word", nome: "Mass Healing Word", circulo: 3, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "revivify", nome: "Revivify", circulo: 3, concentracao: false, ritual: false, escola: "Necromancy" }
                    ],
                    "7": [
                        { valor: "aura-of-life", nome: "Aura of Life", circulo: 4, concentracao: true, ritual: false, escola: "Abjuration" },
                        { valor: "death-ward", nome: "Death Ward", circulo: 4, concentracao: false, ritual: false, escola: "Abjuration" }
                    ],
                    "9": [
                        { valor: "greater-restoration", nome: "Greater Restoration", circulo: 5, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "mass-cure-wounds", nome: "Mass Cure Wounds", circulo: 5, concentracao: false, ritual: false, escola: "Abjuration" }
                    ]
                }
            },
            api: "life-domain",
            habilidadesPorNivel: {
                3: [{ nome: "Disciple of Life", api: "life-disciple-of-life" }, { nome: "Life Domain Spells", api: "life-domain-spells" }, { nome: "Preserve Life", api: "life-preserve-life" }],
                6: [{ nome: "Blessed Healer", api: "life-blessed-healer" }],
                17: [{ nome: "Supreme Healing", api: "life-supreme-healing" }]
            }
        },
        {
            valor: "dominioLuz",
            nome: "Domínio da Luz"
        },
        {
            valor: "dominioGuerra",
            nome: "Domínio da Guerra"
        },
        {
            valor: "dominioTrapaca",
            nome: "Domínio da Trapaça"
        }
    ],
    conjuracao: {
        atributo: "sabedoria",
        tipo: "completo"
    },
    nomeNaApi: "cleric",
    trocaDeMagias: {
        descansoLongo: {
            magias: "todas"
        },
        nivel: {
            truques: 1
        }
    },
    recursos: [
        {
            valor: "canalizarDivindade",
            nome: "Canalizar Divindade",
            quantidade: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
            recupera: "umNoCurto"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Divine Order", api: "cleric-divine-order" },
            { nome: "Spellcasting", api: "cleric-spellcasting" }
        ],
        2: [
            { nome: "Channel Divinity", api: "cleric-channel-divinity" }
        ],
        3: [
            { nome: "Cleric Subclass", api: "cleric-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "cleric-ability-score-improvement" }
        ],
        5: [
            { nome: "Sear Undead", api: "cleric-sear-undead" }
        ],
        6: [
            { nome: "Cleric Subclass", api: "cleric-subclass", subclasse: true }
        ],
        7: [
            { nome: "Blessed Strikes", api: "cleric-blessed-strikes" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "cleric-ability-score-improvement" }
        ],
        10: [
            { nome: "Divine Intervention", api: "cleric-divine-intervention" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "cleric-ability-score-improvement" }
        ],
        14: [
            { nome: "Improved Blessed Strikes", api: "cleric-improved-blessed-strikes" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "cleric-ability-score-improvement" }
        ],
        17: [
            { nome: "Cleric Subclass", api: "cleric-subclass", subclasse: true }
        ],
        19: [
            { nome: "Epic Boon", api: "cleric-epic-boon" }
        ],
        20: [
            { nome: "Greater Divine Intervention", api: "cleric-greater-divine-intervention" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("druida", {
    nome: "Druida",
    dadoDeVida: 8,
    salvaguardas: [
        "inteligencia",
        "sabedoria"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "arcanismo",
            "adestrarAnimais",
            "intuicao",
            "medicina",
            "natureza",
            "percepcao",
            "religiao",
            "sobrevivencia"
        ]
    },
    subclasses: [
        {
            valor: "circuloTerra",
            nome: "Círculo da Terra",
            magias: {
                escolha: {
                    rotulo: "Tipo de terra (troca no descanso longo)",
                    opcoes: [
                        {
                            valor: "arida",
                            nome: "Árida",
                            porNivel: {
                                "3": [
                                    { valor: "blur", nome: "Blur", circulo: 2, concentracao: true, ritual: false, escola: "Illusion" },
                                    { valor: "burning-hands", nome: "Burning Hands", circulo: 1, concentracao: false, ritual: false, escola: "Evocation" },
                                    { valor: "fire-bolt", nome: "Fire Bolt", circulo: 0, concentracao: false, ritual: false, escola: "Evocation" }
                                ],
                                "5": [
                                    { valor: "fireball", nome: "Fireball", circulo: 3, concentracao: false, ritual: false, escola: "Evocation" }
                                ],
                                "7": [
                                    { valor: "blight", nome: "Blight", circulo: 4, concentracao: false, ritual: false, escola: "Necromancy" }
                                ],
                                "9": [
                                    { valor: "wall-of-stone", nome: "Wall of Stone", circulo: 5, concentracao: true, ritual: false, escola: "Evocation" }
                                ]
                            }
                        },
                        {
                            valor: "polar",
                            nome: "Polar",
                            porNivel: {
                                "3": [
                                    { valor: "fog-cloud", nome: "Fog Cloud", circulo: 1, concentracao: true, ritual: false, escola: "Conjuration" },
                                    { valor: "hold-person", nome: "Hold Person", circulo: 2, concentracao: true, ritual: false, escola: "Enchantment" },
                                    { valor: "ray-of-frost", nome: "Ray of Frost", circulo: 0, concentracao: false, ritual: false, escola: "Evocation" }
                                ],
                                "5": [
                                    { valor: "sleet-storm", nome: "Sleet Storm", circulo: 3, concentracao: true, ritual: false, escola: "Conjuration" }
                                ],
                                "7": [
                                    { valor: "ice-storm", nome: "Ice Storm", circulo: 4, concentracao: false, ritual: false, escola: "Evocation" }
                                ],
                                "9": [
                                    { valor: "cone-of-cold", nome: "Cone of Cold", circulo: 5, concentracao: false, ritual: false, escola: "Evocation" }
                                ]
                            }
                        },
                        {
                            valor: "temperada",
                            nome: "Temperada",
                            porNivel: {
                                "3": [
                                    { valor: "misty-step", nome: "Misty Step", circulo: 2, concentracao: false, ritual: false, escola: "Conjuration" },
                                    { valor: "shocking-grasp", nome: "Shocking Grasp", circulo: 0, concentracao: false, ritual: false, escola: "Evocation" },
                                    { valor: "sleep", nome: "Sleep", circulo: 1, concentracao: true, ritual: false, escola: "Enchantment" }
                                ],
                                "5": [
                                    { valor: "lightning-bolt", nome: "Lightning Bolt", circulo: 3, concentracao: false, ritual: false, escola: "Evocation" }
                                ],
                                "7": [
                                    { valor: "freedom-of-movement", nome: "Freedom of Movement", circulo: 4, concentracao: false, ritual: false, escola: "Abjuration" }
                                ],
                                "9": [
                                    { valor: "tree-stride", nome: "Tree Stride", circulo: 5, concentracao: true, ritual: false, escola: "Conjuration" }
                                ]
                            }
                        },
                        {
                            valor: "tropical",
                            nome: "Tropical",
                            porNivel: {
                                "3": [
                                    { valor: "acid-splash", nome: "Acid Splash", circulo: 0, concentracao: false, ritual: false, escola: "Evocation" },
                                    { valor: "ray-of-sickness", nome: "Ray of Sickness", circulo: 1, concentracao: false, ritual: false, escola: "Necromancy" },
                                    { valor: "web", nome: "Web", circulo: 2, concentracao: true, ritual: false, escola: "Conjuration" }
                                ],
                                "5": [
                                    { valor: "stinking-cloud", nome: "Stinking Cloud", circulo: 3, concentracao: true, ritual: false, escola: "Conjuration" }
                                ],
                                "7": [
                                    { valor: "polymorph", nome: "Polymorph", circulo: 4, concentracao: true, ritual: false, escola: "Transmutation" }
                                ],
                                "9": [
                                    { valor: "insect-plague", nome: "Insect Plague", circulo: 5, concentracao: true, ritual: false, escola: "Conjuration" }
                                ]
                            }
                        }
                    ]
                }
            },
            api: "circle-of-the-land",
            habilidadesPorNivel: {
                3: [{ nome: "Circle of the Land Spells", api: "land-circle-of-the-land-spells" }, { nome: "Land's Aid", api: "land-lands-aid" }],
                6: [{ nome: "Natural Recovery", api: "land-natural-recovery" }],
                10: [{ nome: "Nature's Ward", api: "land-natures-ward" }],
                14: [{ nome: "Nature's Sanctuary", api: "land-natures-sanctuary" }]
            }
        },
        {
            valor: "circuloLua",
            nome: "Círculo da Lua"
        },
        {
            valor: "circuloMar",
            nome: "Círculo do Mar"
        },
        {
            valor: "circuloEstrelas",
            nome: "Círculo das Estrelas"
        }
    ],
    conjuracao: {
        atributo: "sabedoria",
        tipo: "completo"
    },
    nomeNaApi: "druid",
    trocaDeMagias: {
        descansoLongo: {
            magias: "todas"
        },
        nivel: {
            truques: 1
        }
    },
    recursos: [
        {
            valor: "formaSelvagem",
            nome: "Forma Selvagem",
            quantidade: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
            recupera: "umNoCurto"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Druidic", api: "druid-druidic" },
            { nome: "Primal Order", api: "druid-primal-order" },
            { nome: "Spellcasting", api: "druid-spellcasting" }
        ],
        2: [
            { nome: "Wild Shape", api: "druid-wild-shape" },
            { nome: "Wild Companion", api: "druid-wild-companion" }
        ],
        3: [
            { nome: "Druid Subclass", api: "druid-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "druid-ability-score-improvement" }
        ],
        5: [
            { nome: "Wild Resurgence", api: "druid-wild-resurgence" }
        ],
        6: [
            { nome: "Druid Subclass", api: "druid-subclass", subclasse: true }
        ],
        7: [
            { nome: "Elemental Fury", api: "druid-elemental-fury" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "druid-ability-score-improvement" }
        ],
        10: [
            { nome: "Druid Subclass", api: "druid-subclass", subclasse: true }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "druid-ability-score-improvement" }
        ],
        14: [
            { nome: "Druid Subclass", api: "druid-subclass", subclasse: true }
        ],
        15: [
            { nome: "Improved Elemental Fury", api: "druid-improved-elemental-fury" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "druid-ability-score-improvement" }
        ],
        18: [
            { nome: "Beast Spells", api: "druid-beast-spells" }
        ],
        19: [
            { nome: "Epic Boon", api: "druid-epic-boon" }
        ],
        20: [
            { nome: "Archdruid", api: "druid-archdruid" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("feiticeiro", {
    nome: "Feiticeiro",
    dadoDeVida: 6,
    salvaguardas: [
        "constituicao",
        "carisma"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "arcanismo",
            "enganacao",
            "intuicao",
            "intimidacao",
            "persuasao",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "linhagemDraconica",
            nome: "Feitiçaria Dracônica",
            magias: {
                porNivel: {
                    "3": [
                        { valor: "alter-self", nome: "Alter Self", circulo: 2, concentracao: true, ritual: false, escola: "Transmutation" },
                        { valor: "chromatic-orb", nome: "Chromatic Orb", circulo: 1, concentracao: false, ritual: false, escola: "Evocation" },
                        { valor: "command", nome: "Command", circulo: 1, concentracao: false, ritual: false, escola: "Enchantment" },
                        { valor: "dragons-breath", nome: "Dragon's Breath", circulo: 2, concentracao: true, ritual: false, escola: "Transmutation" }
                    ],
                    "5": [
                        { valor: "fear", nome: "Fear", circulo: 3, concentracao: true, ritual: false, escola: "Illusion" },
                        { valor: "fly", nome: "Fly", circulo: 3, concentracao: true, ritual: false, escola: "Transmutation" }
                    ],
                    "7": [
                        { valor: "arcane-eye", nome: "Arcane Eye", circulo: 4, concentracao: true, ritual: false, escola: "Divination" },
                        { valor: "charm-monster", nome: "Charm Monster", circulo: 4, concentracao: false, ritual: false, escola: "Enchantment" }
                    ],
                    "9": [
                        { valor: "legend-lore", nome: "Legend Lore", circulo: 5, concentracao: false, ritual: false, escola: "Divination" },
                        { valor: "summon-dragon", nome: "Summon Dragon", circulo: 5, concentracao: true, ritual: false, escola: "Conjuration" }
                    ]
                }
            },
            api: "draconic-sorcery",
            habilidadesPorNivel: {
                3: [{ nome: "Draconic Resilience", api: "draconic-sorcery-draconic-resilience" }, { nome: "Draconic Spells", api: "draconic-sorcery-draconic-spells" }],
                6: [{ nome: "Elemental Affinity", api: "draconic-sorcery-elemental-affinity" }],
                14: [{ nome: "Dragon Wings", api: "draconic-sorcery-dragon-wings" }],
                18: [{ nome: "Dragon Companion", api: "draconic-sorcery-dragon-companion" }]
            }
        },
        {
            valor: "magiaSelvagem",
            nome: "Feitiçaria Selvagem"
        },
        {
            valor: "feiticariaAberrante",
            nome: "Feitiçaria Aberrante"
        },
        {
            valor: "feiticariaMecanica",
            nome: "Feitiçaria Mecânica"
        }
    ],
    conjuracao: {
        atributo: "carisma",
        tipo: "completo"
    },
    nomeNaApi: "sorcerer",
    trocaDeMagias: {
        descansoLongo: {},
        nivel: {
            magias: 1,
            truques: 1
        }
    },
    recursos: [
        {
            valor: "pontosDeFeiticaria",
            nome: "Pontos de Feitiçaria",
            quantidade: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            recupera: "longo"
        },
        {
            valor: "restauracaoFeiticeira",
            nome: "Restauração Feiticeira",
            detalhe: "no descanso curto, recupera até metade do nível em pontos",
            quantidade: 1,
            aPartirDoNivel: 5,
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Innate Sorcery", api: "sorcerer-innate-sorcery" },
            { nome: "Spellcasting", api: "sorcerer-spellcasting" }
        ],
        2: [
            { nome: "Font of Magic", api: "sorcerer-font-of-magic" },
            { nome: "Metamagic", api: "sorcerer-metamagic" }
        ],
        3: [
            { nome: "Sorcerer Subclass", api: "sorcerer-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "sorcerer-ability-score-improvement" }
        ],
        5: [
            { nome: "Sorcerous Restoration", api: "sorcerer-sorcerous-restoration" }
        ],
        6: [
            { nome: "Sorcerer Subclass", api: "sorcerer-subclass", subclasse: true }
        ],
        7: [
            { nome: "Sorcery Incarnate", api: "sorcerer-sorcery-incarnate" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "sorcerer-ability-score-improvement" }
        ],
        10: [
            { nome: "Metamagic", api: "sorcerer-metamagic" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "sorcerer-ability-score-improvement" }
        ],
        14: [
            { nome: "Sorcerer Subclass", api: "sorcerer-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "sorcerer-ability-score-improvement" }
        ],
        17: [
            { nome: "Metamagic", api: "sorcerer-metamagic" }
        ],
        18: [
            { nome: "Sorcerer Subclass", api: "sorcerer-subclass", subclasse: true }
        ],
        19: [
            { nome: "Epic Boon", api: "sorcerer-epic-boon" }
        ],
        20: [
            { nome: "Arcane Apotheosis", api: "sorcerer-arcane-apotheosis" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("guerreiro", {
    nome: "Guerreiro",
    dadoDeVida: 10,
    salvaguardas: [
        "forca",
        "constituicao"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "acrobacia",
            "adestrarAnimais",
            "atletismo",
            "historia",
            "intuicao",
            "intimidacao",
            "percepcao",
            "sobrevivencia"
        ]
    },
    subclasses: [
        {
            valor: "campeao",
            nome: "Campeão",
            api: "champion",
            habilidadesPorNivel: {
                3: [{ nome: "Improved Critical", api: "champion-improved-critical" }, { nome: "Remarkable Athlete", api: "champion-remarkable-athlete" }],
                7: [{ nome: "Additional Fighting Style", api: "champion-additional-fighting-style" }],
                10: [{ nome: "Heroic Warrior", api: "champion-heroic-warrior" }],
                15: [{ nome: "Superior Critical", api: "champion-superior-critical" }],
                18: [{ nome: "Survivor", api: "champion-survivor" }]
            }
        },
        {
            valor: "mestreBatalha",
            nome: "Mestre de Batalha"
        },
        {
            valor: "cavaleiroArcano",
            nome: "Cavaleiro Arcano"
        },
        {
            valor: "guerreiroPsiquico",
            nome: "Guerreiro Psíquico"
        }
    ],
    niveisDeEscolha: [
        4,
        6,
        8,
        12,
        14,
        16,
        19
    ],
    recursos: [
        {
            valor: "retomarOFolego",
            nome: "Retomar o Fôlego",
            quantidade: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            recupera: "umNoCurto"
        },
        {
            valor: "surtoDeAcao",
            nome: "Surto de Ação",
            quantidade: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
            recupera: "curto"
        },
        {
            valor: "indomavel",
            nome: "Indomável",
            quantidade: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Fighting Style", api: "fighter-fighting-style" },
            { nome: "Second Wind", api: "fighter-second-wind" },
            { nome: "Weapon Mastery", api: "fighter-weapon-mastery" }
        ],
        2: [
            { nome: "Action Surge", api: "fighter-action-surge" },
            { nome: "Tactical Mind", api: "fighter-tactical-mind" }
        ],
        3: [
            { nome: "Fighter Subclass", api: "fighter-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        5: [
            { nome: "Extra Attack", api: "fighter-extra-attack" },
            { nome: "Tactical Shift", api: "fighter-tactical-shift" }
        ],
        6: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        7: [
            { nome: "Fighter Subclass", api: "fighter-subclass", subclasse: true }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        9: [
            { nome: "Indomitable", api: "fighter-indomitable" },
            { nome: "Tactical Master", api: "fighter-tactical-master" }
        ],
        10: [
            { nome: "Fighter Subclass", api: "fighter-subclass", subclasse: true }
        ],
        11: [
            { nome: "Two Extra Attacks", api: "fighter-two-extra-attacks" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        13: [
            { nome: "Indomitable", api: "fighter-indomitable" },
            { nome: "Studied Attacks", api: "fighter-studied-attacks" }
        ],
        14: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        15: [
            { nome: "Fighter Subclass", api: "fighter-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "fighter-ability-score-improvement" }
        ],
        17: [
            { nome: "Action Surge", api: "fighter-action-surge" },
            { nome: "Indomitable", api: "fighter-indomitable" }
        ],
        18: [
            { nome: "Fighter Subclass", api: "fighter-subclass", subclasse: true }
        ],
        19: [
            { nome: "Epic Boon", api: "fighter-epic-boon" }
        ],
        20: [
            { nome: "Three Extra Attacks", api: "fighter-three-extra-attacks" }
        ]
    },
    proficienciasDeArma: { simples: true, marciais: true }
})

registrarClasse("ladino", {
    nome: "Ladino",
    dadoDeVida: 8,
    salvaguardas: [
        "destreza",
        "inteligencia"
    ],
    // Slippery Mind (nível 15): proficiência em Sabedoria e Carisma
    salvaguardasPorNivel: {
        15: ["sabedoria", "carisma"]
    },
    pericias: {
        limite: 4,
        opcoes: [
            "acrobacia",
            "atletismo",
            "atuacao",
            "enganacao",
            "furtividade",
            "intimidacao",
            "intuicao",
            "investigacao",
            "percepcao",
            "persuasao",
            "prestidigitacao"
        ]
    },
    subclasses: [
        {
            valor: "trapaceiro",
            nome: "Ladrão",
            api: "thief",
            habilidadesPorNivel: {
                3: [{ nome: "Fast Hands", api: "thief-fast-hands" }, { nome: "Second-Story Work", api: "thief-second-story-work" }],
                9: [{ nome: "Supreme Sneak", api: "thief-supreme-sneak" }],
                13: [{ nome: "Use Magic Device", api: "thief-use-magic-device" }],
                17: [{ nome: "Thief's Reflexes", api: "thief-thiefs-reflexes" }]
            }
        },
        {
            valor: "assassino",
            nome: "Assassino"
        },
        {
            valor: "trapaceiroArcano",
            nome: "Trapaceiro Arcano"
        },
        {
            valor: "laminaAlma",
            nome: "Lâmina da Alma"
        }
    ],
    niveisDeEscolha: [
        4,
        8,
        10,
        12,
        16,
        19
    ],
    recursos: [
        {
            valor: "golpeDeSorte",
            nome: "Golpe de Sorte",
            quantidade: 1,
            aPartirDoNivel: 20,
            recupera: "curto"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Expertise", api: "rogue-expertise" },
            { nome: "Sneak Attack", api: "rogue-sneak-attack" },
            { nome: "Thieves' Cant", api: "rogue-thieves-cant" },
            { nome: "Weapon Mastery", api: "rogue-weapon-mastery" }
        ],
        2: [
            { nome: "Cunning Action", api: "rogue-cunning-action" }
        ],
        3: [
            { nome: "Rogue Subclass", api: "rogue-subclass", subclasse: true },
            { nome: "Steady Aim", api: "rogue-steady-aim" }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "rogue-ability-score-improvement" }
        ],
        5: [
            { nome: "Cunning Strike", api: "rogue-cunning-strike" },
            { nome: "Uncanny Dodge", api: "rogue-uncanny-dodge" }
        ],
        6: [
            { nome: "Expertise", api: "rogue-expertise" }
        ],
        7: [
            { nome: "Evasion", api: "rogue-evasion" },
            { nome: "Reliable Talent", api: "rogue-reliable-talent" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "rogue-ability-score-improvement" }
        ],
        9: [
            { nome: "Rogue Subclass", api: "rogue-subclass", subclasse: true }
        ],
        10: [
            { nome: "Ability Score Improvement", api: "rogue-ability-score-improvement" }
        ],
        11: [
            { nome: "Improved Cunning Strike", api: "rogue-improved-cunning-strike" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "rogue-ability-score-improvement" }
        ],
        13: [
            { nome: "Rogue Subclass", api: "rogue-subclass", subclasse: true }
        ],
        14: [
            { nome: "Devious Strikes", api: "rogue-devious-strikes" }
        ],
        15: [
            { nome: "Slippery Mind", api: "rogue-slippery-mind" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "rogue-ability-score-improvement" }
        ],
        17: [
            { nome: "Rogue Subclass", api: "rogue-subclass", subclasse: true }
        ],
        18: [
            { nome: "Elusive", api: "rogue-elusive" }
        ],
        19: [
            { nome: "Epic Boon", api: "rogue-epic-boon" }
        ],
        20: [
            { nome: "Stroke of Luck", api: "rogue-stroke-of-luck" }
        ]
    },
    proficienciasDeArma: {
        simples: true,
        especificas: ["longsword", "rapier", "scimitar", "shortsword", "whip", "hand-crossbow"]
    }
})

registrarClasse("mago", {
    nome: "Mago",
    dadoDeVida: 6,
    salvaguardas: [
        "inteligencia",
        "sabedoria"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "arcanismo",
            "historia",
            "intuicao",
            "investigacao",
            "medicina",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "evocacao",
            nome: "Evocador",
            api: "evoker",
            habilidadesPorNivel: {
                3: [{ nome: "Evocation Savant", api: "evoker-evocation-savant" }, { nome: "Potent Cantrip", api: "evoker-potent-cantrip" }],
                6: [{ nome: "Sculpt Spells", api: "evoker-sculpt-spells" }],
                10: [{ nome: "Empowered Evocation", api: "evoker-empowered-evocation" }],
                14: [{ nome: "Overchannel", api: "evoker-overchannel" }]
            }
        },
        {
            valor: "abjuracao",
            nome: "Abjurador"
        },
        {
            valor: "ilusao",
            nome: "Ilusionista"
        },
        {
            valor: "adivinho",
            nome: "Adivinho"
        }
    ],
    conjuracao: {
        atributo: "inteligencia",
        tipo: "completo"
    },
    nomeNaApi: "wizard",
    trocaDeMagias: {
        descansoLongo: {
            magias: "todas",
            truques: 1
        },
        nivel: {}
    },
    recursos: [
        {
            valor: "recuperacaoArcana",
            nome: "Recuperação Arcana",
            detalhe: "no descanso curto, recupera espaços até metade do nível",
            quantidade: 1,
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Arcane Recovery", api: "wizard-arcane-recovery" },
            { nome: "Ritual Adept", api: "wizard-ritual-adept" },
            { nome: "Spellcasting", api: "wizard-spellcasting" }
        ],
        2: [
            { nome: "Scholar", api: "wizard-scholar" }
        ],
        3: [
            { nome: "Wizard Subclass", api: "wizard-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "wizard-ability-score-improvement" }
        ],
        5: [
            { nome: "Memorize Spell", api: "wizard-memorize-spell" }
        ],
        6: [
            { nome: "Wizard Subclass", api: "wizard-subclass", subclasse: true }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "wizard-ability-score-improvement" }
        ],
        10: [
            { nome: "Wizard Subclass", api: "wizard-subclass", subclasse: true }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "wizard-ability-score-improvement" }
        ],
        14: [
            { nome: "Wizard Subclass", api: "wizard-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "wizard-ability-score-improvement" }
        ],
        18: [
            { nome: "Spell Mastery", api: "wizard-spell-mastery" }
        ],
        19: [
            { nome: "Epic Boon", api: "wizard-epic-boon" }
        ],
        20: [
            { nome: "Signature Spells", api: "wizard-signature-spells" }
        ]
    },
    proficienciasDeArma: { simples: true }
})

registrarClasse("monge", {
    nome: "Monge",
    dadoDeVida: 8,
    // Defesa sem Armadura: 10 + Destreza + Sabedoria, sem armadura e sem escudo
    classeDeArmadura: {
        nome: "Defesa sem Armadura",
        base: 10,
        atributos: ["destreza", "sabedoria"],
        armaduras: ["nenhuma"],
        escudo: false
    },
    salvaguardas: [
        "forca",
        "destreza"
    ],
    // Disciplined Survivor (nível 14): proficiência em todas as salvaguardas
    salvaguardasPorNivel: {
        14: ["forca", "destreza", "constituicao", "inteligencia", "sabedoria", "carisma"]
    },
    pericias: {
        limite: 2,
        opcoes: [
            "acrobacia",
            "atletismo",
            "furtividade",
            "historia",
            "intuicao",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "maoAberta",
            nome: "Guerreiro da Mão Aberta",
            api: "warrior-of-the-open-hand",
            habilidadesPorNivel: {
                3: [{ nome: "Open Hand Technique", api: "open-hand-technique" }],
                6: [{ nome: "Wholeness of Body", api: "open-hand-wholeness-of-body" }],
                11: [{ nome: "Fleet Step", api: "open-hand-fleet-step" }],
                17: [{ nome: "Quivering Palm", api: "open-hand-quivering-palm" }]
            }
        },
        {
            valor: "sombras",
            nome: "Guerreiro das Sombras"
        },
        {
            valor: "quatroElementos",
            nome: "Guerreiro dos Elementos"
        },
        {
            valor: "misericordia",
            nome: "Guerreiro da Misericórdia"
        }
    ],
    recursos: [
        {
            valor: "pontosDeFoco",
            nome: "Pontos de Foco",
            quantidade: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            recupera: "curto"
        },
        {
            valor: "metabolismoSobrenatural",
            nome: "Metabolismo Sobrenatural",
            detalhe: "ao rolar iniciativa, recupera os Pontos de Foco",
            quantidade: 1,
            aPartirDoNivel: 2,
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Martial Arts", api: "monk-martial-arts" },
            { nome: "Unarmored Defense", api: "monk-unarmored-defense" }
        ],
        2: [
            { nome: "Monk's Focus", api: "monk-monks-focus" },
            { nome: "Unarmored Movement", api: "monk-unarmored-movement" },
            { nome: "Uncanny Metabolism", api: "monk-uncanny-metabolism" }
        ],
        3: [
            { nome: "Monk Subclass", api: "monk-subclass", subclasse: true },
            { nome: "Deflect Attacks", api: "monk-deflect-attacks" }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "monk-ability-score-improvement" },
            { nome: "Slow Fall", api: "monk-slow-fall" }
        ],
        5: [
            { nome: "Extra Attack", api: "monk-extra-attack" },
            { nome: "Stunning Strike", api: "monk-stunning-strike" }
        ],
        6: [
            { nome: "Monk Subclass", api: "monk-subclass", subclasse: true },
            { nome: "Empowered Strikes", api: "monk-empowered-strikes" }
        ],
        7: [
            { nome: "Evasion", api: "monk-evasion" }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "monk-ability-score-improvement" }
        ],
        9: [
            { nome: "Acrobatic Movement", api: "monk-acrobatic-movement" }
        ],
        10: [
            { nome: "Heightened Focus", api: "monk-heightened-focus" },
            { nome: "Self-Restoration", api: "monk-self-restoration" }
        ],
        11: [
            { nome: "Monk Subclass", api: "monk-subclass", subclasse: true }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "monk-ability-score-improvement" }
        ],
        13: [
            { nome: "Deflect Energy", api: "monk-deflect-energy" }
        ],
        14: [
            { nome: "Disciplined Survivor", api: "monk-disciplined-survivor" }
        ],
        15: [
            { nome: "Perfect Focus", api: "monk-perfect-focus" }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "monk-ability-score-improvement" }
        ],
        17: [
            { nome: "Monk Subclass", api: "monk-subclass", subclasse: true }
        ],
        18: [
            { nome: "Superior Defense", api: "monk-superior-defense" }
        ],
        19: [
            { nome: "Epic Boon", api: "monk-epic-boon" }
        ],
        20: [
            { nome: "Body and Mind", api: "monk-body-and-mind" }
        ]
    },
    proficienciasDeArma: { simples: true, marciaisComPropriedade: "light" }
})

registrarClasse("paladino", {
    nome: "Paladino",
    dadoDeVida: 10,
    salvaguardas: [
        "sabedoria",
        "carisma"
    ],
    pericias: {
        limite: 2,
        opcoes: [
            "atletismo",
            "intimidacao",
            "intuicao",
            "medicina",
            "persuasao",
            "religiao"
        ]
    },
    subclasses: [
        {
            valor: "juramentoDevocao",
            nome: "Juramento da Devoção",
            magias: {
                porNivel: {
                    "3": [
                        { valor: "protection-from-evil-and-good", nome: "Protection from Evil and Good", circulo: 1, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "shield-of-faith", nome: "Shield of Faith", circulo: 1, concentracao: true, ritual: false, escola: "Abjuration" }
                    ],
                    "5": [
                        { valor: "aid", nome: "Aid", circulo: 2, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "zone-of-truth", nome: "Zone of Truth", circulo: 2, concentracao: false, ritual: false, escola: "Enchantment" }
                    ],
                    "9": [
                        { valor: "beacon-of-hope", nome: "Beacon of Hope", circulo: 3, concentracao: true, ritual: false, escola: "Abjuration" },
                        { valor: "dispel-magic", nome: "Dispel Magic", circulo: 3, concentracao: false, ritual: false, escola: "Abjuration" }
                    ],
                    "13": [
                        { valor: "freedom-of-movement", nome: "Freedom of Movement", circulo: 4, concentracao: false, ritual: false, escola: "Abjuration" },
                        { valor: "guardian-of-faith", nome: "Guardian of Faith", circulo: 4, concentracao: false, ritual: false, escola: "Conjuration" }
                    ],
                    "17": [
                        { valor: "commune", nome: "Commune", circulo: 5, concentracao: false, ritual: true, escola: "Divination" },
                        { valor: "flame-strike", nome: "Flame Strike", circulo: 5, concentracao: false, ritual: false, escola: "Evocation" }
                    ]
                }
            },
            api: "oath-of-devotion",
            habilidadesPorNivel: {
                3: [{ nome: "Oath of Devotion Spells", api: "devotion-oath-of-devotion-spells" }, { nome: "Sacred Weapon", api: "devotion-sacred-weapon" }],
                7: [{ nome: "Aura of Devotion", api: "devotion-aura-of-devotion" }],
                15: [{ nome: "Smite of Protection", api: "devotion-smite-of-protection" }],
                20: [{ nome: "Holy Nimbus", api: "devotion-holy-nimbus" }]
            }
        },
        {
            valor: "juramentoAnciaos",
            nome: "Juramento dos Anciãos"
        },
        {
            valor: "juramentoVinganca",
            nome: "Juramento da Vingança"
        },
        {
            valor: "juramentoGloria",
            nome: "Juramento da Glória"
        }
    ],
    conjuracao: {
        atributo: "carisma",
        tipo: "meio"
    },
    nomeNaApi: "paladin",
    trocaDeMagias: {
        descansoLongo: {
            magias: 1
        },
        nivel: {}
    },
    recursos: [
        {
            valor: "curaPelasMaos",
            nome: "Cura pelas Mãos",
            detalhe: "pontos de vida para curar",
            quantidade: {
                multiplicadorDoNivel: 5
            },
            recupera: "longo"
        },
        {
            valor: "canalizarDivindade",
            nome: "Canalizar Divindade",
            quantidade: [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            recupera: "umNoCurto"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Lay On Hands", api: "paladin-lay-on-hands" },
            { nome: "Spellcasting", api: "paladin-spellcasting" },
            { nome: "Weapon Mastery", api: "paladin-weapon-mastery" }
        ],
        2: [
            { nome: "Fighting Style", api: "paladin-fighting-style" },
            { nome: "Paladin's Smite", api: "paladin-paladins-smite" }
        ],
        3: [
            { nome: "Channel Divinity", api: "paladin-channel-divinity" },
            { nome: "Paladin Subclass", api: "paladin-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "paladin-ability-score-improvement" }
        ],
        5: [
            { nome: "Extra Attack", api: "paladin-extra-attack" },
            { nome: "Faithful Steed", api: "paladin-faithful-steed" }
        ],
        6: [
            { nome: "Aura of Protection", api: "paladin-aura-of-protection" }
        ],
        7: [
            { nome: "Paladin Subclass", api: "paladin-subclass", subclasse: true }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "paladin-ability-score-improvement" }
        ],
        9: [
            { nome: "Abjure Foes", api: "paladin-abjure-foes" }
        ],
        10: [
            { nome: "Aura of Courage", api: "paladin-aura-of-courage" }
        ],
        11: [
            { nome: "Radiant Strikes", api: "paladin-radiant-strikes" }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "paladin-ability-score-improvement" }
        ],
        14: [
            { nome: "Restoring Touch", api: "paladin-restoring-touch" }
        ],
        15: [
            { nome: "Paladin Subclass", api: "paladin-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "paladin-ability-score-improvement" }
        ],
        18: [
            { nome: "Aura Expansion", api: "paladin-aura-expansion" }
        ],
        19: [
            { nome: "Epic Boon", api: "paladin-epic-boon" }
        ],
        20: [
            { nome: "Paladin Subclass", api: "paladin-subclass", subclasse: true }
        ]
    },
    proficienciasDeArma: { simples: true, marciais: true }
})

registrarClasse("patrulheiro", {
    nome: "Patrulheiro",
    dadoDeVida: 10,
    salvaguardas: [
        "forca",
        "destreza"
    ],
    pericias: {
        limite: 3,
        opcoes: [
            "adestrarAnimais",
            "atletismo",
            "furtividade",
            "intuicao",
            "investigacao",
            "natureza",
            "percepcao",
            "sobrevivencia"
        ]
    },
    subclasses: [
        {
            valor: "cacador",
            nome: "Caçador",
            api: "hunter",
            habilidadesPorNivel: {
                3: [{ nome: "Hunter's Lore", api: "hunter-hunters-lore" }, { nome: "Hunter's Prey", api: "hunter-hunters-prey" }],
                7: [{ nome: "Defensive Tactics", api: "hunter-defensive-tactics" }],
                11: [{ nome: "Superior Hunter's Prey", api: "hunter-superior-hunters-prey" }],
                15: [{ nome: "Superior Hunter's Defense", api: "hunter-superior-hunters-defense" }]
            }
        },
        {
            valor: "senhorFeras",
            nome: "Senhor das Feras"
        },
        {
            valor: "andarilhoFeerico",
            nome: "Andarilho Feérico"
        },
        {
            valor: "perseguidorSombrio",
            nome: "Perseguidor Sombrio"
        }
    ],
    conjuracao: {
        atributo: "sabedoria",
        tipo: "meio"
    },
    nomeNaApi: "ranger",
    trocaDeMagias: {
        descansoLongo: {
            magias: 1
        },
        nivel: {}
    },
    recursos: [
        {
            valor: "inimigoFavorito",
            nome: "Inimigo Favorito",
            detalhe: "Marca do Caçador sem gastar espaço",
            quantidade: [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],
            recupera: "longo"
        }
    ],
    habilidadesPorNivel: {
        1: [
            { nome: "Favored Enemy", api: "ranger-favored-enemy" },
            { nome: "Spellcasting", api: "ranger-spellcasting" },
            { nome: "Weapon Mastery", api: "ranger-weapon-mastery" }
        ],
        2: [
            { nome: "Deft Explorer", api: "ranger-deft-explorer" },
            { nome: "Fighting Style", api: "ranger-fighting-style" }
        ],
        3: [
            { nome: "Ranger Subclass", api: "ranger-subclass", subclasse: true }
        ],
        4: [
            { nome: "Ability Score Improvement", api: "ranger-ability-score-improvement" }
        ],
        5: [
            { nome: "Extra Attack", api: "ranger-extra-attack" }
        ],
        6: [
            { nome: "Roving", api: "ranger-roving" }
        ],
        7: [
            { nome: "Ranger Subclass", api: "ranger-subclass", subclasse: true }
        ],
        8: [
            { nome: "Ability Score Improvement", api: "ranger-ability-score-improvement" }
        ],
        9: [
            { nome: "Expertise", api: "ranger-expertise" }
        ],
        10: [
            { nome: "Tireless", api: "ranger-tireless" }
        ],
        11: [
            { nome: "Ranger Subclass", api: "ranger-subclass", subclasse: true }
        ],
        12: [
            { nome: "Ability Score Improvement", api: "ranger-ability-score-improvement" }
        ],
        13: [
            { nome: "Relentless Hunter", api: "ranger-relentless-hunter" }
        ],
        14: [
            { nome: "Nature's Veil", api: "ranger-natures-veil" }
        ],
        15: [
            { nome: "Ranger Subclass", api: "ranger-subclass", subclasse: true }
        ],
        16: [
            { nome: "Ability Score Improvement", api: "ranger-ability-score-improvement" }
        ],
        17: [
            { nome: "Precise Hunter", api: "ranger-precise-hunter" }
        ],
        18: [
            { nome: "Feral Senses", api: "ranger-feral-senses" }
        ],
        19: [
            { nome: "Epic Boon", api: "ranger-epic-boon" }
        ],
        20: [
            { nome: "Foe Slayer", api: "ranger-foe-slayer" }
        ]
    },
    proficienciasDeArma: { simples: true, marciais: true }
})

// Acrescenta (ou substitui) uma subclasse de uma classe que já existe.
// É o que permite um pacote trazer o Cavaleiro Arcano sem tocar no bloco do
// Guerreiro, que é conteúdo gratuito.
function registrarSubclasse(classe, bloco) {
    if (!CLASSES[classe]) {
        throw new Error(`Subclasse "${bloco.valor}" para classe desconhecida "${classe}".`)
    }

    const lista = subclassesPorClasse[classe] || []

    const posicao = lista.findIndex(function(item) {
        return item.valor === bloco.valor
    })

    if (posicao >= 0) {
        // o SRD já traz o nome da subclasse; o pacote completa o resto
        lista[posicao] = Object.assign({}, lista[posicao], bloco)
    } else {
        lista.push(bloco)
    }

    subclassesPorClasse[classe] = lista
    CLASSES[classe].subclasses = lista
}

// Fase 2b: as classes registradas ATÉ AQUI são o conteúdo gratuito (SRD).
// Tudo o que for registrado depois vem de fora — do conteudo-extra.js local ou
// de um pacote entregue pelo banco — e é isso que distingue os dois.
const CLASSES_SRD = Object.keys(CLASSES)

function classesForaDoSrd() {
    return Object.keys(CLASSES).filter(function(valor) {
        return !CLASSES_SRD.includes(valor)
    })
}

// Retrato exato das subclasses neste ponto do arquivo. Guardar o texto, e não
// só os nomes, é o que permite notar depois que um pacote ACRESCENTOU mecânica
// a uma subclasse que aqui só tinha nome (o Cavaleiro Arcano é esse caso).
const SUBCLASSES_SRD = {}

CLASSES_SRD.forEach(function(classe) {
    const retrato = {}

    ;(subclassesPorClasse[classe] || []).forEach(function(item) {
        retrato[item.valor] = JSON.stringify(item)
    })

    SUBCLASSES_SRD[classe] = retrato
})

// As subclasses de CLASSES DO SRD que mudaram (ou nasceram) depois deste
// ponto: é conteúdo que veio do conteudo-extra.js local ou de um pacote.
// Classe inteira de fora (Pugilista) não entra aqui: ela viaja como pacote
// próprio, com as subclasses dela dentro.
function subclassesForaDoSrd() {
    const achadas = []

    CLASSES_SRD.forEach(function(classe) {
        const retrato = SUBCLASSES_SRD[classe] || {}

        ;(subclassesPorClasse[classe] || []).forEach(function(item) {
            if (retrato[item.valor] !== JSON.stringify(item)) {
                achadas.push({ classe: classe, subclasse: item })
            }
        })
    })

    return achadas
}
