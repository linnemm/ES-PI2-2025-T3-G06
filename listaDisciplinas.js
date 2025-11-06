// =========================================
// LISTA DE DISCIPLINAS
// =========================================
const LS_DISC = 'pi.disciplinas'; // [{ id, cursoId?, nome, codigo?, ch?, professor? }]
const $ = (id) => document.getElementById(id);

// ------- Seeds temporários ) -------
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

// JANELINHA 

const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

// começa fechado
if(menuFlutuante) menuFlutuante.style.display = "none";

// Mocks
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

// ligações da topbar
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

// =========================================
/* MODAL: Cadastrar componente de nota */
// =========================================
(() => {
  const LS_COMP_DISC  = 'pi.componentesDisc';

  const overlay    = document.getElementById('modalComponente');
  const btnOpen    = document.getElementById('btnComponenteNota');
  const btnCloseX  = document.getElementById('btnFecharModal');
  const btnClose   = document.getElementById('btnFechar');
  const btnSalvar  = document.getElementById('btnSalvarComponente');

  const cmpDisc = document.getElementById('cmpDisc');
  const cmpNome = document.getElementById('cmpNome');
  const cmpSigla= document.getElementById('cmpSigla');
  const cmpPeso = document.getElementById('cmpPeso');
  const cmpDesc = document.getElementById('cmpDesc');

  function popularDisciplinas(){
    const lista = JSON.parse(localStorage.getItem(LS_DISC) || '[]');
    cmpDisc.innerHTML = `<option value="">Selecione...</option>` +
      lista.map(d => `<option value="${d.id}">${d.nome}${d.codigo?` — ${d.codigo}`:""}</option>`).join('');
  }

  function openModal(){
    popularDisciplinas();
    overlay.classList.add('show');
    setTimeout(()=> cmpDisc.focus(), 60);
  }
  function closeModal(){
    overlay.classList.remove('show');
    cmpDisc.value = ""; cmpNome.value = ""; cmpSigla.value = "";
    cmpPeso.value = ""; cmpDesc.value = "";
  }

  function toNumberOrNull(v){
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
    }

  function salvar(){
    const disciplinaId = cmpDisc.value.trim();
    const nome  = cmpNome.value.trim();
    const sigla = (cmpSigla.value || "").trim().toUpperCase();
    const pesoPct = (cmpPeso.value || "").trim();
    const descricao = (cmpDesc.value || "").trim();

    if(!disciplinaId){ alert('Selecione a disciplina.'); cmpDisc.focus(); return; }
    if(!nome){ alert('Informe o nome do componente.'); cmpNome.focus(); return; }
    if(!sigla){ alert('Informe a sigla do componente.'); cmpSigla.focus(); return; }

    let peso = toNumberOrNull(pesoPct);
    if(peso !== null){
      if(peso < 0 || peso > 100){ alert('Peso deve estar entre 0 e 100.'); cmpPeso.focus(); return; }
      peso = Number((peso/100).toFixed(4)); // 40% -> 0.4
    }

    const comps = JSON.parse(localStorage.getItem(LS_COMP_DISC) || '[]');

    // impede duplicidade de sigla na mesma disciplina
    const existe = comps.some(c => String(c.disciplinaId)===String(disciplinaId) && String(c.sigla).toUpperCase()===sigla);
    if(existe){
      alert('Já existe um componente com essa sigla para esta disciplina.');
      return;
    }

    const novo = {
      id: 'cmp_' + Date.now(),
      disciplinaId, nome, sigla,
      peso: (peso===null ? undefined : peso),
      descricao
    };
    comps.push(novo);
    localStorage.setItem(LS_COMP_DISC, JSON.stringify(comps));

    alert('Componente salvo com sucesso!');
    closeModal();
  }

  // gatilhos
  btnOpen.addEventListener('click', openModal);
  btnCloseX.addEventListener('click', closeModal);
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e)=> { if(e.target === overlay) closeModal(); });

  document.addEventListener('keydown', (e)=> {
    if(overlay.classList.contains('show') && e.key==='Escape') closeModal();
  });

  [cmpNome, cmpSigla, cmpPeso, cmpDesc].forEach(el=>{
    el.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && !e.shiftKey){
        e.preventDefault(); btnSalvar.click();
      }
    });
  });
  btnSalvar.addEventListener('click', salvar);
})();
