const LS_PROF = 'pi.professor';
const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
};

// Seed inicial (demo)
if (!localStorage.getItem(LS_PROF)) {
  localStorage.setItem(LS_PROF, JSON.stringify({
    nome: 'Prof. Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    senha: 'NotaDez@123'
  }));
}
const getProfessor = () => JSON.parse(localStorage.getItem(LS_PROF) || '{}');
const setProfessor = (data) => localStorage.setItem(LS_PROF, JSON.stringify(data));

// ============================
// Render inicial de perfil
// ============================
function render() {
  const p = getProfessor();
  $('nomeProfessor').textContent = p.nome || 'Professor';
  $('emailProfessor').textContent = p.email || '-';

  const iniciais = (p.nome || 'PR')
    .split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase();
  $('letrasAvatar').textContent = iniciais;

  // limpa formulários
  ['novoEmail','senhaConfirmaEmail','senhaAtual','novaSenha','confirmaSenha'].forEach(id => {
    const el = $(id); if (el) el.value = '';
  });
  atualizarForca('');
}
render();

// ============================
// Troca de e-mail
// ============================
$('formEmail').addEventListener('submit', (e) => {
  e.preventDefault();
  const p = getProfessor();
  const novoEmail = $('novoEmail').value.trim();
  const senha = $('senhaConfirmaEmail').value;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) return toast('E-mail inválido.');
  if (senha !== p.senha) return toast('Senha incorreta.');

  p.email = novoEmail;
  setProfessor(p);
  render();
  toast('E-mail atualizado com sucesso!');
});
$('cancelarEmail').addEventListener('click', render);

// ============================
// Troca de senha
// ============================
$('formSenha').addEventListener('submit', (e) => {
  e.preventDefault();
  const p = getProfessor();
  const atual = $('senhaAtual').value;
  const nova  = $('novaSenha').value;
  const conf  = $('confirmaSenha').value;

  if (atual !== p.senha) return toast('Senha atual incorreta.');
  if (nova.length < 8)   return toast('A nova senha deve ter pelo menos 6 caracteres.');
  if (nova === atual)    return toast('A nova senha deve ser diferente da atual.');
  if (nova !== conf)     return toast('A confirmação não confere.');

  p.senha = nova;
  setProfessor(p);
  render();
  toast('Senha alterada com sucesso!');
});
$('cancelarSenha').addEventListener('click', render);

// ============================
// Força da senha
// ============================
function calcForca(s) {
  let pont = 0;
  if (s.length >= 8) pont++;
  if (/[A-Z]/.test(s)) pont++;
  if (/[a-z]/.test(s)) pont++;
  if (/[0-9]/.test(s)) pont++;
  if (/[^A-Za-z0-9]/.test(s)) pont++;
  return Math.min(pont, 5);
}
function atualizarForca(s) {
  const bar = $('forcaSenha').querySelector('span');
  const n = calcForca(s);
  const larguras = ['0%','20%','40%','60%','80%','100%'];
  const cores    = ['#b33a3a','#d76c3c','#d6b23a','#6aa86f','#5c8c75'];
  bar.style.width = larguras[n];
  bar.style.background = cores[Math.max(0, n - 1)];
}
$('novaSenha').addEventListener('input', (e) => atualizarForca(e.target.value));

