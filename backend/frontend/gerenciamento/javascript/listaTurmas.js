document.addEventListener("DOMContentLoaded", () => {

  const corpoTabela = document.getElementById("corpoTabela");
  const vazio = document.getElementById("vazio");

  const btnBuscar = document.getElementById("btnBuscar");
  const fBusca = document.getElementById("fBusca");

  const btnNovaTurma = document.getElementById("btnNovaTurma");
  const btnNovoAluno = document.getElementById("btnNovoAluno");

  // ============================
  //  PEGAR ID DA URL OU STORAGE
  // ============================
  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaId = urlParams.get("disciplinaId") || localStorage.getItem("disciplinaId");
  const cursoId = urlParams.get("cursoId") || localStorage.getItem("cursoId");

  // ============================
  //  BOTÕES DE NAVEGAÇÃO
  // ============================
  btnNovaTurma.onclick = () => {
    location.href = "/gerenciar/html/cadastro_turma.html";
  };

  btnNovoAluno.onclick = () => {
    location.href = "/gerenciar/html/cadastro_aluno.html";
  };

  // ============================
  //  BUSCAR LISTA DE TURMAS
  // ============================
  async function carregarTurmas(filtro = "") {
    corpoTabela.innerHTML = "<p>Carregando...</p>";

    let rota = null;

    if (disciplinaId) {
      rota = `/api/turmas/listar/${disciplinaId}`;
    } 
    else if (cursoId) {
      rota = `/api/turmas/curso/${cursoId}`;
    } 
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

      // filtro
      const listaFiltrada = turmas.filter(t =>
        t.NOME?.toLowerCase().includes(filtro.toLowerCase()) ||
        t.CODIGO?.toLowerCase().includes(filtro.toLowerCase()) ||
        t.DISCIPLINA_NOME?.toLowerCase().includes(filtro.toLowerCase())
      );

      render(listaFiltrada);

    } catch (err) {
      console.error(err);
      corpoTabela.innerHTML = "<p>Erro inesperado ao carregar turmas.</p>";
    }
  }

  // ============================
  //  EXCLUIR TURMA
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

      alert("Turma excluída com sucesso!");
      carregarTurmas();

    } catch (err) {
      console.error(err);
      alert("Erro inesperado.");
    }
  }

  // ============================
  //  MODAL DE EDIÇÃO
  // ============================
  function abrirModalEdicao(turma) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Editar Turma</div>
          <button class="modal-close" id="btnCloseModal"><i class="fa-solid fa-xmark"></i></button>
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
          <button class="btn btn-ghost" id="btnCancelar">Cancelar</button>
          <button class="btn btn-primary" id="btnSalvar">Salvar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Fechar modal
    document.getElementById("btnCloseModal").onclick = () => modal.remove();
    document.getElementById("btnCancelar").onclick = () => modal.remove();

    // Salvar edição
    document.getElementById("btnSalvar").onclick = async () => {
      const body = {
        nome: document.getElementById("edNome").value,
        diaSemana: document.getElementById("edDia").value,
        horario: document.getElementById("edHora").value,
        localTurma: document.getElementById("edLocal").value
      };

      try {
        const resp = await fetch(`/api/turmas/editar/${turma.ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const json = await resp.json();

        if (!resp.ok) {
          alert(json.message || "Erro ao salvar alterações.");
          return;
        }

        alert("Turma atualizada com sucesso!");
        modal.remove();
        carregarTurmas();

      } catch (err) {
        console.error(err);
        alert("Erro inesperado ao salvar.");
      }
    };
  }

  // ============================
  //  RENDERIZAÇÃO NA TABELA
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

      // Abrir detalhes ao clicar na linha (exceto nas ações)
      row.onclick = e => {
        if (!e.target.closest(".tabela-acoes")) {
          location.href = `/gerenciar/html/detalhesTurma.html?turmaId=${t.ID}`;
        }
      };

      // Botão editar
      row.querySelector(".btn-editar").onclick = e => {
        e.stopPropagation();
        abrirModalEdicao(t);
      };

      // Botão excluir
      row.querySelector(".btn-excluir").onclick = e => {
        e.stopPropagation();
        excluirTurma(t.ID);
      };

      corpoTabela.appendChild(row);
    });
  }

  // ============================
  // BUSCA
  // ============================
  btnBuscar.addEventListener("click", () =>
    carregarTurmas(fBusca.value.trim())
  );

  fBusca.addEventListener("keyup", () =>
    carregarTurmas(fBusca.value.trim())
  );

  // Carregar inicial
  carregarTurmas();

});
