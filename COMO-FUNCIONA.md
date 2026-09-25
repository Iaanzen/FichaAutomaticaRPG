# Como esta aplicação funciona

Guia do código, escrito para quem vai mexer nele. Não é documentação de uso — é
a explicação de **como** e **por quê** cada peça existe.

Leia na ordem se for a primeira vez. Depois use como referência.

---

## 1. A ideia central

O app é feito de **arquivos `<script>` clássicos**, sem framework, sem
empacotador, sem etapa de build. Você abre um `.js`, edita, recarrega a página,
pronto.

Isso tem uma consequência que explica quase tudo no código: **todos os arquivos
compartilham o mesmo espaço de nomes global**. Quando `regras.js` declara

```js
const ATRIBUTOS = ["forca", "destreza", ...]
```

essa constante fica visível para `ficha.js`, `magias.js` e todos os outros. Não
existe `import` nem `export`. A ordem das tags `<script>` no HTML **é** a ordem
de carregamento, e um arquivo só enxerga o que foi declarado antes dele.

Por isso a ordem nos HTMLs não é decorativa. Em `ficha.html`:

```
firebase (3 arquivos)  → o SDK do Google
firebase-config.js     → qual projeto Firebase usar
auth.js                → login e perfil
conteudo.js            → conteúdo liberado por conta
regras.js              → todas as regras de D&D
conteudo-extra.js      → conteúdo fora do SRD (só na sua máquina)
ficha-comum.js         → o que a ficha e o wizard compartilham
armazenamento.js       → onde as fichas moram
ficha.js               → esta página
```

`conteudo-extra.js` vem **depois** de `regras.js` porque ele chama
`registrarClasse()` e `registrarSubclasse()`, que `regras.js` define. E
`ficha.js` vem por último porque usa tudo.

---

## 2. As três camadas

Esta é a regra de organização mais importante do projeto:

| Camada | Arquivo | Conhece a tela? | Papel |
|---|---|---|---|
| Regras | `regras.js` | **Não** | Tabelas e contas de D&D |
| Compartilhado | `ficha-comum.js` | Sim | O que ficha e wizard têm em comum |
| Página | `ficha.js`, `magias.js`, … | Sim | Uma tela específica |

**`regras.js` nunca toca no DOM.** Nenhum `document.getElementById`, nenhum
`innerHTML`. Ele recebe números e devolve números.

```js
// regras.js — pura conta
function cdDeMagia(proficiencia, modificador) {
    return 8 + proficiencia + modificador
}
```

Isso não é preciosismo: é o que torna o projeto testável. Os testes carregam
`regras.js` num ambiente **sem navegador** e verificam as contas direto. Se as
regras estivessem misturadas com a tela, cada teste precisaria simular a página
inteira.

Quando você for acrescentar algo, a pergunta é sempre: **isso é uma regra de
D&D ou é tela?** Regra vai para `regras.js`. Tela vai para a página.

---

## 3. Como uma página nasce

Toda página interna segue o mesmo roteiro. Vamos seguir `ficha.html` do começo:

**Passo 1 — os scripts carregam.** Todo o código de topo roda: os `const` que
pegam elementos da tela (`const pvAtualEL = document.getElementById("pv-atual")`),
os `addEventListener`, as funções sendo declaradas. Nada de personagem ainda.

**Passo 2 — a corrente de inicialização.** No fim de `ficha.js`:

```js
Auth.protegerPagina()
    .then(Conteudo.carregar)
    .then(function () {
        return Armazenamento.carregarFicha(idDaUrl)
    })
    .then(function (encontrada) {
        personagem = encontrada
        iniciar()
        aplicarModoLeitura()
    })
```

Leia como uma fila de espera:

1. **`Auth.protegerPagina()`** — pergunta ao Firebase quem está conectado. Sem
   ninguém, manda para `login.html`. Com alguém, garante que existe o perfil
   dessa conta no banco.
2. **`Conteudo.carregar()`** — busca os pacotes de conteúdo liberados para essa
   conta e registra as classes/subclasses. Precisa vir **antes** da tela montar,
   senão o select de classe não teria o Pugilista.
3. **`Armazenamento.carregarFicha(id)`** — busca a ficha no banco.
4. **`iniciar()`** — só agora a tela é preenchida.

**Por que tanta cerimônia?** Porque cada passo desses **espera resposta**. O
banco não responde na mesma linha em que é chamado. Essa é a diferença entre o
app de hoje e o de antes: quando tudo morava no navegador, a leitura era
instantânea e o código rodava de cima para baixo.

