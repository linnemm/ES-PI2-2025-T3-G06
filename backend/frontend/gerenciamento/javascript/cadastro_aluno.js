// =========================================================
//  CADASTRO DE ALUNO — VERSÃO FINAL PADRONIZADA
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // 1) VALIDAR LOGIN
  // ================================
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Erro: usuário não encontrado.");
    location.href = "/auth/html/login.html";
    return;
  }

  // ================================
  // ELEMENTOS
  // ================================
  const selInstituicao = document.getElementById("instituicao");
  const selCurso       = document.getElementById("curso");
  const selDisciplina  = document.getElementById("disciplina");
  const selTurma       = document.getElementById("turma");

  const form = document.getElementById("formAluno");
  const btnImportar = document.getElementById("btnImportar");

  // ================================
  // 2) CARREGAR INSTITUIÇÕES
  // ================================
  async function carregarInstituicoes() {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const insts = await resp.json();

    selInstituicao.innerHTML = `<option value="">Selecione...</option>`;
    insts.forEach(i => {
      selInstituicao.innerHTML += `<option value="${i.ID}">${i.NOME}</option>`;
    });
  }

  carregarInstituicoes();

  // ================================
  // 3) CARREGAR CURSOS
  // ================================
  selInstituicao.addEventListener("change", async () => {
    const instId = selInstituicao.value;

    if (!instId) return;

    selCurso.disabled = false;
    selCurso.innerHTML = `<option>Carregando...</option>`;

    const resp = await fetch(`/api/cursos/listar/${instId}`);
    const cursos = await resp.json();

    selCurso.innerHTML = `<option value="">Selecione...</option>`;
    cursos.forEach(c => {
      selCurso.innerHTML += `<option value="${c.ID}">${c.NOME}</option>`;
    });

    selDisciplina.disabled = true;
    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    selTurma.disabled = true;
    selTurma.innerHTML = `<option value="">Selecione...</option>`;
  });

  // ================================
  // 4) CARREGAR DISCIPLINAS
  // ================================
  selCurso.addEventListener("change", async () => {
    const cursoId = selCurso.value;

    if (!cursoId) return;

    selDisciplina.disabled = false;
    selDisciplina.innerHTML = `<option>Carregando...</option>`;

    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const disciplinas = await resp.json();

    selDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    disciplinas.forEach(d => {
      selDisciplina.innerHTML += `<option value="${d.ID}">${d.NOME}</option>`;
    });

    selTurma.disabled = true;
    selTurma.innerHTML = `<option value="">Selecione...</option>`;
  });

  // ================================
  // 5) CARREGAR TURMAS
  // ================================
  selDisciplina.addEventListener("change", async () => {
    const discId = selDisciplina.value;

    if (!discId) return;

    selTurma.disabled = false;
    selTurma.innerHTML = `<option>Carregando...</option>`;

    const resp = await fetch(`/api/turmas/listar/${discId}`);
    const turmas = await resp.json();

    selTurma.innerHTML = `<option value="">Selecione...</option>`;
    turmas.forEach(t => {
      selTurma.innerHTML += `<option value="${t.ID}">${t.NOME}</option>`;
    });
  });

  // ================================
  // 6) SALVAR ALUNO
  // ================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      nome: document.getElementById("nome").value.trim(),
      matricula: document.getElementById("matricula").value.trim(),
      instituicaoId: Number(selInstituicao.value),
      cursoId: Number(selCurso.value),
      disciplinaId: Number(selDisciplina.value),
      turmaId: Number(selTurma.value)
    };

    const resp = await fetch("/api/alunos/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const json = await resp.json();

    if (!resp.ok) return alert("Erro: " + json.message);

    alert("Aluno cadastrado com sucesso!");
    location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${body.turmaId}`;
  });

  // ================================
  // 7) IMPORTAR CSV
  // ================================
  btnImportar.addEventListener("click", () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".csv";

    inp.onchange = async () => {
      const arquivo = inp.files[0];
      if (!arquivo) return;

      if (!selInstituicao.value || !selCurso.value || !selDisciplina.value || !selTurma.value)
        return alert("Selecione todos os campos antes de importar.");

      const fd = new FormData();
      fd.append("arquivo", arquivo);
      fd.append("instituicaoId", selInstituicao.value);
      fd.append("cursoId", selCurso.value);
      fd.append("disciplinaId", selDisciplina.value);
      fd.append("turmaId", selTurma.value);

      const resp = await fetch("/api/alunos/importar-csv", { method: "POST", body: fd });
      const json = await resp.json();

      alert(`Importação concluída:
Inseridos: ${json.inseridos}
Duplicados: ${json.ignoradosDuplicados}`);

      location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${selTurma.value}`;
    };

    inp.click();
  });

  // ================================
  // 8) ENTER PARA MUDAR DE CAMPO E ENVIAR FORM
  // ================================
  const campos = document.querySelectorAll(
    "#formAluno input, #formAluno select"
  );

  campos.forEach((campo, index) => {
    campo.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const ultimo = index === campos.length - 1;

        if (ultimo) {
          form.requestSubmit(); // Envia o formulário
        } else {
          campos[index + 1].focus(); // Vai para o próximo campo
        }
      }
    });
  });

  // ================================
  // 9) BOTÃO INSTITUIÇÕES
  // ================================
  document.getElementById("btnInstituicoes").addEventListener("click", () => {
    location.href = "/gerenciar/html/dashboard.html";
  });

});
