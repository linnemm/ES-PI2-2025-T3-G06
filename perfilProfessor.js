// Chave de dados do professor no localStorage
const LS_PROF = 'pi.professor';

const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
};

// Seed inicial (remova quando vier do back-end)
// Estrutura: { nome, email, senha }  -> senha em texto apenas para demo
if(!localStorage.getItem(LS_PROF)){
  localStorage.setItem(LS_PROF, JSON.stringify({
    nome: 'Prof. Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    senha: 'NotaDez@123' // DEMO
  }));
}

function getProfessor(){
  return JSON.parse(localStorage.getItem(LS_PROF) || '{}');
}
function setProfessor(data){
  localStorage.setItem(LS_PROF, JSON.stringify(data));
}

/* ====== Render inicial ====== */
function render(){
  const p = getProfessor();
  $('nomeProfessor').textContent  = p.nome || 'Professor';
  $('emailProfessor').textContent = p.email || '-';
  // Avatar com iniciais
  const iniciais = (p.nome || 'PR').split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
  $('letrasAvatar').textContent = iniciais;
  // Limpa forms
  $('novoEmail').value = '';
  $('senhaConfirmaEmail').value = '';
  $('senhaAtual').value = '';
  $('novaSenha').value = '';
  $('confirmaSenha').value = '';
  atualizarForca('');
}

/* ====== Troca de e-mail ====== */
$('formEmail').addEventListener('submit', (e)=>{
  e.preventDefault();
  const p = getProfessor();
  const novoEmail = $('novoEmail').value.trim();
  const senha = $('senhaConfirmaEmail').value;

  if(!novoEmail) return toast('Informe o novo e-mail.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail)) return toast('E-mail inválido.');
  if(senha !== p.senha) return toast('Senha incorreta.');

  p.email = novoEmail;
  setProfessor(p);
  render();
  toast('E-mail atualizado com sucesso!');
});
$('cancelarEmail').addEventListener('click', render);

/* ====== Troca de senha ====== */
$('formSenha').addEventListener('submit', (e)=>{
  e.preventDefault();
  const p = getProfessor();
  const atual = $('senhaAtual').value;
  const nova  = $('novaSenha').value;
  const conf  = $('confirmaSenha').value;

  if(atual !== p.senha) return toast('Senha atual incorreta.');
  if(nova.length < 8)   return toast('A nova senha deve ter pelo menos 8 caracteres.');
  if(nova === atual)    return toast('A nova senha deve ser diferente da atual.');
  if(nova !== conf)     return toast('A confirmação não confere.');

  p.senha = nova;
  setProfessor(p);
  render();
  toast('Senha alterada com sucesso!');
});
$('cancelarSenha').addEventListener('click', render);

/* ====== Mostrar/ocultar senhas ====== */
document.querySelectorAll('.toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = $(btn.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

/* ====== Força da senha ====== */
function calcForca(s){
  let pont = 0;
  if(s.length >= 8) pont++;
  if(/[A-Z]/.test(s)) pont++;
  if(/[a-z]/.test(s)) pont++;
  if(/[0-9]/.test(s)) pont++;
  if(/[^A-Za-z0-9]/.test(s)) pont++;
  return Math.min(pont, 5);
}
function atualizarForca(s){
  const bar = $('forcaSenha').querySelector('span');
  const n = calcForca(s);
  const larguras = ['0%','20%','40%','60%','80%','100%'];
  const cores = ['#b33a3a','#d76c3c','#d6b23a','#6aa86f','#5c8c75'];
  bar.style.width = larguras[n];
  bar.style.background = cores[Math.max(0, n-1)];
}
$('novaSenha').addEventListener('input', (e)=> atualizarForca(e.target.value));

/* ====== Init ====== */
render();
