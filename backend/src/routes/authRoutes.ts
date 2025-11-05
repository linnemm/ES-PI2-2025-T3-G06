import { Router } from "express";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/authController";

const router = Router();

// Rota para criar conta
router.post("/register", registerUser);

// Rota para login
router.post("/login", loginUser);

// Rota para recuperação de senha
router.post("/forgot-password", forgotPassword);

// Rota para redefinir senha
router.post("/reset-password", resetPassword);

export default router;
