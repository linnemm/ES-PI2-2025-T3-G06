// ============================================================
//  ROTAS DE AUTENTICAÇÃO — NotaDez
//  Organização, padronização e proteção via token
// ============================================================

import express from "express";

import {
  registerUser,             // Criar usuário
  loginUser,                // Login + token
  forgotPassword,           // Enviar e-mail de redefinição
  resetPassword,            // Redefinir senha com token
  getMe,                    // Dados do usuário logado
  updateEmailController,    // Atualizar e-mail
  updatePasswordController  // Atualizar senha
} from "../controllers/authController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

/* ============================================================
   🔓 ROTAS PÚBLICAS (Não exigem token)
   ============================================================ */

// Criar conta
router.post("/register", registerUser);

// Login — gera token JWT
router.post("/login", loginUser);

// Enviar e-mail de recuperação de senha
router.post("/forgot-password", forgotPassword);

// Redefinir senha através do link enviado para o e-mail
router.post("/reset-password", resetPassword);


/* ============================================================
   🔐 ROTAS PROTEGIDAS (Exigem token JWT)
   ============================================================ */

// Recuperar dados do usuário logado
router.get("/me", authMiddleware, getMe);

// Atualizar e-mail
router.put("/update-email", authMiddleware, updateEmailController);

// Atualizar senha
router.put("/update-password", authMiddleware, updatePasswordController);


/* ============================================================ */

export default router;
