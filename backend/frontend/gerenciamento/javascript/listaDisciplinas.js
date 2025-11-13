// =========================================
// LISTA DE DISCIPLINAS
// =========================================
const LS_DISC = 'pi.disciplinas';
const $ = (id) => document.getElementById(id);

// Seeds mock
if (!localStorage.getItem(LS_DISC)) {
  localStorage.setItem(LS_DISC, JSON.stringify([
    { id:'d1', cursoId:'1', nome:'Algoritmos e Programação', codigo:'ALG101', ch:'80h', professor:'Profa. Maria Lima' },
    { id:'d2', cursoId:'1', nome:'Banco de Dados I',         codigo:'BDI201', ch:'60h', professor:'Prof. João Serra' },
    { id:'d3', cursoId:'2', nome:'Engenharia de Requisitos', codigo:'ER301',  ch:'60h', professor:'Profa. Carla Sousa' },
    { id:'d4', cursoId:'3', nome:'Estruturas de Dados',      codigo:'ED202',  ch:'80h', professor:'Prof. Ricardo Melo' },
  ]));
}

// Helpers
function getParam(name){ return new URLSearchParams(window.location.search).get(name); }

function linhaHTML(d){
  const codigo = d.codigo || '-';
  const ch = d.ch || '-';
  const prof = d.professor || '-';
  const paramsTurmas = new URLSearchParams({ disciplinaId: d.id }).toString();

  return `
    <div class="tabela-row">
      <span><strong>${d.nome}</strong></span>
      <span>${codigo}</span>
      <span>${ch}</span>
      <span>${prof}</span>
      <span class="acoes">
        <a class="acao-btn btn-editar" href="cadastro_disciplina.html?id=${encodeURIComponent(d.id)}">
          <i class="fa-solid fa-pen"></i> Editar
        </a>
        <button class="acao-btn btn-turmas" data-href="listaTurmas.html?${paramsTurmas}">
          <i class="fa-solid fa-users"></i> Turmas
        </button>
        <button class="acao-btn btn-excluir" data-id="${d.id}">
          <i class="fa-solid fa-trash"></i> Excluir
        </button>
      </span>
    </div>
  `;
}

function renderLista(){
  const cursoId = getParam('cursoId');
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]');
  const base = cursoId ? lista.filter(d => String(d.cursoId) === String(cursoId)) : lista;

  const termo = $('fBuscaDisc').value.trim().toLowerCase();
  const filtradas = base.filter(d => {
    const nome = (d.nome||'').toLowerCase();
    const codigo = (d.codigo||'').toLowerCase();
    const ch = (d.ch||'').toLowerCase();
    const prof = (d.professor||'').toLowerCase();
    return !termo || nome.includes(termo) || codigo.includes(termo) || ch.includes(termo) || prof.includes(termo);
  });

  $('corpoTabelaDisc').innerHTML = filtradas.map(linhaHTML).join('');
  $('vazioDisc').style.display = filtradas.length ? 'none' : 'block';

  // handlers das ações
  document.querySelectorAll('.btn-turmas').forEach(btn=>{
    btn.addEventListener('click', (e)=>{ location.href = e.currentTarget.dataset.href; });
  });
  document.querySelectorAll('.btn-excluir').forEach(btn=>{
    btn.addEventListener('click', (e)=>{ excluirDisciplina(e.currentTarget.dataset.id); });
  });
}

function excluirDisciplina(id){
  if(!confirm('Deseja realmente excluir esta disciplina?')) return;
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]').filter(x => x.id !== id);
  localStorage.setItem(LS_DISC, JSON.stringify(lista));
  renderLista();
}

$('btnBuscarDisc').addEventListener('click', renderLista);
$('fBuscaDisc').addEventListener('keydown', e => { if(e.key === 'Enter') renderLista(); });
$('btnNovaDisc').addEventListener('click', () => location.href = 'cadastro_disciplina.html');

renderLista();
window.excluirDisciplina = excluirDisciplina;

