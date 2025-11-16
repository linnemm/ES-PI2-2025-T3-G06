// ===============================
// CONFIGURAÇÕES
// ===============================
const API = "http://localhost:3000/api";
const TOKEN = localStorage.getItem("token");

// Se não tiver token → desloga
if (!TOKEN) {
  window.location.href = "../../autenticacao/html/login.html";
}

const $ = (id) => document.getElementById(id);

const toast = (msg) => {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
};

// ===============================
// 1. CARREGAR PERFIL DO PROFESSOR
// ===============================
async function carregarPerfil() {
  try {
    const resp = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!resp.ok) throw new Error("Erro ao carregar perfil.");

    const prof = await resp.json();

    // Atualiza nome + email
    $("nomeProfessor").textContent = prof.nome;
    $("emailProfessor").textContent = prof.email;

    // Avatar
    const iniciais = prof.nome
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    $("letrasAvatar").textContent = iniciais;

  } catch (err) {
    console.error(err);
    toast("Erro ao carregar perfil.");
  }
}

// ===============================
// 2. TROCAR EMAIL
// ===============================
$("formEmail").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoEmail = $("novoEmail").value.trim();
  const senhaAtual = $("senhaConfirmaEmail").value;

  if (!novoEmail || !senhaAtual) {
    toast("Preencha todos os campos.");
    return;
  }

  // Validação simples de email
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
      body: JSON.stringify({ novoEmail, senha: senhaAtual }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      toast(data.message || "Erro ao atualizar e-mail.");
      return;
    }

    toast("E-mail atualizado!");
    carregarPerfil();

  } catch (err) {
    console.error(err);
    toast("Erro ao atualizar e-mail.");
  }
});

$("cancelarEmail").addEventListener("click", () => {
  $("novoEmail").value = "";
  $("senhaConfirmaEmail").value = "";
});

// ===============================
// 3. TROCAR SENHA
// ===============================
$("formSenha").addEventListener("submit", async (e) => {
  e.preventDefault();

  const atual = $("senhaAtual").value;
  const nova = $("novaSenha").value;
  const conf = $("confirmaSenha").value;

  if (!atual || !nova || !conf) return toast("Preencha todos os campos.");
  if (nova.length < 8) return toast("A nova senha deve ter pelo menos 8 caracteres.");
  if (nova !== conf) return toast("A confirmação não confere.");

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

    toast("Senha alterada!");
    $("senhaAtual").value = "";
    $("novaSenha").value = "";
    $("confirmaSenha").value = "";
    atualizarForca("");

  } catch (err) {
    console.error(err);
    toast("Erro ao atualizar senha.");
  }
});

$("cancelarSenha").addEventListener("click", () => {
  $("senhaAtual").value = "";
  $("novaSenha").value = "";
  $("confirmaSenha").value = "";
  atualizarForca("");
});

// ===============================
// 4. FORÇA DA SENHA
// ===============================
function calcForca(s) {
  let p = 0;
  if (s.length >= 8) p++;
  if (/[A-Z]/.test(s)) p++;
  if (/[a-z]/.test(s)) p++;
  if (/[0-9]/.test(s)) p++;
  if (/[^A-Za-z0-9]/.test(s)) p++;
  return p;
}

function atualizarForca(s) {
  const barra = $("forcaSenha").querySelector("span");
  const nivel = calcForca(s);

  const larguras = ["10%", "25%", "40%", "60%", "80%", "100%"];
  const cores = ["#b33a3a", "#d76c3c", "#d6b23a", "#6aa86f", "#5c8c75"];

  barra.style.width = larguras[nivel];
  barra.style.background = cores[Math.max(0, nivel - 1)];
}

$("novaSenha").addEventListener("input", (e) => atualizarForca(e.target.value));

// ===============================
// 5. MENU FLUTUANTE (sem alterações)
// ===============================
document.addEventListener("DOMContentLoaded", () => carregarPerfil());
