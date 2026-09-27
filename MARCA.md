# A marca — como trocar

Tudo que é visual da marca mora na pasta **`marca/`**. O logo e o ícone que
estão lá agora são **provisórios**, feitos só para o app não ficar sem
identidade. Trocar não exige mexer em nenhuma página.

---

## Os dois arquivos

| Arquivo | Onde aparece |
|---|---|
| `marca/logo.svg` | Tela de entrada (grande) e topo da lista de personagens (menor) |
| `marca/favicon.svg` | Ícone da aba do navegador, em todas as páginas |

---

## Trocar o logo

**Se vier em SVG:** sobrescreva `marca/logo.svg`. Acabou.

**Se vier em outro formato** (PNG, WebP), coloque o arquivo na pasta `marca/` e
mude **uma linha** em cada uma das duas folhas de estilo, `cadastro.css` e
`index.css`:

```css
:root {
    --marca-logo: url("marca/logo.png");
}
```

São duas folhas porque a lista de personagens tem estilo próprio. É o mesmo
lugar onde as cores do app já são repetidas.

### O que pedir à designer

- **Proporção livre.** O CSS usa `background-size: contain`, então qualquer
  formato de retângulo entra sem distorcer.
- **Fundo transparente.** O logo aparece sobre o pergaminho claro na tela de
  entrada e sobre o fundo escuro na lista. Fundo sólido só funcionaria num dos
  dois.
- **Legível em 230 px de largura**, que é o tamanho menor usado.
- **SVG é o ideal** (fica nítido em qualquer tela e pesa pouco). Se for PNG,
  peça no mínimo 3x o tamanho de exibição: cerca de 960 px de largura.

### Cuidado ao trocar

Se o arquivo não carregar (nome errado, formato errado), **a tela mostra um
espaço vazio**, não uma mensagem de erro. O nome do app continua no HTML para
leitores de tela, mas não aparece.

Depois de trocar, abra a tela de entrada e a lista de personagens para conferir.

---

## Trocar o ícone da aba

Sobrescreva `marca/favicon.svg`.

Se vier em `.ico` ou `.png`, troque o `<link rel="icon">` nas **sete** páginas
(`index`, `login`, `cadastro`, `ficha`, `levelup`, `magias`, `admin`):

```html
<link rel="icon" href="marca/favicon.png" type="image/png" />
```

O que pedir: quadrado, legível a **16 px**. Ícone com muito detalhe vira um
borrão nesse tamanho — o provisório usa formas cheias por isso.

---

## O nome escrito

**Forja da Criação**, com "da".

Ele aparece como texto em:

- Título das abas do navegador (as sete páginas)
- `README.md`
- O arquivo de backup exportado, no campo `app` (`armazenamento.js`)
- Dentro do logo provisório

Se o nome mudar, esses são os lugares. Uma busca por `Forja da Criação` acha
todos.

---

## Publicar depois de trocar

```bash
firebase deploy --only hosting
```

O ícone da aba costuma ficar no cache do navegador. Se continuar aparecendo o
antigo, recarregue com **Ctrl + Shift + R**.
