import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/userModel";
import { enviarEmail } from "../services/emailService";
import oracledb from "oracledb";

// ***** CADASTRO *****
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    // Verifica se o usuário já existe
    const existe = await findUserByEmail(email);
    if (existe && existe.length > 0) {
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco
    await createUser(nome, email, telefone, senhaCriptografada);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

// ***** LOGIN *****
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  // Procura o usuário no banco
  const usuarios = await findUserByEmail(email);

  if (!usuarios || usuarios.length === 0) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const user = usuarios[0]; //  usuarioDB

  // Compara senha criptografada
  const senhaCorreta = await bcrypt.compare(senha, user.SENHA);
  if (!senhaCorreta) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  // Gera token JWT
  const token = jwt.sign(
    { id: user.ID, email: user.EMAIL },
    "chave_secreta_do_token", 
    { expiresIn: "15min" }
  );

  // Retorna resposta
  return res.json({
    message: "Login realizado com sucesso!",
    token
  });
};

// *** ESQUECI MINHA SENHA ***
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "E-mail não encontrado" });
    }

    // Gera token de redefinição
    const token = jwt.sign({ email }, "chave_secreta_do_token", { expiresIn: "15m" });

    // Monta o link e o HTML do e-mail
    const link = `http://127.0.0.1:8080/frontend/html/RedefinirSenha.html?token=${token}`;
    const html = `
      <h2>Redefinição de senha - NotaDez</h2>
      <p>Olá,</p>
      <p>Para redefinir sua senha clique no link abaixo para continuar:</p>
      <a href="${link}" target="_blank">Redefinir minha senha</a>
      <p>Este link expira em 15 minutos.</p>
    `;

    // Envia o e-mail
    await enviarEmail(email, "Redefinição de senha - NotaDez", html);

    return res.json({ message: "E-mail de recuperação enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao enviar e-mail" });
  }
};

// *** REDEFINIR SENHA ***
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    // "jwt.verify" decodifica e valida o token com a mesma chave usada para criá-lo
    const decoded: any = jwt.verify(token, "chave_secreta_do_token");
    // extrai o e-mail contido dentro do token (de 'Esqueci minha senha')
    const email = decoded.email;

    // verifica se existe um usuário com esse e-mail no banco
    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // criptografa a nova senha com bcrypt antes de salvar no banco 
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10); // 10 = nível de segurança

    // abre conexão direta com o banco de dados
    const connection = await oracledb.getConnection({
      user: "PROJETO",
      password: "projeto",
      connectString: "localhost:1521/XEPDB1",
    });

    // executa o comando SQL (update) para atualizar a senha do usuário
    await connection.execute(
      `UPDATE usuarios SET senha = :senha WHERE email = :email`,
      [novaSenhaCriptografada, email],
      { autoCommit: true }
    );

    await connection.close();

    return res.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }
};
