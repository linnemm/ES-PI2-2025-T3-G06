// ======================================================
//  CADASTRO DE DISCIPLINA — BACKEND INTEGRADO
// ======================================================

// Helper
const $ = (id) => document.getElementById(id);

// Recuperar usuário logado
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("⚠ Erro: usuário não identificado. Faça login novamente.");
  window.location.href = "/auth/html/login.html";
}

// IDs selecionados
let instituicaoId = null;
let cursoId = null;

// ======================================================
// 1️⃣ CARREGAR INSTITUIÇÕES DO BANCO
// ======================================================
async function carregarInstituicoes() {
  try {
    const resp = await fetch(`/api/instituicoes/listar/${userId}`);
    const lista = await resp.json();

    if (!resp.ok) {
      alert("Erro ao buscar instituições!");
      return;
    }

    lista.forEach(inst => {
      const opt = document.createElement("option");
      opt.value = inst.ID;
      opt.textContent = inst.NOME;
      $("instituicao").appendChild(opt);
    });

  } catch (erro) {
    console.error("Erro ao carregar instituições:", erro);
    alert("Erro ao carregar instituições");
  }
}

// Quando selecionar uma instituição → carregar cursos reais do banco
$("instituicao").addEventListener("change", async () => {
  instituicaoId = $("instituicao").value;
  cursoId = null;

  $("curso").innerHTML = `<option value="">Selecione um curso</option>`;

  if (!instituicaoId) return;

  try {
    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const cursos = await resp.json();

    if (!resp.ok) {
      alert("Erro ao buscar cursos!");
      return;
    }

    cursos.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.ID;
      opt.textContent = c.NOME;
      $("curso").appendChild(opt);
    });

  } catch (erro) {
    console.error("Erro ao carregar cursos:", erro);
    alert("Erro ao carregar cursos.");
  }
});

// Quando escolher o curso
$("curso").addEventListener("change", () => {
  cursoId = $("curso").value;
});

// ======================================================
// 2️⃣ SALVAR DISCIPLINA NO BANCO
// ======================================================
$("formDisciplina").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = $("nome").value.trim();
  const sigla = $("sigla").value.trim();
  const codigo = $("codigo").value.trim();
  const periodo = $("periodo").value.trim();

  if (!instituicaoId || !cursoId) {
    alert("Selecione uma instituição e um curso!");
    return;
  }

  if (!nome || !sigla || !codigo || !periodo) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const resp = await fetch("/api/disciplinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        sigla,
        codigo,
        periodo,
        usuarioId: userId,
        instituicaoId,
        cursoId
      })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("📘 Disciplina cadastrada com sucesso!");
    window.location.href = "/gerenciar/html/listaDisciplinas.html";

  } catch (erro) {
    console.error("Erro ao cadastrar disciplina:", erro);
    alert("Erro ao cadastrar disciplina.");
  }
});

// ======================================================
// 3️⃣ CANCELAR
// ======================================================
$("btnCancelar").addEventListener("click", () => history.back());

// ======================================================
// 4️⃣ MENU FLUTUANTE — igual outras telas
// ======================================================
const menuFlutuante = $("menuFlutuante");
const selectContainer = $("selectContainer");
const tituloAba = $("tituloAba");
const btnIr = $("btnIr");

function abrirMenu(tipo) {
  menuFlutuante.style.display = "block";
  selectContainer.innerHTML = "";
  btnIr.style.display = "block";

  if (tipo === "instituicao") {
    tituloAba.textContent = "Instituições";
    btnIr.onclick = () => window.location.href = "/gerenciar/html/dashboard.html";
  }

  if (tipo === "curso") {
    tituloAba.textContent = "Cursos";
    btnIr.onclick = () => window.location.href = "/gerenciar/html/listaCursos.html";
  }

  if (tipo === "disciplina") {
    tituloAba.textContent = "Disciplinas";
    btnIr.onclick = () => window.location.href = "/gerenciar/html/listaDisciplinas.html";
  }
}

$("btnInstituicoes").addEventListener("click", () => abrirMenu("instituicao"));
$("btnCursos").addEventListener("click", () => abrirMenu("curso"));
$("btnDisciplinas").addEventListener("click", () => abrirMenu("disciplina"));
$("btnTurmas").addEventListener("click", () => abrirMenu("turma"));

document.addEventListener("click", (e) => {
  if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
    menuFlutuante.style.display = "none";
  }
});

// ======================================================
// 5️⃣ INICIAR CARREGANDO INSTITUIÇÕES
// ======================================================
carregarInstituicoes();
