# Ficha de RPG Automatizada — D&D 5e

**Projeto pessoal — mestre e jogadores da campanha**
**Escopo:** apenas D&D 5e, sem multiclasse (fora do MVP)
**Armazenamento:** localStorage (sem login/servidor por enquanto)

---

## 1. Requisitos Funcionais (RF)

### 1.1 Identidade e Perfil
- RF01: Cadastrar nome, raça (e sub-raça), classe (e subclasse), antecedente e alinhamento.
- RF02: Selecionar/editar nível do personagem (1–20).
- RF03: Registrar traços de personalidade, ideais, vínculos e defeitos (texto livre).
- RF04: Registrar idiomas conhecidos e proficiência com ferramentas/instrumentos.
- RF05: Calcular percepção passiva automaticamente (10 + mod. Sabedoria + proficiência, se houver).

### 1.2 Atributos e Modificadores
- RF06: Preencher os 6 atributos (Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma).
- RF07: Calcular automaticamente o modificador de cada atributo.
- RF08: Calcular automaticamente o bônus de proficiência conforme o nível.
- RF09: Ao subir para um nível em que a classe permite escolha, exibir uma tela/aba dedicada de "level up" com todas as opções disponíveis lado a lado (inspirado no fluxo do Baldur's Gate 3):
  - Melhoria de Atributo (ASI);
  - Talento;
  - Para classes conjuradoras: aprender nova magia e/ou trocar uma magia já conhecida (quando a classe permitir essa troca no level up).
  - *(ASI e Talento feitos no Sprint 4 — ver seção 3.4. A parte de magias fica para o Sprint 5.)*

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

- Multiclasse
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

**Idioma: a API é em inglês. Decidido traduzir em camadas:**
1. **Campos fixos traduzidos no código** por dicionário: tempo de conjuração, duração e alcance (só 64 valores diferentes). Distâncias em pés viram metros (5 pés = 1,5 m). Valor fora do dicionário aparece em inglês.
2. **Nomes em português** num arquivo de traduções próprio (código da magia → nome), com o nome em inglês como reserva enquanto não houver tradução.
3. **Descrições começam em inglês** e são traduzidas aos poucos, conforme as magias forem usadas na campanha, no mesmo arquivo de traduções.
- Descartado: tradutor automático ao vivo (chave de acesso exposta no navegador, custo, lentidão e erro em termos do jogo).
- Não copiar descrições do livro oficial em português; traduzir o texto da API é permitido mantendo o crédito.

**Decidido também:**
- **Regra de troca de magias: 2024** (substitui o texto de 2014 do RF30). Conferir no livro os detalhes de cada classe, principalmente Paladino e Patrulheiro, antes de implementar no 5b.
- **Cavaleiro Arcano e Trapaceiro Arcano ficam para depois** (item registrado na seção 3).
- **Sprint dividido em 5a e 5b** (ver tabela da seção 5), entregue em passos pequenos e testáveis.
- **Sem internet:** a aba de magias mostra só o aviso "sem conexão, tente de novo"; a ficha continua funcionando com as magias já equipadas.

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
| Sprint 5a | Magias em jogo: espaços de magia, CD e ataque mágico, concentração, descanso | 9, 10 (parte) | próxima |
| Sprint 5b | Aba de magias: lista pela API, limites, equipar, troca (2024), coluna do level up | 9, 10 (parte) | |
| Sprint 6 | Recursos de classe | 11 | |
| Sprint 7 | Combate | 12 | |
| Sprint 8 | Inventário | 13 | |
| Sprint 9 | Gestão avançada de fichas | 14, 15 | |

Cada sprint deve terminar com algo **funcionando de ponta a ponta**, mesmo que simples — é melhor ter "PV calcula certo, mas sem animação bonita" do que travar tentando fazer tudo perfeito de uma vez. Isso também deixa espaço pra mudança: se no meio do Sprint 3 você perceber que quer inverter a ordem com Magias, tudo bem, é revisão de backlog, não quebra de processo.
