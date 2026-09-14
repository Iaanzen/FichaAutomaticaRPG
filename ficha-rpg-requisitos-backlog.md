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
- RF30: Permitir a **troca de magias preparadas** seguindo a regra oficial: disponível após descanso longo para a maioria das classes preparadoras (Clérigo, Druida, Mago); para classes de magias conhecidas fixas (ex: Bruxo, Feiticeiro), a troca ocorre normalmente apenas no level up (RF09), não em descanso.

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

- RNF01: Persistência local via localStorage, funcionando sem internet.
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

## 3.1 Mudança de regra — bônus de atributo (D&D 2024 / 5.5)

Decidido migrar do modelo 2014 (bônus fixos por raça) para uma variação do modelo 2024:
- Bônus de atributo NÃO vêm mais de raça/sub-raça.
- O jogador escreve um antecedente personalizado (texto livre) e distribui os bônus manualmente.
- O app obriga a forma da distribuição: **+2 em um atributo e +1 em outro**, OU **+1 em três atributos diferentes**.
- As tabelas bonusPorRaca / bonusPorSubRaca deixam de valer para cálculo de atributo (raça ainda dará traços/perícias em sprints futuros).

## 3.2 Wizard de criação de personagem (CONCLUÍDO)

Fluxo passo a passo (estilo criação de videogame), substituindo o formulário único. Entregue com 8 etapas, nesta ordem:

| # | Etapa | Observação |
|---|---|---|
| 1 | Nome | — |
| 2 | Nível | vem antes da classe porque define se há subclasse |
| 3 | Classe | subclasse só aparece a partir do nível 3 |
| 4 | Antecedente | texto livre |
| 5 | Bônus do antecedente | +2/+1 ou +1/+1/+1, validado pelo app |
| 6 | Raça | sub-raça preenchida dinamicamente |
| 7 | Atributos | mostra total (base + bônus) e modificador |
| 8 | Detalhes | alinhamento |

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
| Sprint 2 | Raça e perícias | 3, 4 | próxima |
| Sprint 3 | Vida e descanso | 5, 6, 7 | |
| Sprint 4 | Level up dedicado | 8 | |
| Sprint 5 | Magias | 9, 10 | |
| Sprint 6 | Recursos de classe | 11 | |
| Sprint 7 | Combate | 12 | |
| Sprint 8 | Inventário | 13 | |
| Sprint 9 | Gestão avançada de fichas | 14, 15 | |

Cada sprint deve terminar com algo **funcionando de ponta a ponta**, mesmo que simples — é melhor ter "PV calcula certo, mas sem animação bonita" do que travar tentando fazer tudo perfeito de uma vez. Isso também deixa espaço pra mudança: se no meio do Sprint 3 você perceber que quer inverter a ordem com Magias, tudo bem, é revisão de backlog, não quebra de processo.
