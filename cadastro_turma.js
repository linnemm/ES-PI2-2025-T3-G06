// ===== Cadastro de Turma e Topbar (janelinha) =====
document.addEventListener("DOMContentLoaded", () => {
    // --------------------------
    // FORM: salvar Turma 
    // --------------------------
    const form = document.getElementById("formTurma");
    const btnCancelar = document.getElementById("btnCancelar");
  
    // Carrega instituições/curso demo no select 
    const selectInstituicao = document.getElementById("instituicao");
    const selectCurso = document.getElementById("curso");
  
    const instituicoesLS = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
    instituicoesLS.forEach((inst) => {
      const option = document.createElement("option");
      option.value = inst.nome || inst; // compatível com objetos {nome, sigla} ou strings simples
      option.textContent = inst.nome || inst;
      selectInstituicao.appendChild(option);
    });
  
    const cursosLS = JSON.parse(localStorage.getItem("listaCursos")) || [];
    cursosLS.forEach((c) => {
      // c pode ser {nome, instituicao, ...} ou string simples
      const nome = c.nome || c;
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      selectCurso.appendChild(option);
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nomeTurma = document.getElementById("nomeTurma").value.trim();
      const instituicao = document.getElementById("instituicao").value;
      const curso = document.getElementById("curso").value;
      const disciplina = document.getElementById("disciplina").value.trim();
      const codigo = document.getElementById("codigo").value.trim();
      const periodo = document.getElementById("periodo").value.trim();
  
      if (!nomeTurma || !instituicao || !curso || !disciplina || !codigo || !periodo) {
        alert("Preencha todos os campos!");
        return;
      }
  
      const lista = JSON.parse(localStorage.getItem("listaTurmas")) || [];
      lista.push({ nomeTurma, instituicao, curso, disciplina, codigo, periodo });
      localStorage.setItem("listaTurmas", JSON.stringify(lista));
  
      alert("Turma cadastrada com sucesso!");
      form.reset();
    });
  
    btnCancelar?.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  
    // --------------------------
    // ABA FLUTUANTE 
    // --------------------------
    const menuFlutuante   = document.getElementById("menuFlutuante");
    const selectContainer = document.getElementById("selectContainer");
    const tituloAba       = document.getElementById("tituloAba");
    const btnIr           = document.getElementById("btnIr");
  
    // Dados simulados 
    const insts       = ["PUCCAMP", "USP", "UNICAMP"];
    const cursos      = ["Engenharia", "Direito", "Administração"];
    const disciplinas = ["Cálculo I", "Física", "Lógica"];
    const turmas      = ["Turma A", "Turma B", "Turma C"];
  
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
  
    // Aberturas 
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
  