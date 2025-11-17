// =============================================
//  LISTA DE CURSOS — NotaDez
// =============================================

// Helper
const $ = (id) => document.getElementById(id);

// ID do usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Segurança
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

// PEGAR ID DA INSTITUIÇÃO PELA URL
const params = new URLSearchParams(window.location.search);
const instituicaoId = params.get("inst");

if (!instituicaoId) {
  alert("Selecione uma instituição antes.");
  window.location.href = "/gerenciar/html/dashboard.html";
}

// Elementos da página
const lista = $("corpoTabela");
const vazio = $("vazio");

// Variável para armazenar curso selecionado
let cursoSelecionado = null;


// =============================================
//  CARREGAR CURSOS DO BANCO
// =============================================
async function carregarCursos(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar cursos.</p>";
      return;
    }

    // FILTRO
    const filtrados = dados.filter((curso) =>
      curso.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
      curso.SIGLA.toLowerCase().includes(filtro.toLowerCase()) ||
      curso.COORDENADOR.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
      lista.innerHTML = "";
      vazio.style.display = "block";
      return;
    }

    vazio.style.display = "none";
    lista.innerHTML = "";

    filtrados.forEach((curso) => {
      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span><strong>${curso.NOME}</strong></span>
        <span>${curso.SIGLA}</span>
        <span>${curso.COORDENADOR}</span>

        <span class="acoes">
          <button class="btn-editar" data-id="${curso.ID}">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="btn-excluir" data-id="${curso.ID}">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </span>
      `;

      // Quando clicar na linha → abre disciplinas
      row.addEventListener("click", (e) => {
        if (!e.target.closest(".btn-editar") && !e.target.closest(".btn-excluir")) {
          cursoSelecionado = curso.ID;
          window.location.href =
            `/gerenciar/html/listaDisciplinas.html?inst=${instituicaoId}&curso=${curso.ID}`;
        }
      });

      // EDITAR
      row.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation();
        editarCurso(curso);
      });

      // EXCLUIR
      row.querySelector(".btn-excluir").addEventListener("click", (e) => {
        e.stopPropagation();
        removerCurso(curso.ID);
      });

      lista.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    lista.innerHTML = "<p>Erro ao conectar ao servidor.</p>";
  }
}

carregarCursos();


// =============================================
//  BUSCA
// =============================================
$("btnBuscar").addEventListener("click", () => {
  carregarCursos($("fBusca").value.trim());
});

$("fBusca").addEventListener("keyup", () => {
  carregarCursos($("fBusca").value.trim());
});


// =============================================
//  NOVO CURSO
// =============================================
$("btnNovo").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_curso.html";
});


// =============================================
//  NOVA DISCIPLINA — CORRIGIDO!!!
// =============================================
// ➜ Se não selecionar nada, ele abre a tela e a pessoa escolhe o curso lá.
// ➜ Se já clicou em um curso, passa o ID automaticamente.
$("btnNovaDisciplina").addEventListener("click", () => {
  if (!cursoSelecionado) {
    // deixa a pessoa entrar na tela normalmente
    window.location.href = "/gerenciar/html/cadastro_disciplina.html";
  } else {
    // Abre já com curso selecionado
    window.location.href =
      `/gerenciar/html/cadastro_disciplina.html?inst=${instituicaoId}&curso=${cursoSelecionado}`;
  }
});


// =============================================
//  EDITAR CURSO
// =============================================
async function editarCurso(curso) {
  const nome = prompt("Novo nome:", curso.NOME);
  if (!nome) return;

  const sigla = prompt("Nova sigla:", curso.SIGLA);
  if (!sigla) return;

  const coordenador = prompt("Novo coordenador:", curso.COORDENADOR);
  if (!coordenador) return;

  try {
    const resp = await fetch(`/api/cursos/editar/${curso.ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, sigla, coordenador })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Curso atualizado!");
    carregarCursos();

  } catch (err) {
    console.error(err);
    alert("Erro ao editar curso.");
  }
}


// =============================================
//  REMOVER CURSO (com bloqueio certo!)
// =============================================
async function removerCurso(id) {
  if (!confirm("Deseja realmente remover este curso?")) return;

  try {
    const respCheck = await fetch(`/api/cursos/quantidade/${id}`);
    const dadosCheck = await respCheck.json();

    if (dadosCheck.quantidade > 0) {
      alert("❌ Não é possível remover: existem disciplinas vinculadas.");
      return;
    }

    const resp = await fetch(`/api/cursos/remover/${id}`, {
      method: "DELETE"
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Curso removido!");
    carregarCursos();

  } catch (err) {
    console.error(err);
    alert("Erro ao remover curso.");
  }
}


// =============================================
//  MENU SUPERIOR — INSTITUIÇÕES
// =============================================
$("btnInstituicoes").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/dashboard.html";
});
