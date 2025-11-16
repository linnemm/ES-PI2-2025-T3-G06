/* ================= MOSTRAR / OCULTAR SENHA ================= */

// Campos de senha (1ª e 2ª digitação)
const senha1 = document.getElementById("password1");
const senha2 = document.getElementById("password2");

// Ícones de mostrar/ocultar senha
const toggle1 = document.getElementById("togglePassword");
const toggle2 = document.getElementById("togglePassword2");

// Função genérica para alternar visibilidade da senha
function toggleSenha(input, toggle) {
  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password"; // verifica se está "password"
    input.type = isPassword ? "text" : "password"; // muda para "text" ou "password"
    toggle.classList.toggle("visible", isPassword); // troca o ícone
  });
}

// Ativa o comportamento para os dois campos, se existirem
if (senha1 && toggle1) toggleSenha(senha1, toggle1);
if (senha2 && toggle2) toggleSenha(senha2, toggle2);


/* ================= ENVIO DO FORMULÁRIO ================= */

// Formulário principal
const form = document.getElementById('formCadastro');

// Elemento onde aparecem mensagens de erro
const errorMsg = document.getElementById('errorMsg');

// Verifica se o formulário existe
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // impede recarregar página automaticamente

    // Captura dos valores digitados
    const nome = form.querySelector('input[placeholder="Nome"]').value.trim();
    const sobrenome = form.querySelector('input[placeholder="Sobrenome"]').value.trim();
    const email = form.querySelector('input[placeholder="E-mail"]').value.trim();
    const telefone = form.querySelector('input[placeholder="Telefone"]').value.trim();
    const senha1Valor = senha1.value.trim();
    const senha2Valor = senha2.value.trim();

    // Reset da mensagem de erro
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    // ----- VALIDAÇÕES -----

    // Senha com mínimo de 6 caracteres
    if (senha1Valor.length < 6) {
      errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      errorMsg.style.display = 'block';
      return;
    }

    // Confirmação da senha
    if (senha1Valor !== senha2Valor) {
      errorMsg.textContent = 'As senhas não coincidem.';
      errorMsg.style.display = 'block';
      return;
    }

    // Monta nome completo
    const nomeCompleto = `${nome} ${sobrenome}`;

    try {
      // Monta automaticamente a URL do servidor
      const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;

      // Envia os dados para o backend (rota de cadastro)
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

      // SUCESSO NO CADASTRO
      if (resposta.ok) {
        alert("✅ " + (dados.message || "Cadastro realizado com sucesso!"));
        form.reset(); // limpa o formulário
        
        // Redireciona para a tela de login
        window.location.href = "/auth/html/login.html";

      } else {
        // Erros vindos do backend (ex: email já existe)
        errorMsg.textContent = dados.message || "Erro ao cadastrar usuário.";
        errorMsg.style.display = 'block';
      }

    } catch (erro) {
      // Caso não consiga conectar ao backend
      console.error("Erro:", erro);
      errorMsg.textContent = "Erro ao conectar com o servidor.";
      errorMsg.style.display = 'block';
    }
  });
}
 
// ========================================================
// ENTER vai para o próximo campo e, no último, envia o form
// ========================================================

// Seleciona todos os inputs dentro do formulário
const inputs = document.querySelectorAll("#formCadastro input");

// Adiciona comportamento em cada input
inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {

    // Se apertar ENTER
    if (e.key === "Enter") {
      e.preventDefault(); // impede comportamento padrão

      // Verifica se é o último campo
      const isLast = index === inputs.length - 1;

      if (isLast) {
        // Último campo → envia formulário automaticamente
        form.requestSubmit();
      } else {
        // Caso contrário, vai para o próximo input
        inputs[index + 1].focus();
      }
    }
  });
});
