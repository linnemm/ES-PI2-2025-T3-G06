// =========================================================
// TOPBAR
// =========================================================
(function initTopbar() {
  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const btnIr = document.getElementById("btnIr");

  function abrirMenu() {
    selectContainer.innerHTML = "";
    btnIr.style.display = "none";
    menuFlutuante.style.display = "block";
  }

  const id = s => document.getElementById(s);

  id("btnInstituicoes")?.addEventListener("click", e => { e.preventDefault(); abrirMenu(); });
  id("btnCursos")?.addEventListener("click", e => { e.preventDefault(); abrirMenu(); });
  id("btnDisciplinas")?.addEventListener("click", e => { e.preventDefault(); abrirMenu(); });
  id("btnTurmas")?.addEventListener("click", e => { e.preventDefault(); abrirMenu(); });

  document.addEventListener("click", e => {
    if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
      menuFlutuante.style.display = "none";
    }
  });
})();


// =========================================================
// DETALHES DA TURMA
// =========================================================
(function initDetalhes() {

  // -------------------------------
  // PARAMS DA URL
  // -------------------------------
  const qs = new URLSearchParams(location.search);
  const turmaId = Number(qs.get("turmaId"));
  if (!turmaId) {
    alert("Erro: turmaId não informado.");
    return;
  }

  // -------------------------------
  // ELEMENTOS
  // -------------------------------
  const tituloTurma = document.getElementById("tituloTurma");
  const subTurma = document.getElementById("subTurma");
  const tbody = document.getElementById("tbodyAlunos");

  let alunos = [];

  // -------------------------------
  // CARREGAR TURMA
  // -------------------------------
  async function carregarTurma() {
    const resp = await fetch(`/api/turmas/detalhes/${turmaId}`);
    const turma = await resp.json();

    tituloTurma.textContent =
      `Turma ${turma.NOME} — ${turma.DISCIPLINA_NOME}`;

    subTurma.textContent =
      `Código: ${turma.CODIGO || "-"} | Disciplina: ${turma.DISCIPLINA_NOME}`;
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
          <div class="field">
            <label>Matrícula</label>
            <input id="edMatricula" value="${aluno.MATRICULA}">
          </div>

          <div class="field">
            <label>Nome</label>
            <input id="edNome" value="${aluno.NOME}">
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-salvar" id="btnSalvarAluno">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Fecha modal
    document.getElementById("btnFecharModal").onclick = () => modal.remove();

    // Salvar alterações
    document.getElementById("btnSalvarAluno").onclick = async () => {
      const novaMatricula = document.getElementById("edMatricula").value.trim();
      const novoNome = document.getElementById("edNome").value.trim();

      if (!novaMatricula || !novoNome) {
        alert("Preencha todos os campos.");
        return;
      }

      // Validação de matrícula duplicada
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
  // REMOVER UM ALUNO
  // -------------------------------
  async function removerAluno(id) {
    const resp = await fetch(`/api/alunos/remover/${id}`, { method: "DELETE" });
    return resp.ok;
  }

  // -------------------------------
  // RENDERIZAR TABELA
  // -------------------------------
  function render() {
    tbody.innerHTML = alunos.map(a => `
      <tr>
        <td><input type="checkbox" class="chkAluno" data-id="${a.ID}"></td>
        <td>${a.MATRICULA}</td>
        <td>${a.NOME}</td>

        <td>
          <div class="acoes">
            <button class="btn-editar" data-id="${a.ID}">
              <i class="fa-solid fa-pen"></i>
            </button>

            <button class="btn-excluir" data-id="${a.ID}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // EDITAR
    tbody.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const aluno = alunos.find(a => a.ID == btn.dataset.id);
        abrirModalEditar(aluno);
      });
    });

    // EXCLUIR
    tbody.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Remover aluno?")) return;
        await removerAluno(Number(btn.dataset.id));
        carregarAlunos();
      });
    });
  }

  // -------------------------------
  // IMPORTAR CSV
  // -------------------------------
  document.getElementById("btnImportar").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = async () => {
      const arquivo = input.files[0];
      if (!arquivo) return;

      const form = new FormData();
      form.append("arquivo", arquivo);
      form.append("turmaId", turmaId);

      const respTurma = await fetch(`/api/turmas/detalhes/${turmaId}`);
      const turma = await respTurma.json();

      form.append("instituicaoId", turma.INSTITUICAO_ID);
      form.append("cursoId", turma.CURSO_ID);
      form.append("disciplinaId", turma.DISCIPLINA_ID);

      try {
        const resp = await fetch("/api/alunos/importar-csv", {
          method: "POST",
          body: form
        });

        const json = await resp.json();

        if (!resp.ok) throw new Error(json.message);

        alert(`Importação concluída!
Inseridos: ${json.inseridos}
Duplicados ignorados: ${json.ignoradosDuplicados}`);

        carregarAlunos();
      } catch (err) {
        console.error(err);
        alert("Erro ao importar CSV.");
      }
    };

    input.click();
  });

  // -------------------------------
  // EXCLUIR SELECIONADOS
  // -------------------------------
  document.getElementById("btnExcluirSelecionados").onclick = async () => {
    const marcados = [...tbody.querySelectorAll(".chkAluno:checked")];

    if (!marcados.length) return alert("Nenhum aluno selecionado.");

    if (!confirm(`Excluir ${marcados.length} aluno(s)?`)) return;

    for (const chk of marcados) {
      await removerAluno(Number(chk.dataset.id));
    }

    alert("Alunos removidos!");
    carregarAlunos();
  };

  // -------------------------------
  // INICIAR TELA
  // -------------------------------
  carregarTurma();
  carregarAlunos();

})();
