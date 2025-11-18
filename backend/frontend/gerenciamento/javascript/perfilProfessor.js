// autoria por alycia bond
// perfil do professor — usando apenas localstorage

// pega o id, nome e email do usuário do localstorage
const usuarioId = localStorage.getItem("usuarioId");
const usuarioNome = localStorage.getItem("usuarioNome");
const usuarioEmail = localStorage.getItem("usuarioEmail");

// se não tiver id de usuário, redireciona para a página de login
if (!usuarioId) {
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

// carregar perfil do localstorage
function carregarPerfil() {
  // define nome e email do professor nos elementos html
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

// atualizar email
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId,
        novoEmail,
        senha
      })
    });

    const json = await resp.json();

    // exibe erro caso a resposta não seja ok
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

// atualizar senha
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioId,
        senhaAtual: atual,
        novaSenha: nova
      })
    });

    const json = await resp.json();

    // exibe erro caso não esteja ok
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

// logout
$("btnLogout").onclick = () => {
  // apaga todos os dados do localstorage e volta para o login
  localStorage.clear();
  window.location.href = "/auth/html/login.html";
};

// menu
$("btnInstituicoes").onclick = () => {
  // redireciona para o dashboard de gerenciamento
  window.location.href = "/gerenciar/html/dashboard.html";
};

// iniciar função de carregamento do perfil ao abrir a página
carregarPerfil();
