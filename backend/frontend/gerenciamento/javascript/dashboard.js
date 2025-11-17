// =============================================
//  DASHBOARD — NotaDez
// =============================================

// ID do usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Segurança básica
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}


// =============================================
//  BOTÃO INSTITUIÇÕES → DASHBOARD
// =============================================
const btnInst = document.getElementById("btnInstituicoes");

if (btnInst) {
  btnInst.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/gerenciar/html/dashboard.html";
  });
}


// =============================================
//  CARREGAR LISTA DE INSTITUIÇÕES
// =============================================
async function carregarInstituicoes(filtro = "") {
  const listaContainer = document.getElementById("listaInstituicoes");

  listaContainer.innerHTML = "<p class='mensagem-vazia'>Carregando...</p>";

  try {
    const resp = await fetch(`/api/instituicoes/listar/${usuarioId}`);
    const lista = await resp.json();

    if (!resp.ok) {
      listaContainer.innerHTML = "<p class='mensagem-vazia'>Erro ao carregar instituições.</p>";
      return;
    }

    let instituicoes = lista;

    // FILTRO DE BUSCA
    if (filtro.trim() !== "") {
      const termo = filtro.toLowerCase();
      instituicoes = lista.filter(inst =>
        inst.NOME.toLowerCase().includes(termo) ||
        inst.SIGLA.toLowerCase().includes(termo)
      );
    }

    if (instituicoes.length === 0) {
      listaContainer.innerHTML = "<p class='mensagem-vazia'>Nenhuma instituição encontrada.</p>";
      return;
    }

    listaContainer.innerHTML = "";

    // Montar cards
    instituicoes.forEach(inst => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-content">
          <h2>${inst.NOME}</h2>
          <p><strong>Sigla:</strong> ${inst.SIGLA}</p>
        </div>

        <div class="card-actions">
          <button class="edit-btn">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="remove-btn">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      `;

      // =============================
      //  ABRIR LISTA DE CURSOS (AGORA PELA URL)
      // =============================
      card.querySelector(".card-content").addEventListener("click", () => {
        window.location.href = `/gerenciar/html/listaCursos.html?inst=${inst.ID}`;
      });

      // =============================
      //  EDITAR
      // =============================
      card.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // evita abrir cursos
        window.location.href = `/gerenciar/html/editar_instituicao.html?id=${inst.ID}`;
      });

      // =============================
      //  EXCLUIR
      // =============================
      card.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        removerInstituicao(inst.ID);
      });

      listaContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    listaContainer.innerHTML = "<p class='mensagem-vazia'>Erro ao carregar instituições.</p>";
  }
}


// =============================================
//  REMOVER INSTITUIÇÃO — BLOQUEIO SE TIVER CURSOS
// =============================================
async function removerInstituicao(id) {
  if (!confirm("Tem certeza que deseja excluir esta instituição?")) return;

  try {
    const resp = await fetch(`/api/instituicoes/${id}`, {
      method: "DELETE"
    });

    const dados = await resp.json();

    if (!resp.ok) {
      alert(dados.message);
      return;
    }

    alert("Instituição removida!");
    carregarInstituicoes();

  } catch (err) {
    console.error(err);
    alert("Erro ao excluir instituição.");
  }
}


// =============================================
//  BOTÃO — NOVA INSTITUIÇÃO
// =============================================
document.getElementById("addInstituicao").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_instituicao.html";
});


// =============================================
//  BOTÃO DE BUSCA
// =============================================
document.getElementById("btnBuscarInstituicao").addEventListener("click", () => {
  const termo = document.getElementById("buscaInstituicao").value;
  carregarInstituicoes(termo);
});


// =============================================
//  ENTER NA BUSCA
// =============================================
document.getElementById("buscaInstituicao").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const termo = e.target.value;
    carregarInstituicoes(termo);
  }
});


// =============================================
//  CARREGAR AO INICIAR
// =============================================
carregarInstituicoes();
