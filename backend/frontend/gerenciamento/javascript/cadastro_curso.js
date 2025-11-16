// ===========================================================
// CADASTRO DE CURSO — JS COMPLETO E ATUALIZADO
// ===========================================================

// Inputs do formulário
const form = document.getElementById("formCurso");
const selectInst = document.getElementById("instituicao");
const nomeInput = document.getElementById("nome");
const siglaInput = document.getElementById("sigla");
const coordenadorInput = document.getElementById("coordenador");

// Dados salvos no login
const usuarioId = localStorage.getItem("usuarioId");
const instituicaoId = localStorage.getItem("instituicaoId");

// Verificação de segurança
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

// ===========================================================
// 🔥 CARREGAR LISTA DE INSTITUIÇÕES NO SELECT
// ===========================================================
async function carregarInstituicoesSelect() {

  selectInst.innerHTML = `<option value="">Carregando instituições...</option>`;

  try {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const lista = await resp.json();

    if (!resp.ok) {
      selectInst.innerHTML = `<option value="">Erro ao carregar instituições</option>`;
      return;
    }

    if (lista.length === 0) {
      selectInst.innerHTML = `<option value="">Nenhuma instituição encontrada</option>`;
      return;
    }

    // Limpa para inserir as opções reais
    selectInst.innerHTML = `<option value="">Selecione uma instituição</option>`;

    // Preenche o select
    lista.forEach(inst => {
      const opt = document.createElement("option");
      opt.value = inst.ID;
      opt.textContent = `${inst.NOME} (${inst.SIGLA})`;
      selectInst.appendChild(opt);
    });

    // Seleciona automaticamente a instituição que acabou de ser criada
    if (instituicaoId) {
      selectInst.value = instituicaoId;
    }

  } catch (erro) {
    console.error("Erro ao carregar instituições:", erro);
    selectInst.innerHTML = `<option value="">Erro ao conectar ao servidor</option>`;
  }
}

carregarInstituicoesSelect();

// ===========================================================
// 🔥 SALVAR CURSO NO BANCO
// ===========================================================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const instSelecionada = selectInst.value;
  const nome = nomeInput.value.trim();
  const sigla = siglaInput.value.trim();
  const coordenador = coordenadorInput.value.trim();

  // ========================
  // VALIDAÇÕES
  // ========================
  if (!instSelecionada) {
    alert("Selecione uma instituição.");
    return;
  }

  if (!nome || !sigla || !coordenador) {
    alert("Preencha todos os campos!");
    return;
  }

  if (sigla.length < 2) {
    alert("A sigla deve ter pelo menos 2 caracteres.");
    return;
  }

  try {
    const resp = await fetch("/api/cursos", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        nome,
        sigla,
        coordenador,
        instituicaoId: Number(instSelecionada),
        usuarioId: Number(usuarioId)
      })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert(dados.message || "Erro ao cadastrar curso.");
      return;
    }

    alert("Curso cadastrado com sucesso!");

    // Avança para dashboard
    window.location.href = "/gerenciar/html/dashboard.html";

  } catch (erro) {
    console.error("Erro ao cadastrar curso:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});

// ===========================================================
// 🔥 ENTER → IR PARA PRÓXIMO / ENVIAR FORM
// ===========================================================
const inputsCurso = document.querySelectorAll("#formCurso input, #formCurso select");

inputsCurso.forEach((input, i) => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();

      const ultimo = i === inputsCurso.length - 1;

      if (ultimo) {
        form.requestSubmit();
      } else {
        inputsCurso[i + 1].focus();
      }
    }
  });
});
