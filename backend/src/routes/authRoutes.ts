import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateEmailController,
  updatePasswordController
} from "../controllers/authController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

/* ============================================
   🔐 ROTAS DE AUTENTICAÇÃO
   Tudo que não precisa de token
============================================ */

// Criar conta
router.post("/register", registerUser);

// Login (gera token)
router.post("/login", loginUser);

// Esqueci minha senha (envia e-mail)
router.post("/forgot-password", forgotPassword);

// Redefinir senha via token recebido por e-mail
router.post("/reset-password", resetPassword);


/* ============================================
   🛡 ROTAS PROTEGIDAS PELO TOKEN
   Só funcionam se o usuário estiver logado
============================================ */

// Dados do usuário logado
router.get("/me", authMiddleware, getMe);

// Atualizar e-mail
router.put("/update-email", authMiddleware, updateEmailController);

// Atualizar senha
router.put("/update-password", authMiddleware, updatePasswordController);


/* ============================================ */

export default router;
