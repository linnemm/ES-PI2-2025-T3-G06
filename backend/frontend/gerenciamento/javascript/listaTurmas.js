document.addEventListener("DOMContentLoaded", () => {

  const corpoTabela = document.getElementById("corpoTabela");
  const vazio = document.getElementById("vazio");

  const btnBuscar = document.getElementById("btnBuscar");
  const fBusca = document.getElementById("fBusca");

  const btnNovaTurma = document.getElementById("btnNovaTurma");
  const btnNovoAluno = document.getElementById("btnNovoAluno");

  // =====================================================
  // PEGAR PARAMETROS EXATAMENTE COMO AS OUTRAS TELAS
  // =====================================================

  const params = new URLSearchParams(window.location.search);

  const instituicaoId = params.get("inst");
  const cursoId = params.get("curso");
  const disciplinaId = params.get("disc");

  if (!instituicaoId || !cursoId) {
    alert("Selecione primeiro uma instituição e um curso.");
    window.location.href = "/gerenciar/html/dashboard.html";
    return;
  }

  // =====================================================
  // BOTÕES DE TOPO
  // =====================================================
  document.getElementById("btnInstituicoes").addEventListener("click", () => {
    window.location.href = "/gerenciar/html/dashboard.html";
  });

  // =====================================================
  // BOTÃO NOVA TURMA
  // =====================================================
  btnNovaTurma.onclick = () => {
    window.location.href =
      `/gerenciar/html/cadastro_turma.html?inst=${instituicaoId}&curso=${cursoId}&disc=${disciplinaId}`;
  };

  // =====================================================
  // BOTÃO NOVO ALUNO
  // =====================================================
  btnNovoAluno.onclick = () => {
    window.location.href =
      `/gerenciar/html/cadastro_aluno.html?inst=${instituicaoId}&curso=${cursoId}&disc=${disciplinaId}`;
  };

  // =====================================================
  // BUSCAR LISTA DE TURMAS
  // =====================================================
  async function carregarTurmas() {
    corpoTabela.innerHTML = "<p>Carregando...</p>";

    let rota;

    if (disciplinaId) {
      rota = `/api/turmas/listar/${disciplinaId}`;
    } else {
      rota = `/api/turmas/curso/${cursoId}`;
    }

    try {
      const resp = await fetch(rota);
      const turmas = await resp.json();

      const filtro = fBusca.value.toLowerCase();

      const filtradas = turmas.filter(t =>
        (t.NOME || "").toLowerCase().includes(filtro) ||
        (t.CODIGO || "").toLowerCase().includes(filtro) ||
        (t.DISCIPLINA_NOME || "").toLowerCase().includes(filtro)
      );

      render(filtradas);

    } catch (e) {
      console.error(e);
      corpoTabela.innerHTML = "<p>Erro ao carregar turmas.</p>";
    }
  }

  // =====================================================
  // RENDER TABELA
  // =====================================================
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
        <span><strong>${t.NOME}</strong></span>
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

      // ABRIR DETALHES DA TURMA
      row.addEventListener("click", (e) => {
        if (!e.target.closest(".tabela-acoes")) {
          window.location.href =
            `/gerenciar/html/detalhesTurma.html?turmaId=${t.ID}&inst=${instituicaoId}&curso=${cursoId}&disc=${disciplinaId}`;
        }
      });

      // EXCLUIR
      row.querySelector(".btn-excluir").addEventListener("click", (e) => {
        e.stopPropagation();
        excluirTurma(t.ID);
      });

      // EDITAR
      row.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalEdicao(t);
      });

      corpoTabela.appendChild(row);
    });
  }

  // =====================================================
  // EXCLUIR TURMA
  // =====================================================
  async function excluirTurma(id) {
    if (!confirm("Tem certeza que deseja excluir esta turma?")) return;

    try {
      const resp = await fetch(`/api/turmas/remover/${id}`, { method: "DELETE" });
      const json = await resp.json();

      if (!resp.ok) return alert(json.message);
      alert("Turma removida!");
      carregarTurmas();

    } catch (e) {
      alert("Erro ao excluir.");
    }
  }

  // =====================================================
  // BUSCA
  // =====================================================
  btnBuscar.addEventListener("click", () => carregarTurmas());
  fBusca.addEventListener("keyup", () => carregarTurmas());

  // =====================================================
  // INICIAR
  // =====================================================
  carregarTurmas();

});
