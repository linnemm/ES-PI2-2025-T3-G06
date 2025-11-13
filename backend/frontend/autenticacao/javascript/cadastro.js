/* ================= MOSTRAR / OCULTAR SENHA ================= */

// Campos de senha
const senha1 = document.getElementById("password1");
const senha2 = document.getElementById("password2");
const toggle1 = document.getElementById("togglePassword");
const toggle2 = document.getElementById("togglePassword2");

// Função para alternar visibilidade
function toggleSenha(input, toggle) {
  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggle.classList.toggle("visible", isPassword);
  });
}

if (senha1 && toggle1) toggleSenha(senha1, toggle1);
if (senha2 && toggle2) toggleSenha(senha2, toggle2);


/* ================= ENVIO DO FORMULÁRIO ================= */

const form = document.getElementById('formCadastro');
const errorMsg = document.getElementById('errorMsg');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = form.querySelector('input[placeholder="Nome"]').value.trim();
    const sobrenome = form.querySelector('input[placeholder="Sobrenome"]').value.trim();
    const email = form.querySelector('input[placeholder="E-mail"]').value.trim();
    const telefone = form.querySelector('input[placeholder="Telefone"]').value.trim();
    const senha1Valor = senha1.value.trim();
    const senha2Valor = senha2.value.trim();

    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    // validações
    if (senha1Valor.length < 6) {
      errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      errorMsg.style.display = 'block';
      return;
    }

    if (senha1Valor !== senha2Valor) {
      errorMsg.textContent = 'As senhas não coincidem.';
      errorMsg.style.display = 'block';
      return;
    }

    const nomeCompleto = `${nome} ${sobrenome}`;

    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;

      const resposta = await fetch(`${baseURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCompleto,
          email,
          telefone,
          senha: senha1Valor
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("✅ " + (dados.message || "Cadastro realizado com sucesso!"));
        form.reset();
        
        // Caminho CORRETO (sem baseURL)
        window.location.href = "/auth/html/login.html";
      } else {
        errorMsg.textContent = dados.message || "Erro ao cadastrar usuário.";
        errorMsg.style.display = 'block';
      }

    } catch (erro) {
      console.error("Erro:", erro);
      errorMsg.textContent = "Erro ao conectar com o servidor.";
      errorMsg.style.display = 'block';
    }
  });
}
