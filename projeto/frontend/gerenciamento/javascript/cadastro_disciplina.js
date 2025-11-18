//  autoria por alycia bond


const $ = (id) => document.getElementById(id);

// usuário logado
const userId = localStorage.getItem("usuarioId");

if (!userId) {
  alert("⚠ Erro: usuário não identificado. Faça login novamente.");
  window.location.href = "/auth/html/login.html";
}

// pegar parâmetros da URL (instituição e curso)
const params = new URLSearchParams(window.location.search);

let instituicaoId = params.get("inst");
let cursoId = params.get("curso");

// Se não vier instituição, volta
if (!instituicaoId) {
  alert("⚠ Instituição não selecionada.");
  window.location.href = "/gerenciar/html/dashboard.html";
}

// carregar instituições e cursos
async function carregarInstituicoes() {
  try {
    const resp = await fetch(`/api/instituicoes/listar/${userId}`);
    const lista = await resp.json();

    lista.forEach(inst => {
      const opt = document.createElement("option");
      opt.value = inst.ID;
      opt.textContent = inst.NOME;
      $("instituicao").appendChild(opt);
    });

    // Seleciona automaticamente a instituição
    $("instituicao").value = instituicaoId;

    // Agora carregar cursos correspondentes
    await carregarCursos();

  } catch (e) {
    console.error("Erro ao carregar instituições:", e);
  }
}

async function carregarCursos() {
  $("curso").innerHTML = `<option value="">Carregando cursos...</option>`;

  try {
    const resp = await fetch(`/api/cursos/listar/${instituicaoId}`);
    const lista = await resp.json();

    $("curso").innerHTML = `<option value="">Selecione um curso</option>`;

    lista.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.ID;
      opt.textContent = c.NOME;
      $("curso").appendChild(opt);
    });

    // Seleciona automaticamente
    if (cursoId) $("curso").value = cursoId;

  } catch (e) {
    console.error("Erro ao carregar cursos:", e);
  }
}

// Quando mudar instituição manualmente
$("instituicao").addEventListener("change", () => {
  instituicaoId = $("instituicao").value;
  carregarCursos();
});

// Quando mudar curso
$("curso").addEventListener("change", () => {
  cursoId = $("curso").value;
});

// salvar disciplina
$("formDisciplina").addEventListener("submit", async (e) => {
  e.preventDefault();

  instituicaoId = $("instituicao").value;
  cursoId = $("curso").value;

  const nome = $("nome").value.trim();
  const sigla = $("sigla").value.trim();
  const codigo = $("codigo").value.trim();
  const periodo = $("periodo").value.trim();

  if (!instituicaoId) return alert("Selecione uma instituição.");
  if (!cursoId) return alert("Selecione um curso.");
  if (!nome || !sigla || !codigo || !periodo) {
    return alert("Preencha todos os campos!");
  }

  // verificar se já existe disciplina com mesmo código
  try {
    const respCheck = await fetch(`/api/disciplinas/curso/${cursoId}`);
    const disciplinas = await respCheck.json();

    const existeCodigo = disciplinas.some(
      d => d.CODIGO.toLowerCase() === codigo.toLowerCase()
    );

    if (existeCodigo) {
      return alert("❌ Já existe uma disciplina com esse CÓDIGO neste curso.");
    }

  } catch (erro) {
    console.error("Erro ao verificar código:", erro);
  }

  // enviar para o backend
  try {
    const resp = await fetch("/api/disciplinas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        sigla,
        codigo,
        periodo,
        usuarioId: Number(userId),
        instituicaoId,
        cursoId
      })
    });

    const dados = await resp.json();

    if (!resp.ok) return alert("Erro: " + dados.message);

    alert("📘 Disciplina cadastrada com sucesso!");

    window.location.href =
      `/gerenciar/html/listaDisciplinas.html?inst=${instituicaoId}&curso=${cursoId}`;

  } catch (e) {
    console.error(e);
    alert("Erro ao cadastrar disciplina.");
  }
});

// cancelar e voltar
$("btnCancelar").addEventListener("click", () => history.back());

// entrar com Enter nos campos
const inputs = document.querySelectorAll("#formDisciplina input, #formDisciplina select");

inputs.forEach((input, i) => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ultimo = i === inputs.length - 1;
      if (ultimo) $("formDisciplina").requestSubmit();
      else inputs[i + 1].focus();
    }
  });
});

// inicialização
carregarInstituicoes();
