// =========================================================
// PERFIL DO PROFESSOR — NotaDez
//  - Carrega dados do usuário logado
//  - Atualiza e-mail
//  - Atualiza senha
// =========================================================

// Base da API (seu backend está em http://localhost:3000)
const API = "/api";

// Token salvo no login
const TOKEN = localStorage.getItem("token");

// Se não tiver token, volta pro login
if (!TOKEN) {
  window.location.href = "/auth/html/login.html";
}

// Atalho pra pegar elementos
const $ = (id) => document.getElementById(id);

// ===============================
// TOAST SIMPLES (mensagem embaixo)
// ===============================
function toast(msg) {
  const t = $("toast");
  if (!t) {
    alert(msg);
    return;
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ===============================
// 1. CARREGAR PERFIL DO PROFESSOR
// ===============================
async function carregarPerfil() {
  try {
    const resp = await fetch(`${API}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const prof = await resp.json();

    if (!resp.ok) {
      console.error("Erro /auth/me:", prof);
      toast(prof.message || "Erro ao carregar perfil.");
      return;
    }

    // Atualiza nome + email na tela
    $("nomeProfessor").textContent = prof.nome || "Sem nome";
    $("emailProfessor").textContent = prof.email || "-";

    // Avatar com iniciais
    const iniciais = (prof.nome || "?")
      .split(" ")
      .filter((p) => p.trim() !== "")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    $("letrasAvatar").textContent = iniciais;
  } catch (err) {
    console.error(err);
    toast("Erro ao conectar ao servidor.");
  }
}

// ===============================
// 2. TROCAR E-MAIL
// ===============================
function initTrocaEmail() {
  const formEmail = $("formEmail");
  if (!formEmail) return;

  formEmail.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoEmail = $("novoEmail").value.trim();
    const senhaAtual = $("senhaConfirmaEmail").value;

    if (!novoEmail || !senhaAtual) {
      toast("Preencha todos os campos.");
      return;
    }

    // Validação simples de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) {
      toast("E-mail inválido.");
      return;
    }

    try {
      const resp = await fetch(`${API}/auth/update-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          novoEmail,
          senha: senhaAtual,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast(data.message || "Erro ao atualizar e-mail.");
        return;
      }

      toast("E-mail atualizado com sucesso!");
      $("novoEmail").value = "";
      $("senhaConfirmaEmail").value = "";
      carregarPerfil();
    } catch (err) {
      console.error(err);
      toast("Erro ao atualizar e-mail.");
    }
  });

  $("cancelarEmail")?.addEventListener("click", () => {
    $("novoEmail").value = "";
    $("senhaConfirmaEmail").value = "";
  });
}

// ===============================
// 3. TROCAR SENHA
// ===============================
function initTrocaSenha() {
  const formSenha = $("formSenha");
  if (!formSenha) return;

  formSenha.addEventListener("submit", async (e) => {
    e.preventDefault();

    const atual = $("senhaAtual").value;
    const nova = $("novaSenha").value;
    const conf = $("confirmaSenha").value;

    if (!atual || !nova || !conf) {
      toast("Preencha todos os campos.");
      return;
    }

    if (nova.length < 8) {
      toast("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (nova !== conf) {
      toast("A confirmação não confere.");
      return;
    }

    try {
      const resp = await fetch(`${API}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          senhaAtual: atual,
          novaSenha: nova,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        toast(data.message || "Erro ao atualizar senha.");
        return;
      }

      toast("Senha alterada com sucesso!");
      $("senhaAtual").value = "";
      $("novaSenha").value = "";
      $("confirmaSenha").value = "";
      atualizarForca("");
    } catch (err) {
      console.error(err);
      toast("Erro ao atualizar senha.");
    }
  });

  $("cancelarSenha")?.addEventListener("click", () => {
    $("senhaAtual").value = "";
    $("novaSenha").value = "";
    $("confirmaSenha").value = "";
    atualizarForca("");
  });
}

// ===============================
// 4. FORÇA DA SENHA (barrinha)
// ===============================
function calcForca(s) {
  let p = 0;
  if (s.length >= 8) p++;
  if (/[A-Z]/.test(s)) p++;
  if (/[a-z]/.test(s)) p++;
  if (/[0-9]/.test(s)) p++;
  if (/[^A-Za-z0-9]/.test(s)) p++;
  return p; // 0..5
}

function atualizarForca(s) {
  const barraContainer = $("forcaSenha");
  if (!barraContainer) return;

  const barra = barraContainer.querySelector("span");
  if (!barra) return;

  const nivel = calcForca(s);
  const larguras = ["10%", "25%", "40%", "60%", "80%", "100%"];
  const cores = ["#b33a3a", "#d76c3c", "#d6b23a", "#6aa86f", "#5c8c75"];

  barra.style.width = larguras[nivel];
  barra.style.background = cores[Math.max(0, nivel - 1)];
}

$("novaSenha")?.addEventListener("input", (e) => {
  atualizarForca(e.target.value);
});

// ===============================
// 5. LOGOUT PELO BOTÃO "Sair"
// ===============================
document.getElementById("btnLogout")?.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "/auth/html/login.html";
});

// ===============================
// 6. INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  carregarPerfil();
  initTrocaEmail();
  initTrocaSenha();
});
