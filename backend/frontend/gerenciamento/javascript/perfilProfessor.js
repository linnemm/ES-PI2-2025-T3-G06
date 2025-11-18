// Autoria: Alycia

// PERFIL DO PROFESSOR — LOCALSTORAGE + TOKEN + /me

// pega o id, nome e email do usuário do localstorage
const usuarioId = localStorage.getItem("usuarioId");
const token = localStorage.getItem("token");

if (!usuarioId || !token) {
  window.location.href = "/auth/html/login.html";
}

// função auxiliar para pegar elementos pelo id
const $ = (id) => document.getElementById(id);

// função para exibir toast de notificação
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

  // gera iniciais para o avatar
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
  e.preventDefault(); // evita recarregar a página

  // pega o novo email e a senha informada
  const novoEmail = $("novoEmail").value.trim();
  const senha = $("senhaConfirmaEmail").value.trim();

  // valida se os campos foram preenchidos
  if (!novoEmail || !senha) return toast("preencha tudo.");

  try {
    // envia requisição para o backend atualizar o email
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

    toast("e-mail atualizado!");

    // atualiza email salvo no localstorage e na interface
    localStorage.setItem("usuarioEmail", novoEmail);
    $("emailProfessor").textContent = novoEmail;

    // limpa os campos do formulário
    $("novoEmail").value = "";
    $("senhaConfirmaEmail").value = "";

  } catch (e) {
    toast("erro ao atualizar e-mail.");
  }
});

// ATUALIZAR SENHA

$("formSenha").addEventListener("submit", async (e) => {
  e.preventDefault(); // evita recarregar a página

  // pega as senhas informadas no formulário
  const atual = $("senhaAtual").value.trim();
  const nova = $("novaSenha").value.trim();
  const conf = $("confirmaSenha").value.trim();

  // valida preenchimento e confirmação
  if (!atual || !nova || !conf) return toast("preencha tudo.");
  if (nova !== conf) return toast("a confirmação não confere.");

  try {
    // envia requisição para o backend atualizar a senha
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

    toast("senha alterada!");

    // limpa campos do formulário
    $("senhaAtual").value = "";
    $("novaSenha").value = "";
    $("confirmaSenha").value = "";

  } catch (err) {
    toast("erro ao atualizar senha.");
  }
});

// LOGOUT

$("btnLogout").onclick = () => {
  // apaga todos os dados do localstorage e volta para o login
  localStorage.clear();
  window.location.href = "/auth/html/login.html";
};

// MENU

$("btnInstituicoes").onclick = () => {
  // redireciona para o dashboard de gerenciamento
  window.location.href = "/gerenciar/html/dashboard.html";
};

// INICIAR

carregarDoBanco().then(() => {
  carregarPerfil();
});
