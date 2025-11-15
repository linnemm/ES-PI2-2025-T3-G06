document.addEventListener("DOMContentLoaded", () => {

  const corpoTabela = document.getElementById("corpoTabela");
  const vazio = document.getElementById("vazio");

  const btnBuscar = document.getElementById("btnBuscar");
  const fBusca = document.getElementById("fBusca");

  const btnNovaTurma = document.getElementById("btnNovaTurma");
  const btnNovoAluno = document.getElementById("btnNovoAluno");

  // ============================
  // PEGAR ID DA URL OU LOCALSTORAGE
  // ============================
  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaId = urlParams.get("disciplinaId") || localStorage.getItem("disciplinaId");
  const cursoId = urlParams.get("cursoId") || localStorage.getItem("cursoId");

  // ============================
  // BOTÕES DE NAVEGAÇÃO
  // ============================
  btnNovaTurma.onclick = () => {
    location.href = "/gerenciar/html/cadastro_turma.html";
  };

  btnNovoAluno.onclick = () => {
    location.href = "/gerenciar/html/cadastro_aluno.html";
  };

  // ============================
  // BUSCAR LISTA DE TURMAS
  // ============================
  async function carregarTurmas() {
    corpoTabela.innerHTML = "<p>Carregando...</p>";

    let rota = null;

    if (disciplinaId) rota = `/api/turmas/listar/${disciplinaId}`;
    else if (cursoId) rota = `/api/turmas/curso/${cursoId}`;
    else {
      corpoTabela.innerHTML = "<p>Erro: Curso ou Disciplina não selecionado.</p>";
      return;
    }

    try {
      const resp = await fetch(rota);
      if (!resp.ok) {
        corpoTabela.innerHTML = "<p>Erro ao carregar turmas.</p>";
        return;
      }

      const turmas = await resp.json();
      const filtro = fBusca.value.toLowerCase();

      const listaFiltrada = turmas.filter(t =>
        (t.NOME || "").toLowerCase().includes(filtro) ||
        (t.CODIGO || "").toLowerCase().includes(filtro) ||
        (t.DISCIPLINA_NOME || "").toLowerCase().includes(filtro)
      );

      render(listaFiltrada);

    } catch (err) {
      console.error(err);
      corpoTabela.innerHTML = "<p>Erro inesperado.</p>";
    }
  }

  // ============================
  // REMOVER TURMA
  // ============================
  async function excluirTurma(id) {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;

    try {
      const resp = await fetch(`/api/turmas/remover/${id}`, {
        method: "DELETE"
      });

      const json = await resp.json();

      if (!resp.ok) {
        alert(json.message || "Erro ao excluir.");
        return;
      }

      alert("Turma removida!");
      carregarTurmas();
    } catch (err) {
      console.error(err);
      alert("Erro inesperado.");
    }
  }

  // ============================
  // MODAL EDIÇÃO (ATUALIZADO)
  // ============================
  function abrirModalEdicao(turma) {

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Editar Turma</div>
          <button class="modal-close" id="btnCloseModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">

          <div class="field">
            <label>Nome</label>
            <input id="edNome" value="${turma.NOME}">
          </div>

          <div class="field">
            <label>Dia da Semana</label>
            <input id="edDia" value="${turma.DIA_SEMANA || ""}">
          </div>

          <div class="field">
            <label>Horário</label>
            <input id="edHora" value="${turma.HORARIO || ""}">
          </div>

          <div class="field">
            <label>Local</label>
            <input id="edLocal" value="${turma.LOCAL_TURMA || ""}">
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn-curso" id="btnSalvar">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btnCloseModal").onclick =
      () => modal.remove();

    document.getElementById("btnSalvar").onclick = async () => {

      const nome = document.getElementById("edNome").value;
      const diaSemana = document.getElementById("edDia").value;
      const horario = document.getElementById("edHora").value;
      const localTurma = document.getElementById("edLocal").value;

      if (!nome || !diaSemana || !horario || !localTurma) {
        alert("Preencha todos os campos.");
        return;
      }

      try {
        const resp = await fetch(`/api/turmas/editar/${turma.ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, diaSemana, horario, localTurma })
        });

        const json = await resp.json();

        if (!resp.ok) {
          alert(json.message || "Erro ao salvar.");
          return;
        }

        alert("Turma editada com sucesso!");
        modal.remove();
        carregarTurmas();

      } catch (err) {
        console.error(err);
        alert("Erro inesperado ao salvar.");
      }
    };

  }

  // ============================
  // RENDER DA TABELA
  // ============================
  function render(turmas) {

    corpoTabela.innerHTML = "";

    if (!turmas.length) {
      vazio.style.display = "block";
      return;
    }

    vazio.style.display = "none";

    turmas.forEach(t => {

      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span>${t.NOME}</span>
        <span>${t.CODIGO || "-"}</span>
        <span>${t.DISCIPLINA_NOME}</span>
        <span>${t.DIA_SEMANA || "-"}</span>
        <span>${t.HORARIO || "-"}</span>
        <span>${t.LOCAL_TURMA || "-"}</span>

        <div class="tabela-acoes">
          <button class="btn-editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-excluir"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      // Clique na linha → Detalhes
      row.addEventListener("click", (e) => {
        if (!e.target.closest(".tabela-acoes")) {
          location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${t.ID}`;
        }
      });

      // Botão EDITAR
      row.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        abrirModalEdicao(t);
      });

      // Botão EXCLUIR
      row.querySelector(".btn-excluir").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        excluirTurma(t.ID);
      });

      corpoTabela.appendChild(row);
    });
  }

  // ============================
  // EVENTOS DE BUSCA
  // ============================
  btnBuscar.addEventListener("click", () => carregarTurmas());
  fBusca.addEventListener("keyup", () => carregarTurmas());

  // ============================
  // INICIAR
  // ============================
  carregarTurmas();

});
