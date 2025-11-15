import express from "express";
import cors from "cors";
import path from "path";
import { openConnection } from "./config/database";

// Rotas API
import authRoutes from "./routes/authRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import disciplinaRoutes from "./routes/disciplinaRoutes";
import componenteRoutes from "./routes/componenteRoutes";
import turmaRoutes from "./routes/turmaRoutes";

const app = express();

// ======================================================
// CONFIGURAÇÕES BÁSICAS
// ======================================================
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

// ======================================================
// SERVIR FRONTEND (AUTENTICAÇÃO + GERENCIAMENTO)
// ======================================================

// Caminhos absolutos do frontend
const authPath = path.join(__dirname, "../frontend/autenticacao");
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Autenticação
app.use("/auth", express.static(authPath));

// Gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página inicial → vai para login
app.get("/", (req, res) => {
  return res.sendFile(path.join(authPath, "html", "telainicial.html"));
});

// ======================================================
// ROTAS API — BACKEND
// ======================================================
app.use("/api/auth", authRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/componentes", componenteRoutes);
app.use("/api/turmas", turmaRoutes);

// ======================================================
// ROTA DEFAULT (404 PARA API)
// ======================================================
app.use("/api", (_, res) => {
  return res.status(404).json({ message: "Rota API não encontrada." });
});

// ======================================================
// ERRO GLOBAL — EVITA QUE O SERVIDOR CAIA
// ======================================================
app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 ERRO GLOBAL:", err);
  return res.status(500).json({ message: "Erro interno no servidor." });
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================
const PORT = 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log("🚀 Servidor iniciado com sucesso!");
  console.log(`➡️ Localhost: http://localhost:${PORT}`);
  console.log(`➡️ Front Autenticação: http://localhost:${PORT}/auth/html/login.html`);
  console.log(`➡️ Front Gerenciamento: http://localhost:${PORT}/gerenciar/html/home.html`);

  // Teste de conexão Oracle
  try {
    const conn = await openConnection();
    await conn.close();
    console.log("🔗 Oracle conectado com sucesso!");
  } catch (err) {
    console.error("❌ Falha ao conectar no Oracle:", err);
  }
});
