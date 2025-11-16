// =========================================================
// NOTAS DA TURMA — LÓGICA PRINCIPAL
// =========================================================
(function initNotasTurma() {

  const qs = new URLSearchParams(location.search);
  const turmaId = Number(qs.get("turmaId"));

  if (!turmaId) {
    alert("Erro: turmaId não informado.");
    return;
  }

  // ELEMENTOS
  const tituloTurma = document.getElementById("tituloTurma");
  const subTurma = document.getElementById("subTurma");
  const tipoMediaTexto = document.getElementById("tipoMediaTexto");
  const selComponente = document.getElementById("selComponente");
  const chkEdicaoCompleta = document.getElementById("chkEdicaoCompleta");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnVoltar = document.getElementById("btnVoltar");
  const btnExportar = document.getElementById("exportarNotas");

  const thead = document.querySelector("#tabelaNotas thead");
  const tbody = document.getElementById("tbodyNotas");

  // ESTADOS
  let turma = null;
  let alunos = [];
  let componentes = [];
  let notasBD = [];
  let tipoMedia = "SIMPLES";

  const mapaNotas = new Map();
  const notasAlteradas = new Map();

  const keyNota = (alunoId, compId) => `${alunoId}-${compId}`;

  function getNota(alunoId, compId) {
    const k = keyNota(alunoId, compId);
    if (notasAlteradas.has(k)) return notasAlteradas.get(k);
    if (mapaNotas.has(k)) return mapaNotas.get(k);
    return "";
  }

  function setNota(alunoId, compId, valor) {
    const k = keyNota(alunoId, compId);

    if (valor === "" || isNaN(Number(valor))) {
      notasAlteradas.set(k, "");
      return;
    }

    const numero = Number(valor);
    if (numero < 0 || numero > 10) return;

    notasAlteradas.set(k, numero);
  }

  // ======================================================
  // CÁLCULO DA NOTA FINAL
  // ======================================================
  function calcularNotaFinal(alunoId) {
    if (componentes.length === 0) return "-";

    for (const c of componentes) {
      const v = getNota(alunoId, c.ID);
      if (v === "" || v === undefined || v === null) return "-";
    }

    // MÉDIA PONDERADA
    if (tipoMedia === "PONDERADA") {
      let soma = 0;
      let totalPesos = 0;

      for (const c of componentes) {
        const v = Number(getNota(alunoId, c.ID));
        const p = Number(c.PESO);
        soma += v * (p / 100);
        totalPesos += p;
      }

      if (totalPesos !== 100) soma *= (100 / totalPesos);
      return soma.toFixed(2);
    }

    // MÉDIA SIMPLES
    let soma = 0;
    componentes.forEach(c => soma += Number(getNota(alunoId, c.ID)));
    return (soma / componentes.length).toFixed(2);
  }

  // ======================================================
  // MONTAR CABEÇALHO
  // ======================================================
  function montarCabecalho() {
    let html = `
      <th>Matrícula</th>
      <th>Aluno</th>
    `;

    componentes.forEach(c => {
      let label = c.SIGLA;
      if (tipoMedia === "PONDERADA") label += ` (${c.PESO}%)`;
      html += `<th>${label}</th>`;
    });

    html += `<th>Nota Final</th>`;
    thead.innerHTML = `<tr>${html}</tr>`;
  }

  // ======================================================
  // MONTAR TABELA
  // ======================================================
  function montarLinhas() {
    tbody.innerHTML = alunos.map(aluno => {
      let html = `
        <td>${aluno.MATRICULA}</td>
        <td>${aluno.NOME}</td>
      `;

      componentes.forEach(c => {
        const v = getNota(aluno.ID, c.ID);
        html += `
          <td>
            <input 
              type="number"
              step="0.01"
              class="campo-nota"
              data-aluno="${aluno.ID}"
              data-comp="${c.ID}"
              value="${v !== "" ? v : ""}"
              disabled
            >
          </td>
        `;
      });

      const final = calcularNotaFinal(aluno.ID);
      html += `<td class="nota-final" data-aluno="${aluno.ID}">${final}</td>`;

      return `<tr>${html}</tr>`;
    }).join("");
  }

  // ======================================================
  // MODO DE EDIÇÃO
  // ======================================================
  function aplicarModoEdicao() {
    const campos = document.querySelectorAll(".campo-nota");
    const compSel = Number(selComponente.value || 0);
    const full = chkEdicaoCompleta.checked;

    campos.forEach(input => {
      const comp = Number(input.dataset.comp);
      input.disabled = !full && comp !== compSel;
    });
  }

  // ======================================================
  // INPUT + ENTER PARA IR PARA O PRÓXIMO CAMPO
  // ======================================================
  function ligarEventosEntrada() {
    const campos = [...document.querySelectorAll(".campo-nota")];

    campos.forEach((input, index) => {

      input.addEventListener("input", () => {
        const alunoId = Number(input.dataset.aluno);
        const compId = Number(input.dataset.comp);

        setNota(alunoId, compId, input.value);

        const finalCell = document.querySelector(`.nota-final[data-aluno="${alunoId}"]`);
        finalCell.textContent = calcularNotaFinal(alunoId);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();

          if (!chkEdicaoCompleta.checked) return;

          const proximo = campos[index + 1];

          if (proximo && !proximo.disabled) {
            proximo.focus();
            proximo.select();
          }
        }
      });
    });
  }

  // ======================================================
  // SALVAR NOTAS
  // ======================================================
  async function salvarNotas() {
    if (notasAlteradas.size === 0) {
      alert("Nenhuma nota alterada!");
      return;
    }

    const lista = [];

    notasAlteradas.forEach((valor, chave) => {
      if (valor === "") return;
      const [alunoId, compId] = chave.split("-");
      lista.push({
        turmaId,
        alunoId: Number(alunoId),
        componenteId: Number(compId),
        valor: Number(valor)
      });
    });

    try {
      const resp = await fetch("/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lista)
      });

      if (!resp.ok) {
        const j = await resp.json();
        throw new Error(j.message);
      }

      alert("Notas salvas!");

      lista.forEach(n => mapaNotas.set(keyNota(n.alunoId, n.componenteId), n.valor));
      notasAlteradas.clear();

    } catch (e) {
      alert("Erro ao salvar notas.");
      console.error(e);
    }
  }

  // ======================================================
  // EXPORTAR CSV
  // ======================================================
  function exportarCSV() {

    for (const aluno of alunos) {
      for (const c of componentes) {
        const valor = getNota(aluno.ID, c.ID);
        if (valor === "" || valor === null || valor === undefined) {
          alert("Só é possível exportar quando TODAS as notas estiverem preenchidas.");
          return;
        }
      }
    }

    let csv = "";
    csv += "matricula;aluno;";

    componentes.forEach(c => csv += `${c.SIGLA};`);

    csv += "nota_final\n";

    alunos.forEach(aluno => {
      let linha = `${aluno.MATRICULA};${aluno.NOME};`;
      componentes.forEach(c => { linha += `${getNota(aluno.ID, c.ID)};`; });
      linha += `${calcularNotaFinal(aluno.ID)}\n`;
      csv += linha;
    });

    const agora = new Date();
    const nomeArq =
      `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,"0")}-${String(agora.getDate()).padStart(2,"0")}_` +
      `${String(agora.getHours()).padStart(2,"0")}${String(agora.getMinutes()).padStart(2,"0")}${String(agora.getSeconds()).padStart(2,"0")}000-` +
      `${turma.NOME}-${turma.DISCIPLINA_SIGLA}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArq;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ======================================================
  // CARREGAR TUDO
  // ======================================================
  async function carregarTudo() {
    try {
      const respT = await fetch(`/api/turmas/detalhes/${turmaId}`);
      turma = await respT.json();

      // REMOVIDO "Turma"
      tituloTurma.textContent = `Notas — ${turma.NOME}`;
      subTurma.textContent = `Disciplina: ${turma.DISCIPLINA_NOME}`;

      const respC = await fetch(`/api/componentes/listar/${turma.DISCIPLINA_ID}`);
      componentes = await respC.json();

      if (componentes.length > 0) {
        tipoMedia =
          componentes[0].TIPO_MEDIA?.toUpperCase() === "PONDERADA"
            ? "PONDERADA"
            : "SIMPLES";
      }

      tipoMediaTexto.textContent =
        tipoMedia === "PONDERADA"
          ? "Média da Disciplina: Ponderada"
          : "Média da Disciplina: Simples";

      const respA = await fetch(`/api/alunos/turma/${turmaId}`);
      alunos = await respA.json();

      const respN = await fetch(`/api/notas/${turmaId}/${turma.DISCIPLINA_ID}`);
      notasBD = await respN.json();

      mapaNotas.clear();
      notasBD.forEach(n =>
        mapaNotas.set(keyNota(n.ALUNO_ID, n.COMPONENTE_ID), n.VALOR)
      );

      selComponente.innerHTML =
        `<option value="">(Selecione um componente)</option>` +
        componentes.map(c =>
          `<option value="${c.ID}">${c.SIGLA} — ${c.NOME} ${
            tipoMedia === "PONDERADA" ? `(${c.PESO}%)` : ""
          }</option>`
        ).join("");

      montarCabecalho();
      montarLinhas();
      ligarEventosEntrada();

    } catch (e) {
      console.error(e);
      alert("Erro ao carregar dados.");
    }
  }

  // EVENTOS
  selComponente.addEventListener("change", aplicarModoEdicao);
  chkEdicaoCompleta.addEventListener("change", () => {
    selComponente.value = "";
    aplicarModoEdicao();
  });

  btnSalvar.addEventListener("click", salvarNotas);
  btnVoltar.addEventListener("click", () => history.back());
  btnExportar.addEventListener("click", exportarCSV);

  carregarTudo();

})();
