// =========================================================
//  CADASTRO DE ALUNO — VERSÃO FINAL E CORRIGIDA
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // 1) VALIDAR LOGIN
  // =========================================================
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Erro: usuário não encontrado. Faça login novamente.");
    window.location.href = "/auth/html/login.html";
    return;
  }

  // =========================================================
  // ELEMENTOS
  // =========================================================
  const selInstituicao = document.getElementById("instituicao");
  const selCurso       = document.getElementById("curso");
  const selDisciplina  = document.getElementById("disciplina");
  const selTurma       = document.getElementById("turma");

  const form = document.getElementById("formAluno");
  const btnImportar = document.getElementById("btnImportar");


  // =========================================================
  // 2) CARREGAR INSTITUIÇÕES DO USUÁRIO
  // =========================================================
  async function carregarInstituicoes() {
    console.log("🔍 Carregando instituições...");

    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);

    if (!resp.ok) {
      alert("Erro ao carregar instituições.");
      return;
    }

    const data = await resp.json();
    console.log("📌 Instituições carregadas:", data);

    selInstituicao.innerHTML = `<option value="">Selecione...</option>`;

    data.forEach(inst => {
      selInstituicao.innerHTML += `
        <option value="${inst.ID}">${inst.NOME}</option>
      `;
    });

    selInstituicao.disabled = false;
  }


  // =========================================================
  // 3) CARREGAR CURSOS
  // =========================================================
  async function carregarCursos(instituicaoId) {
    console.log("🔍 Carregando cursos...");

    selCurso.disabled = false;
    selCurso.innerHTML = `<option>Carregando...</option>`;

    selDisciplina.disabled = true;
    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    selTurma.disabled = true;
    selTurma.innerHTML = `<option value="">Selecione...</option>`;

    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const data = await resp.json();

    console.log("📘 Cursos:", data);

    selCurso.innerHTML = `<option value="">Selecione...</option>`;
    data.forEach(curso => {
      selCurso.innerHTML += `<option value="${curso.ID}">${curso.NOME}</option>`;
    });
  }


  // =========================================================
  // 4) CARREGAR DISCIPLINAS
  // =========================================================
  async function carregarDisciplinas(cursoId) {
    console.log("🔍 Carregando disciplinas...");

    selDisciplina.disabled = false;
    selDisciplina.innerHTML = `<option>Carregando...</option>`;

    selTurma.disabled = true;
    selTurma.innerHTML = `<option value="">Selecione...</option>`;

    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const data = await resp.json();

    console.log("📗 Disciplinas:", data);

    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    data.forEach(dis => {
      selDisciplina.innerHTML += `<option value="${dis.ID}">${dis.NOME}</option>`;
    });
  }


  // =========================================================
  // 5) CARREGAR TURMAS
  // =========================================================
  async function carregarTurmas(disciplinaId) {
    console.log("🔍 Carregando turmas...");

    selTurma.disabled = false;
    selTurma.innerHTML = `<option>Carregando...</option>`;

    const resp = await fetch(`/api/turmas/listar/${disciplinaId}`);
    const data = await resp.json();

    console.log("👥 Turmas:", data);

    selTurma.innerHTML = `<option value="">Selecione...</option>`;
    data.forEach(t => {
      selTurma.innerHTML += `<option value="${t.ID}">${t.NOME}</option>`;
    });
  }


  // =========================================================
  // 6) EVENTOS — QUANDO ALTERAR OS SELECTS
  // =========================================================

  selInstituicao.addEventListener("change", () => {
    const id = selInstituicao.value;
    console.log("➡ Instituição selecionada:", id);
    if (id) carregarCursos(id);
  });

  selCurso.addEventListener("change", () => {
    const id = selCurso.value;
    console.log("➡ Curso selecionado:", id);
    if (id) carregarDisciplinas(id);
  });

  selDisciplina.addEventListener("change", () => {
    const id = selDisciplina.value;
    console.log("➡ Disciplina selecionada:", id);
    if (id) carregarTurmas(id);
  });


  // =========================================================
  // 7) CADASTRAR ALUNO (COM REDIRECIONAMENTO)
  // =========================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();

    if (!nome || !matricula ||
        !selInstituicao.value ||
        !selCurso.value ||
        !selDisciplina.value ||
        !selTurma.value) 
    {
      return alert("⚠ Preencha todos os campos!");
    }

    const body = {
      nome,
      matricula,
      instituicaoId: Number(selInstituicao.value),
      cursoId: Number(selCurso.value),
      disciplinaId: Number(selDisciplina.value),
      turmaId: Number(selTurma.value)
    };

    console.log("📤 Enviando dados:", body);

    const resp = await fetch("/api/alunos/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const json = await resp.json();

    if (!resp.ok) {
      return alert("❌ Erro: " + json.message);
    }

    alert("✅ Aluno cadastrado com sucesso!");

    // ⭐ REDIRECIONAR AUTOMÁTICO PARA DETALHES DA TURMA
    const turmaId = selTurma.value;
    window.location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${turmaId}`;
  });


  // =========================================================
  // 8) IMPORTAR CSV
  // =========================================================
  btnImportar.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = () => {
      const arquivo = input.files[0];
      if (!arquivo) return;

      if (!selInstituicao.value || !selCurso.value || !selDisciplina.value || !selTurma.value) {
        return alert("Selecione todos os filtros antes de importar.");
      }

      const formData = new FormData();
      formData.append("arquivo", arquivo);
      formData.append("instituicaoId", selInstituicao.value);
      formData.append("cursoId", selCurso.value);
      formData.append("disciplinaId", selDisciplina.value);
      formData.append("turmaId", selTurma.value);

      fetch("/api/alunos/importar-csv", {
        method: "POST",
        body: formData
      })
      .then(r => r.json())
      .then(j => {
        alert(`📥 Importação concluída:
Inseridos: ${j.inseridos}
Duplicados: ${j.ignoradosDuplicados}`);

        // 🔥 REDIRECIONAR APÓS IMPORTAÇÃO
        const turmaId = selTurma.value;
        window.location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${turmaId}`;
      })
      .catch(() => alert("Erro ao importar CSV."));
    };

    input.click();
  });


  // =========================================================
  // 9) INICIAR
  // =========================================================
  carregarInstituicoes();

});
