// ===== Cadastro de Aluno (mantém topbar/aba via topbar.js) =====

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAluno");
  const btnImportar = document.getElementById("btnImportar");
  const btnCancelar = document.getElementById("btnCancelar");

  // Salvar aluno no localStorage
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !matricula || !email) {
      alert("Preencha todos os campos!");
      return;
    }

    const lista = JSON.parse(localStorage.getItem("listaAlunos")) || [];
    lista.push({ nome, matricula, email });
    localStorage.setItem("listaAlunos", JSON.stringify(lista));

    alert("Aluno salvo com sucesso!");
    form.reset();

    // Se preferir, redirecione para a lista:
    // window.location.href = "alunos.html";
  });

  // Importação por arquivo (placeholder)
  btnImportar.addEventListener("click", () => {
    alert("Aqui você pode implementar a importação por arquivo (CSV/Excel).");
    // Dica: <input type=\"file\" accept=\".csv,.xlsx\"> + Papaparse/SheetJS
  });

  // Cancelar: volta para a tela que preferir
  btnCancelar.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
});