Esse é o motivo de existir a função `iniciar()` em `ficha.js`, `levelup.js` e
`magias.js`: ela embrulha tudo que só pode acontecer **depois** da ficha chegar.

---

## 4. `regras.js` — o coração (4.100 linhas)

É o maior arquivo e o mais importante. Está dividido em seções marcadas com
comentários `/* ---------- Nome ---------- */`. Para navegar, procure por esses
marcadores.

### O que tem lá dentro

**Tabelas de conteúdo** — raças, sub-raças, perícias, talentos, armas,
armaduras, condições, moedas, e as **12 classes do SRD**.

**Contas puras** — modificador de atributo, bônus de proficiência, PV por
nível, CD de magia, CA, ataque com arma, valor passivo, XP por nível.

**Um bloco por classe.** No fim do arquivo, cada classe é declarada assim:

```js
registrarClasse("barbaro", {
    nome: "Bárbaro",
    dadoDeVida: 12,
    salvaguardas: ["forca", "constituicao"],
    pericias: { limite: 2, opcoes: [...] },
    subclasses: [...],
    recursos: [...],
    habilidadesPorNivel: {...}
})
```

`registrarClasse()` pega esse bloco e **espalha** pelas tabelas que o resto do
código consulta: `dadoDeVidaPorClasse`, `subclassesPorClasse`,
`periciasPorClasse`, `conjuracaoPorClasse` e outras. Isso significa que para
acrescentar uma classe você escreve **um bloco só**, sem caçar dez tabelas
diferentes.

### A marca do SRD

Logo depois das 12 classes, tem isto:

```js
const CLASSES_SRD = Object.keys(CLASSES)
```

Uma fotografia do que existe **naquele ponto do arquivo**. Tudo que for
registrado depois — pelo `conteudo-extra.js` ou por um pacote do banco — é
conteúdo de fora. É assim que `classesForaDoSrd()` e `subclassesForaDoSrd()`
sabem o que pode ser enviado como pacote.

Para as subclasses a foto guarda o **texto inteiro** de cada uma, não só o
nome. Isso é necessário porque o Cavaleiro Arcano já existe no SRD **como
nome** — o pacote acrescenta a mecânica. Comparar só os nomes não notaria a
diferença.

---

## 5. `ficha-comum.js` — o que ficha e wizard compartilham

O wizard de criação e a ficha têm muitos campos iguais: os seis atributos, o
bônus do antecedente, as perícias, o PV, as salvaguardas. Esse arquivo é o que
os dois usam.

A função central é:

```js
function recalcularDerivados() {
    atualizarOpcoesBonus()
    atualizarModificadores()
    atualizarProficiencia()
    atualizarPericias()
    atualizarSalvaguardas()
    atualizarPontosDeVida()
    atualizarConjuracao()
    atualizarPassivas()
    // e avisa a página que os campos mudaram
    if (typeof aoAtualizarFicha === "function") aoAtualizarFicha()
}
```

Sempre que um atributo, a classe ou o nível mudam, isso roda e a tela inteira
se atualiza. Você quase nunca precisa atualizar um campo na mão.

**O gancho `aoAtualizarFicha()`** merece explicação. `ficha-comum.js` é usado
pelas duas páginas, mas só a ficha tem cadeado. Em vez de o arquivo
compartilhado saber do cadeado, ele **chama uma função se ela existir**. A
ficha define; o wizard não. É como uma página avisa a outra sem criar
dependência.

**`classesDoCalculo()`** é a ponte do multiclasse: quando a ficha carrega, ela
preenche `classesParaCalculo` com a lista de classes; o wizard deixa vazio e aí
a função monta uma lista de uma classe só, lida dos campos da tela.

---

## 6. As páginas, uma a uma

### `index.js` (91 linhas) — a lista de heróis
A mais simples. Carrega as fichas da conta, monta os cartões, cuida do botão de
excluir e mostra o aviso de migração se ainda houver fichas no navegador.

### `login.js` (84 linhas) — entrar e criar conta
Um formulário só, que alterna entre "Entrar" e "Criar conta". Também manda o
e-mail de troca de senha.

### `cadastro.js` (333 linhas) — o wizard
Criação em **8 etapas liberadas uma por vez**. `proximaEtapa` guarda qual etapa
o botão vai liberar; `etapaValida()` decide se pode avançar. Bônus do
antecedente e perícias têm validação própria; o resto usa a validação nativa do
HTML.

Todo personagem nasce no **nível 1**, sempre. Subir de nível é assunto da tela
dedicada, que tem as escolhas certas.

