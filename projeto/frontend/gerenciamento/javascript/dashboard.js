// Autoria: Livia

//  DASHBOARD — NotaDez

// ID do usuário logado
const usuarioId = localStorage.getItem("usuarioId");

// Segurança básica
if (!usuarioId) {
  alert("Erro: usuário não identificado.");
  window.location.href = "/auth/html/login.html";
}

//  BOTÃO INSTITUIÇÕES → DASHBOARD

const btnInst = document.getElementById("btnInstituicoes");

if (btnInst) {
  btnInst.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/gerenciar/html/dashboard.html";
  });
}

// CARREGAR LISTA DE INSTITUIÇÕES

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

      // ABRIR LISTA DE CURSOS
      
      card.querySelector(".card-content").addEventListener("click", () => {
        window.location.href = `/gerenciar/html/listaCursos.html?inst=${inst.ID}`;
      });

      //  EDITAR — VIA PROMPT
      
      card.querySelector(".edit-btn").addEventListener("click", async (e) => {
        e.stopPropagation();

        const nomeAtual = inst.NOME;
        const siglaAtual = inst.SIGLA;

        const novoNome = prompt("Novo nome da instituição:", nomeAtual);
        if (novoNome === null) return;
        if (novoNome.trim() === "") {
          alert("O nome não pode ficar vazio.");
          return;
        }

        const novaSigla = prompt("Nova sigla:", siglaAtual);
        if (novaSigla === null) return;
        if (novaSigla.trim() === "") {
          alert("A sigla não pode ficar vazia.");
          return;
        }

        try {
          const resp = await fetch(`/api/instituicoes/${inst.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: inst.ID,  // OBRIGATÓRIO PARA O BACKEND
              nome: novoNome.trim(),
              sigla: novaSigla.trim()
            })
          });

          const dados = await resp.json();

          if (!resp.ok) {
            alert("Erro ao editar: " + dados.message);
            return;
          }

          alert("Instituição atualizada com sucesso!");
          carregarInstituicoes();

        } catch (err) {
          console.error(err);
          alert("Erro ao atualizar instituição.");
        }
      });

      // EXCLUIR
      
      card.querySelector(".remove-btn").addEventListener("click", async (e) => {
        e.stopPropagation();

        if (!confirm("Tem certeza que deseja excluir esta instituição?")) return;

        try {
          const resp = await fetch(`/api/instituicoes/${inst.ID}`, {
            method: "DELETE"
          });

          const dados = await resp.json();

          if (!resp.ok) {
            alert(dados.message);
            return;
          }

          alert("Instituição removida com sucesso!");
          carregarInstituicoes();

        } catch (err) {
          console.error(err);
          alert("Erro ao remover instituição.");
        }
      });

      listaContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    listaContainer.innerHTML = "<p class='mensagem-vazia'>Erro ao carregar instituições.</p>";
  }
}

// BOTÃO — NOVA INSTITUIÇÃO

document.getElementById("addInstituicao").addEventListener("click", () => {
  window.location.href = "/gerenciar/html/cadastro_instituicao.html";
});

// BOTÃO DE BUSCA

document.getElementById("btnBuscarInstituicao").addEventListener("click", () => {
  const termo = document.getElementById("buscaInstituicao").value;
  carregarInstituicoes(termo);
});

// ENTER NA BUSCA

document.getElementById("buscaInstituicao").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    carregarInstituicoes(e.target.value);
  }
});

// CARREGAR AO INICIAR

carregarInstituicoes();
