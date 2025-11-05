// ========== janelinha ==========
(function initTopbar(){
  const menuFlutuante   = document.getElementById("menuFlutuante");
  const selectContainer = document.getElementById("selectContainer");
  const tituloAba       = document.getElementById("tituloAba");
  const btnIr           = document.getElementById("btnIr");

  const instituicoes = ["PUCCAMP","USP","UNICAMP"];
  const cursos       = ["Engenharia","Direito","Administração"];
  const disciplinas  = ["Cálculo I","Física","Lógica"];
  const turmasSel    = ["Turma A","Turma B","Turma C"];

  const mkSelect = (id,label,opts)=> {
    const wrap = document.createElement("div");
    wrap.className = "campo-selecao";
    wrap.innerHTML = `
      <label for="${id}">${label}</label>
      <select id="${id}">
        <option value="">Selecione...</option>
        ${opts.map(o=>`<option>${o}</option>`).join("")}
      </select>`;
    return wrap;
  };

  function abrirMenu(tipo){
    selectContainer.innerHTML = "";
    btnIr.style.display = "none";
    menuFlutuante.style.display = "block";

    if(tipo==="instituicao"){
      tituloAba.textContent = "Selecionar Instituição";
      const btnTodas = document.createElement("button");
      btnTodas.className="btn-curso"; btnTodas.style.marginBottom="10px";
      btnTodas.textContent="Ver todas as instituições";
      btnTodas.onclick=()=>location.href="dashboard.html";
      selectContainer.appendChild(btnTodas);

      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      btnIr.style.display="block";
      btnIr.onclick = ()=>{
        const v = document.getElementById("selInstituicao").value;
        if(v) location.href="listaCursos.html"; else alert("Selecione uma instituição!");
      };
    }

    if(tipo==="curso"){
      tituloAba.textContent="Selecionar Curso";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", ()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          btnIr.style.display="block";
          btnIr.onclick=()=>{
            const v=document.getElementById("selCurso").value;
            if(v) location.href="listaDisciplinas.html"; else alert("Selecione um curso!");
          };
        }
      }, {once:true});
    }

    if(tipo==="disciplina"){
      tituloAba.textContent="Selecionar Disciplina";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", ()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          document.getElementById("selCurso").addEventListener("change", ()=>{
            if(!document.getElementById("selDisciplina")){
              selectContainer.appendChild(mkSelect("selDisciplina","Disciplina:",disciplinas));
              btnIr.style.display="block";
              btnIr.onclick=()=>{
                const v=document.getElementById("selDisciplina").value;
                if(v) location.href="listaTurmas.html"; else alert("Selecione uma disciplina!");
              };
            }
          }, {once:true});
        }
      }, {once:true});
    }

    if(tipo==="turma"){
      tituloAba.textContent="Selecionar Turma";
      selectContainer.appendChild(mkSelect("selInstituicao","Instituição:",instituicoes));
      document.getElementById("selInstituicao").addEventListener("change", ()=>{
        if(!document.getElementById("selCurso")){
          selectContainer.appendChild(mkSelect("selCurso","Curso:",cursos));
          document.getElementById("selCurso").addEventListener("change", ()=>{
            if(!document.getElementById("selDisciplina")){
              selectContainer.appendChild(mkSelect("selDisciplina","Disciplina:",disciplinas));
              document.getElementById("selDisciplina").addEventListener("change", ()=>{
                if(!document.getElementById("selTurma")){
                  selectContainer.appendChild(mkSelect("selTurma","Turma:",turmasSel));
                  btnIr.style.display="block";
                  btnIr.onclick=()=>{
                    const v=document.getElementById("selTurma").value;
                    if(v) location.href="detalhesTurma.html"; else alert("Selecione uma turma!");
                  };
                }
              }, {once:true});
            }
          }, {once:true});
        }
      }, {once:true});
    }
  }

  const id = s=>document.getElementById(s);
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

// ========== Lista de turmas  ==========
(function initTurmas(){
  // mock inicial
  let turmas = [
    { id:"t100", nome:"100", codigo:"A013", disciplina:"Banco de Dados I" },
    { id:"t101", nome:"101", codigo:"D809", disciplina:"Álgebra Linear" },
    { id:"t102", nome:"102", codigo:"S789", disciplina:"Teologia" },
    { id:"t103", nome:"103", codigo:"A133", disciplina:"Introdução a Web" }
  ];

  const corpoTabela = document.getElementById("corpoTabela");
  const vazio       = document.getElementById("vazio");
  const btnBuscar   = document.getElementById("btnBuscar");
  const fBusca      = document.getElementById("fBusca");
  const btnNovo     = document.getElementById("btnNovo");

  function linhaHTML(turma, index){
    const params = new URLSearchParams({
      turmaId: turma.id,
      turmaNome: turma.nome,
      turmaCodigo: turma.codigo,
      disciplinaNome: turma.disciplina,
      instituicaoNome: "PUCCAMP",
      periodo: "1º Semestre"
    }).toString();

    return `
      <div class="tabela-row">
        <span>${turma.nome}</span>
        <span>${turma.codigo}</span>
        <span>${turma.disciplina}</span>
        <div class="acoes">
          <button class="btn-alunos" data-href="detalhesTurma.html?${params}">
            <i class="fa-solid fa-user-graduate"></i> Alunos
          </button>
          <button class="btn-excluir" data-index="${index}">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      </div>`;
  }

  function render(lista){
    corpoTabela.innerHTML = "";
    if(!lista.length){ vazio.style.display="block"; return; }
    vazio.style.display="none";
    corpoTabela.innerHTML = lista.map(linhaHTML).join("");

    // eventos
    corpoTabela.querySelectorAll(".btn-excluir").forEach(btn=>{
      btn.addEventListener("click",(e)=>{
        const idx = Number(e.currentTarget.dataset.index);
        if(confirm(`Excluir a turma "${turmas[idx].nome}"?`)){
          turmas.splice(idx,1);
          buscar();
        }
      });
    });
    corpoTabela.querySelectorAll(".btn-alunos").forEach(btn=>{
      btn.addEventListener("click",(e)=>{
        location.href = e.currentTarget.dataset.href;
      });
    });
  }

  function buscar(){
    const termo = fBusca.value.toLowerCase().trim();
    const filtradas = turmas.filter(t =>
      t.nome.toLowerCase().includes(termo) ||
      t.codigo.toLowerCase().includes(termo) ||
      t.disciplina.toLowerCase().includes(termo)
    );
    render(filtradas);
  }

  btnBuscar.addEventListener("click", buscar);
  fBusca.addEventListener("keydown", e=>{ if(e.key==="Enter") buscar(); });
  btnNovo.addEventListener("click", ()=> location.href="cadastro_turma.html");

  // inicial
  render(turmas);
})();
