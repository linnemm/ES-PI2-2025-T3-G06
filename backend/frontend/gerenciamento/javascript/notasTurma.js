//Autoria: Miriã - Notas Turmas JS -->

// NOTAS DA TURMA 
(function initNotasTurma() {

  //PEGAR SOMENTE TURMA ID
  const qs = new URLSearchParams(location.search);
  const turmaId = Number(qs.get("turmaId"));

  if (!turmaId) {
    alert("Erro: turmaId não informado.");
    return;
  }

  //ELEMENTOS HTML
  const tituloTurma      = document.getElementById("tituloTurma");
  const subTurma         = document.getElementById("subTurma");
  const tipoMediaTexto   = document.getElementById("tipoMediaTexto");
  const selComponente    = document.getElementById("selComponente");
  const chkEdicaoCompleta= document.getElementById("chkEdicaoCompleta");
  const btnSalvar        = document.getElementById("btnSalvar");
  const btnVoltar        = document.getElementById("btnVoltar");
  const btnExportar      = document.getElementById("exportarNotas");

  const thead = document.querySelector("#tabelaNotas thead");
  const tbody = document.getElementById("tbodyNotas");

  //ESTADOS
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
    if (mapaNotas.has(k))      return mapaNotas.get(k);
    return "";
  }

  function setNota(alunoId, compId, v) {
    const k = keyNota(alunoId, compId);
    if (v === "" || isNaN(Number(v))) return notasAlteradas.set(k, "");
    const n = Number(v);
    if (n < 0 || n > 10) return;
    notasAlteradas.set(k, n);
  }

  //CÁLCULO DA NOTA FINAL
  function calcularNotaFinal(alunoId) {
    if (!componentes.length) return "-";

    for (const c of componentes) {
      const v = getNota(alunoId, c.ID);
      if (v === "" || v === undefined) return "-";
    }

    if (tipoMedia === "PONDERADA") {
      let soma = 0;
      let tot = 0;

      componentes.forEach(c => {
        soma += Number(getNota(alunoId, c.ID)) * (c.PESO / 100);
        tot  += c.PESO;
      });

      if (tot !== 100) soma *= (100 / tot);

      return soma.toFixed(2);
    }

    let soma = 0;
    componentes.forEach(c => soma += Number(getNota(alunoId, c.ID)));

    return (soma / componentes.length).toFixed(2);
  }

  //CABEÇALHO DA TABELA
  function montarCabecalho() {
    let html = `<th>Matrícula</th><th>Aluno</th>`;

    componentes.forEach(c => {
      let label = c.SIGLA;
      if (tipoMedia === "PONDERADA") label += ` (${c.PESO}%)`;
      html += `<th>${label}</th>`;
    });

    html += `<th>Nota Final</th>`;
    thead.innerHTML = `<tr>${html}</tr>`;
  }

  //LINHAS
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
              class="campo-nota"
              data-aluno="${aluno.ID}"
              data-comp="${c.ID}"
              step="0.01"
              value="${v}"
              disabled
            >
          </td>
        `;
      });

      html += `<td class="nota-final" data-aluno="${aluno.ID}">${calcularNotaFinal(aluno.ID)}</td>`;

      return `<tr>${html}</tr>`;
    }).join("");
  }

  //MODO DE EDIÇÃO
  function aplicarModoEdicao() {
    const campos = document.querySelectorAll(".campo-nota");
    const compSel = Number(selComponente.value || 0);
    const full = chkEdicaoCompleta.checked;

    campos.forEach(inp => {
      const comp = Number(inp.dataset.comp);
      inp.disabled = !full && comp !== compSel;
    });
  }

  //ENTER PARA DESCER A TELA
  function ligarEventosEntrada() {
    const campos = [...document.querySelectorAll(".campo-nota")];

    campos.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        const alunoId = Number(inp.dataset.aluno);
        const compId  = Number(inp.dataset.comp);
        setNota(alunoId, compId, inp.value);
        document.querySelector(`.nota-final[data-aluno="${alunoId}"]`)
          .textContent = calcularNotaFinal(alunoId);
      });

      inp.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!chkEdicaoCompleta.checked) return;
          const nxt = campos[i + 1];
          if (nxt && !nxt.disabled) {
            nxt.focus();
            nxt.select();
          }
        }
      });
    });
  }

  //SALVAR NOTAS
  async function salvarNotas() {
    if (!notasAlteradas.size) {
      alert("Nenhuma nota alterada!");
      return;
    }

    const lista = [];

    notasAlteradas.forEach((v, chave) => {
      if (v === "") return;
      const [alunoId, compId] = chave.split("-");
      lista.push({
        turmaId,
        alunoId: Number(alunoId),
        componenteId: Number(compId),
        valor: Number(v)
      });
    });

    const resp = await fetch("/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lista)
    });

    if (!resp.ok) return alert("Erro ao salvar notas.");

    alert("Notas salvas!");

    lista.forEach(n =>
      mapaNotas.set(keyNota(n.alunoId, n.componenteId), n.valor)
    );

    notasAlteradas.clear();
  }

  //EXPORTAÇÃO COMPLETA — TODAS AS NOTAS OBRIGATÓRIAS
  function exportarCSV() {

    for (const aluno of alunos) {
      for (const c of componentes) {
        const v = getNota(aluno.ID, c.ID);
        if (v === "" || v === undefined) {
          alert("⛔ Preencha TODAS as notas antes de exportar.");
          return;
        }
      }

      const media = calcularNotaFinal(aluno.ID);
      if (media === "-" || media === "" || isNaN(Number(media))) {
        alert("⛔ Algumas médias finais não foram calculadas.");
        return;
      }
    }

    let csv = "matricula;aluno;";
    componentes.forEach(c => csv += `${c.SIGLA};`);
    csv += "nota_final\n";

    alunos.forEach(a => {
      let linha = `${a.MATRICULA};${a.NOME};`;
      componentes.forEach(c => linha += `${getNota(a.ID, c.ID)};`);
      linha += `${calcularNotaFinal(a.ID)}\n`;
      csv += linha;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notas_turma_${turma.NOME}.csv`;
    link.click();
  }

  //CARREGAR TUDO USANDO APENAS turmaId
  async function carregarTudo() {
    try {
      const respT = await fetch(`/api/turmas/detalhes/${turmaId}`);
      turma = await respT.json();

      tituloTurma.textContent = `Notas — ${turma.NOME}`;
      subTurma.textContent = turma.DISCIPLINA_NOME;

      const respC = await fetch(`/api/componentes/listar/${turma.DISCIPLINA_ID}`);
      componentes = await respC.json();

      tipoMedia = componentes[0]?.TIPO_MEDIA?.toUpperCase() || "SIMPLES";
      tipoMediaTexto.textContent =
        tipoMedia === "PONDERADA" ? "Média: Ponderada" : "Média: Simples";

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
          `<option value="${c.ID}">${c.SIGLA} — ${c.NOME}</option>`
        ).join("");

      montarCabecalho();
      montarLinhas();
      ligarEventosEntrada();

    } catch (e) {
      console.error(e);
      alert("Erro ao carregar dados da turma.");
    }
  }

  //EVENTOS
  selComponente.addEventListener("change", aplicarModoEdicao);
  chkEdicaoCompleta.addEventListener("change", () => {
    selComponente.value = "";
    aplicarModoEdicao();
  });
  btnSalvar.addEventListener("click", salvarNotas);
  btnExportar.addEventListener("click", exportarCSV);
  btnVoltar.addEventListener("click", () => history.back());

  carregarTudo();

})();
