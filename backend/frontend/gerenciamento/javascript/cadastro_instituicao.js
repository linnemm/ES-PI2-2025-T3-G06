// ===========================================================
// CADASTRO DE INSTITUIÇÃO — JS DEFINITIVO
// ===========================================================

// Usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Se não tiver usuário
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

// ===========================================================
// BLOQUEAR MENUS BASEADO NO BACKEND (SEM localStorage)
// ===========================================================
async function bloquearMenusBackend() {
  const btnInst = document.getElementById("btnInstituicoes");
  const btnPerfil = document.getElementById("btnPerfil");

  try {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const lista = await resp.json();

    if (!lista || lista.length === 0) {
      if (btnInst) btnInst.classList.add("desabilitado");
      if (btnPerfil) btnPerfil.classList.add("desabilitado");
    } else {
      if (btnInst) btnInst.classList.remove("desabilitado");
      if (btnPerfil) btnPerfil.classList.remove("desabilitado");
    }

  } catch (err) {
    console.error("Erro ao verificar instituições:", err);
  }
}

// executar bloqueio ao carregar a página
bloquearMenusBackend();

// ===========================================================
// REDIRECIONAR MENU → INSTITUIÇÕES → DASHBOARD
// ===========================================================
const btnInst = document.getElementById("btnInstituicoes");
if (btnInst) {
  btnInst.addEventListener("click", (e) => {
    if (btnInst.classList.contains("desabilitado")) return;
    e.preventDefault();
    window.location.href = "/gerenciar/html/dashboard.html";
  });
}

// ===========================================================
// FORMULÁRIO E INPUTS
// ===========================================================
const form = document.getElementById("formInstituicao");
const nomeInput = document.getElementById("nome");
const siglaInput = document.getElementById("sigla");

// ===========================================================
// VERIFICAR SE SIGLA JÁ EXISTE
// ===========================================================
async function siglaJaExiste(sigla) {
  try {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const instituicoes = await resp.json();
    if (!resp.ok) return false;

    return instituicoes.some(inst => inst.SIGLA.toLowerCase() === sigla.toLowerCase());

  } catch (e) {
    console.error(e);
    return false;
  }
}

// ===========================================================
// SUBMIT DO FORMULÁRIO
// ===========================================================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const sigla = siglaInput.value.trim();

  if (!nome || !sigla) return alert("Preencha todos os campos!");

  if (await siglaJaExiste(sigla)) {
    return alert("⚠ Já existe uma instituição com essa sigla.");
  }

  try {
    const resp = await fetch("/api/instituicoes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        nome,
        sigla,
        usuarioId: Number(usuarioId)
      })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert(dados.message || "Erro ao cadastrar.");
      return;
    }

    alert("Instituição cadastrada!");

    await verificarProximoPasso();

  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar ao servidor.");
  }
});

// ===========================================================
// ENTER para mudar de campo
// ===========================================================
const inputs = document.querySelectorAll("#formInstituicao input");
inputs.forEach((input, i) => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (i === inputs.length - 1) form.requestSubmit();
      else inputs[i + 1].focus();
    }
  });
});

// ===========================================================
// DEFINIR PROXIMA TELA
// ===========================================================
async function verificarProximoPasso() {
  try {
    const respInst = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const instituicoes = await respInst.json();

    const inst = instituicoes[instituicoes.length - 1];
    localStorage.setItem("instituicaoId", inst.ID);

    // desbloquear menus imediatamente
    await bloquearMenusBackend();

    const respCurso = await fetch(`/api/cursos/listar/${inst.ID}`);
    const cursos = await respCurso.json();

    if (cursos.length === 0) {
      window.location.href = "/gerenciar/html/cadastro_curso.html";
      return;
    }

    window.location.href = "/gerenciar/html/dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Erro ao continuar o fluxo.");
  }
}
