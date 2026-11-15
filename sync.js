/* Cofrinho · sincronização na nuvem (Firebase Auth + Firestore).
   Só roda se firebase-config.js tiver a configuração. O app continua funcionando
   offline e sem login: os dados locais são a fonte principal e a nuvem é uma cópia
   sincronizada. Regra de conflito: vence a alteração mais recente (updatedAt). */
const cfg = window.COFRINHO_FIREBASE, app = window.cofrinhoApp;
const $ = (id) => document.getElementById(id);
const BASE = "https://www.gstatic.com/firebasejs/10.14.1/";

if (cfg && cfg.apiKey && cfg.projectId && app) boot().catch((e) => console.warn("Sincronização indisponível:", e));

async function boot() {
  const [A, Au, F] = await Promise.all([
    import(BASE + "firebase-app.js"),
    import(BASE + "firebase-auth.js"),
    import(BASE + "firebase-firestore.js"),
  ]);
  const fb = A.initializeApp(cfg), auth = Au.getAuth(fb);
  const db = F.initializeFirestore(fb, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });
  $("cloudCard").hidden = false;

  let ref = null, unsub = null, timer = null, first = true;
  const clean = (o) => JSON.parse(JSON.stringify(o));
  const fmtTime = (d) => d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  function setErr(msg) { const e = $("cloudErr"); e.hidden = !msg; e.textContent = msg || ""; }
  function human(e) {
    const c = (e && e.code) || "";
    if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found")) return "E-mail ou senha incorretos.";
    if (c.includes("email-already-in-use")) return "Este e-mail já tem conta. Use Entrar.";
    if (c.includes("weak-password")) return "A senha precisa ter pelo menos 6 caracteres.";
    if (c.includes("invalid-email")) return "Digite um e-mail válido.";
    if (c.includes("network")) return "Sem conexão com a internet. Tente de novo.";
    if (c.includes("popup-closed") || c.includes("cancelled-popup")) return "";
    if (c.includes("popup-blocked")) return "O navegador bloqueou a janela de login. Libere pop-ups ou use e-mail e senha.";
    if (c.includes("unauthorized-domain")) return "Este endereço não está autorizado no Firebase. Adicione-o em Authentication > Settings > Authorized domains.";
    return "Não foi possível concluir. Tente novamente.";
  }
  function status(txt) { $("cLast").textContent = txt; }
  function stamp() { status("hoje às " + fmtTime(new Date())); }

  async function push() {
    if (!ref) return;
    const st = app.getState();
    try {
      await F.setDoc(ref, { schema: 1, updatedAt: st.updatedAt || Date.now(), state: clean(st) });
      stamp();
    } catch (e) { status("Sem conexão, sincroniza ao voltar"); }
  }
  app.onChange = function () {
    if (!ref) return;
    status("Sincronizando…");
    clearTimeout(timer); timer = setTimeout(push, 800);
  };

  function hasData(st) { return (st.done && st.done.length > 0) || (st.extras && st.extras.length > 0); }
  function sum(st) { const s = app.summary(st); return fmtMoney(s.saved) + " (" + s.done + " quadrados, " + s.extras + " extras)"; }
  function fmtMoney(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

  function onSnap(snap) {
    if (snap.metadata && snap.metadata.hasPendingWrites) return;
    const local = app.getState(), remote = snap.exists() ? snap.data() : null;
    if (!remote || !remote.state) { first = false; push(); return; }
    const rs = remote.state, rt = remote.updatedAt || 0, lt = local.updatedAt || 0;
    if (first) {
      first = false;
      if (!hasData(local)) { app.replaceState(rs); stamp(); app.toast("Dados carregados da nuvem."); return; }
      const a = app.summary(local), b = app.summary(rs);
      const same = a.saved === b.saved && a.done === b.done && a.extras === b.extras && local.goal === rs.goal;
      if (hasData(rs) && !same) {
        $("cConflictTxt").textContent = "Neste aparelho: " + sum(local) + ". Na nuvem: " + sum(rs) + ". Qual versão você quer manter?";
        $("cConflict").hidden = false;
        $("cUseCloud").onclick = () => { $("cConflict").hidden = true; app.replaceState(rs); stamp(); app.toast("Dados da nuvem restaurados."); };
        $("cUseLocal").onclick = () => { $("cConflict").hidden = true; app.touch(); push(); app.toast("Dados deste aparelho enviados."); };
        return;
      }
      if (rt > lt) { app.replaceState(rs); } else { push(); return; }
      stamp(); return;
    }
    if (rt > lt) { app.replaceState(rs); stamp(); app.toast("Atualizado a partir de outro aparelho."); }
  }

  function showUser(u) {
    $("cloudOut").hidden = !!u; $("cloudIn").hidden = !u;
    $("chipTxt").textContent = u ? "Sincronizado na sua conta" : "Dados só neste dispositivo";
    $("cloudDesc").textContent = u ? "Seus dados ficam salvos na sua conta e sincronizam entre aparelhos." : "Entre para guardar seus dados na sua conta e usar em vários aparelhos.";
    if (u) $("cUser").textContent = u.email || "Conta Google";
  }
  Au.onAuthStateChanged(auth, (u) => {
    if (unsub) { unsub(); unsub = null; }
    clearTimeout(timer); ref = null; first = true; showUser(u); setErr("");
    if (!u) { $("cConflict").hidden = true; return; }
    ref = F.doc(db, "users", u.uid); status("Sincronizando…");
    unsub = F.onSnapshot(ref, onSnap, () => status("Sem conexão, sincroniza ao voltar"));
  });

  async function run(fn) { setErr(""); try { await fn(); } catch (e) { setErr(human(e)); } }
  $("cGoogle").addEventListener("click", () => run(() => Au.signInWithPopup(auth, new Au.GoogleAuthProvider())));
  function creds() {
    const email = $("cEmail").value.trim(), pass = $("cPass").value;
    if (!email || !pass) { setErr("Preencha e-mail e senha."); return null; }
    return [email, pass];
  }
  $("cloudForm").addEventListener("submit", (ev) => { ev.preventDefault(); const c = creds(); if (c) run(() => Au.signInWithEmailAndPassword(auth, c[0], c[1])); });
  $("cSignUp").addEventListener("click", () => { const c = creds(); if (c) run(() => Au.createUserWithEmailAndPassword(auth, c[0], c[1])); });
  $("cOut").addEventListener("click", () => run(async () => { await Au.signOut(auth); app.toast("Você saiu. Os dados continuam neste aparelho."); }));
}
