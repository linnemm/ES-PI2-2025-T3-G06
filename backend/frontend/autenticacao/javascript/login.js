// ==================== MOSTRAR / OCULTAR SENHA ====================
const senha = document.getElementById("senha");
const toggle = document.getElementById("togglePassword");

if (toggle && senha) {
  toggle.addEventListener("click", () => {
    const isPassword = senha.type === "password";
    senha.type = isPassword ? "text" : "password";
    toggle.classList.toggle("visible", isPassword);
  });
}

// ==================== ENVIO DO FORMULÁRIO (LOGIN) ====================
const form = document.getElementById("formLogin");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede recarregar a página

    // Captura dos valores
    const email = form.querySelector('input[type="email"]').value.trim();
    const senhaValor = document.getElementById("senha").value.trim();

    // Validação básica
    if (!email || !senhaValor) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    // Desabilita o botão
    const botao = form.querySelector("button");
    botao.disabled = true;
    botao.innerText = "Entrando...";

    try {
      // Faz a requisição (caminho absoluto → funciona com localhost e IP)
      const resposta = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: senhaValor }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {

        // Salva token
        if (dados.token) {
          localStorage.setItem("token", dados.token);
        }

        // Salva ID do usuário
        if (dados.userId) {
          localStorage.setItem("userId", dados.userId);
        }

        // Salva o estado de primeiro acesso
        if (dados.primeiroAcesso === true) {
          localStorage.setItem("primeiroAcesso", "true");
        } else {
          localStorage.setItem("primeiroAcesso", "false");
        }

        // ==================== REDIRECIONAMENTO ====================
        if (dados.primeiroAcesso === true) {
          window.location.href = "/gerenciar/html/cadastro_instituicao.html";
        } else {
          window.location.href = "/gerenciar/html/dashboard.html";
        }

      } else {
        alert("❌ " + (dados.message || "Erro ao fazer login."));
      }

    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("❌ Erro ao conectar com o servidor.");
    } finally {
      botao.disabled = false;
      botao.innerText = "Entrar";
    }
  });
}
