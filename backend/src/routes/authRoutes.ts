import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = express.Router();

/* ====================== AUTENTICAÇÃO ====================== */

// 🟢 Rota de cadastro (criação de conta)
router.post("/register", registerUser);

// 🟢 Rota de login (geração de token JWT)
router.post("/login", loginUser);

// 🟢 Rota de recuperação de senha (envio de e-mail)
router.post("/forgot-password", forgotPassword);

// 🟢 Rota de redefinição de senha (com token)
router.post("/reset-password", resetPassword);

/* ========================================================= */

// Exporta todas as rotas com o prefixo /api/auth
export default router;
