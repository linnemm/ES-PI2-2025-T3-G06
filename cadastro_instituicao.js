// Autoria: Alinne 

// --------------------------
// Formulário 
// --------------------------
const form = document.getElementById("formInstituicao");
const btnIrCurso = document.getElementById("btnIrCurso");
const btnCancelar = document.getElementById("btnCancelar");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (!nome || !sigla) {
    alert("Preencha todos os campos antes de salvar!");
    return;
  }

  const listaInstituicoes = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  // evita duplicata por nome
  const existe = listaInstituicoes.some(inst => inst.nome.toLowerCase() === nome.toLowerCase());
  if (existe) {
    alert("Esta instituição já está cadastrada!");
    return;
  }

  listaInstituicoes.push({ nome, sigla });
  localStorage.setItem("listaInstituicoes", JSON.stringify(listaInstituicoes));

  alert(`Instituição "${nome}" cadastrada com sucesso!`);
  form.reset();
});

// Cancelar → volta pro dashboard
btnCancelar?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// “Cadastrar Curso”: salva se necessário e vai para cadastro_curso
btnIrCurso.addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (nome && sigla) {
    const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
    const existe = lista.some(inst => inst.nome.toLowerCase() === nome.toLowerCase());
    if (!existe) {
      lista.push({ nome, sigla });
      localStorage.setItem("listaInstituicoes", JSON.stringify(lista));
    }
  }
  window.location.href = "cadastro_curso.html";
});

// --------------------------
// ABA FLUTUANTE 
// --------------------------
const menuFlutuante   = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba       = document.getElementById("tituloAba");
const btnIr           = document.getElementById("btnIr");

// Dados simulados (trocar pelos reais quando integrar)
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

// Abridores 
document.getElementById("btnInstituicoes")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("instituicao"); });
document.getElementById("btnCursos")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("curso"); });
document.getElementById("btnDisciplinas")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("disciplina"); });
document.getElementById("btnTurmas")?.addEventListener("click", (e) => { e.preventDefault(); abrirMenu("turma"); });

// Fechar janelinha ao clicar fora
document.addEventListener("click", (e) => {
  const dentro = menuFlutuante.contains(e.target);
  const ehTopbar = e.target.closest(".menu-horizontal");
  if (!dentro && !ehTopbar) menuFlutuante.style.display = "none";
});
