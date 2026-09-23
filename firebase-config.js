// Configuração do projeto no Firebase (forja-criacao).
//
// Estes valores são PÚBLICOS por natureza: eles só dizem qual projeto o app
// usa, não dão acesso a nada. Quem protege os dados são as regras do Firestore
// (Fase 2, etapa 2) — nunca esconder isto seria segurança de mentira.
//
// Por que os arquivos "compat" do Firebase: este app é feito de <script>
// clássicos, sem empacotador. O SDK moderno é ESM (import), que exigiria um
// passo de build. Os arquivos compat expõem um objeto global "firebase" e
// funcionam do jeito que o resto do projeto já funciona.

const firebaseConfig = {
    apiKey: "AIzaSyBBr5KIY8QSWTvqXxS33KLUuJRYfAZepoU",
    authDomain: "forja-criacao.firebaseapp.com",
    projectId: "forja-criacao",
    storageBucket: "forja-criacao.firebasestorage.app",
    messagingSenderId: "274426327745",
    appId: "1:274426327745:web:b027e036b0abf3ae1e5a40"
}

firebase.initializeApp(firebaseConfig)