### `ficha.js` (2.123 linhas) — a ficha
A maior página. Também dividida em seções por comentário. Cuida de: descanso,
testes de morte, espaços de magia, recursos, concentração, habilidades, magias
equipadas, defesa, ataques, condições, inventário, moedas, personalidade,
anotações, XP e cadeado.

No fim está `salvarFicha()`, que copia os campos da tela para o objeto
`personagem` e manda para o armazenamento.

### `levelup.js` (972 linhas) — subir de nível
Uma tela por vez, um nível por vez. O conceito que organiza o arquivo é a
**classe em foco**: o jogador escolhe em qual classe o nível entra.

```js
function nivelNovo()      { return nivelAtualDaClasse() + 1 }  // nível DA CLASSE
function nivelTotalNovo() { return nivelTotalAtual() + 1 }     // nível do PERSONAGEM
```

Essa distinção percorre o arquivo inteiro. Melhoria de Atributo, subclasse,
recursos e habilidades olham o **nível da classe**. PV, bônus de proficiência e
espaços de magia olham o **personagem inteiro**.

### `magias.js` (852 linhas) — a aba de magias
Trabalha **uma classe de cada vez**. Busca a lista na API, aplica os limites de
truques e preparadas, controla equipar/remover e a regra de troca.

Distinção importante: o **círculo que a classe prepara** vem da tabela dela; os
**espaços de magia** são compartilhados e somados. Um Clérigo 1 / Mago 4 lança
com espaço de 3º círculo mas só prepara magias de 1º na lista de Clérigo.

### `admin.js` (359 linhas) — o painel do mestre
Envia os pacotes da sua máquina para o banco, libera conteúdo por conta e lista
as fichas dos jogadores.

---

## 7. O que uma ficha guarda

O personagem é um objeto JavaScript salvo como um documento no banco. Os
campos:

**Identidade** — `id`, `dono`, `nome`, `raca`, `subraca`, `racaPropria`,
`antecedente`, `alinhamento`, `classe`, `subclasse`, `nivel`, `classes`

**Atributos** — `forca` … `carisma` (valor base), `bonusAntecedente`,
`atributosTotais`, `modificadores`, `atributosAte30`

**Derivados salvos** — `bonusProficiencia`, `salvaguardas`, `pericias`,
`deslocamento`, `tracos`, `idiomas`, `idiomasExtras`, `talentos`

**Estado de jogo** — `pvMaximo`, `pvAtual`, `pvTemporario`, `dadosVidaGastos`,
`sucessosMorte`, `falhasMorte`, `espacosGastos`, `recursosGastos`,
`concentracao`, `condicoes`, `exaustao`, `xp`

**Equipamento** — `armadura`, `escudo`, `armas`, `itens`, `moedas`

**Magias** — `magiasEquipadas`, `trocasMagia`, `opcaoMagiasSubclasse`

**Texto livre** — `tracosPersonalidade`, `ideais`, `vinculos`, `defeitos`,
`anotacoes`

**Interface** — `fichaTravada`

### Por que guardar derivados?

`bonusProficiencia` dá para calcular a partir do nível, e `salvaguardas` a
partir da classe. Por que salvar? Porque a ficha às vezes precisa ser lida sem
recalcular tudo — o painel de mestre, por exemplo. É redundância proposital,
recalculada a cada salvamento.

### Os três campos "espelho"

`classe`, `subclasse` e `nivel` **não são a verdade** desde o multiclasse. A
verdade é `classes`:

```js
classes: [
    { classe: "guerreiro", nivel: 3, subclasse: "campeao" },
    { classe: "ladino",    nivel: 1, subclasse: "" }
]
```

`classe` e `subclasse` espelham a **primeira** (a classe inicial), e `nivel`
guarda o **total** (4 no exemplo). Eles continuam existindo para o resto do app
funcionar sem ser reescrito. Uma ficha antiga sem `classes` é convertida na
leitura por `classesDoPersonagem()`.

---

## 8. Onde as fichas moram — `armazenamento.js`

Este arquivo é uma **costura**: o único lugar do app que sabe onde os dados
ficam. Ele expõe cinco funções:

```js
Armazenamento.carregarFichas()      // todas as da conta
Armazenamento.carregarFicha(id)     // uma
Armazenamento.gravarFicha(ficha)    // cria ou substitui
Armazenamento.excluirFicha(id)
Armazenamento.novoId()
```

Nenhuma outra página menciona Firestore. Foi construído assim de propósito:
primeiro a camada foi criada ainda usando o navegador, e depois **só ela**
mudou para o banco. As cinco páginas não foram tocadas na migração.

