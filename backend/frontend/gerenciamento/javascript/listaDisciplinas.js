// =========================================
// UTILITÁRIO
// =========================================
const $ = (id) => document.getElementById(id);

// Curso ativo
const cursoId = localStorage.getItem("cursoId");
const usuarioId = localStorage.getItem("usuarioId"); // ⭐ CERTO

if (!cursoId) {
  alert("⚠ Erro: curso não selecionado.");
  window.location.href = "/gerenciar/html/listaCursos.html";
}

// Elementos
const lista = $("corpoTabelaDisc");
const vazio = $("vazioDisc");

// =========================================
// 1️⃣ CARREGAR DISCIPLINAS
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

    const filtradas = dados.filter((disc) =>
      disc.NOME.toLowerCase().includes(filtro.toLowerCase()) ||
      disc.CODIGO.toLowerCase().includes(filtro.toLowerCase()) ||
      disc.PERIODO.toLowerCase().includes(filtro.toLowerCase()) ||
      (disc.PROFESSOR_NOME || "").toLowerCase().includes(filtro.toLowerCase())
    );

    lista.innerHTML = "";
    vazio.style.display = filtradas.length === 0 ? "block" : "none";

    filtradas.forEach((disc) => {
      const row = document.createElement("div");
      row.classList.add("tabela-row");

      row.innerHTML = `
        <span><strong>${disc.NOME}</strong></span>
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

      row.querySelector(".btn-editar").addEventListener("click", () => editarDisciplina(disc));
      row.querySelector(".btn-excluir").addEventListener("click", () => removerDisciplina(disc.ID));

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
      body: JSON.stringify({ nome, codigo, sigla: disc.SIGLA, periodo })
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
// 4️⃣ REMOVER DISCIPLINA
// =========================================
async function removerDisciplina(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    const resp = await fetch(`/api/disciplinas/remover/${id}`, { method: "DELETE" });
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
// 5️⃣ + NOVA DISCIPLINA
// =========================================
$("btnNovaDisc").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_disciplina.html";
});

// =========================================
// 6️⃣ + NOVA TURMA
// =========================================
$("btnNovaTurma").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_turma.html";
});

// =========================================
// 7️⃣ MODAL - COMPONENTE DE NOTA
// =========================================
const modal = $("modalComponente");
const btnAbrir = $("btnComponenteNota");
const btnFecharX = $("btnFecharModal");
const btnFechar = $("btnFechar");
const btnSalvar = $("btnSalvarComponente");

btnAbrir.addEventListener("click", () => {
  modal.style.display = "flex";
  carregarDisciplinasParaSelect();
});

btnFecharX.onclick = btnFechar.onclick = () => modal.style.display = "none";

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// =========================================
// 8️⃣ ALTERNAR PESO DA MÉDIA
// =========================================
$("mediaSimples").addEventListener("change", () => {
  $("campoPeso").style.display = "none";
});

$("mediaPonderada").addEventListener("change", () => {
  $("campoPeso").style.display = "block";
});

// =========================================
// 9️⃣ POPULAR DISCIPLINAS DO SELECT
// =========================================
async function carregarDisciplinasParaSelect() {
  const cmpDisc = $("cmpDisc");
  cmpDisc.innerHTML = `<option value="">Selecione...</option>`;

  try {
    const resp = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const dados = await resp.json();

    dados.forEach(d => {
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
// 🔟 SALVAR COMPONENTE DE NOTA (CORRIGIDO FINAL)
// =========================================
btnSalvar.addEventListener("click", async () => {

  const disciplinaId = $("cmpDisc").value;
  const nome = $("cmpNome").value.trim();
  const sigla = $("cmpSigla").value.trim();
  const descricao = $("cmpDesc").value.trim();
  const tipoMedia = document.querySelector("input[name='tipoMedia']:checked").value;

  // ⭐ REGRA DO ORACLE
  let peso = null;

  if (tipoMedia === "ponderada") {
    const valor = $("cmpPeso").value.trim();

    if (valor === "" || isNaN(Number(valor))) {
      alert("Informe um peso válido para média PONDERADA.");
      return;
    }

    peso = Number(valor);  // Ponderada exige número
  }

  if (tipoMedia === "simples") {
    peso = null; // Simples exige NULL
  }

  if (!disciplinaId || !nome || !sigla) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Erro: usuário não identificado.");
    return;
  }

  const dados = {
    disciplinaId,
    nome,
    sigla,
    descricao,
    tipoMedia,
    peso, // ⭐ Agora 100% compatível com a constraint
    usuario_id: Number(usuarioId)
  };

  try {
    const resp = await fetch("/api/componentes/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resp.json();

    if (!resp.ok) {
      return alert("Erro ao criar componente:\n" + resultado.message);
    }

    alert("Componente criado com sucesso!");
    modal.style.display = "none";

  } catch (e) {
    console.error(e);
    alert("Erro ao criar componente!");
  }
});

// =========================================
// 1️⃣1️⃣ SUB-MODAL — LISTAR COMPONENTES
// =========================================
const subModal = $("modalListaComponentes");
const btnVerComps = $("btnVerComponentes");
const listaCompsContainer = $("listaComponentesContainer");

btnVerComps.addEventListener("click", async () => {
  const discId = $("cmpDisc").value;

  if (!discId) {
    alert("Selecione uma disciplina primeiro!");
    return;
  }

  await carregarComponentesDaDisciplina(discId);
  subModal.style.display = "flex";
});

$("btnFecharListaComp").onclick = () => subModal.style.display = "none";

subModal.onclick = (e) => {
  if (e.target === subModal) subModal.style.display = "none";
};

// =========================================
// 1️⃣2️⃣ CARREGAR COMPONENTES
// =========================================
async function carregarComponentesDaDisciplina(discId) {
  try {
    const resp = await fetch(`/api/componentes/listar/${discId}`);
    const comps = await resp.json();

    if (!resp.ok || comps.length === 0) {
      listaCompsContainer.innerHTML =
        `<p style="text-align:center; color:#666;">Nenhum componente cadastrado.</p>`;
      return;
    }

    listaCompsContainer.innerHTML = comps.map(c => `
      <div class="comp-item">
        <div>
          <strong>${c.NOME} (${c.SIGLA})</strong><br>
          <small>${c.DESCRICAO || ""}</small>
        </div>

        <div class="comp-acoes">
          <button class="acao-btn" onclick="editarComponente(${c.ID})">
            <i class="fa-solid fa-pen"></i>
          </button>

          <button class="acao-btn" onclick="excluirComponente(${c.ID}, ${discId})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join("");

  } catch (e) {
    console.error(e);
    listaCompsContainer.innerHTML =
      `<p style="text-align:center; color:#666;">Erro ao carregar.</p>`;
  }
}

// =========================================
// 1️⃣3️⃣ EDITAR COMPONENTE
// =========================================
async function editarComponente(id) {
  const novoNome = prompt("Novo nome do componente:");
  if (!novoNome) return;

  try {
    const resp = await fetch(`/api/componentes/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome })
    });

    if (!resp.ok) return alert("Erro ao editar componente.");

    alert("Atualizado com sucesso!");
    carregarComponentesDaDisciplina($("cmpDisc").value);

  } catch (e) {
    console.error(e);
  }
}

// =========================================
// 1️⃣4️⃣ EXCLUIR COMPONENTE
// =========================================
async function excluirComponente(id, discId) {
  if (!confirm("Excluir este componente?")) return;

  try {
    const resp = await fetch(`/api/componentes/remover/${id}`, {
      method: "DELETE"
    });

    if (!resp.ok) return alert("Erro ao excluir componente.");

    alert("Componente removido!");
    carregarComponentesDaDisciplina(discId);

  } catch (e) {
    console.error(e);
  }
}
