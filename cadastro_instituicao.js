// Autoria: Alinne

const form = document.getElementById("formInstituicao");
const btnIrCurso = document.getElementById("btnIrCurso");
const listaUL = document.getElementById("listaInstituicoes");

// Salva Instituição
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (!nome || !sigla) {
    alert("Preencha todos os campos!");
    return;
  }

  const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
  lista.push({ nome, sigla });
  localStorage.setItem("listaInstituicoes", JSON.stringify(lista));

  renderLista();
  form.reset();
});

//Botão de cadastrar curso
btnIrCurso.addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (nome && sigla) {
    const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
    lista.push({ nome, sigla });
    localStorage.setItem("listaInstituicoes", JSON.stringify(lista));
  }

  window.location.href = "cadastro_curso.html";
});