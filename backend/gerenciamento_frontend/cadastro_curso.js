// ===== Cadastro de Curso + Topbar (janelinha) =====
window.addEventListener("DOMContentLoaded", () => {
  // --------------------------
  // Popula select de Instituições
  // --------------------------
  const selectInstituicao = document.getElementById("instituicao");
  const instituicoesLS = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
  const unica = JSON.parse(localStorage.getItem("instituicaoCadastrada"));
  if (unica && instituicoesLS.length === 0) {
    instituicoesLS.push(unica);
  }
  instituicoesLS.forEach((inst) => {
    const option = document.createElement("option");
    option.value = inst.nome;
    option.textContent = inst.nome;
    selectInstituicao.appendChild(option);
  });

  // --------------------------
  // Salvar Curso
  // --------------------------
  document.getElementById("formCurso").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sigla = document.getElementById("sigla").value.trim();
    const coordenador = document.getElementById("coordenador").value.trim();
    const instituicao = document.getElementById("instituicao").value;

    if (!instituicao) {
      alert("Selecione uma instituição para vincular o curso!");
      return;
    }

    const curso = { nome, sigla, coordenador, instituicao };
    const listaCursos = JSON.parse(localStorage.getItem("listaCursos")) || [];
    listaCursos.push(curso);
    localStorage.setItem("listaCursos", JSON.stringify(listaCursos));

    alert(`Curso "${nome}" vinculado à instituição "${instituicao}" cadastrado com sucesso!`);
    window.location.href = "dashboard.html";
  });

  // --------------------------
  // Botão Cancelar
  // --------------------------
  document.getElementById("btnCancelar").addEventListener("click", () => {
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
  const insts = ["PUCCAMP", "USP", "UNICAMP"];
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

      selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", insts));
      btnIr.style.display = "block";
      btnIr.onclick = () => {
        const sel = document.getElementById("selInstituicao");
        if (sel.value) window.location.href = "listaCursos.html";
        else alert("Selecione uma instituição!");
      };
    }

    if (tipo === "curso") {
      tituloAba.textContent = "Selecionar Curso";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", insts));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
        btnIr.style.display = "block";
        btnIr.onclick = () => window.location.href = "listaDisciplinas.html";
      });
    }

    if (tipo === "disciplina") {
      tituloAba.textContent = "Selecionar Disciplina";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", insts));
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
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", insts));
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

  // Ações do menu 

  document.getElementById("btnInstituicoes")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("instituicao"); });
  document.getElementById("btnCursos")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("curso"); });
  document.getElementById("btnDisciplinas")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("disciplina"); });
  document.getElementById("btnTurmas")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("turma"); });

  // Fechar janelinha ao clicar fora
  document.addEventListener("click", (e) => {
    const dentro = menuFlutuante.contains(e.target);
    const ehTopbar = e.target.closest(".ndz-menu");
    if (!dentro && !ehTopbar) menuFlutuante.style.display = "none";
  });
});
