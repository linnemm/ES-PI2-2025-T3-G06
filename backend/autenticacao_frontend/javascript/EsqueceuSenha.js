/* ==== Envio do formulário de redefinição de senha ==== */

// Captura o formulário
const form = document.getElementById("formEsqueciSenha");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita recarregar a página

    // Pega o e-mail digitado
    const email = document.getElementById("email").value.trim();

    // Verifica se foi digitado algo
    if (!email) {
      alert("⚠️ Por favor, digite um e-mail válido!");
      return;
    }

    // Desativa o botão durante o envio
    const botao = form.querySelector("button");
    botao.disabled = true;
    botao.innerText = "Enviando...";

    try {
      // Faz a requisição ao backend na porta 3000
      const resposta = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ " + (dados.message || "E-mail de redefinição enviado com sucesso!"));
        form.reset();
      } else {
        alert("❌ " + (dados.message || "Erro ao enviar o e-mail de recuperação."));
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("❌ Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    } finally {
      // Reativa o botão
      botao.disabled = false;
      botao.innerText = "Enviar";
    }
  });
}
