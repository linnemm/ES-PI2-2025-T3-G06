// ===== Topbar / Aba flutuante (copiado da página de referência) =====
document.addEventListener("DOMContentLoaded", () => {
  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba = document.getElementById("tituloAba");
  const btnIr = document.getElementById("btnIr");

  const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
  const cursos = ["Engenharia", "Direito", "Administração"];
  const disciplinas = ["Cálculo I", "Física", "Lógica"];
  const turmasSel = ["Turma A", "Turma B", "Turma C"];

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
                  selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmasSel));
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

  const id = s => document.getElementById(s);
  id("btnInstituicoes")?.addEventListener("click", () => abrirMenu("instituicao"));
  id("btnCursos")?.addEventListener("click", () => abrirMenu("curso"));
  id("btnDisciplinas")?.addEventListener("click", () => abrirMenu("disciplina"));
  id("btnTurmas")?.addEventListener("click", () => abrirMenu("turma"));

  document.addEventListener("click", e => {
    if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
      menuFlutuante.style.display = "none";
    }
  });
});

// ===== Lista de Turmas (seu código, com pequenos ajustes) =====
document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados de turmas
  let turmas = [
    { nome: "100", codigo: "A013", disciplina: "Banco de Dados I" },
    { nome: "101", codigo: "D809", disciplina: "Álgebra Linear" },
    { nome: "102", codigo: "S789", disciplina: "Teologia" },
    { nome: "103", codigo: "A133", disciplina: "Introdução a Web" }
  ];

  // Seleção dos elementos do DOM
  const corpoTabela = document.getElementById("corpoTabela");
  const vazio = document.getElementById("vazio");
  const btnBuscar = document.getElementById("btnBuscar");
  const fBusca = document.getElementById("fBusca");

  function renderizarTabela(lista) {
    corpoTabela.innerHTML = "";

    if (!lista.length) {
      vazio.style.display = "block";
      return;
    }
    vazio.style.display = "none";

    lista.forEach((turma, index) => {
      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span>${turma.nome}</span>
        <span>${turma.codigo}</span>
        <span>${turma.disciplina}</span>
        <div class="acoes">
          <button class="btn-excluir" data-index="${index}">Excluir</button>
        </div>
      `;

      corpoTabela.appendChild(row);
    });

    // Delegação de evento para botões Excluir
    corpoTabela.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = Number(e.currentTarget.getAttribute("data-index"));
        excluirTurma(idx);
      });
    });
  }

  function buscarTurmas() {
    const termo = fBusca.value.toLowerCase().trim();
    const filtradas = turmas.filter(t =>
      t.nome.toLowerCase().includes(termo) ||
      t.codigo.toLowerCase().includes(termo) ||
      t.disciplina.toLowerCase().includes(termo)
    );
    renderizarTabela(filtradas);
  }

  function excluirTurma(index) {
    if (confirm(`Deseja realmente excluir a turma "${turmas[index].nome}"?`)) {
      turmas.splice(index, 1);
      buscarTurmas();
    }
  }

  // Eventos
  btnBuscar.addEventListener("click", buscarTurmas);
  fBusca.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarTurmas();
  });

  // Render inicial
  renderizarTabela(turmas);
});
