// ===========================================================
// CADASTRO DE INSTITUIÇÃO — JS DEFINITIVO
// ===========================================================

// Inputs
const form = document.getElementById("formInstituicao");
const nomeInput = document.getElementById("nome");
const siglaInput = document.getElementById("sigla");

// Usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Se não tiver usuário
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

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

    verificarProximoPasso();

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
    // Buscar instituições
    const respInst = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const instituicoes = await respInst.json();

    if (!respInst.ok) {
      alert("Erro ao verificar instituições.");
      return;
    }

    const inst = instituicoes[instituicoes.length - 1]; // pega a última criada
    localStorage.setItem("instituicaoId", inst.ID);

    // Buscar cursos desta instituição (ROTA CORRETA!)
    const respCurso = await fetch(`/api/cursos/listar/${inst.ID}`);
    const cursos = await respCurso.json();

    if (!respCurso.ok) {
      alert("Erro ao verificar cursos.");
      return;
    }

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
