import express from "express";
import cors from "cors";
import path from "path";
import { openConnection } from "./config/database";

// Rotas API
import authRoutes from "./routes/authRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import cursoRoutes from "./routes/cursoRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// ===================== FRONTENDS ===========================

// Caminho do frontend de autenticação
const authPath = path.join(__dirname, "../frontend/autenticacao");

// Caminho do frontend de gerenciamento
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Servir os arquivos estáticos do frontend de autenticação
app.use("/auth", express.static(authPath));

// Servir arquivos estáticos do frontend de gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página inicial → Tela Inicial (autenticação)
app.get("/", (req, res) => {
  res.sendFile(path.join(authPath, "html", "telainicial.html"));
});

// ===================== ROTAS API ===========================

// Rota de autenticação (login, cadastro, esqueci/redefinir senha)
app.use("/api/auth", authRoutes);

// Rota de instituições
app.use("/api/instituicoes", instituicaoRoutes);

// Rota de cursos
app.use("/api/cursos", cursoRoutes);

// ===================== INICIAR SERVIDOR =====================

app.listen(3000, "0.0.0.0", async () => {
  console.log("🚀 Servidor rodando com sucesso!");
  console.log("➡️  PC: http://localhost:3000");
  console.log("➡️  Celular (mesma rede): use o IP do seu PC → http://SEU-IP:3000");

  try {
    const conn = await openConnection();
    await conn.close();
    console.log("✅ Conexão com Oracle bem-sucedida!");
  } catch (error) {
    console.error("❌ Erro ao testar conexão com Oracle:", error);
  }
});
