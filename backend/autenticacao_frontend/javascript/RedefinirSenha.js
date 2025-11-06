/* ==== REDEFINIÇÃO DE SENHA - Lógica da tela ==== */

// Seleciona o formulário e a área de mensagens de erro
const form = document.getElementById("formRedefinirSenha");
const errorMsg = document.getElementById("errorMsg");

// Seleciona os campos de senha e ícones de olho
const senha1 = document.getElementById("password1");
const senha2 = document.getElementById("password2");
const toggle1 = document.getElementById("togglePassword");
const toggle2 = document.getElementById("togglePassword2");

/* ==== Mostrar/Ocultar Senha ==== */
function toggleSenha(input, toggle) {
  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggle.classList.toggle("visible", isPassword);
  });
}

// Aplica o comportamento aos dois campos
if (senha1 && toggle1) toggleSenha(senha1, toggle1);
if (senha2 && toggle2) toggleSenha(senha2, toggle2);

/* ==== Captura o token do link ==== */
const token = new URLSearchParams(window.location.search).get("token");

// Se não houver token na URL, mostra alerta e redireciona
if (!token) {
  alert("❌ Link inválido! O token de redefinição não foi encontrado.");
  window.location.href = "/html/login.html";
}

/* ==== Envio do formulário ==== */
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // impede o recarregamento da página

  const novaSenha = senha1.value.trim();
  const confirmar = senha2.value.trim();

  errorMsg.style.display = "none";
  errorMsg.textContent = "";

  // --- Validações básicas ---
  if (novaSenha.length < 6) {
    errorMsg.textContent = "A senha deve ter pelo menos 6 caracteres.";
    errorMsg.style.display = "block";
    return;
  }

  if (novaSenha !== confirmar) {
    errorMsg.textContent = "As senhas não coincidem.";
    errorMsg.style.display = "block";
    return;
  }

  // Desativa o botão enquanto envia
  const botao = form.querySelector("button");
  botao.disabled = true;
  botao.innerText = "Redefinindo...";

  try {
    // Envia pro backend (porta 3000)
    const resposta = await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    });

    const dados = await resposta.json();

    // Se o backend responder com sucesso
    if (resposta.ok) {
      alert("✅ " + (dados.message || "Senha redefinida com sucesso!"));
      window.location.href = "/html/login.html";
    } else {
      alert("❌ " + (dados.message || "Erro ao redefinir senha."));
    }
  } catch (erro) {
    // Em caso de erro de conexão
    console.error("Erro ao conectar com o servidor:", erro);
    alert("⚠️ Erro ao conectar com o servidor. Tente novamente mais tarde.");
  } finally {
    // Reativa o botão
    botao.disabled = false;
    botao.innerText = "Redefinir senha";
  }
});
