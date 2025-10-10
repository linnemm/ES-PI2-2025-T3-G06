// Chaves
const LS_KEY = 'pi.cursos';
const LS_INST = 'pi.instituicaoAtual';

const $ = (id) => document.getElementById(id);

// Seeds para testes (remova quando integrar com back-end)
if(!localStorage.getItem(LS_KEY)) {
  localStorage.setItem(LS_KEY, JSON.stringify([
    { id: '1', nome: 'Engenharia de Software', sigla: 'ESW', coordenador: 'Prof. Ivan Granja' },
    { id: '2', nome: 'Sistemas de Informação', sigla: 'SI', coordenador: 'Profa. Renata Arantes' },
    { id: '3', nome: 'Ciência da Computação', sigla: 'CC', coordenador: 'Prof. Luã Muriana' }
  ]));
}

// Gera HTML de linha
function linhaHTML(curso){
  return `
    <div class="tabela-row">
      <span><strong>${curso.nome}</strong></span>
      <span>${curso.sigla}</span>
      <span>${curso.coordenador}</span>
      <span class="acoes">
        <a class="link" href="cadastro_curso.html?id=${encodeURIComponent(curso.id)}">Editar</a>
        <button class="btn-excluir" onclick="excluirCurso('${curso.id}')">Excluir</button>
      </span>
    </div>
  `;
}

// Renderiza lista de cursos
function renderLista(){
  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const q = $('fBusca').value.trim().toLowerCase();

  const filtrados = lista.filter(c =>
    !q ||
    c.nome.toLowerCase().includes(q) ||
    c.sigla.toLowerCase().includes(q) ||
    c.coordenador.toLowerCase().includes(q)
  );

  $('corpoTabela').innerHTML = filtrados.map(linhaHTML).join('');
  $('vazio').style.display = filtrados.length ? 'none' : 'block';
}

// Excluir curso
function excluirCurso(id){
  if(!confirm('Confirmar exclusão deste curso?')) return;
  const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(x => x.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(list));
  renderLista();
}

// Eventos
$('btnNovo').addEventListener('click', ()=> location.href='cadastro_curso.html');
$('btnBuscar').addEventListener('click', renderLista);
$('fBusca').addEventListener('keyup', e => { if(e.key==='Enter') renderLista(); });

// Inicialização
renderLista();

// Expor para botão inline
window.excluirCurso = excluirCurso;
