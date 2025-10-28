// Função de voltar
function voltar() {
  window.history.back();
}

// Função para excluir aluno
document.querySelectorAll('.excluir').forEach(botao => {
  botao.addEventListener('click', (e) => {
    if (confirm('Deseja realmente excluir este aluno?')) {
      e.target.closest('tr').remove();
    }
  });
});

// Botões de ação
document.getElementById('novoComponente').addEventListener('click', () => {
  alert('Função para adicionar novo componente ainda não implementada.');
});

document.getElementById('exportarNotas').addEventListener('click', () => {
  alert('Exportando notas...');
});

document.getElementById('adicionarAluno').addEventListener('click', () => {
  alert('Função para adicionar novo aluno ainda não implementada.');
});