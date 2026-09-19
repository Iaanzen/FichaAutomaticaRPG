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
- Magias sempre preparadas das subclasses (Domínio do Clérigo, Juramento do Paladino etc.) não entram na lista nem no limite.
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
- Fancy Footwork (nível 7): salvaguarda de Destreza extra, e hoje as salvaguardas são fixas desde o nível 1;
- Peak Physical Condition (nível 20): Força e Constituição +2 com teto 22;
- Hand of Dread: truques usando Constituição, e hoje subclasse não dá magias.

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
| Sprint 6.5 | Habilidades por nível (RF13): o que cada nível e subclasse traz, salvaguarda ganha por nível, atributo com teto maior, magias concedidas pela subclasse | — | |
| Sprint 7 | Combate | 12 | |
| Sprint 8 | Inventário | 13 | |
| ~~Sprint 9~~ | ~~Gestão avançada de fichas~~ — juntado à Fase 2 (seção 3.10) | 14, 15 | |
| Fase 2a | Login e fichas no banco: cadastro aberto, CRUD e duplicar ficha no banco, migração do navegador | 14, 15 | |
| Fase 2b | Permissões e administração: pacotes liberados por conta, painel de mestre, exportar ficha como backup | — | |
| Lançamento | Hospedar, alerta de uso do Firebase, termos de uso se for público | — | |

Cada sprint deve terminar com algo **funcionando de ponta a ponta**, mesmo que simples — é melhor ter "PV calcula certo, mas sem animação bonita" do que travar tentando fazer tudo perfeito de uma vez. Isso também deixa espaço pra mudança: se no meio do Sprint 3 você perceber que quer inverter a ordem com Magias, tudo bem, é revisão de backlog, não quebra de processo.
