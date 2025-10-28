// =========================================
// LISTA DE DISCIPLINAS - NOTADEZ
// Padronizado conforme o Dashboard
// =========================================

const LS_DISC = 'pi.disciplinas'; // [{ id, cursoId?, nome, codigo?, ch?, professor? }]
const $ = (id) => document.getElementById(id);

// ===== Seed temporária (apenas para testes locais) =====
if (!localStorage.getItem(LS_DISC)) {
  localStorage.setItem(
    LS_DISC,
    JSON.stringify([
      { id: 'd1', cursoId: '1', nome: 'Algoritmos e Programação', codigo: 'ALG101', ch: '80h', professor: 'Profa. Maria Lima' },
      { id: 'd2', cursoId: '1', nome: 'Banco de Dados I',            codigo: 'BDI201', ch: '60h', professor: 'Prof. João Serra' },
      { id: 'd3', cursoId: '2', nome: 'Engenharia de Requisitos',    codigo: 'ER301',  ch: '60h', professor: 'Profa. Carla Sousa' },
      { id: 'd4', cursoId: '3', nome: 'Estruturas de Dados',         codigo: 'ED202',  ch: '80h', professor: 'Prof. Ricardo Melo' },
    ])
  );
}

// ===== Utils =====
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ===== Linha com 5 colunas (alinhada ao head) =====
function linhaHTML(d) {
  const codigo = d.codigo || '-';
  const ch = d.ch || '-';
  const prof = d.professor || '-';

  return `
    <div class="tabela-row">
      <span><strong>${d.nome}</strong></span>
      <span>${codigo}</span>
      <span>${ch}</span>
      <span>${prof}</span>
      <span class="acoes">
        <a class="link" href="listaTurmas.html?disciplinaId=${encodeURIComponent(d.id)}">
          <i class="fa-solid fa-users"></i> Turmas
        </a>
        <button class="btn-excluir" onclick="excluirDisciplina('${d.id}')">
          <i class="fa-solid fa-trash"></i> Excluir
        </button>
      </span>
    </div>
  `;
}

// ===== Render =====
function renderLista() {
  const cursoId = getParam('cursoId');
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]');

  // Filtra por curso (quando vier da tela de cursos)
  const base = cursoId ? lista.filter((d) => String(d.cursoId) === String(cursoId)) : lista;

  // Busca
  const termo = $('fBuscaDisc').value.trim().toLowerCase();
  const filtradas = base.filter((d) => {
    const nome = (d.nome || '').toLowerCase();
    const codigo = (d.codigo || '').toLowerCase();
    const ch = (d.ch || '').toLowerCase();
    const prof = (d.professor || '').toLowerCase();
    return !termo || nome.includes(termo) || codigo.includes(termo) || ch.includes(termo) || prof.includes(termo);
  });

  $('corpoTabelaDisc').innerHTML = filtradas.map(linhaHTML).join('');
  $('vazioDisc').style.display = filtradas.length ? 'none' : 'block';
}

// ===== Excluir =====
function excluirDisciplina(id) {
  if (!confirm('Deseja realmente excluir esta disciplina?')) return;
  const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]').filter((x) => x.id !== id);
  localStorage.setItem(LS_DISC, JSON.stringify(lista));
  renderLista();
}

// ===== Eventos =====
$('btnBuscarDisc').addEventListener('click', renderLista);
$('fBuscaDisc').addEventListener('keydown', (e) => { if (e.key === 'Enter') renderLista(); });

// ===== Init =====
renderLista();
window.excluirDisciplina = excluirDisciplina;
