// ================================================
// CADASTRO DE TURMA — VERSÃO FINAL CORRIGIDA
// ================================================
document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  const form = $("formTurma");
  const selInstituicao = $("instituicao");
  const selCurso = $("curso");
  const selDisciplina = $("disciplinaId");

  const usuarioId = localStorage.getItem("usuarioId");

  // Segurança
  if (!usuarioId) {
    alert("Erro: usuário não identificado.");
    window.location.href = "/auth/html/login.html";
    return;
  }

  // =====================================================
  // PEGAR PARÂMETROS DA URL
  // =====================================================
  const params = new URLSearchParams(window.location.search);

  let instituicaoId = params.get("inst");
  let cursoId = params.get("curso");
  let disciplinaId = params.get("disc");

  // =====================================================
  // 1) CARREGAR INSTITUIÇÕES DO USUÁRIO
  // =====================================================
  async function carregarInstituicoes() {
    try {
      const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
      const dados = await resp.json();

      selInstituicao.innerHTML = `<option value="">Selecione...</option>`;

      dados.forEach(inst => {
        const opt = document.createElement("option");
        opt.value = inst.ID;
        opt.textContent = inst.NOME;
        selInstituicao.appendChild(opt);
      });

      // Se veio pela URL → selecionar automaticamente
      if (instituicaoId) {
        selInstituicao.value = instituicaoId;
        carregarCursos(); // já carrega os cursos
      }

    } catch (e) {
      console.error("Erro ao carregar instituições:", e);
    }
  }

  carregarInstituicoes();

  // =====================================================
  // 2) AO SELECIONAR INSTITUIÇÃO → CARREGAR CURSOS
  // =====================================================
  async function carregarCursos() {
    selCurso.innerHTML = `<option value="">Carregando...</option>`;
    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    try {
      const resp = await fetch(`/api/cursos/listar/${selInstituicao.value}`);
      const cursos = await resp.json();

      selCurso.innerHTML = `<option value="">Selecione...</option>`;

      cursos.forEach(curso => {
        const opt = document.createElement("option");
        opt.value = curso.ID;
        opt.textContent = curso.NOME;
        selCurso.appendChild(opt);
      });

      if (cursoId) {
        selCurso.value = cursoId;
        carregarDisciplinas();
      }

    } catch (e) {
      console.error("Erro ao carregar cursos:", e);
    }
  }

  selInstituicao.addEventListener("change", () => {
    instituicaoId = selInstituicao.value;
    carregarCursos();
  });

  // =====================================================
  // 3) AO SELECIONAR CURSO → CARREGAR DISCIPLINAS
  // =====================================================
  async function carregarDisciplinas() {
    selDisciplina.innerHTML = `<option value="">Carregando...</option>`;

    try {
      const resp = await fetch(`/api/disciplinas/curso/${selCurso.value}`);
      const disciplinas = await resp.json();

      selDisciplina.innerHTML = `<option value="">Selecione...</option>`;

      disciplinas.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.ID;
        opt.textContent = `${d.NOME} (${d.CODIGO})`;
        selDisciplina.appendChild(opt);
      });

      if (disciplinaId) {
        selDisciplina.value = disciplinaId;
      }

    } catch (e) {
      console.error("Erro ao carregar disciplinas:", e);
    }
  }

  selCurso.addEventListener("change", () => {
    cursoId = selCurso.value;
    carregarDisciplinas();
  });

  // =====================================================
  // 4) SALVAR TURMA
  // =====================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      instituicaoId: Number(selInstituicao.value),
      cursoId: Number(selCurso.value),
      disciplinaId: Number(selDisciplina.value),
      nome: $("nomeTurma").value.trim(),
      diaSemana: $("diaSemana").value.trim(),
      horario: $("horario").value.trim(),
      localTurma: $("localTurma").value.trim()
    };

    if (!dados.instituicaoId || !dados.cursoId || !dados.disciplinaId ||
        !dados.nome || !dados.diaSemana || !dados.horario || !dados.localTurma) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const resp = await fetch("/api/turmas/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      const resultado = await resp.json();

      if (!resp.ok) {
        alert(resultado.message);
        return;
      }

      alert("Turma criada com sucesso!");

      window.location.href =
        `/gerenciar/html/listaTurmas.html?inst=${dados.instituicaoId}&curso=${dados.cursoId}&disc=${dados.disciplinaId}`;

    } catch (e) {
      console.error(e);
      alert("Erro ao criar turma!");
    }
  });

  // =====================================================
  // 5) CANCELAR
  // =====================================================
  $("btnCancelar").addEventListener("click", () => {
    history.back();
  });

});
