window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("instituicao");

  // Carrega todas as instituições salvas (array)
  const instituicoes = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  // Se só tiver uma cadastrada (modo anterior), converte para lista
  const unica = JSON.parse(localStorage.getItem("instituicaoCadastrada"));
  if (unica && instituicoes.length === 0) {
    instituicoes.push(unica);
  }

  // Popula o select
  instituicoes.forEach((inst, index) => {
    const option = document.createElement("option");
    option.value = inst.nome;
    option.textContent = inst.nome;
    select.appendChild(option);
  });
});

// Salvar o curso vinculado
document.getElementById("formCurso").addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const sigla = document.getElementById("sigla").value;
  const coordenador = document.getElementById("coordenador").value;
  const instituicao = document.getElementById("instituicao").value;

  if (!instituicao) {
    alert("Selecione uma instituição para vincular o curso!");
    return;
  }

  const curso = { nome, sigla, coordenador, instituicao };

  // Salvar lista de cursos
  const listaCursos = JSON.parse(localStorage.getItem("listaCursos")) || [];
  listaCursos.push(curso);
  localStorage.setItem("listaCursos", JSON.stringify(listaCursos));

  alert(`Curso "${nome}" vinculado à instituição "${instituicao}" cadastrado com sucesso!`);
  window.location.href = "dashboard.html";
});

