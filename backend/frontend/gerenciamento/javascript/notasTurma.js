// ===============================
// CONFIGURAÇÕES
// ===============================
const API = "http://localhost:3000/api";

// pega a turma e disciplina selecionadas anteriormente
const turmaId = localStorage.getItem("turmaSelecionada");
const disciplinaId = localStorage.getItem("disciplinaSelecionada");

const tabela = document.querySelector("table");
const tbody = document.getElementById("tabelaAlunos");

// ===============================
// CARREGAR CABECALHO DA TURMA
// ===============================
async function carregarCabecalho() {
  const resp = await fetch(`${API}/turmas/${turmaId}`);
  const dados = await resp.json();

  document.querySelector(".info-turma h2")
    .innerText = `Notas da ${dados.nome}`;

  document.querySelector(".info-turma p").innerHTML =
    `<strong>Disciplina:</strong> ${dados.disciplina} |  
     <strong>Instituição:</strong> ${dados.instituicao} | 
     <strong>Período:</strong> ${dados.periodo}`;
}

// ===============================
// CARREGAR COMPONENTES (P1, P2…)
// ===============================
async function carregarComponentes() {
  const resp = await fetch(`${API}/componentes/disciplina/${disciplinaId}`);
  return await resp.json();
}

// ===============================
// CARREGAR ALUNOS DA TURMA
// ===============================
async function carregarAlunos() {
  const resp = await fetch(`${API}/turmas/${turmaId}/alunos`);
  return await resp.json();
}

// ===============================
// CARREGAR NOTAS DA TURMA
// ===============================
async function carregarNotas() {
  const resp = await fetch(`${API}/notas/${turmaId}/${disciplinaId}`);
  return await resp.json();
}

// ===============================
// MONTAR TABELA
// ===============================
async function montarTabela() {
  const alunos = await carregarAlunos();
  const componentes = await carregarComponentes();
  const notas = await carregarNotas();

  // MONTAR O CABEÇALHO DINÂMICO
  const header = `
    <tr>
      <th>Matrícula</th>
      <th>Aluno</th>
      ${componentes.map(c => `<th>${c.sigla}</th>`).join("")}
      <th>Ações</th>
    </tr>
  `;
  tabela.querySelector("thead").innerHTML = header;

  // CORPO DA TABELA
  tbody.innerHTML = "";

  alunos.forEach(aluno => {
    const tr = document.createElement("tr");
    tr.dataset.alunoId = aluno.id;

    const celulasNotas = componentes.map(c => {
      const nota = notas.find(n =>
        n.ALUNO_ID == aluno.id && n.COMPONENTE_ID == c.id
      );

      return `
        <td contenteditable="true" 
            class="nota"
            data-comp-id="${c.id}">
          ${nota ? Number(nota.VALOR).toFixed(2) : "-"}
        </td>
      `;
    }).join("");

    tr.innerHTML = `
      <td>${aluno.ra}</td>
      <td>${aluno.nome}</td>
      ${celulasNotas}
      <td><button class="excluir" data-id="${aluno.id}">🗑</button></td>
    `;

    tbody.appendChild(tr);
  });

  ativarExclusoes();
}

// ===============================
// SALVAR NOTAS NO BACKEND
// ===============================
async function salvarNotas() {
  const lista = [];

  document.querySelectorAll("tbody tr").forEach(tr => {
    const alunoId = tr.dataset.alunoId;

    tr.querySelectorAll("td.nota").forEach(td => {
      const componenteId = td.dataset.compId;
      const valor = parseFloat(td.innerText.replace(",", "."));

      if (!isNaN(valor)) {
        lista.push({
          turmaId,
          alunoId,
          disciplinaId,
          componenteId,
          valor,
        });
      }
    });
  });

  await fetch(`${API}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lista),
  });

  alert("Notas salvas com sucesso!");
}

// ===============================
// EXCLUIR ALUNO
// ===============================
function ativarExclusoes() {
  document.querySelectorAll(".excluir").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

      const id = btn.dataset.id;
      await fetch(`${API}/alunos/${id}`, { method: "DELETE" });

      alert("Aluno removido.");
      montarTabela();
    };
  });
}

// ===============================
// EXPORTAR CSV
// ===============================
async function exportar() {
  const resp = await fetch(`${API}/notas/exportar/${turmaId}`);
  const blob = await resp.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `notas_${Date.now()}.csv`;
  a.click();
}

// ===============================
// VOLTAR
// ===============================
function voltar() {
  window.location.href = "detalhesTurma.html";
}

// ===============================
// EVENTOS
// ===============================
document.getElementById("exportarNotas").onclick = exportar;
document.getElementById("novoComponente").onclick = () =>
  alert("Implementar criação de componente.");

document.querySelector(".voltar").onclick = voltar;

// ===============================
// INICIALIZAÇÃO
// ===============================
(async () => {
  await carregarCabecalho();
  await montarTabela();
})();
