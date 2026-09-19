// Modelo do arquivo de conteúdo extra.
//
// Conteúdo que NÃO pode ir para o GitHub (livros pagos, homebrew de terceiros)
// fica em conteudo-extra.js, na mesma pasta do app. Esse arquivo está no
// .gitignore: existe só no seu computador e nunca é publicado.
//
// Como usar:
// 1. Copie este arquivo com o nome conteudo-extra.js.
// 2. Troque o exemplo abaixo pelas classes de verdade.
// 3. Recarregue o app: as classes aparecem no wizard e na ficha.
//
// Sem conteudo-extra.js o app funciona normalmente, só com o conteúdo gratuito.
//
// Cada classe é um bloco no mesmo formato das classes de regras.js
// (veja a seção "Classes: um bloco por classe" lá).

/*
registrarClasse("classeExemplo", {
    nome: "Classe de Exemplo",
    dadoDeVida: 8,
    salvaguardas: ["destreza", "sabedoria"],
    pericias: {
        limite: 2,
        opcoes: ["acrobacia", "atletismo", "furtividade", "percepcao"]
    },
    subclasses: [
        { valor: "caminhoUm", nome: "Caminho Um" },
        { valor: "caminhoDois", nome: "Caminho Dois" }
    ],

    // opcional: só se a Melhoria de Atributo fugir de 4, 8, 12, 16 e 19
    niveisDeEscolha: [4, 8, 12, 16, 19],

    // opcional: só para classe que conjura magias
    // tipo: "completo", "meio" (espaços desde o nível 1) ou "pacto"
    conjuracao: { atributo: "inteligencia", tipo: "meio" }
})
*/
