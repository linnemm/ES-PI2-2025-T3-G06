// Seletores principais
const inputBusca = document.getElementById("buscaInstituicao");
const btnBusca = document.getElementById("btnBuscarInstituicao");
const lista = document.getElementById("listaInstituicoes");
const cards = document.querySelectorAll(".card");

// Mensagem caso nada seja encontrado
const mensagemVazia = document.createElement("p");
mensagemVazia.textContent = "Nenhuma instituição encontrada.";
mensagemVazia.classList.add("mensagem-vazia");
mensagemVazia.style.display = "none";
mensagemVazia.style.textAlign = "center";
mensagemVazia.style.color = "#777";
mensagemVazia.style.marginTop = "20px";
lista.parentNode.insertBefore(mensagemVazia, lista.nextSibling);

// Função de busca
function filtrarInstituicoes() {
const termo = inputBusca.value.toLowerCase().trim();
let resultados = 0;

cards.forEach((card) => {
const texto = card.innerText.toLowerCase();
const visivel = texto.includes(termo);
card.style.display = visivel ? "flex" : "none";
if (visivel) resultados++;
});

mensagemVazia.style.display = resultados === 0 ? "block" : "none";
}

// Eventos
btnBusca.addEventListener("click", filtrarInstituicoes);
inputBusca.addEventListener("keyup", filtrarInstituicoes);