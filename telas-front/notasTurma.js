document.addEventListener("DOMContentLoaded", () => {
  const LS_COMP_DISC = 'pi.componentesDisc'; // componentes por disciplina
  const LS_NOTAS     = 'pi.notas';           // notas por turma/aluno/componente
  const LS_AUDIT     = 'pi.audit';           // logs de alteração

  const tabela = document.getElementById("tabelaNotas");
  const tbody  = tabela.querySelector("tbody");

  // ===== helpers =====
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const getParam = (name)=> new URLSearchParams(window.location.search).get(name);

  const disciplinaId = getParam('disciplinaId') || 'd1';
  const turmaId      = getParam('turmaId')      || 't1';

  // ============ Cabeçalho dinâmico ============
  function carregarComponentes() {
    const comps = JSON.parse(localStorage.getItem(LS_COMP_DISC) || '[]')
      .filter(c => String(c.disciplinaId) === String(disciplinaId));

    const theadRow = tabela.tHead.rows[0];

    // limpa (mantém as duas primeiras e a última "Ações")
    while (theadRow.cells.length > 3) {
      theadRow.deleteCell(2);
    }

    // insere cada componente antes de "Ações"
    const thAcoes = theadRow.lastElementChild;
    comps.forEach(c => {
      const th = document.createElement("th");
      th.textContent = c.sigla;
      theadRow.insertBefore(th, thAcoes);
    });

    const thNF = document.createElement("th");
    thNF.textContent = "Nota Final";
    theadRow.insertBefore(thNF, thAcoes);

    // cria/ajusta células nas linhas de aluno
    tbody.querySelectorAll("tr").forEach(tr => {
      // remove células dinâmicas antigas (entre aluno e ações)
      while (tr.cells.length > 3) {
        tr.deleteCell(2);
      }
      const tdAcoes = tr.lastElementChild;

      // células por componente (contentEditable)
      comps.forEach(c => {
        const td = document.createElement("td");
        td.setAttribute("data-componente", c.sigla);
        td.contentEditable = "true";
        td.textContent = "-";
        tr.insertBefore(td, tdAcoes);
      });

      // célula Nota Final 
      const tdNF = document.createElement("td");
      tdNF.setAttribute("data-nota-final", "1");
      tdNF.textContent = "-";
      tr.insertBefore(tdNF, tdAcoes);
    });

    // preencher valores existentes e recalcular
    aplicarNotasExistentes(comps);
    recalcularNotasFinais(comps);
    return comps;
  }

  function aplicarNotasExistentes(comps){
    const notas = JSON.parse(localStorage.getItem(LS_NOTAS) || '[]')
      .filter(n => n.turmaId === turmaId && n.disciplinaId === disciplinaId);

    tbody.querySelectorAll("tr").forEach(tr => {
      const ra = tr.cells[0].textContent.trim();
      comps.forEach(c => {
        const td = $$('td[data-componente="'+c.sigla+'"]', tr)[0];
        const registro = notas.find(n => n.alunoId === ra && n.componenteSigla === c.sigla);
        if (registro) td.textContent = Number(registro.valor).toFixed(2);
      });
    });
  }

  // média ponderada se houver pesos, senão média simples
  function calcularFinal(notas, comps){
    const nums = notas.filter(v => v !== null && !isNaN(v));
    if (!nums.length) return null;

    const pesos = comps.map(c => (typeof c.peso === "number" ? c.peso : null));
    const temPeso = pesos.some(p => p !== null);
    if (temPeso) {
      const w = pesos.map(p => (p ?? 0));
      const soma = w.reduce((a,b)=>a+b,0);
      if (soma <= 0) {
        const m = nums.reduce((a,b)=>a+b,0) / nums.length;
        return Number(m.toFixed(2));
      }
      let acc = 0;
      comps.forEach((c, idx) => {
        const v = notas[idx];
        const peso = w[idx];
        acc += ((isNaN(v)||v===null) ? 0 : v) * peso;
      });
      return Number((acc / soma).toFixed(2));
    } else {
      const m = nums.reduce((a,b)=>a+b,0) / nums.length;
      return Number(m.toFixed(2));
    }
  }

  function parseValor(txt){
    const v = parseFloat(String(txt).replace(",", "."));
    if (isNaN(v)) return null;
    if (v < 0 || v > 10) return null;
    return Number(v.toFixed(2));
  }

  function recalcularNotasFinais(comps){
    tbody.querySelectorAll("tr").forEach(tr => {
      const valores = comps.map(c => {
        const td = $$('td[data-componente="'+c.sigla+'"]', tr)[0];
        const v = parseValor(td?.textContent);
        return v;
      });
      const nf = calcularFinal(valores, comps);
      const tdNF = $('[data-nota-final]', tr);
      tdNF.textContent = (nf===null ? '-' : nf.toFixed(2));
    });
  }

  // salva todas as células na tabela pi.notas + log
  function salvarAlteracoes(){
    const now = new Date();
    const notas = JSON.parse(localStorage.getItem(LS_NOTAS) || '[]');
    const audit = JSON.parse(localStorage.getItem(LS_AUDIT) || '[]');

    const key = (ra, sigla) => `${turmaId}|${disciplinaId}|${ra}|${sigla}`;
    const atual = new Map(notas.map(n => [ key(n.alunoId, n.componenteSigla), n ]));

    // componentes atuais no header (entre "Aluno" e "Nota Final")
    const ths = Array.from(tabela.tHead.rows[0].cells);
    const idxAluno = 1; // col 0=matrícula, 1=aluno
    const idxNotaFinal = ths.findIndex(th => th.textContent.trim() === "Nota Final");
    const componentesSiglas = ths.slice(idxAluno+1, idxNotaFinal).map(th => th.textContent.trim());

    // percorre linhas de aluno
    tbody.querySelectorAll("tr").forEach(tr => {
      const ra = tr.cells[0].textContent.trim();
      componentesSiglas.forEach((sigla, i) => {
        const td = tr.cells[idxAluno+1+i];
        const val = parseValor(td.textContent);
        const k = key(ra, sigla);

        const anterior = atual.get(k)?.valor ?? null;
        const novo = (val===null ? null : Number(val.toFixed(2)));

        if (anterior !== novo) {
          if (novo === null) {
            if (atual.has(k)) {
              const idxNota = notas.findIndex(n => key(n.alunoId, n.componenteSigla) === k);
              if (idxNota >= 0) notas.splice(idxNota, 1);
            }
          } else {
            const reg = { turmaId, disciplinaId, alunoId: ra, componenteSigla: sigla, valor: novo };
            if (atual.has(k)) {
              const idxNota = notas.findIndex(n => key(n.alunoId, n.componenteSigla) === k);
              notas[idxNota] = reg;
            } else {
              notas.push(reg);
            }
          }

          audit.push({
            ts: now.toISOString(),
            turmaId, disciplinaId, alunoId: ra, componenteSigla: sigla,
            de: (anterior===null ? null : Number(anterior)),
            para: novo
          });
        }
      });
    });

    localStorage.setItem(LS_NOTAS, JSON.stringify(notas));
    localStorage.setItem(LS_AUDIT, JSON.stringify(audit));
    alert("Notas salvas com sucesso!");
  }

  // ----------------- eventos da página -----------------
  document.getElementById("btnExportar").addEventListener("click", () => {
    alert("Notas exportadas com sucesso (simulação)!");
  });

  document.getElementById("btnExcluirSelecionados").addEventListener("click", () => {
    alert("Seleção múltipla não implementada neste protótipo.");
  });

  document.getElementById("btnSalvar").addEventListener("click", () => {
    salvarAlteracoes();
    const comps = JSON.parse(localStorage.getItem(LS_COMP_DISC) || '[]')
      .filter(c => String(c.disciplinaId) === String(disciplinaId));
    recalcularNotasFinais(comps);
  });

  document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "detalhesTurma.html";
  });

  // Delegação: ações por linha (Editar / Excluir)
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".acao-btn");
    if(!btn) return;

    const tr = e.target.closest("tr");
    const ra = tr?.cells?.[0]?.textContent?.trim() ?? "(?)";
    if(btn.classList.contains("btn-editar")){
      alert(`Editar registro do aluno ${ra} (exemplo).`);
    }
    if(btn.classList.contains("btn-excluir")){
      if(confirm(`Excluir registro do aluno ${ra}?`)){
        tr.remove();
      }
    }
  });

  // validação e recálculo on-blur
  tbody.addEventListener("blur", (e) => {
    const td = e.target.closest('td[data-componente]');
    if (!td) return;
    const v = parseValor(td.textContent);
    td.textContent = (v===null ? '-' : v.toFixed(2));

    const comps = JSON.parse(localStorage.getItem(LS_COMP_DISC) || '[]')
      .filter(c => String(c.disciplinaId) === String(disciplinaId));
    recalcularNotasFinais(comps);
  }, true);

  // ====== Menu flutuante  ======
  const menuFlutuante = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba = document.getElementById("tituloAba");
  const btnIr = document.getElementById("btnIr");
  menuFlutuante.style.display = "none";

  const instituicoes = ["PUCCAMP", "USP", "UNICAMP"];
  const cursos = ["Engenharia", "Direito", "Administração"];
  const disciplinas = ["Cálculo I", "Física", "Lógica"];
  const turmas = ["Turma A", "Turma B", "Turma C"];

  function criarSelect(id, label, opcoes) {
    const div = document.createElement("div");
    div.classList.add("campo-selecao");
    const lbl = document.createElement("label");
    lbl.textContent = label;
    lbl.htmlFor = id;
    const select = document.createElement("select");
    select.id = id;
    select.innerHTML = `<option value="">Selecione...</option>` + opcoes.map(o => `<option>${o}</option>`).join("");
    div.appendChild(lbl); div.appendChild(select);
    return div;
  }

  function abrirMenu(tipo) {
    selectContainer.innerHTML = "";
    btnIr.style.display = "none";
    menuFlutuante.style.display = "block";

    if (tipo === "instituicao") {
      tituloAba.textContent = "Selecionar Instituição";
      const btnVerTodas = document.createElement("button");
      btnVerTodas.textContent = "Ver todas as instituições";
      btnVerTodas.classList.add("btn-curso");
      btnVerTodas.style.marginBottom = "10px";
      btnVerTodas.onclick = () => window.location.href = "listaCursos.html";
      selectContainer.appendChild(btnVerTodas);
      selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", instituicoes));
      btnIr.style.display = "block";
      btnIr.onclick = () => {
        const sel = document.getElementById("selInstituicao");
        if (sel.value) window.location.href = "listaCursos.html";
        else alert("Selecione uma instituição!");
      };
    }

    if (tipo === "curso") {
      tituloAba.textContent = "Selecionar Curso";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          btnIr.style.display = "block";
          btnIr.onclick = () => {
            const sel = document.getElementById("selCurso");
            if (sel.value) window.location.href = "listaDisciplinas.html";
            else alert("Selecione um curso!");
          };
        }
      }, { once: true });
    }

    if (tipo === "disciplina") {
      tituloAba.textContent = "Selecionar Disciplina";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          document.getElementById("selCurso").addEventListener("change", () => {
            if (!document.getElementById("selDisciplina")) {
              selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
              btnIr.style.display = "block";
              btnIr.onclick = () => {
                const sel = document.getElementById("selDisciplina");
                if (sel.value) window.location.href = "listaTurmas.html";
                else alert("Selecione uma disciplina!");
              };
            }
          }, { once: true });
        }
      }, { once: true });
    }

    if (tipo === "turma") {
      tituloAba.textContent = "Selecionar Turma";
      selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", () => {
        if (!document.getElementById("selCurso")) {
          selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursos));
          document.getElementById("selCurso").addEventListener("change", () => {
            if (!document.getElementById("selDisciplina")) {
              selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinas));
              document.getElementById("selDisciplina").addEventListener("change", () => {
                if (!document.getElementById("selTurma")) {
                  selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmas));
                  btnIr.style.display = "block";
                  btnIr.onclick = () => {
                    const sel = document.getElementById("selTurma");
                    if (sel.value) window.location.href = "detalhesTurma.html";
                    else alert("Selecione uma turma!");
                  };
                }
              }, { once: true });
            }
          }, { once: true });
        }
      }, { once: true });
    }
  }

  document.getElementById("btnInstituicoes").onclick = () => abrirMenu("instituicao");
  document.getElementById("btnCursos").onclick = () => abrirMenu("curso");
  document.getElementById("btnDisciplinas").onclick = () => abrirMenu("disciplina");
  document.getElementById("btnTurmas").onclick = () => abrirMenu("turma");

  document.addEventListener("click", e => {
    if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
      menuFlutuante.style.display = "none";
    }
  });

  // carrega componentes e injeta a estrutura
  carregarComponentes();
});
