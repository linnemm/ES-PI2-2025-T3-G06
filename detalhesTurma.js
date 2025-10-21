document.addEventListener("DOMContentLoaded", () => {
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
    select.innerHTML = `<option value="">Selecione...</option>` + opcoes.map(o => `<option>${o}</option>`).join("");

    div.appendChild(lbl);
    div.appendChild(select);
    return div;
  }

  function abrirMenu(tipo) {
    selectContainer.innerHTML = "";
    btnIr.style.display = "none";
    menuFlutuante.style.display = "block";

    if (tipo === "instituicao") {
      tituloAba.textContent = "Selecionar Instituição";
      const btnVerTodas = document.createElement("button");
      btnVerTodas.textContent = "Ver todas as instituições";
      btnVerTodas.classList.add("btn-curso");
      btnVerTodas.style.marginBottom = "10px";
      btnVerTodas.onclick = () => window.location.href = "listaCursos.html";
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
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          btnIr.style.display = "block";
          btnIr.onclick = () => {
            const sel = document.getElementById("selCurso");
            if (sel.value) window.location.href = "listaDisciplinas.html";
            else alert("Selecione um curso!");
          };
        }
      }, { once: true });
    }

    if (tipo === "disciplina") {
      tituloAba.textContent = "Selecionar Disciplina";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          document.getElementById("selCurso").addEventListener("change", () => {
            if (!document.getElementById("selDisciplina")) {
              selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
              btnIr.style.display = "block";
              btnIr.onclick = () => {
                const sel = document.getElementById("selDisciplina");
                if (sel.value) window.location.href = "listaTurmas.html";
                else alert("Selecione uma disciplina!");
              };
            }
          }, { once: true });
        }
      }, { once: true });
    }

    if (tipo === "turma") {
      tituloAba.textContent = "Selecionar Turma";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          document.getElementById("selCurso").addEventListener("change", () => {
            if (!document.getElementById("selDisciplina")) {
              selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
              document.getElementById("selDisciplina").addEventListener("change", () => {
                if (!document.getElementById("selTurma")) {
                  selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmas));
                  btnIr.style.display = "block";
                  btnIr.onclick = () => {
                    const sel = document.getElementById("selTurma");
                    if (sel.value) window.location.href = "detalhesTurma.html";
                    else alert("Selecione uma turma!");
                  };
                }
              }, { once: true });
            }
          }, { once: true });
        }
      }, { once: true });
    }
  }

  document.getElementById("btnInstituicoes").onclick = () => abrirMenu("instituicao");
  document.getElementById("btnCursos").onclick = () => abrirMenu("curso");
  document.getElementById("btnDisciplinas").onclick = () => abrirMenu("disciplina");
  document.getElementById("btnTurmas").onclick = () => abrirMenu("turma");

  document.addEventListener("click", e => {
    if (!menuFlutuante.contains(e.target) &&
        !e.target.closest(".menu-horizontal")) {
      menuFlutuante.style.display = "none";
    }
  });
});
