// Chaves de armazenamento (segue padrão dos seus arquivos)
const LS_DISC = 'pi.disciplinas'; // [{ id, cursoId?, nome }]
const $ = (id) => document.getElementById(id);

// Seeds para testes (remova ao integrar com back-end)
if (!localStorage.getItem(LS_DISC)) {
  localStorage.setItem(LS_DISC, JSON.stringify([
    { id: 'd1', cursoId: '1', nome: 'Algoritmos e Programação' },
    { id: 'd2', cursoId: '1', nome: 'Banco de Dados I' },
    { id: 'd3', cursoId: '2', nome: 'Engenharia de Requisitos' },
    { id: 'd4', cursoId: '3', nome: 'Estruturas de Dados' }
  ]));
}

function getParam(name){ return new URLSearchParams(window.location.search).get(name); }

function linhaHTML(d){
  return `
    <div class="tabela-row">
      <span><strong>${d.nome}</strong></span>
      <span class="acoes">
        <a class="link" href="turmas.html?disciplinaId=${encodeURIComponent(d.id)}">Turmas</a>
        <button class="btn-excluir" onclick="excluirDisciplina('${d.id}')">Excluir</button>
      </span>
    </div>
  `;
}

function renderLista(){
  const cursoId = getParam('cursoId'); // se vier do fluxo Cursos→Disciplinas
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]');

  // Filtra por cursoId quando informado; senão, mostra todas
  const base = cursoId ? lista.filter(d => d.cursoId === cursoId) : lista;

  const q = $('fBuscaDisc').value.trim().toLowerCase();
  const filtradas = base.filter(d => !q || d.nome.toLowerCase().includes(q));

  $('corpoTabelaDisc').innerHTML = filtradas.map(linhaHTML).join('');
  $('vazioDisc').style.display = filtradas.length ? 'none' : 'block';
}

function excluirDisciplina(id){
  if(!confirm('Confirmar exclusão desta disciplina?')) return;

  // (Opcional) validar se há turmas vinculadas ao id antes de excluir.
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]').filter(x => x.id !== id);
  localStorage.setItem(LS_DISC, JSON.stringify(lista));
  renderLista();
}

// Eventos
$('btnBuscarDisc').addEventListener('click', renderLista);
$('fBuscaDisc').addEventListener('keyup', e => { if(e.key === 'Enter') renderLista(); });

// Inicialização
renderLista();

// Expor para botão inline
window.excluirDisciplina = excluirDisciplina;
