// ===========================================================
// DASHBOARD - NotaDez
// Carrega instituições do banco + editar + remover
// ===========================================================

// -------------------------------
// ELEMENTOS DO DOM
// -------------------------------
const inputBusca = document.getElementById("buscaInstituicao");
const btnBusca = document.getElementById("btnBuscarInstituicao");
const lista = document.getElementById("listaInstituicoes");
const btnAddInstituicao = document.getElementById("addInstituicao");

const menuFlutuante = document.getElementById("menuFlutuante");
const selectContainer = document.getElementById("selectContainer");
const tituloAba = document.getElementById("tituloAba");
const btnIr = document.getElementById("btnIr");

// ============================================================
// 🔥 CORREÇÃO MAIS IMPORTANTE
// No login você salva: localStorage.setItem("usuarioId", id)
// ENTÃO AQUI VOCÊ PRECISA PEGAR "usuarioId" E NÃO "userId"
// ============================================================
const userId = localStorage.getItem("usuarioId");  // CORRIGIDO

if (!userId) {
  alert("⚠ Erro: usuário não identificado. Faça login novamente.");
  window.location.href = "/auth/html/login.html";
}

// -------------------------------
// MENSAGEM DE LISTA VAZIA
// -------------------------------
const mensagemVazia = document.createElement("p");
mensagemVazia.textContent = "Nenhuma instituição encontrada.";
mensagemVazia.classList.add("mensagem-vazia");
mensagemVazia.style.display = "none";
mensagemVazia.style.textAlign = "center";
mensagemVazia.style.color = "#555";
mensagemVazia.style.marginTop = "20px";
lista.parentNode.insertBefore(mensagemVazia, lista.nextSibling);

