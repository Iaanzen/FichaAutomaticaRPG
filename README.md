# 🐉 Forja de Criação — Ficha de RPG Automatizada (D&D 5e)

> _"Que nenhum herói se perca por falta de um bom pergaminho."_

Uma ficha de personagem de **Dungeons & Dragons 5ª Edição** que faz as contas chatas sozinha, para o mestre e os jogadores cuidarem do que importa: a aventura. Projeto pessoal, construído do zero, sem depender de aplicativos pagos.

**🔗 No ar em [forja-criacao.web.app](https://forja-criacao.web.app)** — crie uma conta e comece.

---

## ⚔️ Sobre o Projeto

Cansado das limitações de apps pagos de ficha, este grimório digital nasceu para ser **livre, automático e sob medida** para as campanhas da mesa. A ficha calcula o que puder sozinha — modificadores, vida, magias, recursos de classe, combate — conforme o personagem é criado e evolui.

O projeto é desenvolvido **aos poucos, em sprints**, com espaço para mudanças conforme a mesa pede coisas novas. As decisões de regra e de arquitetura ficam registradas no arquivo de backlog, que serve de memória do projeto.

📘 **[COMO-FUNCIONA.md](COMO-FUNCIONA.md)** — guia do código: como as peças se encaixam, o que cada arquivo faz e por quê.

---

## 🗺️ O que já está forjado

**O personagem**
- 📜 Criação guiada por etapas: raça, sub-raça, classe, antecedente, alinhamento e atributos
- 🧬 **Raça própria** — invente a sua, com deslocamento, traços e idiomas
- 💪 Atributos com o bônus vindo do **antecedente** (regra de 2024), com teto de 20
- 🎚️ **Subir de nível** numa tela dedicada, um nível por vez, com Melhoria de Atributo, Talento e Dádiva Épica lado a lado
- ⚔️ **Multiclasse** — escolha em qual classe o nível entra, com PV, proficiência e espaços de magia somados corretamente

**Em jogo**
- ❤️ Pontos de vida, PV temporários, testes de morte e dados de vida por classe
- 🛌 Descanso curto e longo, com o que cada um recupera
- ✨ Aba de magias com a lista da classe, limites de preparadas e regra de troca
- 🔮 Espaços de magia, concentração, CD e ataque mágico
- 🔥 Recursos de classe (Fúria, Ki, Pontos de Feitiçaria e companhia)
- 🛡️ CA, iniciativa, ataques com armas, condições e exaustão
- 🎒 Inventário, moedas, peso e sobrecarga
- 📝 Anotações livres e campos de personalidade
- 🔒 **Cadeado de edição** — a ficha abre travada, para ninguém mudar a classe sem querer no meio da sessão

**A mesa**
- 👥 Conta própria para cada jogador; as fichas seguem a pessoa em qualquer aparelho
- 🎲 **Painel de mestre** — o dono da mesa vê as fichas dos jogadores (somente leitura)
- 📦 **Pacotes de conteúdo por conta** — conteúdo fora do SRD é liberado individualmente

---

## 🧙 Tecnologias

Puro e artesanal, sem frameworks nem etapa de build:

- **HTML5, CSS3 e JavaScript** — arquivos `<script>` clássicos, sem empacotador
- **Firebase** — Authentication (login), Firestore (fichas) e Hosting (o site)
- **[API do D&D 5e](https://www.dnd5eapi.co/)** — magias, habilidades de classe, armas e condições
- Fontes _Cinzel_ e _Lora_, cores de pergaminho e sangue de dragão

---

## 📖 Rodando na sua máquina

O app precisa de um servidor local: o login do Firebase **não funciona** abrindo o arquivo direto (`file://`).

```bash
git clone https://github.com/Iaanzen/FichaAutomaticaRPG
cd FichaAutomaticaRPG
python -m http.server 8000
```

Abra **http://localhost:8000** e crie uma conta.

> Use um navegador de verdade. O preview embutido do VS Code não completa a conexão com o banco.

---

## 🗂️ Estrutura do Grimório

```
📁 projeto
├── index.html / index.js        # A Taverna: lista de personagens
├── login.html / login.js        # Entrada e criação de conta
├── cadastro.html / cadastro.js  # Criação do personagem, por etapas
├── ficha.html / ficha.js        # A ficha em si
├── levelup.html / levelup.js    # Subir de nível
├── magias.html / magias.js      # Gerenciamento de magias
├── admin.html / admin.js        # Painel do mestre
├── regras.js                    # Todas as tabelas e regras de D&D
├── ficha-comum.js               # O que a ficha e o cadastro compartilham
├── armazenamento.js             # O único lugar que sabe onde as fichas moram
├── auth.js / conteudo.js        # Login e conteúdo liberado por conta
├── firestore.rules              # Quem pode ler e escrever o quê
└── ficha-rpg-requisitos-backlog.md  # Backlog e decisões do projeto
```

---

## 🛡️ Status

🚧 **Em desenvolvimento ativo** — novas funcionalidades sendo adicionadas sprint a sprint.

---

## 📜 Licença e créditos

Este projeto usa conteúdo do **System Reference Document 5.1** ("SRD 5.1") da Wizards of the Coast LLC, disponível sob a [licença Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/legalcode).

_Dungeons & Dragons_ é propriedade da Wizards of the Coast. Este é um projeto pessoal, de fã, sem fins comerciais, e **não contém conteúdo além do SRD**: classes, subclasses e outros materiais de livros pagos não estão neste repositório.

---

<p align="center">
  <em>Feito com 🎲 e muito café, entre uma sessão e outra.</em>
</p>
