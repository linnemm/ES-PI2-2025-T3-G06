"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const emailService_1 = require("../services/emailService");
const oracledb_1 = __importDefault(require("oracledb"));
// ======================= CADASTRO =======================
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, telefone, senha } = req.body;
    try {
        const existe = yield (0, userModel_1.findUserByEmail)(email);
        if (existe && existe.length > 0) {
            return res.status(400).json({ message: "Usuário já cadastrado" });
        }
        const senhaCriptografada = yield bcrypt_1.default.hash(senha, 10);
        yield (0, userModel_1.createUser)(nome, email, telefone, senhaCriptografada);
        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
});
exports.registerUser = registerUser;
// ======================= LOGIN =======================
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    const usuarios = yield (0, userModel_1.findUserByEmail)(email);
    if (!usuarios || usuarios.length === 0) {
        return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const user = usuarios[0];
    const senhaCorreta = yield bcrypt_1.default.compare(senha, user.SENHA);
    if (!senhaCorreta) {
        return res.status(401).json({ message: "Senha incorreta" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.ID, email: user.EMAIL }, "chave_secreta_do_token", { expiresIn: "15min" });
    return res.json({ message: "Login realizado com sucesso!", token });
});
exports.loginUser = loginUser;
// ======================= ESQUECI MINHA SENHA =======================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const usuarios = yield (0, userModel_1.findUserByEmail)(email);
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: "E-mail não encontrado" });
        }
        // Gera token de redefinição (expira em 15 minutos)
        const token = jsonwebtoken_1.default.sign({ email }, "chave_secreta_do_token", { expiresIn: "15m" });
        // 🔹 Detecta automaticamente o host (localhost ou IP da rede)
        const host = req.headers.host; // ex: "192.168.0.105:3000" ou "localhost:3000"
        const baseURL = `http://${host}`;
        // Monta link completo de redefinição
        const link = `${baseURL}/html/RedefinirSenha.html?token=${token}`;
        // Corpo do e-mail
        const html = `
      <h2>Redefinição de senha - NotaDez</h2>
      <p>Olá!</p>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="${link}" target="_blank">Redefinir minha senha</a>
      <p>Este link expira em 15 minutos.</p>
    `;
        // Envia e-mail com link dinâmico
        yield (0, emailService_1.enviarEmail)(email, "Redefinição de senha - NotaDez", html);
        return res.json({ message: "E-mail de recuperação enviado com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao enviar e-mail" });
    }
});
exports.forgotPassword = forgotPassword;
// ======================= REDEFINIR SENHA =======================
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, novaSenha } = req.body;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "chave_secreta_do_token");
        const email = decoded.email;
        const usuarios = yield (0, userModel_1.findUserByEmail)(email);
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const novaSenhaCriptografada = yield bcrypt_1.default.hash(novaSenha, 10);
        const connection = yield oracledb_1.default.getConnection({
            user: "PROJETO",
            password: "projeto",
            connectString: "localhost:1521/XEPDB1",
        });
        yield connection.execute(`UPDATE usuarios SET senha = :senha WHERE email = :email`, [novaSenhaCriptografada, email], { autoCommit: true });
        yield connection.close();
        return res.json({ message: "Senha redefinida com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Token inválido ou expirado" });
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map