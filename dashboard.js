// 
// ==========================
const inputBusca = document.getElementById("buscaInstituicao");
const btnBusca = document.getElementById("btnBuscarInstituicao");
const lista = document.getElementById("listaInstituicoes");
const cards = document.querySelectorAll(".card");

const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

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
// Função de busca
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

// ==========================
// Evento busca
// ==========================
btnBusca.addEventListener("click", filtrarInstituicoes);
inputBusca.addEventListener("keyup", filtrarInstituicoes);

// ==========================
// Menu flutuante
// ==========================
const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
const cursos = ["Engenharia", "Direito", "Administração"];
const disciplinas = ["Cálculo I", "Física", "Lógica"];
const turmas = ["Turma A", "Turma B", "Turma C"];
const alunos = ["João Silva", "Maria Souza", "Pedro Santos"];

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

function abrirMenu(tipo) {
  selectContainer.innerHTML = "";
  btnIr.style.display = "none";
  menuFlutuante.style.display = "block";

  if (tipo === "curso") {
    tituloAba.textContent = "Selecionar Curso";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
      btnIr.style.display = "block";
      btnIr.onclick = () => window.location.href = "curso.html";
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
        btnIr.onclick = () => window.location.href = "disciplina.html";
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
          btnIr.onclick = () => window.location.href = "turma.html";
        });
      });
    });
  }

  if (tipo === "aluno") {
    tituloAba.textContent = "Selecionar Aluno";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
      document.getElementById("selCurso").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
        document.getElementById("selDisciplina").addEventListener("change", () => {
          selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmas));
          document.getElementById("selTurma").addEventListener("change", () => {
            selectContainer.appendChild(criarSelect("selAluno", "Aluno:", alunos));
            btnIr.style.display = "block";
            btnIr.onclick = () => window.location.href = "aluno.html";
          });
        });
      });
    });
  }
}

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
    menuFlutuante.style.display = "none";
  }
});

// Eventos do menu
document.getElementById("btnCursos").addEventListener("click", () => abrirMenu("curso"));
document.getElementById("btnDisciplinas").addEventListener("click", () => abrirMenu("disciplina"));
document.getElementById("btnTurmas").addEventListener("click", () => abrirMenu("turma"));
document.getElementById("btnAlunos").addEventListener("click", () => abrirMenu("aluno"));