**Tudo devolve Promise**, mesmo quando a resposta é imediata, porque o banco
responde com espera.

**O `id` é texto**, não número. O Firestore usa id de documento em texto. Ficha
antiga com id numérico é convertida na leitura.

**Uma ficha por gravação.** No banco é um documento por ficha, não uma lista
gigante.

**Modo offline** — `enablePersistence()` faz o Firestore guardar uma cópia
local e sincronizar quando a internet volta. É o que faz o app funcionar na
mesa quando a rede do lugar cai.

---

## 9. Login e permissões

Três arquivos e um que não é código.

### `firebase-config.js`
A configuração do projeto. **É pública por natureza** — diz qual projeto usar,
não dá acesso a nada. Vai para o GitHub sem problema.

### `auth.js`
- `Auth.protegerPagina()` — a guarda. Esconde a página, pergunta quem está
  conectado, redireciona se não houver ninguém, e garante o perfil.
- `Auth.garantirPerfil()` — cria `perfis/{uid}` no primeiro acesso, sempre com
  a lista de pacotes **vazia**.
- `Auth.RECADOS` — traduz os erros do Firebase, que vêm em inglês com código
  técnico.

### `conteudo.js`
Busca no banco os pacotes que a conta pode ver e registra as classes e
subclasses **antes** da tela montar.

### `firestore.rules` — a segurança de verdade

**Este é o arquivo que protege os dados.** Não o JavaScript. Qualquer pessoa
pode abrir o console do navegador e chamar o banco direto; esconder botão não
protege nada.

```
allow read: if conectado() && (resource.data.dono == request.auth.uid || admin());
```

As decisões que estão codificadas ali:

- **Cada um lê só as próprias fichas.** O administrador também lê, mas **não
  escreve** — o painel de mestre mostra, não altera.
- **A conta cria o próprio perfil, mas com `pacotes` vazio.** Sem essa
  restrição, qualquer pessoa se cadastraria já liberando conteúdo pago para si
  mesma. Esse é o buraco óbvio do desenho, e ele é fechado no banco.
- **O administrador é um uid escrito no arquivo**, não um campo do banco. Se
  fosse um campo, alguém poderia se promover editando um documento.
- **Um pacote só é entregue a quem o tem no perfil**, conferido com um `get()`
  dentro da própria regra.

As regras são publicadas com `firebase deploy --only firestore`.

---

## 10. Conteúdo fora do SRD

O SRD (System Reference Document) é a parte de D&D liberada sob Creative
Commons. Ele tem as 12 classes, mas **só uma subclasse por classe**. Cavaleiro
Arcano, Trapaceiro Arcano, Necromante, Domínio da Morte, Pugilista e Artífice
**não estão nele**.

Como o repositório e o site são públicos, esse conteúdo não pode estar em
nenhum dos dois. O caminho que ele faz:

```
conteudo-extra.js   (só na sua máquina, no .gitignore)
       ↓  tela de mestre: "Enviar os pacotes desta máquina"
coleção "pacotes"   (no banco)
       ↓  conteudo.js, se o perfil da conta tiver o pacote
app do jogador
```

O bloco vai para o banco como **texto JSON** (`blocoJson`). Isso não é
capricho: o Firestore **não aceita array dentro de array**, e a tabela de
espaços de magia por nível é exatamente isso. Guardar o JSON inteiro como
string contorna essa e qualquer outra restrição de formato — e o app nunca
consulta dentro do bloco, só o lê inteiro.

### Acrescentar uma subclasse de fora

```js
registrarSubclasse("clerigo", {
    valor: "dominioMorte",
    nome: "Domínio da Morte",
    magias: { porNivel: { 3: [...], 5: [...] } },
    habilidadesPorNivel: { 3: [...], 6: [...] }
})
```

Se a subclasse já existir no SRD só com o nome, o bloco **completa** em vez de
duplicar.

### A questão dos níveis

Conteúdo de 2014 costuma dar habilidades em níveis que não batem com 2024. O
Clérigo de 2014 escolhia o domínio no nível 1; aqui a subclasse é escolhida no
nível 3. Então as habilidades de nível 1 e 2 são movidas para o 3 — senão
nunca apareceriam. O Domínio da Vida, que veio pronto da API, já faz isso.

---

## 11. Multiclasse

Foi a mudança mais invasiva do projeto. O que ela alterou:

