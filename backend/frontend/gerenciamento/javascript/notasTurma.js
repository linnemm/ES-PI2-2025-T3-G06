document.addEventListener("DOMContentLoaded", async () => {

  const API = "http://localhost:3000/api";

  const tabela = document.getElementById("tabelaNotas");
  const tbody = tabela.querySelector("tbody");

  const getParam = n => new URLSearchParams(location.search).get(n);
  const disciplinaId = getParam("disciplinaId");
  const turmaId = getParam("turmaId");

  let alunosGlobal = [];

  // =====================================================
  // 1. CARREGAR COMPONENTES DA DISCIPLINA
  // =====================================================
  async function carregarComponentes() {
    const resp = await fetch(`${API}/componentes/disciplina/${disciplinaId}`);
    const comps = await resp.json();

    const head = tabela.tHead.rows[0];

    // remove colunas dinâmicas (mantém Matrícula, Aluno, Ações)
    while (head.cells.length > 3) {
      head.deleteCell(2);
    }

    const thAcoes = head.lastElementChild;

    // adiciona componentes dinamicamente
    comps.forEach(c => {
      const th = document.createElement("th");
      th.textContent = c.sigla;
      head.insertBefore(th, thAcoes);
    });

    return comps;
  }

  // =====================================================
  // 2. CARREGAR ALUNOS DA TURMA
  // =====================================================
  async function carregarAlunos() {
    const resp = await fetch(`${API}/turmas/${turmaId}/alunos`);
    const alunos = await resp.json();
    alunosGlobal = alunos;

    tbody.innerHTML = "";

    alunos.forEach(a => {
      const tr = document.createElement("tr");
      tr.dataset.alunoId = a.id; // usa ID real do backend

      tr.innerHTML = `
        <td>${a.ra}</td>
        <td>${a.nome}</td>
        <td class="acoes">
          <button class="acao-btn btn-excluir" onclick="excluirAluno(${a.id})">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    return alunos;
  }

  // =====================================================
  // 3. MONTAR COLUNAS DE NOTA
  // =====================================================
  function montarColunas(componentes) {
    tbody.querySelectorAll("tr").forEach(tr => {

      // remove colunas anteriores de nota
      while (tr.cells.length > 3) {
        tr.deleteCell(2);
      }

      const acoes = tr.lastElementChild;

      // cria TD para cada componente
      componentes.forEach(c => {
        const td = document.createElement("td");
        td.classList.add("celula-nota");
        td.dataset.compId = c.id;
        td.contentEditable = "true";
        td.textContent = "-";
        tr.insertBefore(td, acoes);
      });
    });
  }

  // =====================================================
  // 4. CARREGAR NOTAS DO BACKEND
  // =====================================================
  async function carregarNotas() {
    const resp = await fetch(`${API}/notas/${turmaId}/${disciplinaId}`);
    return await resp.json();
  }

  // =====================================================
  // 5. APLICAR NOTAS NA TABELA
  // =====================================================
  function aplicarNotas(componentes, notas) {
    tbody.querySelectorAll("tr").forEach(tr => {
      const alunoId = tr.dataset.alunoId;

      componentes.forEach(c => {
        const td = tr.querySelector(`td[data-comp-id="${c.id}"]`);
        const reg = notas.find(n =>
          n.ALUNO_ID == alunoId &&
          n.COMPONENTE_ID == c.id
        );

        if (reg) {
          td.textContent = Number(reg.VALOR).toFixed(2);
        }
      });
    });
  }

  // =====================================================
  // 6. SALVAR NOTAS NO BACKEND
  // =====================================================
  async function salvarNotas() {
    const lista = [];

    tbody.querySelectorAll("tr").forEach(tr => {
      const alunoId = tr.dataset.alunoId;

      tr.querySelectorAll("td[data-comp-id]").forEach(td => {
        const componenteId = td.dataset.compId;
        const valor = parseFloat(td.textContent.replace(",", "."));

        if (!isNaN(valor)) {
          lista.push({
            turmaId,
            disciplinaId,
            alunoId,
            componenteId,
            valor
          });
        }
      });
    });

    await fetch(`${API}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lista)
    });

    alert("Notas salvas com sucesso!");
  }

  // =====================================================
  // 7. EXCLUIR ALUNO
  // =====================================================
  window.excluirAluno = async function (idAluno) {
    if (!confirm("Deseja excluir este aluno da turma?")) return;

    await fetch(`${API}/alunos/${idAluno}`, { method: "DELETE" });

    alert("Aluno removido.");
    await carregarAlunos();
    montarColunas(await carregarComponentes());
  }

  // =====================================================
  // 8. EXECUÇÃO INICIAL
  // =====================================================
  const componentes = await carregarComponentes();
  await carregarAlunos();
  montarColunas(componentes);

  const notas = await carregarNotas();
  aplicarNotas(componentes, notas);

  document.getElementById("btnSalvar").onclick = salvarNotas;

});
