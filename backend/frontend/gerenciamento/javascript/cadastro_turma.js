// ================================================
// CADASTRO DE TURMA — FINALIZADO E CORRIGIDO
// ================================================
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formTurma");
  const btnCancelar = document.getElementById("btnCancelar");

  const selInstituicao = document.getElementById("instituicao");
  const selCurso = document.getElementById("curso");
  const selDisciplina = document.getElementById("disciplinaId");

  const usuarioId = localStorage.getItem("usuarioId");

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

    } catch (e) {
      console.error("Erro ao carregar instituições:", e);
    }
  }

  carregarInstituicoes();

  // =====================================================
  // 2) AO SELECIONAR INSTITUIÇÃO → CARREGAR CURSOS
  // =====================================================
  selInstituicao.addEventListener("change", async () => {
    selCurso.innerHTML = `<option value="">Selecione...</option>`;
    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    if (!selInstituicao.value) return;

    try {
      const resp = await fetch(`/api/cursos/listar/${selInstituicao.value}`);
      const cursos = await resp.json();

      cursos.forEach(curso => {
        const opt = document.createElement("option");
        opt.value = curso.ID;
        opt.textContent = curso.NOME;
        selCurso.appendChild(opt);
      });

    } catch (e) {
      console.error("Erro ao carregar cursos:", e);
    }
  });

  // =====================================================
  // 3) AO SELECIONAR CURSO → CARREGAR DISCIPLINAS
  // =====================================================
  selCurso.addEventListener("change", async () => {
    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    if (!selCurso.value) return;

    try {
      const resp = await fetch(`/api/disciplinas/curso/${selCurso.value}`);
      const disciplinas = await resp.json();

      disciplinas.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.ID;
        opt.textContent = `${d.NOME} (${d.CODIGO})`;
        selDisciplina.appendChild(opt);
      });

    } catch (e) {
      console.error("Erro ao carregar disciplinas:", e);
    }
  });

  // =====================================================
  // 4) SALVAR TURMA NO BANCO
  // =====================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeTurma").value.trim();
    const diaSemana = document.getElementById("diaSemana").value;
    const horario = document.getElementById("horario").value;
    const localTurma = document.getElementById("localTurma").value;

    if (!nome || !diaSemana || !horario || !localTurma ||
        !selInstituicao.value || !selCurso.value || !selDisciplina.value) {
      alert("Preencha todos os campos!");
      return;
    }

    const dados = {
      instituicaoId: Number(selInstituicao.value),
      cursoId: Number(selCurso.value),
      disciplinaId: Number(selDisciplina.value),
      nome,
      diaSemana,
      horario,
      localTurma
    };

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
      window.location.href = "/gerenciar/html/listaTurmas.html";

    } catch (e) {
      console.error(e);
      alert("Erro ao criar turma!");
    }
  });

  // =====================================================
  // 5) CANCELAR
  // =====================================================
  btnCancelar?.addEventListener("click", () => {
    window.location.href = "/gerenciar/html/listaTurmas.html";
  });

});
