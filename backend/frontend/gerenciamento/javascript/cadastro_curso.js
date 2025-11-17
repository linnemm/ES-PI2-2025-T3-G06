// ===========================================================
// CADASTRO DE CURSO — JS DEFINITIVO
// ===========================================================

// Usuário logado
const usuarioId = localStorage.getItem("usuarioId");

if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

// ===========================================================
// 🔒 BLOQUEAR MENUS VIA BACKEND (INSTITUIÇÕES + CURSOS)
// ===========================================================
async function bloquearMenusBackend() {
  const btnInst = document.getElementById("btnInstituicoes");
  const btnPerfil = document.getElementById("btnPerfil");

  try {
    const respInst = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const instituicoes = await respInst.json();

    if (!instituicoes || instituicoes.length === 0) {
      btnInst?.classList.add("desabilitado");
      btnPerfil?.classList.add("desabilitado");
      return;
    }

    const instId = instituicoes[instituicoes.length - 1].ID;

    const respCurso = await fetch(`/api/cursos/listar/${instId}`);
    const cursos = await respCurso.json();

    if (!cursos || cursos.length === 0) {
      btnInst?.classList.remove("desabilitado"); // Inst pode acessar
      btnPerfil?.classList.add("desabilitado");
      return;
    }

    btnInst?.classList.remove("desabilitado");
    btnPerfil?.classList.remove("desabilitado");

  } catch (err) {
    console.error("Erro ao verificar bloqueios:", err);
  }
}

bloquearMenusBackend();

// ===========================================================
// REDIRECIONAR PARA DASHBOARD (botão Instituições)
// ===========================================================
document.getElementById("btnInstituicoes").addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/gerenciar/html/dashboard.html";
});

// ===========================================================
// FORM INPUTS
// ===========================================================
const form = document.getElementById("formCurso");
const selectInst = document.getElementById("instituicao");
const nomeInput = document.getElementById("nome");
const siglaInput = document.getElementById("sigla");
const coordenadorInput = document.getElementById("coordenador");

// ===========================================================
// CARREGAR INSTITUIÇÕES
// ===========================================================
async function carregarInstituicoesSelect() {

  selectInst.innerHTML = `<option value="">Carregando instituições...</option>`;

  try {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const lista = await resp.json();

    if (!lista || lista.length === 0) {
      selectInst.innerHTML = `<option value="">Nenhuma instituição cadastrada</option>`;
      return;
    }

    selectInst.innerHTML = `<option value="">Selecione uma instituição</option>`;

    lista.forEach(inst => {
      const opt = document.createElement("option");
      opt.value = inst.ID;
      opt.textContent = `${inst.NOME} (${inst.SIGLA})`;
      selectInst.appendChild(opt);
    });

  } catch (err) {
    console.error("Erro ao listar instituições:", err);
    selectInst.innerHTML = `<option value="">Erro ao carregar instituições</option>`;
  }
}

carregarInstituicoesSelect();

// ===========================================================
// SALVAR CURSO — REDIRECIONAMENTO INTELIGENTE
// ===========================================================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const instSelecionada = selectInst.value;
  const nome = nomeInput.value.trim();
  const sigla = siglaInput.value.trim();
  const coordenador = coordenadorInput.value.trim();

  if (!instSelecionada) return alert("Selecione uma instituição.");
  if (!nome || !sigla || !coordenador) return alert("Preencha todos os campos.");
  if (sigla.length < 2) return alert("A sigla deve ter pelo menos 2 caracteres.");

  try {
    const resp = await fetch("/api/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // Recarrega menus
    await bloquearMenusBackend();

    // 🔍 Verifica quantos cursos existem após cadastrar
    const respCursos = await fetch(`/api/cursos/listar/${instSelecionada}`);
    const listaCursos = await respCursos.json();

    // PRIMEIRO CURSO → DASHBOARD
    if (listaCursos.length === 1) {
      window.location.href = "/gerenciar/html/dashboard.html";
      return;
    }

    // JÁ EXISTEM OUTROS → LISTA DE CURSOS
    window.location.href = `/gerenciar/html/listaCursos.html?inst=${instSelecionada}`;

  } catch (erro) {
    console.error("Erro ao cadastrar curso:", erro);
    alert("Erro ao conectar ao servidor.");
  }
});

// ===========================================================
// ENTER → Avança para o próximo campo
// ===========================================================
const inputsCurso = document.querySelectorAll("#formCurso input, #formCurso select");

inputsCurso.forEach((input, i) => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ultimo = i === inputsCurso.length - 1;
      if (ultimo) form.requestSubmit();
      else inputsCurso[i + 1].focus();
    }
  });
});
