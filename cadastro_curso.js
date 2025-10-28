window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("instituicao");

  // Carrega instituições salvas
  const instituicoes = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  // Caso tenha apenas uma cadastrada (modo antigo)
  const unica = JSON.parse(localStorage.getItem("instituicaoCadastrada"));
  if (unica && instituicoes.length === 0) {
    instituicoes.push(unica);
  }

  // Popula o select
  instituicoes.forEach((inst) => {
    const option = document.createElement("option");
    option.value = inst.nome;
    option.textContent = inst.nome;
    select.appendChild(option);
  });
});

// Salvar curso vinculado
document.getElementById("formCurso").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sigla = document.getElementById("sigla").value.trim();
  const coordenador = document.getElementById("coordenador").value.trim();
  const instituicao = document.getElementById("instituicao").value;

  if (!instituicao) {
    alert("Selecione uma instituição para vincular o curso!");
    return;
  }

  const curso = { nome, sigla, coordenador, instituicao };
  const listaCursos = JSON.parse(localStorage.getItem("listaCursos")) || [];
  listaCursos.push(curso);
  localStorage.setItem("listaCursos", JSON.stringify(listaCursos));

  alert(`Curso "${nome}" vinculado à instituição "${instituicao}" cadastrado com sucesso!`);
  window.location.href = "dashboard.html";
});
