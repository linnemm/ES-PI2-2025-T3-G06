document.getElementById("formInstituicao").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const sigla = document.getElementById("sigla").value;

  // Recupera lista existente ou cria nova
  const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  // Adiciona a nova instituição
  lista.push({ nome, sigla });
  localStorage.setItem("listaInstituicoes", JSON.stringify(lista));

  alert(`Instituição "${nome}" cadastrada com sucesso!`);
});

document.getElementById("btnIrCurso").addEventListener("click", () => {
  // Antes de ir, salva a instituição atual se tiver sido preenchida
  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();

  if (nome && sigla) {
    const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
    lista.push({ nome, sigla });
    localStorage.setItem("listaInstituicoes", JSON.stringify(lista));
  }

  window.location.href = "cadastro_curso.html";
});
