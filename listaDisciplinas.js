// =========================================
// LISTA DE DISCIPLINAS - padrão do Dashboard
// =========================================
const LS_DISC = 'pi.disciplinas'; // [{ id, cursoId?, nome, codigo?, ch?, professor? }]
const $ = (id) => document.getElementById(id);

// ------- Seeds temporários (remova ao integrar) -------
if (!localStorage.getItem(LS_DISC)) {
  localStorage.setItem(LS_DISC, JSON.stringify([
    { id:'d1', cursoId:'1', nome:'Algoritmos e Programação', codigo:'ALG101', ch:'80h', professor:'Profa. Maria Lima' },
    { id:'d2', cursoId:'1', nome:'Banco de Dados I',         codigo:'BDI201', ch:'60h', professor:'Prof. João Serra' },
    { id:'d3', cursoId:'2', nome:'Engenharia de Requisitos', codigo:'ER301',  ch:'60h', professor:'Profa. Carla Sousa' },
    { id:'d4', cursoId:'3', nome:'Estruturas de Dados',      codigo:'ED202',  ch:'80h', professor:'Prof. Ricardo Melo' },
  ]));
}

// ------- Helpers -------
function getParam(name){ return new URLSearchParams(window.location.search).get(name); }

function linhaHTML(d){
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

// =========================================
// JANELINHA (menu flutuante) — igual ao dashboard
// =========================================
const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

// começa fechado
if(menuFlutuante) menuFlutuante.style.display = "none";

// Mock
const instituicoes = ["PUCCAMP","USP","UNICAMP"];
const cursos = ["Engenharia","Direito","Administração"];
const disciplinas = ["Cálculo I","Física","Lógica"];
const turmas = ["Turma A","Turma B","Turma C"];

function criarSelect(id,label,opcoes){
  const div = document.createElement("div");
  div.classList.add("campo-selecao");
  div.innerHTML = `
    <label for="${id}">${label}</label>
    <select id="${id}">
      <option value="">Selecione...</option>
      ${opcoes.map(o=>`<option>${o}</option>`).join("")}
    </select>`;
  return div;
}

function abrirMenu(tipo){
  if(!menuFlutuante) return;
  selectContainer.innerHTML = "";
  btnIr.style.display = "none";
  menuFlutuante.style.display = "block";

  if(tipo==="instituicao"){
    tituloAba.textContent = "Instituições";
    const btnVerTodas = document.createElement("button");
    btnVerTodas.textContent = "Ver todas as instituições";
    btnVerTodas.classList.add("btn-curso");
    btnVerTodas.style.marginBottom = "10px";
    btnVerTodas.onclick = () => window.location.href = "dashboard.html";
    selectContainer.appendChild(btnVerTodas);

    selectContainer.appendChild(criarSelect("selInstituicao","Selecionar Instituição:",instituicoes));
    btnIr.style.display = "block";
    btnIr.onclick = () => {
      const sel = document.getElementById("selInstituicao");
      if(sel && sel.value) window.location.href = "listaCursos.html";
      else alert("Selecione uma instituição!");
    };
  }

  if(tipo==="curso"){
    tituloAba.textContent = "Selecionar Curso";
    selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
    selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "listaDisciplinas.html";
  }

  if(tipo==="disciplina"){
    tituloAba.textContent = "Selecionar Disciplina";
    selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
    selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
    selectContainer.appendChild(criarSelect("selDisciplina","Disciplina:",disciplinas));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "listaTurmas.html";
  }

  if(tipo==="turma"){
    tituloAba.textContent = "Selecionar Turma";
    selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
    selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
    selectContainer.appendChild(criarSelect("selDisciplina","Disciplina:",disciplinas));
    selectContainer.appendChild(criarSelect("selTurma","Turma:",turmas));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "detalhesTurma.html";
  }
}

// ligações da topbar (Perfil não abre janelinha)
document.getElementById("btnInstituicoes").addEventListener("click", e=>{e.preventDefault(); abrirMenu("instituicao");});
document.getElementById("btnCursos").addEventListener("click",        e=>{e.preventDefault(); abrirMenu("curso");});
document.getElementById("btnDisciplinas").addEventListener("click",   e=>{e.preventDefault(); abrirMenu("disciplina");});
document.getElementById("btnTurmas").addEventListener("click",        e=>{e.preventDefault(); abrirMenu("turma");});

// Fechar ao clicar fora
document.addEventListener("click", (e)=>{
  const dentro = menuFlutuante?.contains(e.target);
  const naTopbar = e.target.closest(".menu-horizontal");
  if(!dentro && !naTopbar && menuFlutuante?.style.display==="block"){
    menuFlutuante.style.display = "none";
  }
});
