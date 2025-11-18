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
exports.enviarEmail = enviarEmail;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + "/../../.env" }); // garante que o .env é carregado
const nodemailer_1 = __importDefault(require("nodemailer"));
// evita erro de certificado SSL em algumas máquinas do Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function enviarEmail(destinatario, assunto, conteudoHTML) {
    return __awaiter(this, void 0, void 0, function* () {
        // Configuração segura para Gmail (SSL + logs)
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true, // mostra log detalhado
            debug: true,
        });
        const mailOptions = {
            from: `"NotaDez" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: assunto,
            html: conteudoHTML,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log(`📨 E-mail enviado para: ${destinatario}`);
            console.log("📦 Info:", info);
        }
        catch (error) {
            console.error("❌ Erro ao enviar e-mail:", error);
        }
    });
}
//# sourceMappingURL=emailService.js.map