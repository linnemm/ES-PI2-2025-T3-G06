document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.getElementById("tabelaNotas").querySelector("tbody");

  // Adicionar novo componente de nota
  document.getElementById("btnAddComponente").addEventListener("click", () => {
    const matricula = prompt("Digite a matrícula do aluno:");
    const nome = prompt("Digite o nome do aluno:");
    const componente = prompt("Digite o nome do componente (ex: Prova 2):");
    const nota = prompt("Digite a nota:");
    if (matricula && nome && componente && nota) adicionarNota(matricula, nome, componente, nota);
  });

  // Exportar notas (simulação)
  document.getElementById("btnExportar").addEventListener("click", () => {
    alert("Notas exportadas com sucesso (simulação)!");
  });

  function adicionarNota(matricula, nome, componente, nota) {
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `
      <td>${matricula}</td>
      <td>${nome}</td>
      <td contenteditable="true">${componente}</td>
      <td contenteditable="true">${nota}</td>
      <td>
        <button class="btnEditar" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btnExcluir" title="Excluir"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tabela.appendChild(novaLinha);
    atualizarEventos();
  }

  // Excluir múltiplos
  document.getElementById("btnExcluirSelecionados").addEventListener("click", () => {
    const selecionados = tabela.querySelectorAll(".chkNota:checked");
    if (selecionados.length === 0) return alert("Nenhuma nota selecionada.");
    if (!confirm(`Remover ${selecionados.length} nota(s)?`)) return;
    selecionados.forEach(chk => chk.closest("tr").remove());
  });

  // Salvar alterações
  document.getElementById("btnSalvar").addEventListener("click", () => {
    alert("Alterações salvas (simulação).");
  });

  // Voltar
  document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "detalhesTurma.html";
  });

  function atualizarEventos() {
    tabela.querySelectorAll(".btnExcluir").forEach(btn => {
      btn.onclick = () => {
        if (confirm("Remover esta nota?")) btn.closest("tr").remove();
      };
    });
  }

  atualizarEventos();

  // ------------------------------
  // Menu flutuante (reaproveitado)
  // ------------------------------
  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba = document.getElementById("tituloAba");
  const btnIr = document.getElementById("btnIr");

  // 🔹 Garante que o menu NÃO apareça automaticamente
  menuFlutuante.style.display = "none";

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

  // Botões da Topbar que abrem o menu
  document.getElementById("btnInstituicoes").onclick = () => abrirMenu("instituicao");
  document.getElementById("btnCursos").onclick = () => abrirMenu("curso");
  document.getElementById("btnDisciplinas").onclick = () => abrirMenu("disciplina");
  document.getElementById("btnTurmas").onclick = () => abrirMenu("turma");

  // Fecha o menu ao clicar fora
  document.addEventListener("click", e => {
    if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
      menuFlutuante.style.display = "none";
    }
  });
});
