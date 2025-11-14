import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/userModel";
import { enviarEmail } from "../services/emailService";
import oracledb from "oracledb";

// ============================
// 📌 CADASTRAR USUÁRIO
// ============================
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    const existe = await findUserByEmail(email);
    if (existe && existe.length > 0) {
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await createUser(nome, email, telefone, senhaCriptografada);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

// ============================
// 📌 LOGIN
// ============================
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuarios = await findUserByEmail(email);

    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const user = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, user.SENHA);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL },
      "chave_secreta_do_token",
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login realizado com sucesso!",
      token,
      usuario: {
        id: user.ID,
        nome: user.NOME,
        email: user.EMAIL
      },
      primeiroAcesso: user.PRIMEIRO_ACESSO === 1
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
};

// ============================
// 📌 ESQUECI MINHA SENHA
// ============================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "E-mail não encontrado" });
    }

    const token = jwt.sign({ email }, "chave_secreta_do_token", {
      expiresIn: "15m",
    });

    const host = req.headers.host || "localhost:3000";
    const link = `http://${host}/auth/html/RedefinirSenha.html?token=${token}`;

    const html = `
      <h2>Redefinição de senha</h2>
      <p>Clique no link para redefinir sua senha:</p>
      <a href="${link}">${link}</a>
      <p>O link expira em 15 minutos.</p>
    `;

    await enviarEmail(email, "Redefinição de senha - NotaDez", html);

    return res.json({ message: "E-mail enviado com sucesso!" });

  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res.status(500).json({ message: "Erro ao enviar email" });
  }
};

// ============================
// 📌 REDEFINIR SENHA
// ============================
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    const decoded: any = jwt.verify(token, "chave_secreta_do_token");
    const email = decoded.email;

    const usuarios = await findUserByEmail(email);
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

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
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }
};
