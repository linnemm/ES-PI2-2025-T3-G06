// Autoria: Alycia

// PERFIL DO PROFESSOR — LOCALSTORAGE + TOKEN + /me

const usuarioId = localStorage.getItem("usuarioId");
const token = localStorage.getItem("token");

if (!usuarioId || !token) {
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

// BUSCAR DADOS DO USUÁRIO PELO BACKEND (/me)

async function carregarDoBanco() {
  try {
    const resp = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!resp.ok) return;

    const json = await resp.json();

    // Atualiza localStorage com dados reais do banco
    localStorage.setItem("usuarioNome", json.nome);
    localStorage.setItem("usuarioEmail", json.email);

  } catch (err) {
    console.log("Erro ao carregar do banco:", err);
  }
}

// CARREGAR PERFIL DO LOCALSTORAGE

function carregarPerfil() {
  const usuarioNome = localStorage.getItem("usuarioNome");
  const usuarioEmail = localStorage.getItem("usuarioEmail");

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

// ATUALIZAR EMAIL

$("formEmail").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoEmail = $("novoEmail").value.trim();
  const senha = $("senhaConfirmaEmail").value.trim();

  if (!novoEmail || !senha) return toast("Preencha tudo.");

  try {
    const resp = await fetch(`/api/auth/update-email`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`   
      },
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

// ATUALIZAR SENHA

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
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`   // OBRIGATÓRIO
      },
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

// LOGOUT

$("btnLogout").onclick = () => {
  localStorage.clear();
  window.location.href = "/auth/html/login.html";
};

// MENU

$("btnInstituicoes").onclick = () => {
  window.location.href = "/gerenciar/html/dashboard.html";
};

// INICIAR

carregarDoBanco().then(() => {
  carregarPerfil();
});