// ============================
// Topbar: janelinha nas abas (Perfil é direto)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const menuFlutuante   = $('menuFlutuante');
  const selectContainer = $('selectContainer');
  const tituloAba       = $('tituloAba');
  const btnIr           = $('btnIr');

  const instituicoes = ["PUCCAMP","USP","UNICAMP"];
  const cursos       = ["Engenharia","Direito","Administração"];
  const disciplinas  = ["Cálculo I","Física","Lógica"];
  const turmasSel    = ["Turma A","Turma B","Turma C"];

  function criarSelect(id, label, opcoes){
    const div = document.createElement("div");
    div.classList.add("campo-selecao");
    div.innerHTML = `
      <label for="${id}">${label}</label>
      <select id="${id}">
        <option value="">Selecione...</option>
        ${opcoes.map(o => `<option>${o}</option>`).join("")}
      </select>`;
    return div;
  }

  function abrirMenu(tipo){
    selectContainer.innerHTML = "";
    btnIr.style.display = "none";
    menuFlutuante.style.display = "block";

    if (tipo === "instituicao"){
      tituloAba.textContent = "Selecionar Instituição";
      const btnVerTodas = document.createElement("button");
      btnVerTodas.textContent = "Ver todas as instituições";
      btnVerTodas.classList.add("btn-curso");
      btnVerTodas.style.marginBottom = "10px";
      btnVerTodas.onclick = () => window.location.href = "dashboard.html";
      selectContainer.appendChild(btnVerTodas);

      selectContainer.appendChild(criarSelect("selInstituicao","Selecionar Instituição:",instituicoes));
      btnIr.style.display = "block";
      btnIr.onclick = () => {
        const sel = $('selInstituicao');
        if (sel.value) window.location.href = "listaCursos.html";
        else alert("Selecione uma instituição!");
      };
    }

    if (tipo === "curso"){
      tituloAba.textContent = "Selecionar Curso";
      selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
      $('selInstituicao').addEventListener("change", () => {
        if (!$('selCurso')){
          selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
          btnIr.style.display = "block";
          btnIr.onclick = () => {
            const sel = $('selCurso');
            if (sel.value) window.location.href = "listaDisciplinas.html";
            else alert("Selecione um curso!");
          };
        }
      }, { once:true });
    }

    if (tipo === "disciplina"){
      tituloAba.textContent = "Selecionar Disciplina";
      selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
      $('selInstituicao').addEventListener("change", () => {
        if (!$('selCurso')){
          selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
          $('selCurso').addEventListener("change", () => {
            if (!$('selDisciplina')){
              selectContainer.appendChild(criarSelect("selDisciplina","Disciplina:",disciplinas));
              btnIr.style.display = "block";
              btnIr.onclick = () => {
                const sel = $('selDisciplina');
                if (sel.value) window.location.href = "listaTurmas.html";
                else alert("Selecione uma disciplina!");
              };
            }
          }, { once:true });
        }
      }, { once:true });
    }

    if (tipo === "turma"){
      tituloAba.textContent = "Selecionar Turma";
      selectContainer.appendChild(criarSelect("selInstituicao","Instituição:",instituicoes));
      $('selInstituicao').addEventListener("change", () => {
        if (!$('selCurso')){
          selectContainer.appendChild(criarSelect("selCurso","Curso:",cursos));
          $('selCurso').addEventListener("change", () => {
            if (!$('selDisciplina')){
              selectContainer.appendChild(criarSelect("selDisciplina","Disciplina:",disciplinas));
              $('selDisciplina').addEventListener("change", () => {
                if (!$('selTurma')){
                  selectContainer.appendChild(criarSelect("selTurma","Turma:",turmasSel));
                  btnIr.style.display = "block";
                  btnIr.onclick = () => {
                    const sel = $('selTurma');
                    if (sel.value) window.location.href = "detalhesTurma.html";
                    else alert("Selecione uma turma!");
                  };
                }
              }, { once:true });
            }
          }, { once:true });
        }
      }, { once:true });
    }
  }

  // Ligações da topbar 
  $('btnInstituicoes')?.addEventListener('click', e => { e.preventDefault(); abrirMenu('instituicao'); });
  $('btnCursos')?.addEventListener('click',       e => { e.preventDefault(); abrirMenu('curso'); });
  $('btnDisciplinas')?.addEventListener('click',  e => { e.preventDefault(); abrirMenu('disciplina'); });
  $('btnTurmas')?.addEventListener('click',       e => { e.preventDefault(); abrirMenu('turma'); });

  // Fechar janelinha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!menuFlutuante.contains(e.target) && !e.target.closest('.menu-horizontal')) {
      menuFlutuante.style.display = 'none';
    }
  });
});
