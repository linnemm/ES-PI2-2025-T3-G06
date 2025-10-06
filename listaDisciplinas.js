// Chaves
const LS_KEY = 'pi.disciplinas';
const LS_INST = 'pi.instituicoes';
const LS_CURSO = 'pi.cursos';

const $ = (id) => document.getElementById(id);

// Seeds (remova se vier do back-end)
if(!localStorage.getItem(LS_INST)) localStorage.setItem(LS_INST, JSON.stringify(['PUC-Campinas','UNICAMP','FATEC']));
if(!localStorage.getItem(LS_CURSO)) localStorage.setItem(LS_CURSO, JSON.stringify(['Engenharia de Software','Sistemas de Informação','Ciência da Computação']));
if(!localStorage.getItem(LS_KEY)) localStorage.setItem(LS_KEY, JSON.stringify([]));

function carregarCombos(){
JSON.parse(localStorage.getItem(LS_INST) || '[]').forEach(i => $('fInstituicao').append(new Option(i,i)));
JSON.parse(localStorage.getItem(LS_CURSO) || '[]').forEach(c => $('fCurso').append(new Option(c,c)));
}

function linhaHTML(d){
return `
<div class="tabela-row">
<span><span class="tag">${d.instituicao || '-'}</span></span>
<span><strong>${d.nome}</strong><br><small>${d.curso || '-'} • código ${d.codigo || '-'}</small></span>
<span>${d.sigla || '-'}</span>
<span>${d.periodo || '-'}</span>
<span class="acoes">
<a class="link" href="cadastro_disciplina.html?id=${encodeURIComponent(d.id)}">Editar</a>
<button class="btn-excluir" onclick="excluirDisciplina('${d.id}')">Excluir</button>
</span>
</div>`;
}

function renderLista(){
const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const fI = $('fInstituicao').value.trim().toLowerCase();
const fC = $('fCurso').value.trim().toLowerCase();
const q = $('fBusca').value.trim().toLowerCase();

const filtrados = lista.filter(d => {
const passI = !fI || (d.instituicao||'').toLowerCase() === fI;
const passC = !fC || (d.curso||'').toLowerCase() === fC;
const txt = `${d.nome||''} ${d.sigla||''} ${d.codigo||''}`.toLowerCase();
const passQ = !q || txt.includes(q);
return passI && passC && passQ;
});

$('corpoTabela').innerHTML = filtrados.map(linhaHTML).join('');
$('vazio').style.display = filtrados.length ? 'none' : 'block';
}

function excluirDisciplina(id){
if(!confirm('Confirmar exclusão desta disciplina?')) return;
const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(x=>x.id!==id);
localStorage.setItem(LS_KEY, JSON.stringify(list));
renderLista();
}

// Eventos
$('btnNova').addEventListener('click', ()=> location.href='cadastro_disciplina.html');
$('btnBuscar').addEventListener('click', renderLista);
$('fInstituicao').addEventListener('change', renderLista);
$('fCurso').addEventListener('change', renderLista);
$('fBusca').addEventListener('keyup', e => { if(e.key==='Enter') renderLista(); });

// Init
carregarCombos();
renderLista();

// Expor para botão inline
window.excluirDisciplina = excluirDisciplina;