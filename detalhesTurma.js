// ============================
// Funções principais da tela
// ============================

document.addEventListener("DOMContentLoaded", () => {
  // Botões superiores
  document.getElementById("btnAddAluno").addEventListener("click", () => {
    alert("Função de adicionar aluno ainda em desenvolvimento.");
  });

  document.getElementById("btnImportar").addEventListener("click", () => {
    alert("Importação CSV será implementada futuramente.");
  });

  document.getElementById("btnExportar").addEventListener("click", () => {
    alert("Exportação de notas (CSV) em desenvolvimento.");
  });

  document.getElementById("btnAddComponente").addEventListener("click", () => {
    alert("Cadastro de novo componente de nota ainda não disponível.");
  });

  // Botões inferiores
  document.getElementById("btnAtualizar").addEventListener("click", () => {
    alert("Função em desenvolvimento!");
  });

  document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "turmas.html";
  });

  // Ações de remoção na tabela de alunos
  document.querySelectorAll('#tabelaAlunos td button[title="Remover"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Tem certeza que deseja remover este aluno?")) {
        btn.closest("tr").remove();
      }
    });
  });

  // Ações de edição na tabela de notas
  document.querySelectorAll('#tabelaNotas td button[title="Editar"]').forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      alert("Função de edição de notas ainda em desenvolvimento.");
    });
  });
});
