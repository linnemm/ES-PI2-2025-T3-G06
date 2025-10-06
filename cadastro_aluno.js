const form = document.getElementById("formAluno");
const btnImportar = document.getElementById("btnImportar");

// Salvar aluno no localStorage
form.addEventListener("submit", function (e) {
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
});

// Botão para importar arquivo (por enquanto só um alerta)
btnImportar.addEventListener("click", () => {
  alert("Aqui você pode implementar a importação por arquivo.");
  // Se quiser, pode adicionar input file e processar CSV, por exemplo.
});
