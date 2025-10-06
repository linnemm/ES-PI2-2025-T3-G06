// Exibe a lista de instituições cadastradas

const listaUL = document.getElementById("listaInstituicoes");
function renderLista() {
  const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];
  listaUL.innerHTML = "";

  if (lista.length === 0) {
    listaUL.innerHTML = "<li style='text-align:center; color:#666;'>Nenhuma instituição cadastrada ainda.</li>";
    return;
  }

  lista.forEach((inst, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="info">
        <strong>${inst.nome}</strong> <span>(${inst.sigla})</span>
      </div>
      <div class="acoes">
        <button class="editar" data-index="${index}">Editar</button>
        <button class="remover" data-index="${index}">Remover</button>
      </div>
    `;
    listaUL.appendChild(li);
  });
}

// Botões de Editar e Remover 
listaUL.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const index = btn.dataset.index;
  const lista = JSON.parse(localStorage.getItem("listaInstituicoes")) || [];

  if (btn.classList.contains("remover")) {
    lista.splice(index, 1);
    localStorage.setItem("listaInstituicoes", JSON.stringify(lista));
    renderLista();
  }

  if (btn.classList.contains("editar")) {
    const inst = lista[index];
    document.getElementById("nome").value = inst.nome;
    document.getElementById("sigla").value = inst.sigla;
    lista.splice(index, 1);
    localStorage.setItem("listaInstituicoes", JSON.stringify(lista));
    renderLista();
  }
});

// Exibe a lista assim que salvar
document.addEventListener("DOMContentLoaded", renderLista);