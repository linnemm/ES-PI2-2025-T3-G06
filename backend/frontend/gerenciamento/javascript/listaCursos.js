// ===========================================================
// LISTA DE CURSOS — INTEGRAÇÃO COMPLETA COM O BACKEND
// ===========================================================

// Helpers
const $ = (id) => document.getElementById(id);

// IDs essenciais
const userId = localStorage.getItem("userId");
const instituicaoId = localStorage.getItem("instituicaoId");

// Verificações
if (!userId) {
  alert("⚠ Erro: usuário não identificado. Faça login novamente.");
  window.location.href = "/auth/html/login.html";
}

if (!instituicaoId) {
  alert("⚠ Selecione uma instituição antes!");
  window.location.href = "/gerenciar/html/dashboard.html";
}

// Elementos
const lista = $("corpoTabela");
const vazio = $("vazio");

// ===========================================================
// 1️⃣ CARREGAR CURSOS DO BANCO
// ===========================================================
async function carregarCursos(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar cursos.</p>";
      return;
    }

    // Filtro de busca
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

    filtrados.forEach(curso => {
      const div = document.createElement("div");
      div.classList.add("tabela-row");

      div.innerHTML = `
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

      // Clique na linha → abrir disciplinas
      div.addEventListener("click", (e) => {
        if (!e.target.closest(".btn-editar") && !e.target.closest(".btn-excluir")) {
          localStorage.setItem("cursoId", curso.ID);
          window.location.href = "/gerenciar/html/listaDisciplinas.html";
        }
      });

      // Botão editar
      div.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation();
        editarCurso(curso);
      });

      // Botão excluir
      div.querySelector(".btn-excluir").addEventListener("click", (e) => {
        e.stopPropagation();
        removerCurso(curso.ID);
      });

      lista.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p>Erro ao conectar com servidor.</p>";
  }
}

carregarCursos();

// ===========================================================
// 2️⃣ BUSCA
// ===========================================================
$("btnBuscar").addEventListener("click", () => {
  carregarCursos($("fBusca").value.trim());
});

$("fBusca").addEventListener("keyup", () => {
  carregarCursos($("fBusca").value.trim());
});

// ===========================================================
// 3️⃣ NOVO CURSO
// ===========================================================
$("btnNovo").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_curso.html";
});

// ===========================================================
// 4️⃣ EDITAR CURSO
// ===========================================================
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

  } catch (error) {
    console.error(error);
    alert("Erro ao editar curso.");
  }
}

// ===========================================================
// 5️⃣ REMOVER CURSO — CORRIGIDO ✔
// ===========================================================
async function removerCurso(id) {
  if (!confirm("Deseja realmente remover este curso?")) return;

  try {
    // Verifica disciplinas ligadas ao curso
    const respCheck = await fetch(`/api/cursos/quantidade/${id}`);
    const dadosCheck = await respCheck.json();

    if (!respCheck.ok) {
      alert("Erro ao verificar disciplinas.");
      return;
    }

    if (dadosCheck.quantidade > 0) {
      alert("❌ Não é possível remover: existem disciplinas vinculadas.");
      return;
    }

    // Agora remover
    const resp = await fetch(`/api/cursos/remover/${id}`, {
      method: "DELETE",
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Curso removido!");
    carregarCursos();

  } catch (error) {
    console.error(error);
    alert("Erro ao remover curso.");
  }
}

// ===========================================================
// 6️⃣ MENU FLUTUANTE (mesma lógica das outras telas)
// ===========================================================
const menuFlutuante = $("menuFlutuante");
const selectContainer = $("selectContainer");
const tituloAba = $("tituloAba");
const btnIr = $("btnIr");

const instsFake = ["PUCCAMP", "USP", "UNICAMP"];
const cursosFake = ["Engenharia", "Direito", "Administração"];
const disciplinasFake = ["Cálculo I", "Física", "Lógica"];
const turmasFake = ["Turma A", "Turma B", "Turma C"];

function criarSelect(id, label, opcoes) {
  const div = document.createElement("div");
  div.classList.add("campo-selecao");
  div.innerHTML = `
    <label>${label}</label>
    <select id="${id}">
      <option>Selecione...</option>
      ${opcoes.map(o => `<option>${o}</option>`).join("")}
    </select>
  `;
  return div;
}

function abrirMenu(tipo) {
  selectContainer.innerHTML = "";
  btnIr.style.display = "none";
  menuFlutuante.style.display = "block";

  if (tipo === "instituicao") {
    tituloAba.textContent = "Instituições";
    selectContainer.appendChild(criarSelect("selInst", "Instituição:", instsFake));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "/gerenciar/html/dashboard.html";
  }

  if (tipo === "curso") {
    tituloAba.textContent = "Curso";
    selectContainer.appendChild(criarSelect("selInst", "Instituição:", instsFake));
    selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursosFake));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "/gerenciar/html/listaDisciplinas.html";
  }
}

document.getElementById("btnInstituicoes").addEventListener("click", () => abrirMenu("instituicao"));
document.getElementById("btnCursos").addEventListener("click", () => abrirMenu("curso"));
document.getElementById("btnDisciplinas").addEventListener("click", () => abrirMenu("disciplina"));
document.getElementById("btnTurmas").addEventListener("click", () => abrirMenu("turma"));

document.addEventListener("click", (e) => {
  if (
    !menuFlutuante.contains(e.target) &&
    !e.target.closest(".menu-horizontal")
  ) {
    menuFlutuante.style.display = "none";
  }
});

// ===========================================================
// BOTÃO: NOVA DISCIPLINA
// ===========================================================
$("btnNovaDisciplina").addEventListener("click", () => {
  localStorage.setItem("cursoId", ""); // limpa curso selecionado
  window.location.href = "/gerenciar/html/cadastro_disciplina.html";
});
