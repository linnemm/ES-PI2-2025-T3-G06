// =========================================
// LISTA DE CURSOS - NOTADEZ
// Autoria base: Aly / Equipe NotaDez
// Padronizado conforme o Dashboard
// =========================================

// Chaves do localStorage
const LS_KEY = 'pi.cursos';
const LS_INST = 'pi.instituicaoAtual';

const $ = (id) => document.getElementById(id);

// =========================================
// SEEDS TEMPORÁRIOS (remoção após integração)
// =========================================
if (!localStorage.getItem(LS_KEY)) {
  localStorage.setItem(LS_KEY, JSON.stringify([
    { id: '1', nome: 'Engenharia de Software', sigla: 'ESW', coordenador: 'Prof. Ivan Granja' },
    { id: '2', nome: 'Sistemas de Informação', sigla: 'SI', coordenador: 'Profa. Renata Arantes' },
    { id: '3', nome: 'Ciência da Computação', sigla: 'CC', coordenador: 'Prof. Luã Muriana' }
  ]));
}

// =========================================
// FUNÇÃO: GERA HTML DE CADA LINHA
// =========================================
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

// =========================================
// FUNÇÃO: RENDERIZA LISTA DE CURSOS
// =========================================
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

// =========================================
// FUNÇÃO: EXCLUIR CURSO
// =========================================
function excluirCurso(id) {
  if (!confirm('Deseja realmente excluir este curso?')) return;
  const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(c => c.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(lista));
  renderLista();
}

// =========================================
// EVENTOS
// =========================================
$('btnNovo').addEventListener('click', () => location.href = 'cadastro_curso.html');
$('btnBuscar').addEventListener('click', renderLista);
$('fBusca').addEventListener('keyup', e => { if (e.key === 'Enter') renderLista(); });

// =========================================
// INICIALIZAÇÃO
// =========================================
renderLista();
window.excluirCurso = excluirCurso;
