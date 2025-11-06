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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Caminho da pasta do frontend
const frontendPath = path_1.default.join(__dirname, "../autenticacao_frontend");
// Servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express_1.default.static(frontendPath));
// Página inicial (Tela Inicial)
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, "html", "telainicial.html"));
});
// Rotas da API (login, cadastro, esqueci senha, redefinir senha)
app.use("/api/auth", authRoutes_1.default);
// Inicia o servidor na porta 3000, aceitando conexões externas
app.listen(3000, "0.0.0.0", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🚀 Servidor disponível em:");
    console.log("➡️  PC: http://localhost:3000");
    console.log("➡️  Celular (mesma rede): use o IP do seu PC, ex: http://192.168.X.X:3000");
    try {
        const conn = yield (0, database_1.openConnection)();
        yield conn.close();
        console.log("✅ Conexão com Oracle bem-sucedida!");
    }
    catch (error) {
        console.error("❌ Falha ao testar conexão:", error);
    }
}));
//# sourceMappingURL=index.js.map