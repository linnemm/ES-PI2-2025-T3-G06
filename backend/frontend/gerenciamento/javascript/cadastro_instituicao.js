// =========================================
// LISTA DE DISCIPLINAS — INTEGRAÇÃO BACKEND
// =========================================

const $ = (id) => document.getElementById(id);

const cursoId = localStorage.getItem("cursoId");

if (!cursoId) {
  alert("⚠ Erro: curso não selecionado.");
  window.location.href = "/gerenciar/html/listaCursos.html";
}

// Elementos da página
const lista = $("corpoTabelaDisc");
const vazio = $("vazioDisc");

// =========================================
// 1️⃣ CARREGAR DISCIPLINAS DO BANCO
// =========================================
async function carregarDisciplinas(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar disciplinas.</p>";
      return;
    }

    // Aplicar filtro
    const filtradas = dados.filter((disc) =>
      disc.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
      disc.CODIGO.toLowerCase().includes(filtro.toLowerCase()) ||
      disc.PERIODO.toLowerCase().includes(filtro.toLowerCase()) ||
      (disc.PROFESSOR_NOME || "").toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtradas.length === 0) {
      lista.innerHTML = "";
      vazio.style.display = "block";
      return;
    }

    vazio.style.display = "none";
    lista.innerHTML = "";

    filtradas.forEach(disc => {
      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span><strong>${disc.NOME}</strong></span>
        <span>${disc.CODIGO}</span>
        <span>${disc.PERIODO}</span>
        <span>${disc.PROFESSOR_NOME || "-"}</span>

        <span class="acoes">

          <button class="acao-btn btn-editar" data-id="${disc.ID}">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="acao-btn btn-excluir" data-id="${disc.ID}">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </span>
      `;

      // EDITAR → sem redirecionar
      row.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation();
        editarDisciplina(disc);
      });

      // EXCLUIR
      row.querySelector(".btn-excluir").addEventListener("click", (e) => {
        e.stopPropagation();
        removerDisciplina(disc.ID);
      });

      lista.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
  }
}

carregarDisciplinas();

// =========================================
// 2️⃣ FUNÇÃO EDITAR DISCIPLINA — prompts
// =========================================
async function editarDisciplina(disc) {

  const nome = prompt("Novo nome da disciplina:", disc.NOME);
  if (!nome) return;

  const codigo = prompt("Novo código:", disc.CODIGO);
  if (!codigo) return;

  const periodo = prompt("Novo período:", disc.PERIODO);
  if (!periodo) return;

  try {
    const resp = await fetch(`/api/disciplinas/editar/${disc.ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, sigla: disc.SIGLA, codigo, periodo })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Disciplina atualizada com sucesso!");
    carregarDisciplinas();

  } catch (error) {
    console.error(error);
    alert("Erro ao editar disciplina.");
  }
}

// =========================================
// 3️⃣ BUSCA
// =========================================
$("btnBuscarDisc").addEventListener("click", () => {
  carregarDisciplinas($("fBuscaDisc").value.trim());
});

$("fBuscaDisc").addEventListener("keyup", () => {
  carregarDisciplinas($("fBuscaDisc").value.trim());
});

// =========================================
// 4️⃣ REMOVER DISCIPLINA
// =========================================
async function removerDisciplina(id) {
  const confirmar = confirm("Tem certeza que deseja remover esta disciplina?");
  if (!confirmar) return;

  try {
    const resp = await fetch(`/api/disciplinas/remover/${id}`, {
      method: "DELETE",
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Disciplina removida!");
    carregarDisciplinas();

  } catch (error) {
    console.error(error);
    alert("Erro ao remover disciplina.");
  }
}

// =========================================
// 5️⃣ NOVA DISCIPLINA
// =========================================
$("btnNovaDisc").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_disciplina.html";
});
