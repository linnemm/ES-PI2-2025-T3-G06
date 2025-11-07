"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
/* ====================== AUTENTICAÇÃO ====================== */
// 🟢 Rota de cadastro (criação de conta)
router.post("/register", authController_1.registerUser);
// 🟢 Rota de login (geração de token JWT)
router.post("/login", authController_1.loginUser);
// 🟢 Rota de recuperação de senha (envio de e-mail)
router.post("/forgot-password", authController_1.forgotPassword);
// 🟢 Rota de redefinição de senha (com token)
router.post("/reset-password", authController_1.resetPassword);
/* ========================================================= */
// Exporta todas as rotas com o prefixo /api/auth
exports.default = router;
//# sourceMappingURL=authRoutes.js.map