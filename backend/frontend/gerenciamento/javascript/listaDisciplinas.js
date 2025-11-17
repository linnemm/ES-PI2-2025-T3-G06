// =========================================
// UTILITÁRIO
// =========================================
const $ = (id) => document.getElementById(id);

// =========================================
// PEGAR PARAMETROS DA URL
// =========================================
const params = new URLSearchParams(window.location.search);
const instituicaoId = params.get("inst");
const cursoId = params.get("curso");
const usuarioId = localStorage.getItem("usuarioId");

// =========================================
// VALIDAÇÕES DE SEGURANÇA
// =========================================
if (!usuarioId) {
  alert("⚠ Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

if (!instituicaoId) {
  alert("Selecione primeiro uma instituição 😊");
  window.location.href = "/gerenciar/html/dashboard.html";
}

if (!cursoId) {
  alert("Selecione primeiro um curso.");
  window.location.href = `/gerenciar/html/listaCursos.html?inst=${instituicaoId}`;
}

// Elementos principais
const lista = $("corpoTabelaDisc");
const vazio = $("vazioDisc");


// =========================================
// 1️⃣ CARREGAR DISCIPLINAS DO CURSO
// =========================================
async function carregarDisciplinas(filtro = "") {
  lista.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const dados = await resp.json();

    if (!resp.ok) {
      lista.innerHTML = "<p>Erro ao carregar disciplinas.</p>";
      return;
    }

    const filtradas = dados.filter(d =>
      d.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
      d.CODIGO.toLowerCase().includes(filtro.toLowerCase()) ||
      d.PERIODO.toLowerCase().includes(filtro.toLowerCase()) ||
      (d.PROFESSOR_NOME || "").toLowerCase().includes(filtro.toLowerCase())
    );

    lista.innerHTML = "";
    vazio.style.display = filtradas.length === 0 ? "block" : "none";

    filtradas.forEach((disc) => {
      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span class="disciplina-click" data-id="${disc.ID}">
          <strong>${disc.NOME}</strong>
        </span>
        <span>${disc.CODIGO}</span>
        <span>${disc.PERIODO}</span>
        <span>${disc.PROFESSOR_NOME || "-"}</span>

        <span class="acoes">
          <button class="acao-btn btn-editar">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="acao-btn btn-excluir">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </span>
      `;

      // ABRIR LISTA DE TURMAS
      row.querySelector(".disciplina-click")
        .addEventListener("click", () => {
          window.location.href =
            `/gerenciar/html/listaTurmas.html?inst=${instituicaoId}&curso=${cursoId}&disc=${disc.ID}`;
        });

      // editar
      row.querySelector(".btn-editar")
        .addEventListener("click", () => editarDisciplina(disc));

      // excluir
      row.querySelector(".btn-excluir")
        .addEventListener("click", () => removerDisciplina(disc.ID));

      lista.appendChild(row);
    });

  } catch (e) {
    console.error(e);
    lista.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
  }
}

carregarDisciplinas();


// =========================================
// 2️⃣ EDITAR DISCIPLINA
// =========================================
async function editarDisciplina(disc) {
  const nome = prompt("Novo nome:", disc.NOME);
  if (!nome) return;

  const codigo = prompt("Novo código:", disc.CODIGO);
  if (!codigo) return;

  const periodo = prompt("Novo período:", disc.PERIODO);
  if (!periodo) return;

  try {
    const resp = await fetch(`/api/disciplinas/editar/${disc.ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, codigo, periodo })
    });

    const dados = await resp.json();

    if (!resp.ok) return alert("Erro: " + dados.message);

    alert("Disciplina atualizada!");
    carregarDisciplinas();

  } catch (e) {
    console.error(e);
    alert("Erro ao editar disciplina.");
  }
}


// =========================================
// 3️⃣ BUSCA
// =========================================
$("btnBuscarDisc").addEventListener("click", () =>
  carregarDisciplinas($("fBuscaDisc").value.trim())
);

$("fBuscaDisc").addEventListener("keyup", () =>
  carregarDisciplinas($("fBuscaDisc").value.trim())
);


// =========================================
// 4️⃣ REMOVER DISCIPLINA (BLOQUEIO TURMAS)
// =========================================
async function removerDisciplina(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    // Verificar se tem turmas
    const check = await fetch(`/api/disciplinas/tem-turmas/${id}`);
    const dadosCheck = await check.json();

    if (dadosCheck.temTurmas) {
      alert("❌ Não é possível excluir: existem turmas vinculadas.");
      return;
    }

    const resp = await fetch(`/api/disciplinas/remover/${id}`, {
      method: "DELETE"
    });

    const dados = await resp.json();
    if (!resp.ok) return alert("Erro: " + dados.message);

    alert("Disciplina removida!");
    carregarDisciplinas();

  } catch (e) {
    console.error(e);
    alert("Erro ao remover disciplina.");
  }
}


// =========================================
// 5️⃣ NOVA DISCIPLINA
// =========================================
$("btnNovaDisc").addEventListener("click", () => {
  window.location.href =
    `/gerenciar/html/cadastro_disciplina.html?inst=${instituicaoId}&curso=${cursoId}`;
});


