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
function tetoDoAtributo(atributo, atributosAte30) {
    return (atributosAte30 || []).includes(atributo)
        ? ATRIBUTO_MAXIMO_DADIVA
        : ATRIBUTO_MAXIMO
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
function espacosDeMagia(classe, nivel) {
    const conjuracao = conjuracaoDaClasse(classe)

    if (conjuracao === null || nivel < 1 || nivel > NIVEL_MAXIMO) {
        return []
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
            nome: "Caminho do Berserker"
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
    ]
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
            nome: "Colégio do Conhecimento"
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
    }
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
            nome: "Patrono Corruptor"
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
    }
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
            nome: "Domínio da Vida"
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
    }
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
            nome: "Círculo da Terra"
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
    }
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
            nome: "Feitiçaria Dracônica"
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
    }
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
            nome: "Campeão"
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
    ]
})

registrarClasse("ladino", {
    nome: "Ladino",
    dadoDeVida: 8,
    salvaguardas: [
        "destreza",
        "inteligencia"
    ],
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
            nome: "Ladrão"
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
    ]
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
            nome: "Evocador"
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
    }
})

registrarClasse("monge", {
    nome: "Monge",
    dadoDeVida: 8,
    salvaguardas: [
        "forca",
        "destreza"
    ],
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
            nome: "Guerreiro da Mão Aberta"
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
    ]
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
            nome: "Juramento da Devoção"
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
    }
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
            nome: "Caçador"
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
    }
})
