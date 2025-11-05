// ===== Chaves de storage =====
const LS_KEY  = 'pi.disciplinas';
const LS_INST = 'pi.instituicoes';
const LS_CURSO = 'pi.cursos';

const $ = (id) => document.getElementById(id);
const url = new URL(location.href);
const idEdicao = url.searchParams.get('id');

// ===== Dados iniciais — remover qnd integrar back-end =====
if (!localStorage.getItem(LS_INST))  localStorage.setItem(LS_INST, JSON.stringify(['PUC-Campinas','UNICAMP','FATEC']));
if (!localStorage.getItem(LS_CURSO)) localStorage.setItem(LS_CURSO, JSON.stringify(['Engenharia de Software','Sistemas de Informação','Ciência da Computação']));
if (!localStorage.getItem(LS_KEY))   localStorage.setItem(LS_KEY, JSON.stringify([]));

// ===== Carregar selects =====
function carregarCombos(){
  JSON.parse(localStorage.getItem(LS_INST) || '[]')
    .forEach(i => $('instituicao').append(new Option(i,i)));
  JSON.parse(localStorage.getItem(LS_CURSO) || '[]')
    .forEach(c => $('curso').append(new Option(c,c)));
}

// ===== Carregar se for edição =====
function carregarSeEdicao(){
  if(!idEdicao) return;
  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const d = lista.find(x => x.id === idEdicao);
  if(!d) return;
  $('instituicao').value = d.instituicao || '';
  $('curso').value = d.curso || '';
  $('nome').value = d.nome || '';
  $('sigla').value = d.sigla || '';
  $('codigo').value = d.codigo || '';
  $('periodo').value = d.periodo || '';
  document.title = 'Editar Disciplina — NotaDez';
  $('titulo').textContent = 'Editar Disciplina';
}

// ===== Salvar disciplina =====
function salvar(e){
  e.preventDefault();
  const obj = {
    id: idEdicao || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    instituicao: $('instituicao').value.trim(),
    curso: $('curso').value.trim(),
    nome: $('nome').value.trim(),
    sigla: $('sigla').value.trim(),
    codigo: $('codigo').value.trim(),
    periodo: $('periodo').value.trim()
  };

  if(!obj.instituicao || !obj.curso || !obj.nome){
    alert('Preencha instituição, curso e nome da disciplina.');
    return;
  }

  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const i = lista.findIndex(x => x.id === obj.id);
  if(i >= 0) lista[i] = obj; else lista.push(obj);
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
  location.href = 'listaDisciplinas.html';
}

$('formDisciplina').addEventListener('submit', salvar);
$('btnCancelar').addEventListener('click', ()=> history.back());

// ====== ABA FLUTUANTE  ======
const menuFlutuante  = $('menuFlutuante');
const selectContainer= $('selectContainer');
const tituloAba      = $('tituloAba');
const btnIr          = $('btnIr');

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

// Abridores 
$('btnInstituicoes')?.addEventListener('click', (e)=>{ e.preventDefault(); abrirMenu('instituicao'); });
$('btnCursos')?.addEventListener('click', (e)=>{ e.preventDefault(); abrirMenu('curso'); });
$('btnDisciplinas')?.addEventListener('click', (e)=>{ e.preventDefault(); abrirMenu('disciplina'); });
$('btnTurmas')?.addEventListener('click', (e)=>{ e.preventDefault(); abrirMenu('turma'); });

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  const dentro = menuFlutuante.contains(e.target);
  const ehTopbar = e.target.closest('.ndz-menu');
  if (!dentro && !ehTopbar) menuFlutuante.style.display = 'none';
});

// ===== Inicialização =====
carregarCombos();
carregarSeEdicao();
