// Autoria: Livia 

// MOSTRAR / OCULTAR SENHA

// Seleciona o input da senha no HTML
const senha = document.getElementById("senha");

// Seleciona o ícone que alterna a visibilidade da senha
const toggle = document.getElementById("togglePassword");

// Verifica se ambos existem antes de adicionar eventos
if (toggle && senha) {
  toggle.addEventListener("click", () => {
    const isPassword = senha.type === "password";
    senha.type = isPassword ? "text" : "password";
    toggle.classList.toggle("visible", isPassword);
  });
}

// ENVIO DO FORMULÁRIO (LOGIN)

// Seleciona o formulário de login
const form = document.getElementById("formLogin");

// Se o formulário existir...
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede recarregar a página automaticamente

    const email = form.querySelector('input[type="email"]').value.trim();
    const senhaValor = senha.value.trim();

    if (!email || !senhaValor) {
      alert("⚠️ Preencha todos os campos!");
      return;
    }

    const botao = form.querySelector("button");
    botao.disabled = true;
    botao.innerText = "Entrando...";

    try {
      // LOGIN
      const resposta = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: senhaValor }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert("❌ " + (dados.message || "Erro ao fazer login."));
        return;
      }

      // SALVAR TOKEN
      if (dados.token) {
        localStorage.setItem("token", dados.token);
      }

      // SALVAR DADOS DO USUÁRIO
      if (dados.usuario) {
        localStorage.setItem("usuarioId", dados.usuario.id);
        localStorage.setItem("usuarioNome", dados.usuario.nome);
        localStorage.setItem("usuarioEmail", dados.usuario.email);
      }

      // DEFINIR PRIMEIRO ACESSO
      const primeiroAcesso = dados.primeiroAcesso === true;
      localStorage.setItem("primeiroAcesso", primeiroAcesso ? "true" : "false");

      // REDIRECIONAMENTO 1 → PRIMEIRO ACESSO = CADASTRAR INSTITUIÇÃO
      if (primeiroAcesso) {
        window.location.href = "/gerenciar/html/cadastro_instituicao.html";
        return;
      }

      // SE NÃO FOR PRIMEIRO ACESSO → VERIFICAR INSTITUIÇÃO
      const usuarioId = dados.usuario.id;
      const respInst = await fetch(`/api/instituicoes/listar/${usuarioId}`);
      let instituicoes = [];

      try {
        instituicoes = await respInst.json();
      } catch (e) {
        instituicoes = [];
      }

      // ERRO OU NENHUMA INSTITUIÇÃO → REDIRECIONAR
      if (!respInst.ok || instituicoes.length === 0) {
        window.location.href = "/gerenciar/html/cadastro_instituicao.html";
        return;
      }

      // Pegamos a primeira instituição cadastrada
      const instituicaoId = instituicoes[0].ID;
      localStorage.setItem("instituicaoId", instituicaoId);

      // VERIFICAR SE EXISTE CURSO
      const respCursos = await fetch(`/api/cursos/listar/${instituicaoId}`);

      let cursos = [];
      try {
        cursos = await respCursos.json();
      } catch (e) {
        cursos = [];
      }

      // ERRO ou Nenhum curso → cadastrar curso
      if (!respCursos.ok || !Array.isArray(cursos) || cursos.length === 0) {
        window.location.href = "/gerenciar/html/cadastro_curso.html";
        return;
      }

      // SE TUDO OK → IR PARA DASHBOARD
      window.location.href = "/gerenciar/html/dashboard.html";

    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("❌ Erro ao conectar com o servidor.");
    } finally {
      botao.disabled = false;
      botao.innerText = "Entrar";
    }
  });
}

// ENTER vai para o próximo campo e, no último, envia o form

// Seleciona todos os inputs dentro do formulário de login
const inputsLogin = document.querySelectorAll("#formLogin input");

if (inputsLogin) {
  inputsLogin.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const isLast = index === inputsLogin.length - 1;

        if (isLast) {
          form.requestSubmit();
        } else {
          inputsLogin[index + 1].focus();
        }
      }
    });
  });
}

// VALIDAÇÃO DE EMAIL AO SAIR DO CAMPO (BLUR)

// Seleciona o input de email
const emailInput = document.getElementById("email");

if (emailInput) {
  emailInput.addEventListener("blur", () => {
    const valor = emailInput.value.trim();

    const ehEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    if (valor !== "" && !ehEmail) {
      alert("⚠️ Digite um e-mail válido.");
      emailInput.focus();
    }
  });
}
