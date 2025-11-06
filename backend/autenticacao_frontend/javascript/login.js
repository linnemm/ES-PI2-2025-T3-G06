//  OLHO DE MOSTRAR/OCULTAR SENHA 
const senha = document.getElementById("senha");
const toggle = document.getElementById("togglePassword");

if (toggle && senha) {
  toggle.addEventListener("click", () => {
    const isPassword = senha.type === "password";
    senha.type = isPassword ? "text" : "password";
    toggle.classList.toggle("visible", isPassword);
  });
}

//  ENVIO DO FORMULÁRIO 
const form = document.getElementById("formLogin");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede o reload da página

    // Captura os valores digitados
    const email = form.querySelector('input[type="email"]').value.trim();
    const senhaValor = document.getElementById("senha").value.trim();

    // Validação básica
    if (!email || !senhaValor) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    // Desabilita o botão enquanto envia
    const botao = form.querySelector("button");
    botao.disabled = true;
    botao.innerText = "Entrando...";

    try {
      // Envia para o backend (rota /api/auth/login)
      const resposta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: senhaValor }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ Login realizado com sucesso!");

        // Armazena o token JWT no navegador
        if (dados.token) {
          localStorage.setItem("token", dados.token);
        }

        // Redireciona o usuário (ajuste o destino conforme sua página pós-login)
        window.location.href = "/html/telainicial.html";
      } else {
        alert("❌ " + (dados.message || "Erro ao fazer login."));
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("❌ Erro ao conectar com o servidor.");
    } finally {
      // Reabilita o botão
      botao.disabled = false;
      botao.innerText = "Entrar";
    }
  });
}
