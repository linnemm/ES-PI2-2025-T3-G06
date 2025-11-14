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

    const email = form.querySelector('input[type="email"]').value.trim();
    const senhaValor = document.getElementById("senha").value.trim();

    if (!email || !senhaValor) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    const botao = form.querySelector("button");
    botao.disabled = true;
    botao.innerText = "Entrando...";

    try {
      const resposta = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: senhaValor }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {

        // ================================
        // 🔥 SALVAR TOKEN
        // ================================
        if (dados.token) {
          localStorage.setItem("token", dados.token);
        }

        // ================================
        // 🔥 SALVAR O USUÁRIO COMPLETO
        // PARA COMPONENTE DE NOTA FUNCIONAR
        // ================================
        if (dados.usuario) {
          localStorage.setItem("usuarioId", dados.usuario.id);
          localStorage.setItem("usuarioNome", dados.usuario.nome);
          localStorage.setItem("usuarioEmail", dados.usuario.email);
        }

        // ================================
        // 🔥 SALVAR PRIMEIRO ACESSO
        // ================================
        if (dados.primeiroAcesso === true) {
          localStorage.setItem("primeiroAcesso", "true");
        } else {
          localStorage.setItem("primeiroAcesso", "false");
        }

        // ================================
        // 🔥 REDIRECIONAMENTO
        // ================================
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
