// ===============================
// CADASTRO DE CURSO — NotaDez
// ===============================

window.addEventListener("DOMContentLoaded", async () => {

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

  // --------------------------
  // CARREGAR INSTITUIÇÕES DO BANCO
  // --------------------------
  
  const selectInstituicao = document.getElementById("instituicao");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("⚠ Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "/auth/html/login.html";
    return;
  }

  try {
    const resp = await fetch(`/api/instituicoes/listar/${userId}`);
    const instituicoes = await resp.json();

    if (!resp.ok) {
      alert("Erro ao carregar instituições.");
      return;
    }

    instituicoes.forEach(inst => {
      const option = document.createElement("option");
      option.value = inst.ID;
      option.textContent = inst.NOME;
      selectInstituicao.appendChild(option);
    });

  } catch (error) {
    console.error("Erro ao carregar instituições:", error);
    alert("Erro ao conectar com o servidor.");
  }

  // --------------------------
  // SALVAR CURSO NO BANCO
  // --------------------------

  document.getElementById("formCurso").addEventListener("submit", async (e) => {
    e.preventDefault();

    const instituicaoId = document.getElementById("instituicao").value;
    const nome = document.getElementById("nome").value.trim();
    const sigla = document.getElementById("sigla").value.trim();
    const coordenador = document.getElementById("coordenador").value.trim();

    if (!instituicaoId) {
      alert("Selecione uma instituição!");
      return;
    }

    try {
      const resp = await fetch("/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: userId,
          instituicaoId,
          nome,
          sigla,
          coordenador
        })
      });

      const dados = await resp.json();

      if (resp.ok) {
        alert("📚 Curso cadastrado com sucesso!");

        // Ao cadastrar o curso → desbloqueia o menu
        localStorage.setItem("primeiroAcesso", "false");

        window.location.href = "/gerenciar/html/dashboard.html";
      } else {
        alert("Erro: " + dados.message);
      }

    } catch (error) {
      console.error("Erro ao cadastrar curso:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });

  // --------------------------
  // CANCELAR
  // --------------------------

  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = "/gerenciar/html/dashboard.html";
  });

  // --------------------------
  // MENU FLUTUANTE (TOPBAR)
  // --------------------------

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
        if (sel.value) window.location.href = "/gerenciar/html/listaCursos.html";
        else alert("Selecione uma instituição!");
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

  // BOTÕES DO MENU (TOPBAR)
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

  // FECHAR MENU AO CLICAR FORA
  document.addEventListener("click", (e) => {
    const dentro = menuFlutuante.contains(e.target);
    const ehTopbar = e.target.closest(".menu-horizontal");
    if (!dentro && !ehTopbar) menuFlutuante.style.display = "none";
  });
});
