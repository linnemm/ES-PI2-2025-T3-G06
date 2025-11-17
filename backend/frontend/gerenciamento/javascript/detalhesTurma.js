// =========================================================
//  DETALHES DA TURMA — VERSÃO FINAL SEM MENU FLUTUANTE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // PEGAR TURMA ID DA URL
  // -------------------------------
  const qs = new URLSearchParams(location.search);
  const turmaId = Number(qs.get("turmaId"));

  if (!turmaId) {
    alert("Erro: turmaId não informado.");
    return;
  }

  // -------------------------------
  // BOTÃO INSTITUIÇÕES
  // -------------------------------
  document.getElementById("btnInstituicoes").onclick = () => {
    window.location.href = "/gerenciar/html/dashboard.html";
  };

  // -------------------------------
  // ELEMENTOS
  // -------------------------------
  const tituloTurma = document.getElementById("tituloTurma");
  const subTurma    = document.getElementById("subTurma");
  const tbody       = document.getElementById("tbodyAlunos");

  let alunos = [];
  let turmaCache = null; // ⭐ aqui vamos guardar INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID

  // -------------------------------
  // CARREGAR TURMA
  // -------------------------------
  async function carregarTurma() {
    const resp  = await fetch(`/api/turmas/detalhes/${turmaId}`);
    const turma = await resp.json();

    turmaCache = turma; // ⭐ guarda tudo para usar depois nos botões / import

    tituloTurma.textContent = `Turma ${turma.NOME} — ${turma.DISCIPLINA_NOME}`;
    subTurma.textContent    = `Código: ${turma.CODIGO || "-"} | Disciplina: ${turma.DISCIPLINA_NOME}`;
  }

  // -------------------------------
  // CARREGAR ALUNOS
  // -------------------------------
  async function carregarAlunos() {
    const resp = await fetch(`/api/alunos/turma/${turmaId}`);
    alunos = await resp.json();
    render();
  }

  // -------------------------------
  // MODAL EDITAR ALUNO
  // -------------------------------
  function abrirModalEditar(aluno) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Editar Aluno</div>
          <button class="modal-close" id="btnFecharModal"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body">
          <div class="field"><label>Matrícula</label><input id="edMatricula" value="${aluno.MATRICULA}"></div>
          <div class="field"><label>Nome</label><input id="edNome" value="${aluno.NOME}"></div>
        </div>

        <div class="modal-footer">
          <button class="btn-salvar" id="btnSalvarAluno">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btnFecharModal").onclick = () => modal.remove();

    document.getElementById("btnSalvarAluno").onclick = async () => {
      const novaMatricula = document.getElementById("edMatricula").value.trim();
      const novoNome      = document.getElementById("edNome").value.trim();

      if (!novaMatricula || !novoNome) {
        alert("Preencha todos os campos.");
        return;
      }

      const duplicado = alunos.some(a =>
        a.MATRICULA === novaMatricula && a.ID !== aluno.ID
      );

      if (duplicado) {
        alert("Já existe um aluno com esta matrícula.");
        return;
      }

      const resp = await fetch(`/api/alunos/editar/${aluno.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula: novaMatricula, nome: novoNome })
      });

      const json = await resp.json();

      if (!resp.ok) {
        alert(json.message || "Erro ao editar aluno.");
        return;
      }

      alert("Aluno atualizado!");
      modal.remove();
      carregarAlunos();
    };
  }

  // -------------------------------
  // REMOVER ALUNO INDIVIDUAL
  // -------------------------------
  async function removerAluno(id) {
    const resp = await fetch(`/api/alunos/remover/${id}`, { method: "DELETE" });
    return resp.ok;
  }

  // -------------------------------
  // RENDERIZAÇÃO DA TABELA
  // -------------------------------
  function render() {
    tbody.innerHTML = alunos.map(a => `
      <tr>
        <td><input type="checkbox" class="chkAluno" data-id="${a.ID}"></td>
        <td>${a.MATRICULA}</td>
        <td>${a.NOME}</td>
        <td>
          <button class="btn-editar" data-id="${a.ID}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-excluir" data-id="${a.ID}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join("");

    // editar
    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.onclick = () => abrirModalEditar(alunos.find(a => a.ID == btn.dataset.id));
    });

    // excluir
    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.onclick = async () => {
        if (!confirm("Remover aluno?")) return;
        await removerAluno(Number(btn.dataset.id));
        carregarAlunos();
      };
    });
  }

  // -------------------------------
  // IMPORTAR CSV
  // -------------------------------
  document.getElementById("btnImportar").onclick = () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".csv";

    inp.onchange = async () => {
      const arquivo = inp.files[0];
      if (!arquivo) return;

      // usa turmaCache para pegar instituicao/curso/disciplina
      if (!turmaCache) {
        alert("Turma ainda não carregada. Tente novamente.");
        return;
      }

      const fd = new FormData();
      fd.append("arquivo", arquivo);
      fd.append("turmaId", turmaId);
      fd.append("instituicaoId", turmaCache.INSTITUICAO_ID);
      fd.append("cursoId", turmaCache.CURSO_ID);
      fd.append("disciplinaId", turmaCache.DISCIPLINA_ID);

      const resp = await fetch("/api/alunos/importar-csv", { method: "POST", body: fd });
      const json = await resp.json();

      alert(`Importação concluída!
Inseridos: ${json.inseridos}
Duplicados: ${json.ignoradosDuplicados}`);

      carregarAlunos();
    };

    inp.click();
  };

  // -------------------------------
  // EXCLUIR SELECIONADOS
  // -------------------------------
  document.getElementById("btnExcluirSelecionados").onclick = async () => {
    const checks = [...document.querySelectorAll(".chkAluno:checked")];

    if (!checks.length) {
      alert("Nenhum aluno selecionado.");
      return;
    }

    if (!confirm(`Excluir ${checks.length} aluno(s)?`)) return;

    for (const chk of checks) {
      await removerAluno(Number(chk.dataset.id));
    }

    alert("Alunos removidos!");
    carregarAlunos();
  };

  // -------------------------------
  // BOTÃO NOTAS DA TURMA
  // (AGORA SÓ USA turmaCache, SEM URL EXTRA)
// -------------------------------
  document.getElementById("btnNotasTurma").onclick = () => {
    if (!turmaCache) {
      alert("Turma ainda não carregada. Tente novamente.");
      return;
    }

    const instId  = turmaCache.INSTITUICAO_ID;
    const cursoId = turmaCache.CURSO_ID;
    const discId  = turmaCache.DISCIPLINA_ID;

    window.location.href =
      `/gerenciar/html/notasTurma.html?` +
      `turmaId=${turmaId}&inst=${instId}&curso=${cursoId}&disc=${discId}`;
  };

  // -------------------------------
  // BOTÃO ADICIONAR ALUNO
  // -------------------------------
  document.getElementById("btnAddAluno").onclick = () => {
    if (!turmaCache) {
      alert("Turma ainda não carregada. Tente novamente.");
      return;
    }

    const instId  = turmaCache.INSTITUICAO_ID;
    const cursoId = turmaCache.CURSO_ID;
    const discId  = turmaCache.DISCIPLINA_ID;

    window.location.href =
      `/gerenciar/html/cadastro_aluno.html?` +
      `turmaId=${turmaId}&inst=${instId}&curso=${cursoId}&disc=${discId}`;
  };

  // -------------------------------
  // VOLTAR
  // -------------------------------
  document.getElementById("btnVoltar").onclick = () => {
    window.history.back();
  };

  // -------------------------------
  // INICIAR
  // -------------------------------
  carregarTurma();
  carregarAlunos();

});
