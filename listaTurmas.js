//Autoria: Miriã

// listaTurmas.js

// Dados simulados de turmas
let turmas = [
  { nome: "100", codigo: "A013", disciplina: "Banco de Dados I" },
  { nome: "101", codigo: "D809", disciplina: "Álgebra Linear" },
  { nome: "102", codigo: "S789", disciplina: "Teologia" },
  { nome: "103", codigo: "A133", disciplina: "Introdução a Web" }
];

// Seleção dos elementos do DOM
const corpoTabela = document.getElementById("corpoTabela");
const vazio = document.getElementById("vazio");
const btnBuscar = document.getElementById("btnBuscar");
const fBusca = document.getElementById("fBusca");

// Função para renderizar a tabela
function renderizarTabela(lista) {
  corpoTabela.innerHTML = ""; // limpa tabela

  if (lista.length === 0) {
    vazio.style.display = "block";
    return;
  } else {
    vazio.style.display = "none";
  }

  lista.forEach((turma, index) => {
    const row = document.createElement("div");
    row.classList.add("tabela-row");

    row.innerHTML = `
      <span>${turma.nome}</span>
      <span>${turma.codigo}</span>
      <span>${turma.disciplina}</span>
      <div class="acoes">
        <button class="btn-excluir" onclick="excluirTurma(${index})">Excluir</button>
      </div>
    `;

    corpoTabela.appendChild(row);
  });
}

// Função para buscar turmas
function buscarTurmas() {
  const termo = fBusca.value.toLowerCase().trim();
  const filtradas = turmas.filter(t => 
    t.nome.toLowerCase().includes(termo) ||
    t.codigo.toLowerCase().includes(termo) ||
    t.disciplina.toLowerCase().includes(termo)
  );

  renderizarTabela(filtradas);
}

// Função para excluir turma
function excluirTurma(index) {
  if (confirm(`Deseja realmente excluir a turma "${turmas[index].nome}"?`)) {
    turmas.splice(index, 1);
    buscarTurmas(); // atualiza a tabela
  }
}

// Eventos
btnBuscar.addEventListener("click", buscarTurmas);

// Renderiza a tabela inicial
renderizarTabela(turmas);
