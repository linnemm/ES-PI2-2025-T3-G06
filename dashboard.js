// ==========================
// Elementos do DOM
// ==========================
const inputBusca = document.getElementById("buscaInstituicao");
const btnBusca = document.getElementById("btnBuscarInstituicao");
const lista = document.getElementById("listaInstituicoes");
const cards = document.querySelectorAll(".card");

const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");
const btnAddInstituicao = document.getElementById("addInstituicao");

// ==========================
// Mensagem caso nada seja encontrado
// ==========================
const mensagemVazia = document.createElement("p");
mensagemVazia.textContent = "Nenhuma instituição encontrada.";
mensagemVazia.classList.add("mensagem-vazia");
mensagemVazia.style.display = "none";
mensagemVazia.style.textAlign = "center";
mensagemVazia.style.color = "#777";
mensagemVazia.style.marginTop = "20px";
lista.parentNode.insertBefore(mensagemVazia, lista.nextSibling);

// ==========================
// Função de busca de instituições
// ==========================
function filtrarInstituicoes() {
  const termo = inputBusca.value.toLowerCase().trim();
  let resultados = 0;

  cards.forEach((card) => {
    const texto = card.innerText.toLowerCase();
    const visivel = texto.includes(termo);
    card.style.display = visivel ? "flex" : "none";
    if (visivel) resultados++;
  });

  mensagemVazia.style.display = resultados === 0 ? "block" : "none";
}

btnBusca.addEventListener("click", filtrarInstituicoes);
inputBusca.addEventListener("keyup", filtrarInstituicoes);

// ==========================
// Dados simulados
// ==========================
const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
const cursos = ["Engenharia", "Direito", "Administração"];
const disciplinas = ["Cálculo I", "Física", "Lógica"];
const turmas = ["Turma A", "Turma B", "Turma C"];

// ==========================
// Função auxiliar para criar selects
// ==========================
function criarSelect(id, label, opcoes) {
  const div = document.createElement("div");
  div.classList.add("campo-selecao");

  const lbl = document.createElement("label");
  lbl.textContent = label;
  lbl.htmlFor = id;

  const select = document.createElement("select");
  select.id = id;
  select.innerHTML =
    `<option value="">Selecione...</option>` +
    opcoes.map(o => `<option>${o}</option>`).join("");

  div.appendChild(lbl);
  div.appendChild(select);
  return div;
}

// ==========================
// Abrir menu flutuante
// ==========================
function abrirMenu(tipo) {
  selectContainer.innerHTML = "";
  btnIr.style.display = "none";
  menuFlutuante.style.display = "block";

  if (tipo === "instituicao") {
    tituloAba.textContent = "Instituições";
    
    // Botão Ver todas acima do select
    const btnVerTodas = document.createElement("button");
    btnVerTodas.textContent = "Ver todas as instituições";
    btnVerTodas.classList.add("btn-curso");
    btnVerTodas.style.marginBottom = "10px";
    btnVerTodas.onclick = () => window.location.href = "instituicoes.html";
    selectContainer.appendChild(btnVerTodas);

    selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", instituicoes));
    btnIr.style.display = "block";
    btnIr.onclick = () => {
      const sel = document.getElementById("selInstituicao");
      if(sel.value) window.location.href = "listaCursos.html";
      else alert("Selecione uma instituição!");
    };
  }

  if (tipo === "curso") {
    tituloAba.textContent = "Selecionar Curso";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
      btnIr.style.display = "block";
      btnIr.onclick = () => window.location.href = "listaDisciplinas.html";
    });
  }

  if (tipo === "disciplina") {
    tituloAba.textContent = "Selecionar Disciplina";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
      document.getElementById("selCurso").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
        btnIr.style.display = "block";
        btnIr.onclick = () => window.location.href = "listaTurmas.html";
      });
    });
  }

  if (tipo === "turma") {
    tituloAba.textContent = "Selecionar Turma";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
      document.getElementById("selCurso").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
        document.getElementById("selDisciplina").addEventListener("change", () => {
          selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmas));
          btnIr.style.display = "block";
          btnIr.onclick = () => window.location.href = "detalhesTurma.html";
        });
      });
    });
  }
}

// ==========================
// Eventos do menu
// ==========================
document.getElementById("btnCursos").addEventListener("click", () => abrirMenu("curso"));
document.getElementById("btnDisciplinas").addEventListener("click", () => abrirMenu("disciplina"));
document.getElementById("btnTurmas").addEventListener("click", () => abrirMenu("turma"));
document.getElementById("btnInstituicoes").addEventListener("click", () => abrirMenu("instituicao"));

// ==========================
// Botão Nova Instituição
// ==========================
btnAddInstituicao.addEventListener("click", () => {
  window.location.href = "cadastro_instituicao.html";
});

// ==========================
// Fechar menu ao clicar fora
// ==========================
document.addEventListener("click", (e) => {
  if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
    menuFlutuante.style.display = "none";
  }
});
