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
import alunoRoutes from "./routes/alunoRoutes";  // ⭐ NOVO — ROTAS DE ALUNOS

const app = express();

// ======================================================
// CONFIGURAÇÕES BÁSICAS
// ======================================================
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

// Para uploads de CSV (multer armazena na pasta)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ======================================================
// SERVIR FRONTEND (AUTENTICAÇÃO + GERENCIAMENTO)
// ======================================================

// Caminhos absolutos das pastas frontend
const authPath = path.join(__dirname, "../frontend/autenticacao");
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Servir autenticação
app.use("/auth", express.static(authPath));

// Servir gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página inicial → redireciona para login
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
app.use("/api/alunos", alunoRoutes);   // ⭐ IMPORTANTE: rotas de ALUNOS

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
  console.log(`➡️ Login: http://localhost:${PORT}/auth/html/login.html`);
  console.log(`➡️ Gerenciamento: http://localhost:${PORT}/gerenciar/html/home.html`);

  // Teste da conexão com Oracle
  try {
    const conn = await openConnection();
    await conn.close();
    console.log("🔗 Oracle conectado com sucesso!");
  } catch (err) {
    console.error("❌ Falha ao conectar no Oracle:", err);
  }
});
