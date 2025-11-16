// ==========================
// Funções da tabela de notas
// ==========================
function voltar() {
  window.history.back();
}

document.querySelectorAll('.excluir').forEach(botao => {
  botao.addEventListener('click', (e) => {
    if (confirm('Deseja realmente excluir este aluno?')) {
      e.target.closest('tr').remove();
    }
  });
});

document.getElementById('novoComponente').addEventListener('click', () => {
  alert('Função para adicionar novo componente ainda não implementada.');
});

document.getElementById('exportarNotas').addEventListener('click', () => {
  alert('Exportando notas...');
});

// ==========================
// Integração com o menu flutuante (igual ao dashboard)
// ==========================
const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
const cursos = ["Engenharia", "Direito", "Administração"];
const disciplinas = ["Cálculo I", "Física", "Lógica"];
const turmas = ["Turma A", "Turma B", "Turma C"];

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

  if (tipo === "instituicao") {
    tituloAba.textContent = "Instituições";
    const btnVerTodas = document.createElement("button");
    btnVerTodas.textContent = "Ver todas as instituições";
    btnVerTodas.classList.add("btn-curso");
    btnVerTodas.style.marginBottom = "10px";
    btnVerTodas.onclick = () => window.location.href = "dashboard.html";

    selectContainer.appendChild(btnVerTodas);
    selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", instituicoes));

    btnIr.style.display = "block";
    btnIr.onclick = () => {
      const sel = document.getElementById("selInstituicao");
      if (sel.value) window.location.href = "listaCursos.html";
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

document.getElementById("btnInstituicoes").addEventListener("click", (e) => {
  e.preventDefault();
  abrirMenu("instituicao");
});

document.getElementById("btnCursos").addEventListener("click", (e) => {
  e.preventDefault();
  abrirMenu("curso");
});

document.getElementById("btnDisciplinas").addEventListener("click", (e) => {
  e.preventDefault();
  abrirMenu("disciplina");
});

document.getElementById("btnTurmas").addEventListener("click", (e) => {
  e.preventDefault();
  abrirMenu("turma");
});

document.addEventListener("click", (e) => {
  if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
    menuFlutuante.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menuFlutuante.style.display = "none";
  }
});
