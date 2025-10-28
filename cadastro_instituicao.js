// Autoria: Alinne
// Cadastro de Instituição - NotaDez

const form = document.getElementById("formInstituicao");
const btnIrCurso = document.getElementById("btnIrCurso");

// ==========================
// Função: salvar instituição
// ==========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (!nome || !sigla) {
    alert("Preencha todos os campos antes de salvar!");
    return;
  }

  // Recupera lista do localStorage
  const listaInstituicoes = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  // Verifica se a instituição já existe (evita duplicatas)
  const existe = listaInstituicoes.some(inst => inst.nome.toLowerCase() === nome.toLowerCase());
  if (existe) {
    alert("Esta instituição já está cadastrada!");
    return;
  }

  // Adiciona nova instituição
  listaInstituicoes.push({ nome, sigla });
  localStorage.setItem("listaInstituicoes", JSON.stringify(listaInstituicoes));

  alert(`Instituição "${nome}" cadastrada com sucesso!`);
  form.reset();
});

// ==========================
// Função: ir para cadastro de curso
// ==========================
btnIrCurso.addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (nome && sigla) {
    const listaInstituicoes = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

    // Evita duplicar se já existir
    const existe = listaInstituicoes.some(inst => inst.nome.toLowerCase() === nome.toLowerCase());
    if (!existe) {
      listaInstituicoes.push({ nome, sigla });
      localStorage.setItem("listaInstituicoes", JSON.stringify(listaInstituicoes));
    }
  }

  // Redireciona
  window.location.href = "cadastro_curso.html";
});
