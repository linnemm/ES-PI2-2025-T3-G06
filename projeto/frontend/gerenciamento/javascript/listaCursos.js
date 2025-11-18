// Autora: Alinne

const $ = (id) => document.getElementById(id);

// ID do usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Apenas para usuarios logados
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

// Armazena ID do curso clicado (para nova disciplina)
let cursoSelecionado = null;

//  CARREGAR CURSOS DO BANCO
async function carregarCursos(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar cursos.</p>";
      return;
    }

    // FILTRO (cursos por nome, sigla ou coordenador)
    const filtrados = dados.filter((curso) =>
      curso.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
      curso.SIGLA.toLowerCase().includes(filtro.toLowerCase()) ||
      curso.COORDENADOR.toLowerCase().includes(filtro.toLowerCase())
    );

    // Nenhum curso encontrado
    if (filtrados.length === 0) {
      lista.innerHTML = "";
      vazio.style.display = "block";
      return;
    }

    vazio.style.display = "none";
    lista.innerHTML = "";

    // renderiza cada curso na tabela
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

      // EDITAR CURSO
      row.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation(); // impede abrir lista de disciplinas
        editarCurso(curso);
      });

      // EXCLUIR CURSO
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


//  BUSCA DE CURSO
$("btnBuscar").addEventListener("click", () => {
  carregarCursos($("fBusca").value.trim());
});

$("fBusca").addEventListener("keyup", () => {
  carregarCursos($("fBusca").value.trim());
});



//  CADASTRO NOVO CURSO
$("btnNovo").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_curso.html?inst=" + instituicaoId;
});



//  NOVA DISCIPLINA
$("btnNovaDisciplina").addEventListener("click", () => {

  // Se o usuário já clicou em um curso → enviamos o ID do curso
  if (cursoSelecionado) {
    window.location.href =
      `/gerenciar/html/cadastro_disciplina.html?inst=${instituicaoId}&curso=${cursoSelecionado}`;
    return;
  }

  // Se não clicou em nada, mas há pelo menos 1 curso na lista, abre a página e o usuário escolhe o curso normalmente.
  window.location.href =
    `/gerenciar/html/cadastro_disciplina.html?inst=${instituicaoId}`;
});



//  EDITAR CURSO
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


//  REMOVER CURSO 
async function removerCurso(id) {
  if (!confirm("Deseja realmente remover este curso?")) return;

  try {
    // Verifica se o curso tem disciplinas vinculadas
    const respCheck = await fetch(`/api/cursos/quantidade/${id}`);
    const dadosCheck = await respCheck.json();

    if (dadosCheck.quantidade > 0) {
      alert("❌ Não é possível remover: existem disciplinas vinculadas.");
      return;
    }

    // Se não tem disciplinas, remove
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

//  MENU SUPERIOR — INSTITUIÇÕES
$("btnInstituicoes").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/dashboard.html";
});
