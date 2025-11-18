// Autora: Alinne

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

// Criar conta
router.post("/register", registerUser);

// Login — gera token JWT
router.post("/login", loginUser);

// Enviar e-mail de recuperação de senha
router.post("/forgot-password", forgotPassword);

// Redefinir senha através do link enviado para o e-mail
router.post("/reset-password", resetPassword);



// rota protegidas (exigem token JWT)

// recuperar dados do usuário logado
router.get("/me", authMiddleware, getMe);

// atualizar e-mail
router.put("/update-email", authMiddleware, updateEmailController);

// atualizar senha
router.put("/update-password", authMiddleware, updatePasswordController);


export default router;
