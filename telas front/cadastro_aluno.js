// ===== Topbar: “janelinha” (igual ao dashboard) + Form de cadastro =====
document.addEventListener("DOMContentLoaded", () => {
  // --------------------------
  // FORM cadastra aluno
  // --------------------------
  const form = document.getElementById("formAluno");
  const btnImportar = document.getElementById("btnImportar");
  const btnCancelar = document.getElementById("btnCancelar");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !matricula || !email) {
      alert("Preencha todos os campos!");
      return;
    }

    const lista = JSON.parse(localStorage.getItem("listaAlunos")) || [];
    lista.push({ nome, matricula, email });
    localStorage.setItem("listaAlunos", JSON.stringify(lista));

    alert("Aluno salvo com sucesso!");
    form.reset();
  });

  btnImportar.addEventListener("click", () => {
    alert("Aqui você pode implementar a importação por arquivo (CSV/Excel).");
    // <input type="file" accept=".csv,.xlsx"> + Papaparse/SheetJS
  });

  btnCancelar.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  // --------------------------
  // ABA FLUTUANTE 
  // --------------------------
  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba = document.getElementById("tituloAba");
  const btnIr = document.getElementById("btnIr");

  // Dados simulados 
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

      // “Ver todas” 
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

  // Abridores 
  const btnInstituicoes = document.getElementById("btnInstituicoes");
  const btnCursos = document.getElementById("btnCursos");
  const btnDisciplinas = document.getElementById("btnDisciplinas");
  const btnTurmas = document.getElementById("btnTurmas");

  btnInstituicoes?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("instituicao"); });
  btnCursos?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("curso"); });
  btnDisciplinas?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("disciplina"); });
  btnTurmas?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("turma"); });

  // Fechar ao clicar fora
  document.addEventListener("click", (e) => {
    const dentro = menuFlutuante.contains(e.target);
    const ehTopbar = e.target.closest(".ndz-menu");
    if (!dentro && !ehTopbar) menuFlutuante.style.display = "none";
  });
});
