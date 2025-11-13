// =========================================
// LISTA DE CURSOS 
// =========================================

// Chaves / helpers
const LS_KEY = 'pi.cursos';
const $ = (id) => document.getElementById(id);

// ------- Seeds temporários (remova após integrar com backend) -------
if (!localStorage.getItem(LS_KEY)) {
  localStorage.setItem(LS_KEY, JSON.stringify([
    { id: '1', nome: 'Engenharia de Software', sigla: 'ESW', coordenador: 'Prof. Ivan Granja' },
    { id: '2', nome: 'Sistemas de Informação', sigla: 'SI', coordenador: 'Profa. Renata Arantes' },
    { id: '3', nome: 'Ciência da Computação', sigla: 'CC', coordenador: 'Prof. Luã Muriana' }
  ]));
}

// ------- Renderização da lista -------
function linhaHTML(curso) {
  return `
    <div class="tabela-row">
      <span><strong>${curso.nome}</strong></span>
      <span>${curso.sigla}</span>
      <span>${curso.coordenador}</span>
      <span class="acoes">
        <a class="link" href="cadastro_curso.html?id=${encodeURIComponent(curso.id)}">
          <i class="fa-solid fa-pen"></i> Editar
        </a>
        <button class="btn-excluir" onclick="excluirCurso('${curso.id}')">
          <i class="fa-solid fa-trash"></i> Excluir
        </button>
      </span>
    </div>
  `;
}

function renderLista() {
  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const termo = $('fBusca').value.trim().toLowerCase();

  const filtrados = lista.filter(curso =>
    !termo ||
    curso.nome.toLowerCase().includes(termo) ||
    curso.sigla.toLowerCase().includes(termo) ||
    curso.coordenador.toLowerCase().includes(termo)
  );

  $('corpoTabela').innerHTML = filtrados.map(linhaHTML).join('');
  $('vazio').style.display = filtrados.length ? 'none' : 'block';
}

function excluirCurso(id) {
  if (!confirm('Deseja realmente excluir este curso?')) return;
  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(c => c.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
  renderLista();
}
window.excluirCurso = excluirCurso;

// ------- Eventos principais -------
$('btnNovo').addEventListener('click', () => location.href = 'cadastro_curso.html');
$('btnBuscar').addEventListener('click', renderLista);
$('fBusca').addEventListener('keyup', e => { if (e.key === 'Enter') renderLista(); });

// Inicializa lista
renderLista();

// =========================================
// JANELINHA (menu flutuante) — igual ao dashboard
// =========================================
const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

// Garantia: começa fechado
if (menuFlutuante) menuFlutuante.style.display = "none";

// Mock de dados
const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
const cursos = ["Engenharia", "Direito", "Administração"];
const disciplinas = ["Cálculo I", "Física", "Lógica"];
const turmas = ["Turma A", "Turma B", "Turma C"];

function criarSelect(id, label, opcoes) {
  const div = document.createElement("div");
  div.classList.add("campo-selecao");
  div.innerHTML = `
    <label for="${id}">${label}</label>
    <select id="${id}">
      <option value="">Selecione...</option>
      ${opcoes.map(o => `<option>${o}</option>`).join("")}
    </select>
  `;
  return div;
}

function abrirMenu(tipo) {
  if (!menuFlutuante) return;

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
      if (sel && sel.value) window.location.href = "listaCursos.html";
      else alert("Selecione uma instituição!");
    };
  }

  if (tipo === "curso") {
    tituloAba.textContent = "Selecionar Curso";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "listaDisciplinas.html";
  }

  if (tipo === "disciplina") {
    tituloAba.textContent = "Selecionar Disciplina";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
    selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "listaTurmas.html";
  }

  if (tipo === "turma") {
    tituloAba.textContent = "Selecionar Turma";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
    selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
    selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
    selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmas));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "detalhesTurma.html";
  }
}

// Ligações dos botões da topbar 
document.getElementById("btnInstituicoes").addEventListener("click", (e) => { e.preventDefault(); abrirMenu("instituicao"); });
document.getElementById("btnCursos").addEventListener("click",        (e) => { e.preventDefault(); abrirMenu("curso"); });
document.getElementById("btnDisciplinas").addEventListener("click",   (e) => { e.preventDefault(); abrirMenu("disciplina"); });
document.getElementById("btnTurmas").addEventListener("click",        (e) => { e.preventDefault(); abrirMenu("turma"); });

// Fechar ao clicar fora 
document.addEventListener("click", (e) => {
  const clicouDentro = menuFlutuante?.contains(e.target);
  const clicouNaTopbar = e.target.closest(".menu-horizontal");
  if (!clicouDentro && !clicouNaTopbar && menuFlutuante?.style.display === "block") {
    menuFlutuante.style.display = "none";
  }
});
