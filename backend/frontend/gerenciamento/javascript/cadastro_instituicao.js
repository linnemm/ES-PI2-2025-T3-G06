// ======================================================
//  CADASTRO DE INSTITUIÇÃO — NotaDez
// ======================================================

window.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // BLOQUEAR MENU DURANTE O PRIMEIRO ACESSO
  // =====================================================

  const primeiroAcesso = localStorage.getItem("primeiroAcesso");

  if (primeiroAcesso === "true") {
    const itensMenu = document.querySelectorAll(".menu-horizontal a");

    itensMenu.forEach(item => {
      item.classList.add("desabilitado");

      item.addEventListener("click", (e) => {
        e.preventDefault();
        alert("⚠ Termine o cadastro da instituição e do curso primeiro!");
      });
    });
  }

  // ======================================================
  //  FORMULÁRIO
  // ======================================================

  const form = document.getElementById("formInstituicao");
  const btnIrCurso = document.getElementById("btnIrCurso");
  const btnCancelar = document.getElementById("btnCancelar");

  // ======================================================
  //  ENVIAR PARA O BACKEND
  // ======================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sigla = document.getElementById("sigla").value.trim();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("⚠ Erro: usuário não identificado. Faça login novamente.");
      window.location.href = "/auth/html/login.html";
      return;
    }

    if (!nome || !sigla) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }

    try {
      // 1️⃣ Cadastrar instituição
      const resposta = await fetch("/api/instituicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sigla, usuarioId: userId })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert("❌ " + (dados.message || "Erro ao cadastrar instituição."));
        return;
      }

      alert("🏫 Instituição cadastrada com sucesso!");

      // 2️⃣ Atualizar no backend
      await fetch("/api/auth/finalizar-primeiro-acesso", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: userId })
      });

      // 3️⃣ Agora obrigatoriamente vá para CADASTRO DE CURSO
      window.location.href = "/gerenciar/html/cadastro_curso.html";

    } catch (erro) {
      console.error("Erro:", erro);
      alert("❌ Erro ao conectar com o servidor.");
    }
  });

  // ======================================================
  // CANCELAR → voltar ao dashboard
  // ======================================================
  btnCancelar?.addEventListener("click", () => {
    window.location.href = "/gerenciar/html/dashboard.html";
  });

  // ======================================================
  // BOTÃO “Cadastrar Curso”
  // ======================================================
  btnIrCurso?.addEventListener("click", () => {
    window.location.href = "/gerenciar/html/cadastro_curso.html";
  });

  // ======================================================
  //  MENU FLUTUANTE — TOPBAR
  // ======================================================

  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba = document.getElementById("tituloAba");
  const btnIr = document.getElementById("btnIr");

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
      btnVerTodas.onclick = () => window.location.href = "/gerenciar/html/dashboard.html";
      selectContainer.appendChild(btnVerTodas);

      selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", insts));
      btnIr.style.display = "block";
      btnIr.onclick = () => {
        const sel = document.getElementById("selInstituicao");
        if (sel.value)
          window.location.href = "/gerenciar/html/listaCursos.html";
        else
          alert("Selecione uma instituição!");
      };
    }

    if (tipo === "curso") {
      tituloAba.textContent = "Selecionar Curso";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", insts));

      document.getElementById("selInstituicao").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
        btnIr.style.display = "block";
        btnIr.onclick = () => window.location.href = "/gerenciar/html/listaDisciplinas.html";
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
          btnIr.onclick = () => window.location.href = "/gerenciar/html/listaTurmas.html";
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
            btnIr.onclick = () => window.location.href = "/gerenciar/html/detalhesTurma.html";
          });
        });
      });
    }
  }

  // Abridores
  document.getElementById("btnInstituicoes")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirMenu("instituicao");
  });

  document.getElementById("btnCursos")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirMenu("curso");
  });

  document.getElementById("btnDisciplinas")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirMenu("disciplina");
  });

  document.getElementById("btnTurmas")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirMenu("turma");
  });

  // Fechar flutuante
  document.addEventListener("click", (e) => {
    const dentro = menuFlutuante.contains(e.target);
    const ehTopbar = e.target.closest(".menu-horizontal");

    if (!dentro && !ehTopbar) {
      menuFlutuante.style.display = "none";
    }
  });
});
