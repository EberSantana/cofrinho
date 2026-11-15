/* Configuração do Firebase do Cofrinho.
   Enquanto estiver null, o app funciona só com os dados do próprio aparelho.
   Para ativar a sincronização, cole aqui o objeto firebaseConfig do seu app web
   (Console do Firebase > Configurações do projeto > Seus apps > App da Web).
   Esses valores são públicos por design: a proteção dos dados está em firestore.rules.

   Exemplo:
   window.COFRINHO_FIREBASE = {
     apiKey: "AIza...",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto",
     appId: "1:123456789:web:abcdef"
   };
*/
window.COFRINHO_FIREBASE = null;
