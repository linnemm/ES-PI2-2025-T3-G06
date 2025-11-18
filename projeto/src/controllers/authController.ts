// Autora: Alinne

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

// configurações do token JWT
const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta_notadez";
const JWT_EXPIRES = "2h";

// CADASTRAR USUARIO
export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    // verifica se já existe usuário com o mesmo e-mail
    const existe = await findUserByEmail(email);
    if (existe) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    // criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // salva usuário no banco
    await createUser(nome, email, telefone, senhaCriptografada);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
};


// LOGIN USUARIO
export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // verifica se o usuário existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    // compara senha enviada com a senha criptografada
    const senhaCorreta = await bcrypt.compare(senha, user.SENHA);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // gera token JWT
    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // retorna dados do usuário logado
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
    return res.status(500).json({ message: "Erro ao fazer login." });
  }
};


// RETORNAR PERFIL DO USUARIO LOGADO
export const getMe = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId; // vem do middleware JWT
    if (!usuarioId) return res.status(401).json({ message: "Não autenticado." });

    // busca o usuário no banco
    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    // retorna dados básicos do usuário
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


// ATUALIZAR EMAIL
export const updateEmailController = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId;
    const { novoEmail, senha } = req.body;

    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    // verifica senha atual
    const ok = await bcrypt.compare(senha, user.SENHA);
    if (!ok) return res.status(401).json({ message: "Senha incorreta." });

    // atualiza email
    await updateUserEmail(usuarioId, novoEmail);

    return res.json({ message: "E-mail atualizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar e-mail:", error);
    return res.status(500).json({ message: "Erro ao atualizar e-mail." });
  }
};


// ATUALIZAR SENHA
export const updatePasswordController = async (req: any, res: Response) => {
  try {
    const usuarioId = req.usuarioId;
    const { senhaAtual, novaSenha } = req.body;

    // verifica se usuario existe
    const user = await findUserById(usuarioId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    // verifica senha atual
    const ok = await bcrypt.compare(senhaAtual, user.SENHA);
    if (!ok) return res.status(401).json({ message: "Senha atual incorreta." });

    // criptografa nova senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await updateUserPassword(usuarioId, hash);

    return res.json({ message: "Senha alterada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return res.status(500).json({ message: "Erro ao atualizar senha." });
  }
};

// ESQUECI MINHA SENHA (gera e envia token por email)
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "E-mail não encontrado." });
    }

    // token (valido por 15 minutos)
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });

    // link de recuperação enviado ao usuario
    const link = `http://${req.headers.host}/auth/html/RedefinirSenha.html?token=${token}`;

    // envio do email - mensagem
    await enviarEmail(
      email,
      "Redefinição de senha - NotaDez",
      `
      <h2>Redefinição de senha</h2>
      <p>Clique no link abaixo:</p>
      <a href="${link}">${link}</a>
      <p>Expira em 15 minutos.</p>
    `
    );

    return res.json({ message: "E-mail enviado com sucesso!" });

  } catch (error) {
    console.error("Erro forgot-password:", error);
    return res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
};


// RESETAR SENHA (USANDO TOKEN ENVIADO POR EMAIL)
export const resetPassword = async (req: Request, res: Response) => {
  const { token, novaSenha } = req.body;

  try {
    // verifica e decodifica token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // verifica se o usuario existe
    const user = await findUserByEmail(decoded.email);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    // atualiza senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await updateUserPassword(user.ID, hash);

    return res.json({ message: "Senha redefinida com sucesso!" });

  } catch (error) {
    console.error("Erro reset-password:", error);
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
};
