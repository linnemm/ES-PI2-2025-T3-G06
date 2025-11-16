import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserEmail,
  updateUserPassword
} from "../models/userModel";

import { enviarEmail } from "../services/emailService";

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta_notadez";
const JWT_EXPIRES = "2h";

// ============================================================================
// 📌 REGISTRAR NOVO USUÁRIO
// ============================================================================
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    const existe = await findUserByEmail(email);
    if (existe) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    await createUser(nome, email, telefone, senhaCriptografada);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

// ============================================================================
// 📌 LOGIN
// ============================================================================
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.SENHA);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
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

// ============================================================================
// 📌 PERFIL DO USUÁRIO LOGADO
// ============================================================================
export const getMe = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId;
    if (!usuarioId) return res.status(401).json({ message: "Não autenticado." });

    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    return res.json({
      id: user.ID,
      nome: user.NOME,
      email: user.EMAIL,
      telefone: user.TELEFONE,
      primeiroAcesso: user.PRIMEIRO_ACESSO === 1
    });

  } catch (error) {
    console.error("Erro no /me:", error);
    return res.status(500).json({ message: "Erro ao carregar perfil." });
  }
};

// ============================================================================
// 📌 ATUALIZAR E-MAIL
// ============================================================================
export const updateEmailController = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId;
    const { novoEmail, senha } = req.body;

    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const ok = await bcrypt.compare(senha, user.SENHA);
    if (!ok) return res.status(401).json({ message: "Senha incorreta." });

    await updateUserEmail(usuarioId, novoEmail);

    return res.json({ message: "E-mail atualizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar e-mail:", error);
    return res.status(500).json({ message: "Erro ao atualizar e-mail." });
  }
};

// ============================================================================
// 📌 ATUALIZAR SENHA
// ============================================================================
export const updatePasswordController = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId;
    const { senhaAtual, novaSenha } = req.body;

    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const ok = await bcrypt.compare(senhaAtual, user.SENHA);
    if (!ok) return res.status(401).json({ message: "Senha atual incorreta." });

    const hash = await bcrypt.hash(novaSenha, 10);
    await updateUserPassword(usuarioId, hash);

    return res.json({ message: "Senha alterada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res.status(500).json({ message: "Erro ao atualizar senha." });
  }
};

// ============================================================================
// 📌 ESQUECI SENHA
// ============================================================================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "E-mail não encontrado." });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });

    const host = req.headers.host || "localhost:3000";
    const link = `http://${host}/auth/html/RedefinirSenha.html?token=${token}`;

    const html = `
      <h2>Redefinição de senha</h2>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${link}">${link}</a>
      <p>O link expira em 15 minutos.</p>
    `;

    await enviarEmail(email, "Redefinição de senha - NotaDez", html);

    return res.json({ message: "E-mail enviado com sucesso!" });

  } catch (error) {
    console.error("Erro forgot-password:", error);
    return res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
};

// ============================================================================
// 📌 REDEFINIR SENHA
// ============================================================================
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const hash = await bcrypt.hash(novaSenha, 10);

    await updateUserPassword(user.ID, hash);

    return res.json({ message: "Senha redefinida com sucesso!" });

  } catch (error) {
    console.error("Erro reset-password:", error);
    return res.status(400).json({ message: "Token inválido ou expirado" });
  }
};
