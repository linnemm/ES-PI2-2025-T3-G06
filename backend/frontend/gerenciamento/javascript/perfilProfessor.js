// =========================================================
// PERFIL DO PROFESSOR — UTILIZANDO SOMENTE LOCALSTORAGE
// =========================================================

const usuarioId = localStorage.getItem("usuarioId");
const usuarioNome = localStorage.getItem("usuarioNome");
const usuarioEmail = localStorage.getItem("usuarioEmail");

if (!usuarioId) {
  window.location.href = "/auth/html/login.html";
}

const $ = (id) => document.getElementById(id);

// Toast
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// =========================================================
// 1 — CARREGAR PERFIL DO LOCALSTORAGE
// =========================================================
function carregarPerfil() {
  $("nomeProfessor").textContent = usuarioNome || "Professor";
  $("emailProfessor").textContent = usuarioEmail || "-";

  const iniciais = (usuarioNome || "?")
    .split(" ")
    .map(p => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  $("letrasAvatar").textContent = iniciais;
}

// =========================================================
// 2 — ATUALIZAR EMAIL
// =========================================================
$("formEmail").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoEmail = $("novoEmail").value.trim();
  const senha = $("senhaConfirmaEmail").value.trim();

  if (!novoEmail || !senha) return toast("Preencha tudo.");

  try {
    const resp = await fetch(`/api/auth/update-email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId,
        novoEmail,
        senha
      })
    });

    const json = await resp.json();

    if (!resp.ok) return toast(json.message);

    toast("E-mail atualizado!");

    // Atualiza localStorage
    localStorage.setItem("usuarioEmail", novoEmail);
    $("emailProfessor").textContent = novoEmail;

    $("novoEmail").value = "";
    $("senhaConfirmaEmail").value = "";

  } catch (e) {
    toast("Erro ao atualizar e-mail.");
  }
});

// =========================================================
// 3 — ATUALIZAR SENHA
// =========================================================
$("formSenha").addEventListener("submit", async (e) => {
  e.preventDefault();

  const atual = $("senhaAtual").value.trim();
  const nova = $("novaSenha").value.trim();
  const conf = $("confirmaSenha").value.trim();

  if (!atual || !nova || !conf) return toast("Preencha tudo.");
  if (nova !== conf) return toast("A confirmação não confere.");

  try {
    const resp = await fetch(`/api/auth/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId,
        senhaAtual: atual,
        novaSenha: nova
      })
    });

    const json = await resp.json();

    if (!resp.ok) return toast(json.message);

    toast("Senha alterada!");

    $("senhaAtual").value = "";
    $("novaSenha").value = "";
    $("confirmaSenha").value = "";

  } catch (err) {
    toast("Erro ao atualizar senha.");
  }
});

// =========================================================
// 4 — LOGOUT
// =========================================================
$("btnLogout").onclick = () => {
  localStorage.clear();
  window.location.href = "/auth/html/login.html";
};

// =========================================================
// 5 — MENU
// =========================================================
$("btnInstituicoes").onclick = () => {
  window.location.href = "/gerenciar/html/dashboard.html";
};

// =========================================================
// INICIAR
// =========================================================
carregarPerfil();
