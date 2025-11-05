// ========== Topbar e janelinha ==========
(function initTopbar(){
  const menuFlutuante   = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba       = document.getElementById("tituloAba");
  const btnIr           = document.getElementById("btnIr");

  const instituicoes = ["PUCCAMP","USP","UNICAMP"];
  const cursos       = ["Engenharia","Direito","Administração"];
  const disciplinas  = ["Cálculo I","Física","Lógica"];
  const turmasSel    = ["Turma A","Turma B","Turma C"];

  const mkSelect=(id,label,opts)=>{
    const d=document.createElement("div");
    d.className="campo-selecao";
    d.innerHTML=`<label for="${id}">${label}</label>
      <select id="${id}">
        <option value="">Selecione...</option>
        ${opts.map(o=>`<option>${o}</option>`).join("")}
      </select>`;
    return d;
  };

  function abrirMenu(tipo){
    selectContainer.innerHTML=""; btnIr.style.display="none";
    menuFlutuante.style.display="block";

    if(tipo==="instituicao"){
      tituloAba.textContent="Selecionar Instituição";
      const btnTodas=document.createElement("button");
      btnTodas.className="btn-curso"; btnTodas.style.marginBottom="10px";
      btnTodas.textContent="Ver todas as instituições";
      btnTodas.onclick=()=>location.href="dashboard.html";
      selectContainer.appendChild(btnTodas);

      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      btnIr.style.display="block";
      btnIr.onclick=()=>{
        const v=document.getElementById("selInstituicao").value;
        if(v) location.href="listaCursos.html"; else alert("Selecione uma instituição!");
      };
    }

    if(tipo==="curso"){
      tituloAba.textContent="Selecionar Curso";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change",()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          btnIr.style.display="block";
          btnIr.onclick=()=>{
            const v=document.getElementById("selCurso").value;
            if(v) location.href="listaDisciplinas.html"; else alert("Selecione um curso!");
          };
        }
      },{once:true});
    }

    if(tipo==="disciplina"){
      tituloAba.textContent="Selecionar Disciplina";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change",()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          document.getElementById("selCurso").addEventListener("change",()=>{
            if(!document.getElementById("selDisciplina")){
              selectContainer.appendChild(mkSelect("selDisciplina","Disciplina:",disciplinas));
              btnIr.style.display="block";
              btnIr.onclick=()=>{
                const v=document.getElementById("selDisciplina").value;
                if(v) location.href="listaTurmas.html"; else alert("Selecione uma disciplina!");
              };
            }
          },{once:true});
        }
      },{once:true});
    }

    if(tipo==="turma"){
      tituloAba.textContent="Selecionar Turma";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change",()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          document.getElementById("selCurso").addEventListener("change",()=>{
            if(!document.getElementById("selDisciplina")){
              selectContainer.appendChild(mkSelect("selDisciplina","Disciplina:",disciplinas));
              document.getElementById("selDisciplina").addEventListener("change",()=>{
                if(!document.getElementById("selTurma")){
                  selectContainer.appendChild(mkSelect("selTurma","Turma:",turmasSel));
                  btnIr.style.display="block";
                  btnIr.onclick=()=>{
                    const v=document.getElementById("selTurma").value;
                    if(v) location.href="detalhesTurma.html"; else alert("Selecione uma turma!");
                  };
                }
              },{once:true});
            }
          },{once:true});
        }
      },{once:true});
    }
  }

  const id=s=>document.getElementById(s);
  id("btnInstituicoes")?.addEventListener("click",(e)=>{e.preventDefault(); abrirMenu("instituicao");});
  id("btnCursos")?.addEventListener("click",(e)=>{e.preventDefault(); abrirMenu("curso");});
  id("btnDisciplinas")?.addEventListener("click",(e)=>{e.preventDefault(); abrirMenu("disciplina");});
  id("btnTurmas")?.addEventListener("click",(e)=>{e.preventDefault(); abrirMenu("turma");});

  document.addEventListener("click",(e)=>{
    if(!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")){
      menuFlutuante.style.display="none";
    }
  });
})();

// ========== Detalhes / alunos ==========
(function initDetalhes(){
  const qs = new URLSearchParams(location.search);
  const turmaId        = qs.get("turmaId")       || "-";
  const turmaNome      = qs.get("turmaNome")     || "-";
  const turmaCodigo    = qs.get("turmaCodigo")   || "-";
  const disciplinaNome = qs.get("disciplinaNome")|| "-";
  const instituicao    = qs.get("instituicaoNome") || "-";
  const periodo        = qs.get("periodo")       || "-";

  // Cabeçalho
  document.getElementById("tituloTurma").textContent = `Turma ${turmaNome} — ${disciplinaNome}`;
  document.getElementById("subTurma").textContent    = `Código: ${turmaCodigo} | Disciplina: ${disciplinaNome} | Instituição: ${instituicao} | Período: ${periodo}`;

  // Mock de alunos (substituir por fetch em produção)
  let alunos = [
    { id:"11111", nome:"João Silva"  },
    { id:"11112", nome:"Maria Souza" }
  ];

  const tbody = document.getElementById("tbodyAlunos");
  const chkAll = document.getElementById("selecionarTodos");

  function linhaAluno(a){
    return `<tr>
      <td><input type="checkbox" class="chkAluno" data-id="${a.id}"></td>
      <td>${a.id}</td>
      <td contenteditable="true" data-id="${a.id}" class="celNome">${a.nome}</td>
      <td>
        <button class="btnEditar" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btnExcluir" data-id="${a.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }

  function render(){
    tbody.innerHTML = alunos.map(linhaAluno).join("");

    // excluir
    tbody.querySelectorAll(".btnExcluir").forEach(btn=>{
      btn.addEventListener("click",(e)=>{
        const id = e.currentTarget.dataset.id;
        if(confirm("Remover este aluno da turma?")){
          alunos = alunos.filter(x=>x.id!==id);
          render();
        }
      });
    });
  }

  // selecionar todos
  chkAll.addEventListener("change", ()=>{
    tbody.querySelectorAll(".chkAluno").forEach(c => c.checked = chkAll.checked);
  });

  // ações
  document.getElementById("btnAddAluno").addEventListener("click", ()=>{
    const novoId = String(Date.now()).slice(-5);
    alunos.push({ id: novoId, nome: "Novo Aluno" });
    render();
  });

  document.getElementById("btnImportar").addEventListener("click", ()=>{
    alert("Importação de alunos (CSV/planilha) — implementar com backend.");
  });

  document.getElementById("btnExcluirSelecionados").addEventListener("click", ()=>{
    const idsSel = Array.from(tbody.querySelectorAll(".chkAluno:checked")).map(c=>c.dataset.id);
    if(!idsSel.length) return alert("Selecione pelo menos um aluno.");
    if(confirm("Excluir os alunos selecionados?")){
      alunos = alunos.filter(a=>!idsSel.includes(a.id));
      render();
    }
  });

  document.getElementById("btnNotasTurma").addEventListener("click", ()=>{
    alert(`Abrir notas da turma ${turmaNome} (ID ${turmaId}) — rota futura.`);
  });

  document.getElementById("btnSalvar").addEventListener("click", ()=>{
    // leitura dos nomes editados
    tbody.querySelectorAll(".celNome").forEach(td=>{
      const id = td.dataset.id;
      const novoNome = td.textContent.trim();
      const idx = alunos.findIndex(a=>a.id===id);
      if(idx>=0) alunos[idx].nome = novoNome;
    });

    
    alert("Alterações salvas (mock).");
  });

  document.getElementById("btnVoltar").addEventListener("click", ()=> history.back());

  // inicial
  render();
})();
