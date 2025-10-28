const LS_KEY = 'pi.disciplinas';
const LS_INST = 'pi.instituicoes';
const LS_CURSO = 'pi.cursos';

const $ = (id) => document.getElementById(id);
const url = new URL(location.href);
const idEdicao = url.searchParams.get('id');

// Dados iniciais (demo) — pode remover quando vier do back-end
if(!localStorage.getItem(LS_INST)) localStorage.setItem(LS_INST, JSON.stringify(['PUC-Campinas','UNICAMP','FATEC']));
if(!localStorage.getItem(LS_CURSO)) localStorage.setItem(LS_CURSO, JSON.stringify(['Engenharia de Software','Sistemas de Informação','Ciência da Computação']));
if(!localStorage.getItem(LS_KEY)) localStorage.setItem(LS_KEY, JSON.stringify([]));

// Carregar selects
function carregarCombos(){
  JSON.parse(localStorage.getItem(LS_INST) || '[]')
    .forEach(i => $('instituicao').append(new Option(i,i)));
  JSON.parse(localStorage.getItem(LS_CURSO) || '[]')
    .forEach(c => $('curso').append(new Option(c,c)));
}

// Carregar se for edição
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
  document.title = 'Editar Disciplina';
  $('titulo').textContent = 'Editar Disciplina';
}

// Salvar disciplina
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

// Inicialização
carregarCombos();
carregarSeEdicao();
