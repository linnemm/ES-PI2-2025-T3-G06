/* Mostrar/Ocultar senha  */

// Pega os campos de senha e os ícones de "olhinho"
const senha1 = document.getElementById("password1");
const senha2 = document.getElementById("password2");
const toggle1 = document.getElementById("togglePassword");
const toggle2 = document.getElementById("togglePassword2");

// Função reutilizável que alterna a visibilidade da senha
function toggleSenha(input, toggle) {
  toggle.addEventListener("click", () => {
    // Verifica se o tipo atual é "password" ou "text"
    const isPassword = input.type === "password";
    // Alterna entre texto visível e oculto
    input.type = isPassword ? "text" : "password";
    // Troca a classe CSS para alterar o ícone visualmente (ex: olho aberto/fechado)
    toggle.classList.toggle("visible", isPassword);
  });
}

// Ativa o comportamento de mostrar/ocultar senha para os dois campos
if (senha1 && toggle1) toggleSenha(senha1, toggle1);
if (senha2 && toggle2) toggleSenha(senha2, toggle2);



/* Envio do formulário */

// Captura o formulário e o parágrafo onde aparecem mensagens de erro
const form = document.getElementById('formCadastro');
const errorMsg = document.getElementById('errorMsg');

// Só adiciona o evento se o formulário existir na página
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // impede o comportamento padrão de recarregar a página

    // Lê os valores digitados pelo usuário e remove espaços extras
    const nome = form.querySelector('input[placeholder="Nome"]').value.trim();
    const sobrenome = form.querySelector('input[placeholder="Sobrenome"]').value.trim();
    const email = form.querySelector('input[placeholder="E-mail"]').value.trim();
    const telefone = form.querySelector('input[placeholder="Telefone"]').value.trim();
    const senha1Valor = senha1.value.trim();
    const senha2Valor = senha2.value.trim();

    // Limpa mensagens de erro anteriores
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    // Validações básicas antes do envio
    if (senha1Valor.length < 6) {
      errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      errorMsg.style.display = 'block';
      return; // interrompe o envio
    }

    if (senha1Valor !== senha2Valor) {
      errorMsg.textContent = 'As senhas não coincidem.';
      errorMsg.style.display = 'block';
      return; // interrompe o envio
    }

    // Junta nome + sobrenome em um único campo (para enviar ao backend)
    const nomeCompleto = `${nome} ${sobrenome}`;

    try {
      // Faz a requisição para o backend (rota de cadastro)
      const resposta = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeCompleto,
          email,
          telefone,
          senha: senha1Valor
        }),
      });

      // Converte a resposta em JSON
      const dados = await resposta.json();

      // Se o backend responder com sucesso (status 200 ou 201)
      if (resposta.ok) {
        alert("✅ " + (dados.message || "Cadastro realizado com sucesso!"));
        form.reset(); // limpa os campos do formulário
        // Redireciona o usuário para a tela de login
        window.location.href = "/html/login.html";
      } else {
        // Mostra mensagem de erro retornada pelo backend
        errorMsg.textContent = dados.message || "Erro ao cadastrar usuário.";
        errorMsg.style.display = 'block';
      }

    } catch (erro) {
      // Caso ocorra erro de conexão ou exceção
      console.error("Erro ao conectar com o servidor:", erro);
      errorMsg.textContent = "Erro ao conectar com o servidor.";
      errorMsg.style.display = 'block';
    }
  });
}
