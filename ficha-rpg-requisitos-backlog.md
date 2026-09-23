# Ficha de RPG Automatizada — D&D 5e

**Projeto pessoal — mestre e jogadores da campanha**
**Escopo:** apenas D&D 5e; multiclasse entrou no escopo em 23/09/2026 (seção 3.16)
**Armazenamento:** localStorage (sem login/servidor por enquanto)

---

## 1. Requisitos Funcionais (RF)

### 1.1 Identidade e Perfil
- RF01: Cadastrar nome, raça (e sub-raça), classe (e subclasse), antecedente e alinhamento.
- RF02: Selecionar/editar nível do personagem (1–20).
- RF03: Registrar traços de personalidade, ideais, vínculos e defeitos (texto livre). *(Feito: quatro caixas de texto na ficha, salvas com ela.)*
- RF04: Registrar idiomas conhecidos e proficiência com ferramentas/instrumentos.
- RF05: Calcular percepção passiva automaticamente (10 + mod. Sabedoria + proficiência, se houver). *(Feito, e ampliado: Percepção, Investigação e Intuição passivas, como na ficha de 2024; o talento Observador soma +5 em Percepção e Investigação.)*

### 1.2 Atributos e Modificadores
- RF06: Preencher os 6 atributos (Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma).
- RF07: Calcular automaticamente o modificador de cada atributo.
- RF08: Calcular automaticamente o bônus de proficiência conforme o nível.
- RF09: Ao subir para um nível em que a classe permite escolha, exibir uma tela/aba dedicada de "level up" com todas as opções disponíveis lado a lado (inspirado no fluxo do Baldur's Gate 3):
  - Melhoria de Atributo (ASI);
  - Talento;
  - Para classes conjuradoras: aprender nova magia e/ou trocar uma magia já conhecida (quando a classe permitir essa troca no level up).
  - *(ASI e Talento feitos no Sprint 4 — ver seção 3.4. Magias feitas no Sprint 5b: o level up mostra o que muda nas magias e libera as trocas; a escolha em si é feita na aba de magias — ver seção 3.8.)*

### 1.3 Raça e Traços
- RF10: ~~Aplicar automaticamente os bônus de atributo da raça/sub-raça escolhida.~~ **Revogado pela seção 3.1** — nas regras 2024 o bônus vem do antecedente. O que continua valendo: o select de sub-raça deve ser preenchido dinamicamente com as opções corretas conforme a raça escolhida (ex: Anão → Anão da Colina / Anão da Montanha). *(Feito.)*
- RF11: Exibir os traços passivos da raça (ex: visão no escuro, resistência a veneno).
- RF12: Aplicar deslocamento (velocidade) padrão da raça, editável se algo o alterar.

### 1.4 Classe e Progressão
- RF13: Exibir as habilidades de classe desbloqueadas em cada nível (ex: Fúria no nível 1 do Bárbaro).
- RF14: Controlar pontos de experiência (XP) e sinalizar quando o personagem pode subir de nível.
- RF15: Ao subir de nível, recalcular automaticamente PV, bônus de proficiência, espaços de magia e habilidades novas.

### 1.5 Perícias e Proficiências
- RF16: ~~Conceder automaticamente as perícias fixas do antecedente.~~ **Revisto:** como o antecedente é texto livre (seção 3.1), não há tabela de onde tirar perícias fixas. A escolha de perícias é **manual**, dentro do limite da classe (RF17).
- RF17: Apresentar a lista de perícias elegíveis pela classe, com limite de escolhas definido pela classe.
- RF18: Destacar visualmente as perícias já selecionadas e impedir escolha além do limite.
- RF19: Marcar proficiência em salvaguardas (definidas pela classe).
- RF20: Calcular automaticamente o bônus de cada perícia/salvaguarda (modificador + proficiência, se aplicável).

### 1.6 Pontos de Vida e Descanso
- RF21: Calcular PV inicial (dado de vida da classe + mod. Constituição).
- RF22: Aumentar PV automaticamente a cada nível (média do dado ou rolagem, a definir).
- RF23: Registrar descanso curto (recupera dados de vida gastos, alguns recursos de classe) e descanso longo (recupera PV total, espaços de magia, demais recursos).
- RF24: Gerenciar testes de morte (death saves) quando PV chega a 0.

### 1.7 Magias
- RF25: Exibir espaços de magia (spell slots) por nível de magia, conforme a progressão da classe conjuradora.
- RF26: Listar magias conhecidas/preparadas do personagem, numa **aba dedicada de gerenciamento de magias** (separada da ficha principal).
- RF27: Descontar espaço de magia ao usar uma magia e recuperar espaços por descanso, respeitando a regra oficial:
  - a maioria das classes recupera espaços de magia apenas em **descanso longo**;
  - exceção: **Bruxo (Warlock)** recupera espaços de magia em **descanso curto**.
- RF28: Controlar concentração (apenas uma magia de concentração ativa por vez).
- RF29: Impor o **limite de magias conhecidas/preparadas por nível**, definido pela progressão de cada classe — a aba de gerenciamento de magias deve impedir selecionar mais magias do que esse limite permite.
- RF30: Permitir a **troca de magias preparadas** seguindo a regra oficial: disponível após descanso longo para a maioria das classes preparadoras (Clérigo, Druida, Mago); para classes de magias conhecidas fixas (ex: Bruxo, Feiticeiro), a troca ocorre normalmente apenas no level up (RF09), não em descanso. **Revisto:** seguir a regra de **2024** (ver seção 3.6).

### 1.8 Recursos de Classe
- RF31: Gerenciar recursos próprios de cada classe (Fúria, Pontos de Ki, Pontos de Feitiçaria, Inspiração de Bardo, Dados Superiores etc.), com contagem de uso e recuperação por descanso.

### 1.9 Combate
- RF32: Calcular iniciativa (mod. Destreza).
- RF33: Calcular Classe de Armadura (CA) com base na armadura equipada + mod. Destreza (respeitando limites por tipo de armadura).
- RF34: Registrar armas e calcular bônus de ataque/dano automaticamente.
- RF35: Gerenciar condições ativas (envenenado, atordoado, etc.) como marcações na ficha.

### 1.10 Inventário e Economia
- RF36: Gerenciar inventário de itens.
- RF37: Controlar moedas (PC, PP, PO, PE, PL).

### 1.11 Gestão de Fichas
- RF38: Criar, listar, editar e excluir personagens (CRUD completo).
- RF39: Ver detalhes de um personagem em página própria.
- RF40: Exportar/importar ficha (backup, já que os dados vivem só no navegador).
- RF41: Duplicar uma ficha existente (útil pra testar variações de build).

### 1.12 Modos de Descanso
- RF42: Implementar um "Modo Descanso Curto" que destaca na interface as ações disponíveis nesse momento (ex: gastar dados de vida, recuperar espaços de magia se for Bruxo, usar recursos de classe que recuperam em descanso curto).
- RF43: Implementar um "Modo Descanso Longo" que destaca as ações equivalentes (recuperar PV total, espaços de magia, trocar magias preparadas conforme RF30, resetar recursos de classe).
- RF44: Fora desses modos, a interface funciona normalmente (modo padrão de jogo/exploração/combate).

---

## 2. Requisitos Não Funcionais (RNF)

- RNF01: Persistência local via localStorage, funcionando sem internet. **Revisto (Sprint 5):** a aba de magias consulta a API ao vivo e precisa de conexão. O resto do app, inclusive as magias já equipadas na ficha, continua funcionando offline (ver seção 3.6).
- RNF02: Interface rápida de usar durante a sessão — poucos cliques até a informação que o jogador precisa no meio do combate.
- RNF03: Compatibilidade com os navegadores mais comuns (Chrome, Firefox).
- RNF04: Código organizado de forma que novas regras (magias, classes, itens) possam ser adicionadas sem reescrever tudo — já que o projeto vai crescer por sprints.
- RNF05: Nenhuma perda de dados ao fechar/recarregar a aba (tudo salvo antes de qualquer navegação).

---

## 3. Fora de escopo por enquanto (Backlog futuro / Fase 2)

- ~~Multiclasse~~ — **entrou no escopo** (pedido em 23/09/2026); em andamento, ver seção 3.16
- Login e sincronização em servidor (múltiplos dispositivos)
- Painel de mestre (visão consolidada de todas as fichas dos jogadores)
- Talentos avançados com pré-requisitos complexos
- Descrições curtas de cada raça/sub-raça/classe exibidas na interface (nice-to-have)
- Separar raças/classes do livro base das expansões/homebrew nos selects, com filtro e busca
- Subclasses conjuradoras de classes não conjuradoras: **Cavaleiro Arcano** (Guerreiro) e **Trapaceiro Arcano** (Ladino). Usam a lista de magias do Mago e a progressão de espaços de um terço de conjurador. Implementar depois do Sprint 5, reaproveitando a aba de magias.

## 3.1 Mudança de regra — bônus de atributo (D&D 2024 / 5.5)

Decidido migrar do modelo 2014 (bônus fixos por raça) para uma variação do modelo 2024:
- Bônus de atributo NÃO vêm mais de raça/sub-raça.
- O jogador escreve um antecedente personalizado (texto livre) e distribui os bônus manualmente.
- O app obriga a forma da distribuição: **+2 em um atributo e +1 em outro**, OU **+1 em três atributos diferentes**.
- As tabelas bonusPorRaca / bonusPorSubRaca deixam de valer para cálculo de atributo (raça ainda dará traços/perícias em sprints futuros).

## 3.2 Wizard de criação de personagem (CONCLUÍDO)

Fluxo passo a passo (estilo criação de videogame), substituindo o formulário único. Etapas atuais, nesta ordem:

| # | Etapa | Observação |
|---|---|---|
| 1 | Nome | — |
| 2 | Classe | sem subclasse: o personagem nasce no nível 1 |
| 3 | Antecedente | texto livre |
| 4 | Bônus do antecedente | +2/+1 ou +1/+1/+1, validado pelo app |
| 5 | Raça | sub-raça preenchida dinamicamente |
| 6 | Atributos | array padrão; mostra total (base + bônus) e modificador |
| 7 | Perícias | dentro do limite da classe |
| 8 | Detalhes | alinhamento |

**Revisão (Sprint 4): o personagem só é criado no nível 1.** A etapa de Nível foi removida do wizard, junto com a escolha de subclasse. Criar direto num nível alto pulava as escolhas que a tela de level up faz (subclasse, Melhoria de Atributo, Talento, Dádiva Épica), então o personagem sobe um nível por vez pela ficha.

Regras de funcionamento decididas durante a sprint:
- Cada etapa desbloqueia a próxima; as seguintes ficam bloqueadas (`fieldset disabled`) até a atual ser válida.
- **A etapa anterior continua liberada.** Decisão de UX: corrigir algo já preenchido não deve exigir voltar. Por isso não existe botão "Voltar".
- Cada etapa tem uma breve explicação do que fazer.
- Validação por etapa antes de avançar, usando a validação nativa do HTML (`required`), mais a regra própria da etapa de bônus.
- Barra de navegação **fixa** no rodapé, para o botão nunca sair da tela.
- **Enter avança** de etapa; na última etapa o Enter salva.
- Ao liberar uma etapa, o foco vai automaticamente para o primeiro campo dela.
- Na etapa de bônus, fechada a distribuição, os atributos restantes travam até o jogador desfazer alguma escolha.
- O modificador (RF07) é calculado já com os bônus inclusos, e recalculado ao vivo.

Decisão de organização de código feita nesta sprint: as tabelas e regras de D&D ficam em **`regras.js`**, carregado pelo cadastro e pela ficha. Regra nova entra lá, nunca duplicada nas páginas — foi duplicação que deixou a página de edição desatualizada uma vez.

## 3.3 Cobertura de conteúdo e conteúdo próprio (implementar durante o projeto)

Ideias que não travam nenhum sprint específico, mas que precisam entrar em algum momento. As três primeiras são dívida de conteúdo: o app já tem a mecânica, falta o dado completo.

- **IDEIA01: Completar todas as subclasses.** Hoje a tabela `subclassesPorClasse` no cadastro.js tem só 2 a 3 subclasses por classe, um subconjunto criado pra destravar o fluxo do wizard. Preencher com a lista completa de cada uma das 12 classes.
- **IDEIA02: Completar todas as raças jogáveis.** Mesmo caso do select de raça: incluir todas as raças jogáveis, com as sub-raças correspondentes preenchidas dinamicamente (RF10).
- **IDEIA03: Cobertura mínima do livro oficial.** Estabelecer como meta que raças, sub-raças, classes e subclasses cubram pelo menos o conteúdo do livro base oficial, antes de qualquer expansão ou homebrew. Serve de critério de "pronto" para IDEIA01 e IDEIA02.
- **IDEIA04: Criar a própria raça (homebrew).** Permitir que o jogador defina uma raça própria em vez de escolher da lista: nome, deslocamento, traços passivos (texto livre) e perícias/idiomas concedidos. Nas regras 2024 a raça não dá bônus de atributo, então a raça personalizada não afeta a distribuição +2/+1 ou +1/+1/+1 da seção 3.1. Depende de IDEIA03 estar fechada, para que o conteúdo oficial e o homebrew fiquem distinguíveis no select (ver item correspondente na seção 3).
- **IDEIA05: Cadeado de edição na ficha.** Durante a sessão o jogador fica com a ficha aberta o tempo todo e pode alterar um campo sem querer — um clique no select de classe, uma rolagem do mouse sobre um campo numérico. Um botão de cadeado no topo da ficha alterna entre **travada** e **liberada**: travada, os campos ficam somente leitura; liberada, a ficha volta a ser editável. A ficha deve **abrir travada**, já que em jogo ler é o uso normal e editar é a exceção, e o estado deve ser lembrado por personagem. Atenção: campos que mudam durante o jogo (PV atuais, PV temporários, testes de morte, usos de recursos de classe) precisam continuar editáveis mesmo com o cadeado fechado. O cadeado protege a **construção** do personagem, não o estado dele em jogo.
- **IDEIA06: Limite de 20 nos atributos e opção +2 que some ao ser usada.** *(Feito no Sprint 5.5 — ver seção 3.9.)*
  - **Limite de 20** no valor total dos atributos (base + bônus) em três lugares: na **ficha**, no **wizard** e no **level up**.
  - **Distribuição de pontos:** quando o jogador escolher **+2** num atributo, a opção +2 **some** dos outros atributos, deixando claro que agora só dá para escolher +1. Vale para o bônus do antecedente (wizard e ficha) e para a Melhoria de Atributo do level up.
  - Pontos a decidir na implementação:
    - **Dádiva Épica (nível 19):** a regra de 2024 permite passar de 20, até 30. Hoje a ficha aceita valor base até 30 por causa dela. O limite de 20 precisa abrir essa exceção.
    - **Melhoria de Atributo:** +2 num atributo já fecha a escolha (+2 num atributo *ou* +1 em dois). Ao escolher +2, os outros atributos não têm mais opção nenhuma, e não só a de +2.
    - **Hoje:** o bônus do antecedente já trava os atributos restantes quando a distribuição fecha, e o level up já não oferece valores que passem de 20. O que falta é a opção +2 sumir no meio da escolha e o limite na ficha e no wizard.
- **IDEIA07: Aviso para avançar no wizard.** *(Feito no Sprint 5.5 — ver seção 3.9.)* Quando a etapa atual estiver completa, mostrar um **pop-up em forma de notificação** avisando que o jogador deve apertar **Próximo** ou **Enter** para ir à próxima etapa.

## 3.4 Level up dedicado (CONCLUÍDO — Sprint 4)

Tela própria (`levelup.html`), aberta pelo botão "Subir de Nível" no topo da ficha. Sobe um nível por vez.

O que a tela faz:
- Mostra nível atual → novo e o que o nível traz: PV máximo (antes → depois), dados de vida, bônus de proficiência.
- Nos níveis de escolha (4, 8, 12, 16, 19; Guerreiro também 6 e 14; Ladino também 10), mostra **Melhoria de Atributo** e **Talento** lado a lado. A coluna de **Magias** está reservada para o Sprint 5.
- Melhoria de Atributo: +2 num atributo ou +1 em dois, sem passar de 20 (contando o bônus do antecedente).
- Talento: lista de 10 talentos com descrição; talento já escolhido não se repete.
- Nível sem escolha: só confirma.
- Personagem sem subclasse, chegando ao nível 3 ou acima, escolhe a subclasse na própria tela.

Regras decididas nesta sprint:
- **O nível na ficha é somente leitura.** Só muda pela tela de level up, para ninguém pular a escolha de ASI/Talento.
- **Subir de nível não cura:** só o PV máximo aumenta. O PV atual fica como estava e sobe com descanso ou cura (ex: 36/36 → 36/44).
- Aumento de Constituição e o talento **Robusto** (+2 PV por nível) valem para todos os níveis, inclusive os já passados. A prévia de PV acompanha a escolha ao vivo.
- Os talentos escolhidos aparecem num bloco próprio na ficha. Só o Robusto tem efeito mecânico por enquanto; os outros dependem de blocos futuros (iniciativa no Sprint 7, magias no Sprint 5, percepção passiva no RF05).
- **Nível 19 — Dádiva Épica (regra 2024):** além da Melhoria de Atributo e dos talentos comuns, a tela oferece 12 Dádivas Épicas. A dádiva dá +1 num atributo, que pode passar de 20 até 30 (algumas limitam o atributo). A Dádiva da Fortitude soma +40 PV máximos; as demais são texto por enquanto.
- Ainda falta: as habilidades de classe de cada nível (RF13). O cadeado de edição (IDEIA05) continua necessário, porque os atributos base ainda podem ser editados à mão na ficha.

## 3.5 Mistura 2014 + 2024 (decisão consciente)

O app é para as campanhas do próprio mestre, então não precisa seguir uma edição pura. Regra adotada:
- **Conteúdo que saiu em 2024 continua disponível** (ex: Meio-Elfo, Meio-Orc, sub-raças de Anão e Halfling).
- **Nomes que mudaram usam o de 2024.** Ex: Caminho do Guerreiro Totêmico → Caminho do Coração Selvagem; Escola de Evocação → Evocador; Caminho da Mão Aberta → Guerreiro da Mão Aberta; Linhagem Dracônica → Feitiçaria Dracônica. Ao renomear, só o nome muda; o valor salvo continua o mesmo, para fichas antigas não quebrarem.
- **Conteúdo novo de 2024 foi acrescentado:**
  - Raças: Aasimar, Golias (ancestralidade gigante como sub-raça) e Orc.
  - Tiefling: os legados de 2024 (Abissal, Ctônico, Infernal) viraram sub-raças. A resistência e as magias saíram da raça base e ficaram no legado; o Tiefling de 2014 equivale ao Legado Infernal.
  - Subclasses: uma ou duas novas por classe (ex: Caminho da Árvore do Mundo, Colégio da Dança, Patrono Celestial, Domínio da Trapaça, Círculo das Estrelas, Feitiçaria Aberrante, Guerreiro Psíquico, Lâmina da Alma, Adivinho, Guerreiro da Misericórdia, Juramento da Glória, Perseguidor Sombrio).
- **Regras de 2024 aplicadas:** bônus de atributo pelo antecedente (seção 3.1), subclasse no nível 3 para todas as classes, Dádiva Épica no nível 19 (seção 3.4) e **descanso longo devolve todos os dados de vida gastos**.

## 3.6 Magias — decisões do Sprint 5 (planejamento)

**Como vai funcionar:**
- Uma **aba só para gerenciar magias** (`magias.html`), aberta pela ficha.
- Vale para **todas as classes conjuradoras**: Bardo, Bruxo, Clérigo, Druida, Feiticeiro, Mago, Paladino e Patrulheiro.
- A lista mostra **só as magias da classe do personagem, até o círculo que o nível dele permite**.
- O jogador **equipa** magias até o limite da classe e do nível. As equipadas **aparecem na ficha**.

**Fonte das magias: D&D 5e API ao vivo** (`dnd5eapi.co`, versão 2024 / SRD 5.2), sem baixar os dados para o projeto. Testado em 15/09/2026:
- Aceita chamadas do navegador, inclusive com o app aberto direto do arquivo (CORS liberado).
- GraphQL em `/graphql/2024` busca as magias de uma classe numa requisição só (ex: 124 do Druida).
- 339 magias no total, com círculo, classes, concentração, ritual, tempo, alcance, duração, componentes e descrição (`description`).
- Tempo medido: lista do Druida sem descrição 0,6 s (12 KB); com descrição 3,8 s (100 KB).
- Limite de 100 requisições por janela curta.
- Só cobre o conteúdo gratuito (SRD): algumas magias do livro completo não existem na API.
- Exige crédito ao conteúdo SRD (licença CC-BY) se o app for publicado.

**Uso da API decidido:**
- A lista vem **sem descrição**, para abrir rápido; a descrição é buscada ao abrir uma magia.
- Ao equipar, a ficha salva **código, nome, círculo e concentração** da magia, para funcionar sem internet ou com a API fora do ar. Só a aba de magias depende de conexão.

**Idioma: as magias ficam em inglês, como vêm da API.**
- **Revisto no passo 3 do 5b:** a tradução em camadas chegou a ser feita (campos fixos por dicionário, distâncias em metros, nomes num arquivo próprio), mas foi **retirada**. Com só parte das magias traduzida, a tela ficava misturada, e traduzir tudo seria trabalho demais para o ganho.
- Nome, escola, tempo, alcance, duração e descrição aparecem em inglês, com as distâncias em pés. Os rótulos do app ("Tempo", "Alcance", "Magias Preparadas") continuam em português.
- A única limpeza feita no dado: a API gruda "Component: V, S" no alcance de algumas magias, e isso é removido (os componentes têm linha própria).
- Descartado também: tradutor automático ao vivo (chave de acesso exposta no navegador, custo, lentidão e erro em termos do jogo).
- Se um dia a tradução voltar: não copiar descrições do livro oficial em português; traduzir o texto da API é permitido mantendo o crédito.

**Decidido também:**
- **Regra de troca de magias: 2024** (substitui o texto de 2014 do RF30). Conferida no texto oficial de cada classe, pela API, em 18/09/2026:

  | Classe | Troca de magias | Troca de truques |
  |---|---|---|
  | Clérigo, Druida | todas, no descanso longo | 1, ao subir de nível |
  | Mago | todas, no descanso longo (do grimório) | 1, no descanso longo |
  | Paladino, Patrulheiro | 1, no descanso longo | não têm truques |
  | Bardo, Feiticeiro, Bruxo | 1, ao subir de nível | 1, ao subir de nível |

  **Implementação (passo 4 do 5b), com a troca travada pela regra:**
  - Descanso longo e level up **liberam** as trocas da classe, que ficam guardadas na ficha até serem usadas. Não acumulam: dois descansos seguidos continuam valendo 1 troca.
  - Na aba de magias, **tirar** uma magia só é possível com troca liberada; **preencher vaga livre** é sempre permitido. Troca de 1 é gasta ao tirar a magia; "todas" dura até o jogador clicar em "Concluir troca".
  - Magia equipada na mesma visita à aba pode ser desfeita sem gastar troca (correção de engano).
  - Os botões "Magias" e "Subir de Nível" da ficha passaram a **salvar a ficha antes de sair**, senão a troca liberada pelo descanso se perdia.
  - Limitação: o grimório do Mago não é controlado; ele troca entre todas as magias de Mago da API.
- **Cavaleiro Arcano e Trapaceiro Arcano ficam para depois** (item registrado na seção 3).
- **Sprint dividido em 5a e 5b** (ver tabela da seção 5), entregue em passos pequenos e testáveis.
- **Sem internet:** a aba de magias mostra só o aviso "sem conexão, tente de novo"; a ficha continua funcionando com as magias já equipadas.

## 3.7 Magias em jogo (CONCLUÍDO — Sprint 5a)

Entregue em quatro passos, cada um testado antes do seguinte:
1. **Conjuração:** atributo de cada classe (regra 2024), CD de magia (8 + proficiência + modificador) e bônus de ataque mágico, num bloco próprio da ficha. Classe que não conjura mostra o bloco vazio.
2. **Espaços de magia (RF25):** tabelas de conjurador completo, meio conjurador (com os 2 espaços do nível 1, novidade de 2024) e Magia de Pacto do Bruxo. Na ficha, uma linha de bolinhas por círculo para marcar os gastos. O level up mostra os espaços novos do nível.
3. **Descanso (RF27):** o longo recupera os espaços de toda classe conjuradora; o curto recupera a Magia de Pacto do Bruxo.
4. **Concentração (RF28):** uma magia por vez, com aviso ao trocar; ao sofrer dano aparece a salvaguarda de Constituição com a CD de 2024 (10 ou metade do dano, até 30); cair a 0 PV encerra.

Conferido em 16/09/2026: as três tabelas de espaços batem com a API do D&D 5e em todos os 20 níveis, nas três progressões.

Decisões desta sprint:
- Os círculos dos testes de morte viraram um componente só, usado também pelos espaços de magia.
- O dano é medido quando o campo de PV perde o foco, e não a cada tecla, senão apagar o número para digitar outro contaria como cair a 0 PV.
- A magia em concentração é digitada à mão por enquanto; no 5b passa a ser escolhida entre as magias equipadas.
- **Limites de magias:** a API informa, por classe e nível, quantos truques e quantas magias preparadas o personagem tem (ex: Druida nível 5 = 3 truques e 9 preparadas). O app usa esses números em vez de manter mais uma tabela.

## 3.8 Aba de magias (CONCLUÍDO — Sprint 5b)

Entregue em cinco passos, cada um testado antes do seguinte (decisões na seção 3.6):
1. **Lista (RF26):** aba `magias.html`, aberta pela ficha. Busca na API as magias da classe do personagem, até o círculo que o nível alcança, com busca por nome e filtro por círculo. Sem conexão, mostra aviso e botão "Tentar de novo".
2. **Equipar (RF26, RF29):** limite de truques e de magias preparadas vindo da própria API, por classe e nível. A aba salva na hora. As magias equipadas aparecem na ficha, agrupadas por círculo, com (C) na concentração, e funcionam sem internet.
3. **Descrição:** clicar no nome abre tempo, alcance, duração, componentes, material e descrição. A tradução chegou a ser feita e foi retirada: as magias ficam em inglês (seção 3.6).
4. **Troca (RF30, regra 2024):** descanso longo e level up liberam as trocas de cada classe; a aba trava a remoção sem troca. O level up ganhou um bloco "Magias" em todo nível de classe conjuradora. Os botões "Magias" e "Subir de Nível" da ficha salvam antes de sair.
5. **Concentração ligada às magias:** o campo de concentração da ficha virou uma lista com as magias equipadas que pedem concentração, mais "Outra magia..." para o que não vem da classe (raça, talento, item mágico).

Limitações conhecidas:
- ~~Magias sempre preparadas das subclasses não entram na lista nem no limite~~ — resolvido no Sprint 6.5, passo 5 (seção 3.13).
- O grimório do Mago não é controlado.
- Só as 339 magias do SRD estão na API.
- Arcanas Místicas do Bruxo (6º ao 9º círculo) não são tratadas.

## 3.9 Distribuição de atributos e aviso do wizard (CONCLUÍDO — Sprint 5.5)

**IDEIA06 — opções que somem e teto de 20:**
- Uma regra só para as duas distribuições: bônus do antecedente (+2/+1 ou +1/+1/+1) e Melhoria de Atributo (+2 ou +1/+1). Cada select mostra só os valores que ainda cabem numa forma válida; o resto **some** da lista.
  - Antecedente: escolher +2 tira o +2 dos outros; com dois +1 escolhidos, o +2 também some (só sobra a forma +1/+1/+1).
  - Melhoria de Atributo: +2 num atributo já fecha a escolha, então os outros ficam só com "—"; com um +1, o +2 some dos outros.
  - O valor já escolhido nunca some: é por ele que o jogador desfaz a escolha.
- **Teto de 20** no total (base + bônus):
  - **wizard:** o array padrão (15 + 2 = 17) nunca chega lá, mas a regra vale igual;
  - **ficha:** o bônus não oferece o que passaria de 20, e o valor base ganha limite, que a validação cobra ao salvar;
  - **level up:** a Melhoria de Atributo já não oferecia o que passa de 20.
- **Exceção da Dádiva Épica:** só o atributo que recebeu o +1 da dádiva vai até 30. O level up agora registra qual foi (`atributosAte30`). Ficha antiga com dádiva e sem esse registro libera todos os atributos até 30, para não travar.

**IDEIA07 — aviso do wizard:**
- Quando a etapa atual fica completa, aparece um aviso flutuante acima da barra: "Etapa completa! Aperte Próximo ou Enter para continuar." Na última etapa o texto manda salvar.
- Aparece uma vez por etapa, some sozinho depois de 4 segundos e some também ao avançar.

## 3.10 Fase 2 — login, banco de dados e conteúdo por conta (PLANEJADO, no final do projeto)

**Decisão (19/09/2026):** o banco entra **no final**, quando o app estiver completo e for hospedado para a campanha. Não será criada antes uma camada de armazenamento (`armazenamento.js`), porque o site não será usado antes disso.
- Custo aceito: no sprint do banco, cada página que lê e grava fichas (hoje `index.js`, `cadastro.js`, `ficha.js`, `levelup.js`, `magias.js`) precisará ser adaptada, porque o banco responde com espera (assíncrono) e o localStorage não.

**Ordem decidida:** caminho B (Sprint 5.6) → Sprint 6 → Sprint 6.5 (RF13) → Sprint 7 → Sprint 8 → Fase 2a → Fase 2b → lançamento. O Sprint 6.5 fica depois dos recursos (várias habilidades gastam Moxie, Fúria, Ki) e antes do combate (que precisa saber o que cada nível dá, como Extra Attack). Ele cobre três mecânicas que aparecem tanto no Pugilista quanto nas classes oficiais: salvaguarda ganha por nível (Fancy Footwork; Monge no 14, Ladino no 15), atributo com teto maior (Peak Physical Condition; Bárbaro 2024 no 20) e magias concedidas pela subclasse (Hand of Dread; Domínios do Clérigo, Juramentos do Paladino). Para as classes oficiais, a API tem os nomes das habilidades por nível. O banco vem depois das funcionalidades para pegar o formato final da ficha. O **Sprint 9 foi juntado à Fase 2**: CRUD e duplicar ficha já feitos no banco; exportar ficha fica só como backup.

**Como vai funcionar (o app pode virar público):**
- **Cadastro aberto:** qualquer pessoa cria a conta e usa o app com o **conteúdo gratuito (SRD)**.
- Cada pessoa vê **só as próprias fichas**, em qualquer aparelho.
- **Permissão manual do mestre:** o dono do app (conta administradora) libera **pacotes de conteúdo** (Artífice, Pugilista e outros fora do SRD) para contas específicas — os amigos da campanha. Ex: só o jogador do Pugilista recebe essa classe; o público nem sabe que ela existe.
  - Pela **tela de administração** (visível só para a conta administradora): cada conta ganha um perfil com o e-mail ao se cadastrar, e a tela lista os perfis com os pacotes para marcar.
  - As **regras do banco** garantem que só a conta administradora altera permissões e que um pacote só é entregue a quem está liberado.
- **Painel de mestre:** o dono vê as fichas dos amigos liberados.
- O formato dos pacotes é o mesmo bloco de classe de `regras.js` / `conteudo-extra.js` (seção 3.11).
- O site hospedado e o repositório no GitHub (que é **público**) ficam só com conteúdo SRD; os pacotes chegam depois do login.
- **Segurança pelas regras do próprio serviço** (regras de segurança do Firebase / Row Level Security do Supabase), nunca só escondendo botões no JavaScript.
- No primeiro login, botão para **enviar as fichas do navegador** para a conta.

**Serviço sugerido:** Firebase (modo offline embutido para jogar sem internet e sincronizar depois; não pausa no plano gratuito). Supabase é alternativa, mas pelo que se sabia o plano gratuito pausa projetos parados por uma semana — conferir na hora.

**Limites do plano gratuito do Firebase (Spark), conferidos em 19/09/2026:** 50 mil leituras e 20 mil gravações por dia, 1 GiB no banco, 50 mil usuários ativos por mês com login por e-mail, hospedagem com 10 GB e 360 MB de tráfego por dia. Estimativa: centenas a mil e poucas sessões por dia sem custo.
- **Plano gratuito:** passou do limite, o recurso para até o dia seguinte; nunca cobra. **Lançar nele.**
- **Plano pago (Blaze):** mesma cota grátis e cobrança só do excedente, mas **sem teto de gasto automático** — só alerta de orçamento. Se um dia precisar: alerta de orçamento + **App Check** (só o próprio site usa o banco).
- **Dependência externa:** a API de magias é projeto da comunidade, sem garantia de ficar no ar. Para o app público, decidir na Fase 2 se as magias passam a ser baixadas para dentro do app.
- Se for público: **termos de uso** e canal para remover conteúdo que alguém reclamar.

**Sprints previstos:** Fase 2a (Firebase, login, fichas no banco com migração) e Fase 2b (permissões, tela de administração e painel de mestre) — ver tabela da seção 5.

**Enquanto isso:** conteúdo fora do SRD não pode ir para o repositório público.

## 3.11 Um bloco por classe e conteúdo extra local (Sprint 5.6 — caminho B)

**Por quê:** acrescentar o Artífice e o Pugilista agora, para que cada sprint seguinte (recursos, combate, habilidades por nível) já inclua as duas classes. Como o repositório no GitHub é **público**, esse conteúdo (pago ou de terceiros) não pode ir para o código versionado.

**Feito:**
- **Um bloco por classe** em `regras.js`, com `registrarClasse`. Adicionar uma classe = um bloco; o resto do código não muda. As 8 tabelas antigas (subclasses, perícias, dado de vida, níveis de escolha, salvaguardas, conjuração, nome na API, troca de magias) continuam existindo e são preenchidas pelos blocos. Conferido que nenhum dado mudou na conversão.
- O **select de classe** do wizard e da ficha é montado a partir dos blocos, em ordem alfabética.
- **`conteudo-extra.js`**: arquivo opcional, carregado logo depois de `regras.js`, listado no **`.gitignore`** (nunca vai para o GitHub). O formato está em `conteudo-extra.exemplo.js`, que vai para o git. Sem ele o app funciona só com o conteúdo gratuito.
- Classe que conjura e não existe na API de magias mostra um aviso na aba de magias, até ganhar lista local.

**Pugilista (feito, só em `conteudo-extra.js`):** dado de vida, salvaguardas, perícias, os 7 Fight Clubs e Melhoria de Atributo no padrão; não conjura. O arquivo também guarda, em formato provisório, o que os próximos sprints vão usar: Moxie por nível (Sprint 6), dado de Fisticuffs e CA do Iron Chin (Sprint 7) e habilidades por nível (RF13). Regras que mexem no que já existe, para tratar quando chegar a hora:
- ~~Fancy Footwork (nível 7): salvaguarda de Destreza extra~~ — feito no Sprint 6.5, passo 3;
- ~~Peak Physical Condition (nível 20): Força e Constituição +2 com teto 22~~ — feito no Sprint 6.5, passo 4;
- ~~Hand of Dread: truques usando Constituição~~ — feito no Sprint 6.5, passo 5.

**Artífice (feito, só em `conteudo-extra.js`), versão 2014 / Tasha's Cauldron of Everything:**
- d8, salvaguardas de Constituição e Inteligência, 2 perícias, os 4 especialistas (Alquimista, Armeiro, Artilheiro, Ferreiro de Batalha), Melhoria de Atributo no padrão.
- Meio conjurador de Inteligência: a tabela de espaços do livro é idêntica à de meio conjurador do app (conferido nos 20 níveis).
- Troca: a lista inteira de preparadas no descanso longo; 1 truque ao subir de nível.
- **Magias locais** (novo no app, serve para qualquer classe fora da API): o bloco da classe traz `magiasLocais` com truques por nível, a regra de preparadas (Inteligência + metade do nível, mínimo 1) e a lista de magias. A aba de magias usa isso no lugar da API para a lista e os limites.
  - 71 magias da lista existem na API e aparecem com descrição.
  - 24 não existem (Xanathar's e Tasha's, fora do conteúdo gratuito): aparecem para equipar com nome, círculo e concentração, e o detalhe manda consultar o livro. Esses dados e a própria lista do Artífice foram escritos de memória: **conferir no livro**.
- Guardado para os próximos sprints: Flash of Genius (Sprint 6), infusões conhecidas e itens infundidos por nível, habilidades por nível (RF13).
- Não incluídos: os especialistas de Unearthed Arcana (Archivist e o Armorer antigo), que eram material de teste.

## 3.12 Recursos de classe (CONCLUÍDO — Sprint 6, RF31)

**Fonte:** quantidades por nível da API 2024 (Fúria, Canalizar Divindade do Clérigo e do Paladino, Forma Selvagem, Retomar o Fôlego, Pontos de Foco, Inimigo Favorito, Pontos de Feitiçaria) e regras de recuperação do texto oficial de cada habilidade, conferidos em 19/09/2026. Surto de Ação e Indomável pela tabela e pelo texto do Guerreiro.

| Classe | Recursos |
|---|---|
| Bárbaro | Fúria (1 no curto, todas no longo) |
| Bardo | Inspiração de Bardo = Carisma, mín. 1 (longo; a partir do 5, curto ou longo) |
| Bruxo | Astúcia Mágica, a partir do 2 (longo) |
| Clérigo | Canalizar Divindade (1 no curto, todos no longo) |
| Druida | Forma Selvagem (1 no curto, todas no longo) |
| Feiticeiro | Pontos de Feitiçaria (longo); Restauração Feiticeira, a partir do 5 (longo) |
| Guerreiro | Retomar o Fôlego (1 no curto, todos no longo); Surto de Ação (curto); Indomável, a partir do 9 (longo) |
| Ladino | Golpe de Sorte, no 20 (curto) |
| Mago | Recuperação Arcana (longo) |
| Monge | Pontos de Foco (curto); Metabolismo Sobrenatural, a partir do 2 (longo) |
| Paladino | Cura pelas Mãos = 5 × nível, em PV (longo); Canalizar Divindade, a partir do 3 (1 no curto, todos no longo) |
| Patrulheiro | Inimigo Favorito: Marca do Caçador sem gastar espaço (longo) |
| Pugilista | Moxie (curto); Bloodied but Unbowed (curto); Down but Not Out e Fighting Spirit (longo) |
| Artífice | Flash of Genius = Inteligência, mín. 1, a partir do 7 (longo) |

**Como funciona na ficha:**
- Bloco **"Recursos de Classe"**: até 8 usos viram bolinhas (cheia = gasta, igual aos espaços de magia); acima disso (Pontos de Foco, Pontos de Feitiçaria, Cura pelas Mãos, Moxie alto) o jogador digita quanto resta. Cada recurso mostra como recupera.
- **Descanso curto** ganhou o botão **"Concluir descanso curto"**: devolve os recursos que voltam no curto (1 uso dos "1 no curto") e, no Bruxo, os espaços de Pacto. Substituiu o botão só de Pacto do 5a.
- **Descanso longo** devolve todos os recursos.
- O modo descanso lista, antes de concluir, o que vai voltar.
- O **level up** mostra recursos novos e os que aumentam ("Fúria: 3 → 4").
- Os gastos são salvos com a ficha, como os espaços de magia.

**Nomes em português** são tradução própria (não necessariamente os do livro em português); Pugilista e Artífice mantêm os nomes do material original.

**Fora deste sprint:** o que o recurso *faz* (ex: Restauração Feiticeira devolver pontos, Recuperação Arcana devolver espaços) é marcado à mão; o app só conta os usos.

## 3.13 Habilidades por nível (CONCLUÍDO — Sprint 6.5, RF13)

**Passos:**
1. **Habilidades de classe por nível** — *feito*.
2. **Habilidades das subclasses** — *feito* (detalhes abaixo).
3. **Salvaguarda ganha por nível** — *feito*: campo `salvaguardasPorNivel` no bloco da classe. Monge no 14 ganha todas (Disciplined Survivor), Ladino no 15 ganha Sabedoria e Carisma (Slippery Mind) — ambos conferidos no texto oficial da API —, Pugilista no 7 ganha Destreza (Fancy Footwork). A ficha marca a proficiência a partir do nível, e o level up mostra "Proficiência nova em salvaguardas: ...".
4. **Atributo com teto maior** — *feito*: campo `aumentoDeAtributoPorNivel` no bloco da classe. Bárbaro no 20 (Primal Champion, conferido no texto oficial): Força e Constituição +4, até 25. Pugilista no 20 (Peak Physical Condition): +2, até 22.
   - Aplicado **automaticamente ao confirmar o nível**, entrando no valor base (como a Melhoria de Atributo e a Dádiva); nunca passa do teto (ex: Força 23 só ganha +2).
   - O level up avisa antes: "Primal Champion: Força +4 (fica 24), Constituição +4 (fica 20); teto 25." A prévia de PV já conta a Constituição nova.
   - Na ficha, o teto do atributo passa a ser o maior entre 20, o da Dádiva Épica (30) e o que a classe liberou.
5. **Magias concedidas pela subclasse** — *feito*: campo `magias` na subclasse, sempre preparadas (não contam no limite e não saem na troca).
   - **Extraídas do texto da API** (a API não traz lista, só o texto da habilidade; as linhas quebradas da tabela foram juntadas): Patrono Corruptor, Domínio da Vida, Feitiçaria Dracônica e Círculo da Terra.
   - **Círculo da Terra:** o Druida escolhe o tipo de terra (árida, polar, temperada, tropical) na ficha, no bloco "Magias Preparadas"; cada tipo tem sua lista. A escolha é salva com a ficha.
   - **À mão, para conferir no livro:** Juramento da Devoção (o texto da API veio embaralhado com a lista do Paladino), Hand of Dread do Pugilista (3 truques, usando Constituição) e os 4 especialistas do Artífice (Tasha's, de memória).
   - **Fora:** Colégio do Conhecimento (o jogador escolhe 2 magias quaisquer, não é lista fixa). As outras 6 subclasses da API não dão magias.
   - 6 magias não existem na API e ficam locais, sem descrição: Blade Ward, Branding Smite, Aura of Vitality, Conjure Barrage, Aura of Purity, Banishing Smite.
   - **Ficha:** as magias da subclasse aparecem em "Magias Preparadas" com "(subclasse)"; as de concentração entram na lista de concentração. Classe que não conjura (Pugilista com Hand of Dread) passa a ver o bloco, com o aviso de que as magias usam Constituição.
   - **Aba de magias:** aparecem com a etiqueta "Da subclasse" e o botão "Sempre preparada"; magia de fora da lista da classe também entra (ex: Burning Hands no Bruxo do Patrono Corruptor).
   - **Level up:** "Magias da subclasse (sempre preparadas): ...".

**Passo 1 (feito):**
- As habilidades das 12 classes, nível a nível, vêm da API 2024 (conferido: iguais à API nas 12). Ficam em inglês, como as magias. Pugilista e Artífice usam os nomes da tabela do material deles (as Melhorias de Atributo da tabela foram acrescentadas).
- Os níveis marcados como "subclasse" (ex: "Barbarian Subclass" no 3, 6, 10 e 14) aparecem com o nome da subclasse escolhida: no nível da escolha, "Subclasse: Caminho do Berserker"; nos outros, "Habilidade de Caminho do Berserker". O conteúdo delas é o passo 2.
- **Ficha:** bloco "Habilidades de Classe", uma linha por nível até o atual. A lista funciona sem internet; clicar no nome busca a descrição na API (em inglês).
- **Level up:** a linha provisória do RF13 virou "Habilidades novas: ..." com o que o nível traz (Melhoria de Atributo e Dádiva Épica ficam de fora porque já aparecem como escolha).
- Classes do conteúdo extra mostram os nomes sem descrição (não estão na API).

**Passo 2 (feito) — decisão: opção A agora, B aos poucos:**
- **A:** a API 2024 tem **uma subclasse por classe** (a do conteúdo gratuito). As 12 ganharam as habilidades por nível, ligadas às subclasses que já existiam no app (conferido: iguais à API nas 12; nenhuma subclasse mudou de valor ou nome):
  Caminho do Berserker, Colégio do Conhecimento, Patrono Corruptor, Domínio da Vida, Círculo da Terra, Feitiçaria Dracônica, Campeão, Ladrão, Evocador, Guerreiro da Mão Aberta, Juramento da Devoção, Caçador.
- **B (aos poucos):** subclasses fora da API recebem as habilidades à mão no `conteudo-extra.js`, só as que a mesa usar. Já feito: os 7 Fight Clubs do Pugilista (nomes, do material do usuário).
- **Na tela:** no nível de uma habilidade de subclasse aparecem as habilidades da subclasse escolhida (com descrição ao clicar, quando vêm da API). Subclasse sem dados continua como "Habilidade de ...". Isso vale também para níveis de subclasse fora das marcas da classe (ex: Campeão no 7).

## 3.14 Combate (CONCLUÍDO — Sprint 7)

**Passos:** 1. iniciativa e CA; 2. ataques e armas; 3. condições.

**Passo 1 (feito):**
- **Tabela de armaduras** gerada da API 2024: 12 vestíveis mais o escudo, com CA base, uso de Destreza (e o limite +2 das médias), Força mínima e desvantagem em Furtividade. **Correção:** a API marca o Hide Armor como leve, mas no livro ele é média; corrigido na tabela, com o motivo comentado.
- **CA (RF33):** a ficha tem o select de armadura e a caixa de escudo. O app calcula todas as formas possíveis e **usa a maior**, mostrando qual foi:
  - padrão: armadura (ou 10) + Destreza, respeitando o limite da armadura;
  - **Bárbaro:** 10 + Destreza + Constituição, sem armadura, escudo permitido;
  - **Monge:** 10 + Destreza + Sabedoria, sem armadura e **sem escudo**;
  - **Pugilista (Iron Chin):** 12 + Constituição, sem armadura ou com leve, sem escudo.
  - Avisos da armadura equipada: Força mínima (deslocamento -3 m) e desvantagem em Furtividade.
- **Iniciativa (RF32):** modificador de Destreza, somando o bônus de proficiência de quem tem o talento **Alerta**.
- Armadura e escudo são salvos com a ficha.

**Passo 2 (feito) — ataques (RF34):**
- **Tabela de armas** gerada da API 2024: 38 armas com dano, tipo de dano, propriedades (acuidade, versátil, leve, pesada, alcance, arremesso, munição, duas mãos, recarga), alcance e maestria. Mais o **ataque desarmado**, que não está na API.
- **Proficiência de arma por classe**, da API: simples e marciais para Bárbaro, Guerreiro, Paladino e Patrulheiro; só simples para os conjuradores; lista própria do Ladino (espada longa, rapieira, cimitarra, espada curta, chicote, besta de mão). **Exceção:** o Monge segue a regra de 2024 (simples e marciais com a propriedade Leve); a API ainda traz a lista de 2014.
- **Bônus de ataque:** Força no corpo a corpo, Destreza à distância, o melhor dos dois com Acuidade, mais a proficiência quando a classe tem. Sem proficiência, a linha avisa.
- **Dano:** dado da arma + modificador do mesmo atributo, com a opção "2 mãos" nas versáteis.
- **Fisticuffs do Pugilista:** o dado da classe (d6 a d12 por nível) substitui o dado do ataque desarmado e das armas de pugilista quando é maior, e a linha marca "dado da classe".
- **Ficha:** bloco "Ataques" com select de arma, botão Adicionar e uma linha por ataque (bônus, dano, versátil, remover). Salvo com a ficha.

**Passo 3 (feito) — condições (RF35):**
- As **14 condições** da API 2024 viram botões que ligam e desligam na ficha; ligar mostra a descrição (buscada na API, em inglês). A lista funciona sem internet.
- **Exaustão** fica à parte, com nível de 0 a 6, porque é cumulativa: o app mostra o efeito do nível (regra 2024: testes de d20 -2 por nível, deslocamento -1,5 m por nível, morte no 6).
- Condições e nível de exaustão são salvos com a ficha.
- O app **marca** as condições; aplicar o efeito nas rolagens continua com o jogador.

## 3.15 Inventário e moedas (CONCLUÍDO — Sprint 8)

- **Moedas (RF37):** PC, PP, PE, PO e PL na ficha, com o **total convertido em PO** (100 PC = 10 PP = 2 PE = 1 PO; 1 PL = 10 PO). O total só aparece quando há dinheiro.
- **Inventário (RF36):** itens com **nome, quantidade e peso por unidade**, adicionados à mão. Cada linha mostra o peso total do item e tem botão de remover; a quantidade é editável na própria linha.
- **Decisão:** os itens são **digitados**, e não vêm da API. Assim o inventário funciona sem internet e aceita itens da campanha que não existem em lista nenhuma.
- **Peso e carga:** o app soma o peso carregado e mostra a **capacidade de carga** (7,5 kg por ponto de Força, o equivalente métrico das 15 lb do livro), avisando quando passa do limite.
- Moedas e itens são salvos com a ficha.

**Junto com o Sprint 8, os dois requisitos soltos que faltavam:**
- **RF03 — personalidade:** traços, ideais, vínculos e defeitos viraram quatro caixas de texto livre na ficha, salvas com ela.
- **RF05 — passivas:** bloco com **Percepção, Investigação e Intuição** passivas (10 + o bônus da perícia, contando proficiência). O talento **Observador** soma +5 em Percepção e Investigação. As passivas acompanham mudanças de atributo, nível e perícia.

## 3.16 Multiclasse — CONCLUÍDA

**Passos:** 1. base; 2. level up escolhendo a classe; 3. magias por classe; 4. acabamento. **Todos concluídos.**

**Modelo de dados:** `personagem.classes = [{ classe, nivel, subclasse }]`. A **primeira** é a classe inicial. `classe`, `nivel` e `subclasse` continuam existindo como espelho (classe inicial e **nível total**), para o resto do app seguir funcionando. Ficha antiga vira lista de uma classe sozinha, sem migração manual.

**Passo 1 (feito) — regras e ficha:**
- **PV:** dado cheio só no nível 1 da classe inicial; todo o resto pela média do dado de cada classe. Robusto e Dádiva da Fortitude contam uma vez, pelo nível total.
- **Bônus de proficiência:** pelo nível total.
- **Salvaguardas e perícias:** só da classe inicial, como manda a regra.
- **Espaços de magia:** com duas classes conjuradoras, soma-se o nível de conjurador (completo conta tudo, meio conjurador conta a metade para baixo) e usa-se a tabela do conjurador completo. A **Magia de Pacto do Bruxo fica separada**, com contagem própria de gastos.
- **Recursos, habilidades e subclasses:** por nível de cada classe; a ficha mostra as habilidades agrupadas por classe.
- **CA e ataques:** valem o melhor cálculo entre as classes (Defesa sem Armadura, Iron Chin, Fisticuffs, proficiência de arma de qualquer uma delas).
- **Pré-requisito 2024** (13 no atributo principal) já calculado, incluindo o "Força **ou** Destreza" do Guerreiro e o "Destreza **e** Sabedoria" do Monge. Mostrado na tela no passo 2.
- A ficha mostra "Classes: Guerreiro 3 / Ladino 2 (nível 5)" quando há mais de uma.

**Passo 2 (feito) — level up escolhendo a classe:**
- Bloco novo **"Classe que sobe"** no topo do level up: um botão por classe que o personagem já tem ("Guerreiro 3 → 4") e um select para **começar uma classe nova**. É por aqui que se cria um multiclasse.
- O que é **por nível da classe escolhida**: Melhoria de Atributo / Talento / Dádiva Épica, subclasse (no nível de escolha daquela classe), recursos, habilidades, aumento automático de atributo e troca de magias.
- O que é **pelo personagem inteiro**: PV, bônus de proficiência, espaços de magia (com os de Pacto listados à parte) e o nível mostrado no cabeçalho.
- Trocar de classe **zera a escolha em andamento** (ASI/talento), porque ela era da outra classe.
- **Pré-requisito 2024:** o app **avisa e deixa passar** — diz o que falta para entrar na classe nova e o que falta para sair da inicial, e sugere combinar com o mestre. Não bloqueia, porque mesas mudam essa regra.
- Ao confirmar: o nível entra na classe certa (ou abre uma entrada nova com nível 1), `personagem.nivel` vira o **total**, `classe`/`subclasse` espelham a **inicial** e as salvaguardas são recalculadas pela inicial.
- Coberto por `testar-multiclasse-levelup.js` (Guerreiro 3 → Ladino 1 → Ladino 3, com subclasse indo para o Ladino e não para o Guerreiro).

**Passo 3 (feito) — magias por classe:**
- A aba de magias trabalha **uma classe de cada vez**, com um bloco "Classe" no topo (só aparece com duas ou mais classes conjuradoras). Cada classe tem a lista, o limite de truques/preparadas, as magias equipadas e a troca dela.
- **Distinção que importa:** o círculo que a classe *prepara* vem da tabela **dela** (`circuloMaximoDaClasse`), enquanto os espaços de magia são **compartilhados** e somados pelo nível de conjurador. Um Clérigo 1 / Mago 4 lança com espaços de 3º círculo, mas só prepara magias de 1º na lista de Clérigo e de 2º na de Mago.
- `magiasEquipadas` ganhou o campo `classe`. Ficha antiga sem esse campo: a magia é da classe inicial (`normalizarMagiasEquipadas`), sem migração manual.
- `trocasMagia` virou um **mapa por classe** (`{ mago: { magias, truques } }`). Ficha antiga, que guardava um objeto só, vira a troca da classe inicial. O **descanso longo libera em todas** as classes conjuradoras; o **level up só na classe que subiu**.
- Trocar de classe na aba **não apaga** as magias das outras: a limpeza de magias fora da lista só olha a classe aberta.
- Na ficha, as magias sempre preparadas de subclasse saem pelo nível **daquela** classe, e com duas conjuradoras cada magia mostra de onde vem.
- Coberto por `testar-multiclasse-magias.js` (regras + o `magias.js` de verdade contra a API, com um Clérigo 1 / Mago 4).

**Passo 4 (feito) — acabamento:**
- **Dados de vida por classe.** `dadosVidaGastos` virou um mapa (`{ guerreiro: 2 }`); ficha antiga, que guardava um número, vira o gasto da classe inicial. No descanso curto aparece **um botão por classe** ("Gastar d10 (Guerreiro) — 3 de 3"), e o texto do resultado diz de qual classe foi o dado. Com uma classe só, o botão continua sendo o de sempre ("Gastar dado de vida").
- O bloco de Dados de Vida da ficha mostra "3d10 + 2d8" em vez de um grupo só.
- **Texto do wizard:** a etapa 2 avisa que aquela é a **classe inicial**, que dá para multiclassear depois pelo level up, e que as **salvaguardas e perícias ficam sempre as dela**. De propósito, não menciona o pré-requisito de 13 (não se aplica no nível 1, e o aviso já aparece no level up) nem dá conselho de build.
- Coberto por `testar-multiclasse-dados.js`.

**Resumo do que o multiclasse toca:** `regras.js` (camada nova), `levelup.js` (escolha da classe), `magias.js` (uma classe por vez), `ficha.js` (resumo, recursos, habilidades, espaços, CA, ataques, trocas, dados de vida), `ficha-comum.js` (PV e salvaguardas), `cadastro.js`/`cadastro.html` (classe inicial).

---

## 4. Backlog do Produto (ordenado por prioridade e dependência)

Escrito como histórias de usuário, do jeito Scrum — cada uma vira uma entrega testável.

1. Como mestre, quero cadastrar nome, raça, classe e nível de um personagem, para iniciar a ficha.
2. Como mestre, quero que os atributos calculem seus modificadores automaticamente, para não fazer conta de cabeça na mesa.
3. Como mestre, quero que a raça aplique seus traços, deslocamento e perícias automaticamente, para refletir as regras corretas sem esforço manual. *(Reescrito: a parte de "aplicar bônus de atributo" saiu, porque nas regras 2024 o bônus vem do antecedente — ver seção 3.1. Cobre RF11 e RF12.)*
4. Como mestre, quero escolher perícias dentro do limite da classe, com destaque visual, para não errar a montagem do personagem.
5. Como mestre, quero que o PV inicial e por nível seja calculado automaticamente, para acompanhar a saúde do personagem sem planilha externa.
6. Como mestre, quero gerenciar descanso curto/longo, para recuperar recursos de forma correta durante o jogo.
7. Como mestre, quero um "Modo Descanso" que destaque as ações disponíveis em cada tipo de descanso, para não esquecer o que pode ser feito.
8. Como mestre, quero uma tela dedicada de "level up" que mostre ASI, Talento e opções de magia lado a lado quando a classe permitir escolha, para tomar essa decisão de forma clara (como no Baldur's Gate 3).
9. Como mestre, quero uma aba dedicada de gerenciamento de magias, com limite de magias conhecidas/preparadas por nível, para controlar os conjuradores sem contar no papel.
10. Como mestre, quero que a troca de magias preparadas siga a regra oficial (descanso longo, com exceção do Bruxo em descanso curto), para manter a ficha fiel ao sistema.
11. Como mestre, quero controlar recursos exclusivos de classe (Fúria, Ki, etc.), para acompanhar classes não-conjuradoras também.
12. Como mestre, quero calcular CA, iniciativa e bônus de ataque, para agilizar o combate.
13. Como mestre, quero um inventário simples com moedas e itens, para registrar equipamentos.
14. Como mestre, quero criar, editar, excluir e listar múltiplos personagens, para gerenciar minha campanha inteira.
15. Como mestre, quero exportar/importar fichas, para ter backup e compartilhar com jogadores.

---

## 5. Proposta de Sprints

*(sprints de 1–2 semanas, ajustável — cada um entrega algo jogável, mesmo que incompleto)*

| Sprint | Foco | Itens do backlog | Situação |
|---|---|---|---|
| Sprint 1 | Fundação da ficha | 1, 2 | concluída |
| Sprint 1.5 | Wizard de criação (seção 3.2) | — | concluída |
| Sprint 2 | Raça e perícias | 3, 4 | concluída |
| Sprint 3 | Vida e descanso | 5, 6, 7 | concluída |
| Sprint 4 | Level up dedicado (seção 3.4) | 8 | concluída (magias no level up vão para o Sprint 5) |
| Sprint 5a | Magias em jogo: espaços de magia, CD e ataque mágico, concentração, descanso | 9, 10 (parte) | concluída (ver seção 3.7) |
| Sprint 5b | Aba de magias: lista pela API, limites, equipar, troca (2024), coluna do level up | 9, 10 (parte) | concluída (ver seção 3.8) |
| Sprint 5.5 | Ajustes de distribuição de atributos e aviso do wizard (IDEIA06, IDEIA07) | — | concluída (ver seção 3.9) |
| Sprint 5.6 | Um bloco por classe e conteúdo extra local, fora do git (Artífice, Pugilista) | — | em andamento (ver seção 3.11) |
| Sprint 6 | Recursos de classe | 11 | concluída (ver seção 3.12) |
| Sprint 6.5 | Habilidades por nível (RF13): o que cada nível e subclasse traz, salvaguarda ganha por nível, atributo com teto maior, magias concedidas pela subclasse | — | concluída (ver seção 3.13) |
| Sprint 7 | Combate | 12 | concluída (ver seção 3.14) |
| Sprint 8 | Inventário | 13 | concluída (ver seção 3.15) |
| ~~Sprint 9~~ | ~~Gestão avançada de fichas~~ — juntado à Fase 2 (seção 3.10) | 14, 15 | |
| Fase 2a | Login e fichas no banco: cadastro aberto, CRUD e duplicar ficha no banco, migração do navegador | 14, 15 | |
| Fase 2b | Permissões e administração: pacotes liberados por conta, painel de mestre, exportar ficha como backup | — | |
| Lançamento | Hospedar, alerta de uso do Firebase, termos de uso se for público | — | |

Cada sprint deve terminar com algo **funcionando de ponta a ponta**, mesmo que simples — é melhor ter "PV calcula certo, mas sem animação bonita" do que travar tentando fazer tudo perfeito de uma vez. Isso também deixa espaço pra mudança: se no meio do Sprint 3 você perceber que quer inverter a ordem com Magias, tudo bem, é revisão de backlog, não quebra de processo.