// ===========================================================
// 1️⃣ CARREGAR INSTITUIÇÕES REAIS DO BANCO
// ===========================================================
async function carregarInstituicoes(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/instituicoes/listar/${userId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar instituições.</p>";
      return;
    }

    const filtradas = dados.filter(
      (inst) =>
        inst.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
        inst.SIGLA.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtradas.length === 0) {
      lista.innerHTML = "";
      mensagemVazia.style.display = "block";
      return;
    }

    lista.innerHTML = "";
    mensagemVazia.style.display = "none";

    filtradas.forEach((inst) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-content">
          <h2>${inst.SIGLA}</h2>
          <p><strong>Nome:</strong> ${inst.NOME}</p>
        </div>

        <div class="card-actions">
          <button class="edit-btn" data-id="${inst.ID}">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="remove-btn" data-id="${inst.ID}">
            <i class="fa-solid fa-trash"></i> Remover
          </button>
        </div>
      `;

      // 👉 Clique no card abre lista de cursos
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".edit-btn") && !e.target.closest(".remove-btn")) {
          localStorage.setItem("instituicaoId", inst.ID);
          window.location.href = "/gerenciar/html/listaCursos.html";
        }
      });

      // 👉 Botão EDITAR
      card.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        editarInstituicao(inst);
      });

      // 👉 Botão REMOVER
      card.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        removerInstituicao(inst.ID);
      });

      lista.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    lista.innerHTML = "<p>Erro ao conectar com servidor.</p>";
  }
}

carregarInstituicoes();

// ===========================================================
// 2️⃣ BUSCA
// ===========================================================
btnBusca.addEventListener("click", () => {
  carregarInstituicoes(inputBusca.value.trim());
});

inputBusca.addEventListener("keyup", () => {
  carregarInstituicoes(inputBusca.value.trim());
});

// ===========================================================
// 3️⃣ NOVA INSTITUIÇÃO
// ===========================================================
btnAddInstituicao.addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_instituicao.html";
});

// ===========================================================
// 4️⃣ EDITAR INSTITUIÇÃO
// ===========================================================
async function editarInstituicao(inst) {
  const novoNome = prompt("Novo nome da instituição:", inst.NOME);
  if (!novoNome) return;

  const novaSigla = prompt("Nova sigla:", inst.SIGLA);
  if (!novaSigla) return;

  try {
    const resp = await fetch("/api/instituicoes/editar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: inst.ID,
        nome: novoNome,
        sigla: novaSigla,
      }),
    });

    const dados = await resp.json();

    if (resp.ok) {
      alert("Instituição atualizada!");
      carregarInstituicoes();
    } else {
      alert("Erro: " + dados.message);
    }
  } catch (err) {
    alert("Erro ao editar instituição.");
  }
}

// ===========================================================
// 5️⃣ REMOVER (SÓ SE NÃO TIVER CURSOS)
// ===========================================================
async function removerInstituicao(id) {
  if (!confirm("Excluir esta instituição?")) return;

  try {
    const resp = await fetch(`/api/cursos/quantidade/${id}`);
    const { quantidade } = await resp.json();

    if (quantidade > 0) {
      alert("❌ Não é possível remover — existem cursos cadastrados.");
      return;
    }

    await fetch("/api/instituicoes/remover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    alert("Instituição removida!");
    carregarInstituicoes();
  } catch (err) {
    console.error(err);
    alert("Erro ao remover instituição.");
  }
}

// ===========================================================
// 6️⃣ MENU FLUTUANTE — SEU ORIGINAL (sem remover nada)
// ===========================================================

// Fake (por enquanto)
const instsFake = ["PUCCAMP", "USP", "UNICAMP"];
const cursosFake = ["Engenharia", "Direito", "Administração"];
const disciplinasFake = ["Cálculo I", "Física", "Lógica"];
const turmasFake = ["Turma A", "Turma B", "Turma C"];

function criarSelect(id, label, opcoes) {
  const div = document.createElement("div");
  div.classList.add("campo-selecao");

  const lbl = document.createElement("label");
  lbl.textContent = label;
  lbl.htmlFor = id;

  const select = document.createElement("select");
  select.id = id;
  select.innerHTML =
    `<option value="">Selecione...</option>` +
    opcoes.map((o) => `<option>${o}</option>`).join("");

  div.appendChild(lbl);
  div.appendChild(select);
  return div;
}

function abrirMenu(tipo) {
  selectContainer.innerHTML = "";
  btnIr.style.display = "none";
  menuFlutuante.style.display = "block";

  if (tipo === "instituicao") {
    tituloAba.textContent = "Instituições";
    selectContainer.appendChild(criarSelect("selInstituicao", "Selecionar Instituição:", instsFake));
    btnIr.style.display = "block";
    btnIr.onclick = () => window.location.href = "listaCursos.html";
  }

  if (tipo === "curso") {
    tituloAba.textContent = "Curso";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instsFake));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursosFake));
      btnIr.style.display = "block";
      btnIr.onclick = () => window.location.href = "listaDisciplinas.html";
    });
  }

  if (tipo === "disciplina") {
    tituloAba.textContent = "Disciplina";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instsFake));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursosFake));
      document.getElementById("selCurso").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinasFake));
        btnIr.style.display = "block";
        btnIr.onclick = () => window.location.href = "listaTurmas.html";
      });
    });
  }

  if (tipo === "turma") {
    tituloAba.textContent = "Turma";
    selectContainer.appendChild(criarSelect("selInstituicao", "Instituição:", instsFake));
    document.getElementById("selInstituicao").addEventListener("change", () => {
      selectContainer.appendChild(criarSelect("selCurso", "Curso:", cursosFake));
      document.getElementById("selCurso").addEventListener("change", () => {
        selectContainer.appendChild(criarSelect("selDisciplina", "Disciplina:", disciplinasFake));
        document.getElementById("selDisciplina").addEventListener("change", () => {
          selectContainer.appendChild(criarSelect("selTurma", "Turma:", turmasFake));
          btnIr.style.display = "block";
          btnIr.onclick = () => window.location.href = "detalhesTurma.html";
        });
      });
    });
  }
}

// Abrir menu ao clicar nos botões da topbar
document.getElementById("btnInstituicoes").addEventListener("click", () => abrirMenu("instituicao"));
document.getElementById("btnCursos").addEventListener("click", () => abrirMenu("curso"));
document.getElementById("btnDisciplinas").addEventListener("click", () => abrirMenu("disciplina"));
document.getElementById("btnTurmas").addEventListener("click", () => abrirMenu("turma"));

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!menuFlutuante.contains(e.target) && !e.target.closest(".menu-horizontal")) {
    menuFlutuante.style.display = "none";
  }
});