| O que | Como conta |
|---|---|
| PV | Dado cheio só no nível 1 da classe inicial; média no resto |
| Bônus de proficiência | Nível **total** |
| Salvaguardas e perícias | Só da **classe inicial** |
| Espaços de magia | Soma dos níveis de conjurador, tabela de conjurador completo |
| Magia de Pacto (Bruxo) | Separada, com contagem própria |
| Recursos e habilidades | Por nível de **cada** classe |
| CA e ataques | O melhor cálculo entre as classes |
| Dados de vida | Um grupo por classe (`3d10 + 2d8`) |

As funções ficam na seção `Multiclasse` de `regras.js` e quase todas recebem a
lista `classes` em vez de uma classe só.

**Nível de conjurador**: classe completa conta o nível inteiro, meio conjurador
conta metade, subclasse conjuradora conta um terço, Pacto não conta.

---

## 12. O cadeado

A ficha **abre travada**. O cadeado protege a **construção** do personagem, não
o estado dele em jogo.

A lista em `ficha.js` enumera o que **trava**:

```js
const IDS_DE_CONSTRUCAO = ["nome", "classe", "raca", "antecedente", ...]
```

**Enumerar o que trava, e não o que fica livre, é proposital.** Se um campo
novo aparecer e ninguém classificar, ele nasce editável. O erro cai para o lado
seguro: nada pior que um campo de PV bloqueado no meio da sessão.

Continuam sempre editáveis: PV, testes de morte, recursos, espaços, condições,
concentração, armadura, armas, inventário, moedas, XP e **anotações**.

---

## 13. Os testes

Ficam na pasta de rascunho, fora do repositório. São **26 arquivos**, de três
tipos:

**Testes de regra** (a maioria) — carregam `regras.js` num ambiente sem
navegador e conferem as contas:

```js
const r = vm.runInContext(ler("regras.js") + `;({ pontosDeVida, espacosDeMagia })`, ctx)
confere("Mago 5 tem 4/3/2", r.espacosDeMagia("mago", 5), [...])
```

**Testes de página** — rodam o `ficha.js`/`levelup.js`/`magias.js` **de
verdade** contra uma tela simulada e um armazenamento falso. Alguns usam a API
real.

**Um teste estático** (`testar-cadeado.js`) — lê o HTML e o JS como texto e
confere que **todo campo da ficha foi classificado** como construção ou jogo.
Esse já pegou três campos que eu tinha esquecido.

Para rodar:

```bash
node testar-regras.js "C:/Users/.../FichaAutomaticaRPG"
```

Antes de qualquer publicação vale rodar todos.

---

## 14. Receitas

### Acrescentar uma classe do SRD
Um bloco `registrarClasse()` no fim de `regras.js`.

### Acrescentar conteúdo fora do SRD
Um bloco em `conteudo-extra.js`, depois enviar pela tela de mestre.

### Acrescentar um campo na ficha
1. O `<input>` em `ficha.html`
2. Ler no `salvarFicha()` e escrever no carregamento, em `ficha.js`
3. Decidir se é construção (entra em `IDS_DE_CONSTRUCAO`) ou jogo
4. Rodar `testar-cadeado.js` — ele vai reclamar se você esquecer o passo 3

### Mudar uma regra de D&D
Só `regras.js`, e um teste que prove.

---

## 15. Publicar

```bash
python -m http.server 8000     # testar em localhost, num navegador de verdade
git add . && git commit -m "..."
git push                        # histórico no GitHub
firebase deploy --only hosting  # o site no ar
```

GitHub e Firebase são independentes: enviar para um não publica no outro.

---

## 16. Armadilhas conhecidas

**Abrir o HTML com dois cliques não funciona.** O login do Firebase exige
`http://`. Use `python -m http.server 8000`.

**O preview embutido do VS Code não funciona.** A leitura passa, a escrita fica
pendurada sem erro. Use um navegador de verdade. Isso já custou uma sessão
inteira de depuração.

**O Firestore não aceita array dentro de array.** E recusa lançando erro na
hora, não pela promessa — então um `.catch()` comum não pega.

**`conteudo-extra.js` não está no Git.** Se você trocar de máquina, ele não vem
junto. O backup dele hoje são os pacotes no banco.

**O site tem `no-cache`, o servidor local não.** Se uma mudança não aparecer em
`localhost`, recarregue com `Ctrl + Shift + R`.

**A API de magias é de terceiros.** Se ela cair, a aba de magias para para
todos. O que já está equipado continua na ficha, porque os dados são guardados
junto com o personagem.

---

## 17. Onde ficam as decisões

`ficha-rpg-requisitos-backlog.md` é a memória do projeto: cada sprint, cada
decisão de regra e o porquê. Quando você não lembrar **por que** algo foi feito
de certo jeito, é lá que está.
