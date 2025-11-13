import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/userModel";
import { enviarEmail } from "../services/emailService";
import oracledb from "oracledb";

// ======================= CADASTRO =======================
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    // Verifica se o usuário já existe
    const existe = await findUserByEmail(email);
    if (existe && existe.length > 0) {
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    // Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await createUser(nome, email, telefone, senhaCriptografada);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

// ======================= LOGIN =======================
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const usuarios = await findUserByEmail(email);
  if (!usuarios || usuarios.length === 0) {
    return res.status(401).json({ message: "Usuário não encontrado" });
  }

  const user = usuarios[0];
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

  return res.json({
    message: "Login realizado com sucesso!",
    token,
    userId: user.ID,
    primeiroAcesso: user.PRIMEIRO_ACESSO === 1
  });
};

// ======================= ESQUECI MINHA SENHA =======================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "E-mail não encontrado" });
    }

    // Gera token de redefinição (expira em 15 minutos)
    const token = jwt.sign({ email }, "chave_secreta_do_token", {
      expiresIn: "15m",
    });

    // 🔹 Detecta automaticamente o host (localhost ou IP real da rede)
    const host = req.headers.host || "localhost:3000"; // Ex: "192.168.0.105:3000"
    const baseURL = `http://${host}`;

    // Monta link completo de redefinição (acessível no PC e celular)
    const link = `${baseURL}/html/RedefinirSenha.html?token=${token}`;

    // Corpo do e-mail
    const html = `
      <h2>Redefinição de senha - NotaDez</h2>
      <p>Olá!</p>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="${link}" target="_blank">Redefinir minha senha</a>
      <p>Este link expira em 15 minutos.</p>
      <hr>
      <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
    `;

    // Envia e-mail com link dinâmico
    await enviarEmail(email, "Redefinição de senha - NotaDez", html);

    return res.json({
      message: "E-mail de recuperação enviado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ message: "Erro ao enviar e-mail" });
  }
};

// ======================= REDEFINIR SENHA =======================
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    // Valida e decodifica o token recebido
    const decoded: any = jwt.verify(token, "chave_secreta_do_token");
    const email = decoded.email;

    // Verifica se o usuário existe
    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Criptografa a nova senha
    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha no banco Oracle
    const connection = await oracledb.getConnection({
      user: "PROJETO",
      password: "projeto",
      connectString: "localhost:1521/XEPDB1",
    });

    await connection.execute(
      `UPDATE usuarios SET senha = :senha WHERE email = :email`,
      [novaSenhaCriptografada, email],
      { autoCommit: true }
    );

    await connection.close();

    return res.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return res
      .status(400)
      .json({ message: "Token inválido ou expirado. Solicite novamente." });
  }
};
