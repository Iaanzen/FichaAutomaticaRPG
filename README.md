# 🐉 Grimório do Aventureiro — Ficha de RPG Automatizada (D&D 5e)

> _"Que nenhum herói se perca por falta de um bom pergaminho."_

Uma ficha de personagem de **Dungeons & Dragons 5ª Edição** feita para automatizar os cálculos chatos e deixar o mestre e os jogadores focarem no que importa: a aventura. Projeto pessoal, construído do zero, sem depender de aplicativos pagos.

---

## ⚔️ Sobre o Projeto

Cansado das limitações de apps pagos de ficha, este grimório digital nasceu para ser **livre, automático e sob medida** para as campanhas da mesa. A ideia é que a ficha calcule sozinha o que puder — modificadores, vida, magias, recursos de classe — conforme o personagem é criado e evolui.

O projeto é desenvolvido **aos poucos, em sprints** (metodologia ágil), com espaço para mudanças conforme a mesa pede coisas novas.

---

## 🗺️ Funcionalidades

### Já forjadas ✅
- 📜 **Cadastro de personagem** com nome, raça, sub-raça, classe, subclasse, nível, antecedente e alinhamento
- 🎭 **Sub-raças dinâmicas** — as opções aparecem conforme a raça escolhida
- 💪 **Atributos** com bônus raciais mapeados (raça + sub-raça)
- 🏰 **Taverna dos personagens** — lista todos os heróis salvos
- 🗑️ **Exclusão** de personagens
- 💾 **Persistência local** — tudo salvo no navegador, sem precisar de internet

### No caldeirão 🔮 (próximos sprints)
- ➕ Cálculo automático de modificadores e bônus de proficiência
- ❤️ Pontos de vida automáticos por nível e classe
- 🛌 Modos de Descanso Curto e Longo com ações destacadas
- ✨ Aba de gerenciamento de magias (com limite por nível e spell slots)
- 🎚️ Tela de _level up_ estilo Baldur's Gate 3 (Melhoria de Atributo / Talento / Magias)
- 🔥 Recursos de classe (Fúria, Ki, Pontos de Feitiçaria...)
- 🛡️ Combate (CA, iniciativa, ataques)
- 🎒 Inventário e moedas
- 📤 Exportar / importar fichas

---

## 🧙 Tecnologias

Puro e artesanal, sem frameworks:

- **HTML5** — a estrutura do pergaminho
- **CSS3** — o tema medieval (fontes _Cinzel_ e _Lora_, cores de pergaminho e sangue de dragão)
- **JavaScript** — a magia que automatiza tudo
- **localStorage** — o baú onde os heróis descansam

---

## 📖 Como Usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/Iaanzen/FichaAutomatica
   ```
2. Abra o arquivo `index.html` no seu navegador
3. Clique em **"Criar Novo Personagem"** e forje seu herói
4. Que os dados rolem a seu favor! 🎲

> Nenhuma instalação, servidor ou conexão necessária — é só abrir e jogar.

---

## 🗂️ Estrutura do Grimório

```
📁 projeto
├── index.html        # A Taverna (lista de personagens)
├── index.css         # Estilo da Taverna
├── cadastro.html     # A ficha de criação de personagem
├── cadastro.js       # A magia por trás do cadastro
├── ficha.css         # Estilo da ficha (tema folha oficial de D&D)
```

---

## 🛡️ Status

🚧 **Em desenvolvimento ativo** — novas funcionalidades sendo adicionadas sprint a sprint.

---

## 📜 Licença

Projeto pessoal e de estudo. _Dungeons & Dragons_ é propriedade da Wizards of the Coast — este projeto é uma ferramenta de fã, sem fins comerciais.

---

<p align="center">
  <em>Feito com 🎲 e muito café, entre uma sessão e outra.</em>
</p>