// =========================================
// 6️⃣ NOVA TURMA
// =========================================
$("btnNovaTurma").addEventListener("click", () => {
  window.location.href =
    `/gerenciar/html/cadastro_turma.html?inst=${instituicaoId}&curso=${cursoId}`;
});


// =========================================
// 7️⃣ BOTÃO INSTITUIÇÕES
// =========================================
$("btnInstituicoes").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/dashboard.html";
});


// =========================================
// 8️⃣ MODAL DE COMPONENTE
// =========================================
const modal = $("modalComponente");
const btnAbrir = $("btnComponenteNota");
const btnFecharX = $("btnFecharModal");
const btnFechar = $("btnFechar");
const btnSalvar = $("btnSalvarComponente");
const btnVerLista = $("btnVerComponentes");

btnAbrir.addEventListener("click", () => {
  modal.style.display = "flex";
  carregarDisciplinasParaSelect();
});

btnFecharX.onclick = btnFechar.onclick = () => modal.style.display = "none";

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


// =========================================
// 9️⃣ CARREGAR DISCIPLINAS NO SELECT DO MODAL
// =========================================
async function carregarDisciplinasParaSelect() {
  const cmpDisc = $("cmpDisc");
  cmpDisc.innerHTML = `<option value="">Carregando...</option>`;

  try {
    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const lista = await resp.json();

    cmpDisc.innerHTML = `<option value="">Selecione...</option>`;

    lista.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.ID;
      opt.textContent = `${d.NOME} (${d.CODIGO})`;
      cmpDisc.appendChild(opt);
    });

  } catch (e) {
    console.error("Erro ao carregar disciplinas:", e);
  }
}


// =========================================
// 🔟 SALVAR COMPONENTE
// =========================================
btnSalvar.addEventListener("click", async () => {

  const disciplinaId = $("cmpDisc").value;
  const nome = $("cmpNome").value.trim();
  const sigla = $("cmpSigla").value.trim();
  const descricao = $("cmpDesc").value.trim();
  const tipoMedia = document.querySelector("input[name='tipoMedia']:checked").value;
  const peso = tipoMedia === "ponderada" ? $("cmpPeso").value : null;

  if (!disciplinaId || !nome || !sigla) {
    return alert("Preencha todos os campos obrigatórios.");
  }

  try {
    const resp = await fetch("/api/componentes/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disciplinaId,
        nome,
        sigla,
        descricao,
        peso,
        tipoMedia,
        usuario_id: usuarioId
      })
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Componente cadastrado com sucesso!");
    modal.style.display = "none";

  } catch (e) {
    console.error("Erro:", e);
    alert("Erro ao salvar componente.");
  }
});


// =========================================
// 1️⃣1️⃣ SUBMODAL — LISTAR COMPONENTES
// =========================================
const subModal = $("modalListaComponentes");
const btnFecharLista = $("btnFecharListaComp");

btnVerLista.addEventListener("click", () => {
  subModal.style.display = "flex";
  carregarComponentes();
});

btnFecharLista.addEventListener("click", () => {
  subModal.style.display = "none";
});

subModal.addEventListener("click", (e) => {
  if (e.target === subModal) subModal.style.display = "none";
});


// =========================================
// 1️⃣2️⃣ CARREGAR LISTA DE COMPONENTES
// =========================================
async function carregarComponentes() {
  const container = $("listaComponentesContainer");
  const disciplinaId = $("cmpDisc").value;

  if (!disciplinaId) {
    container.innerHTML = "<p>Selecione uma disciplina no modal principal.</p>";
    return;
  }

  container.innerHTML = "<p>Carregando...</p>";

  try {
    const resp = await fetch(`/api/componentes/listar/${disciplinaId}`);
    const lista = await resp.json();

    if (!resp.ok) {
      container.innerHTML = "<p>Erro ao carregar componentes.</p>";
      return;
    }

    if (lista.length === 0) {
      container.innerHTML = "<p>Nenhum componente cadastrado.</p>";
      return;
    }

    container.innerHTML = "";

    lista.forEach(c => {
      const item = document.createElement("div");
      item.classList.add("comp-item");

      item.innerHTML = `
        <div>
          <strong>${c.NOME}</strong> (${c.SIGLA})
          <br>
          Tipo: <b>${c.TIPO_MEDIA}</b>
          ${c.PESO !== null ? ` — Peso: ${c.PESO}%` : ""}
        </div>

        <button class="btn-excluir-comp" data-id="${c.ID}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      item.querySelector(".btn-excluir-comp")
        .addEventListener("click", () => removerComponente(c.ID));

      container.appendChild(item);
    });

  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Erro ao carregar componentes.</p>";
  }
}


// =========================================
// 1️⃣3️⃣ REMOVER COMPONENTE
// =========================================
async function removerComponente(id) {
  if (!confirm("Deseja realmente excluir este componente?")) return;

  try {
    const resp = await fetch(`/api/componentes/remover/${id}`, {
      method: "DELETE"
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert("Erro: " + dados.message);
      return;
    }

    alert("Componente removido!");
    carregarComponentes();

  } catch (e) {
    console.error("Erro ao excluir:", e);
    alert("Erro ao excluir componente.");
  }
}
