// Autoria: Livia

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
import alunoRoutes from "./routes/alunoRoutes"; 
import notasRoutes from "./routes/notasRoutes"; 

const app = express();

// CONFIGURAÇÕES BÁSICAS

app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(express.json());

// Para uploads de CSV
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// SERVIR FRONTEND

const authPath = path.join(__dirname, "../frontend/autenticacao");
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Autenticação
app.use("/auth", express.static(authPath));

// Gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página padrão → tela inicial
app.get("/", (req, res) => {
  return res.sendFile(path.join(authPath, "html", "telainicial.html"));
});

// ROTAS DO BACKEND (API)

app.use("/api/auth", authRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/componentes", componenteRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notasRoutes);  // NECESSÁRIO PARA A PÁGINA DE NOTAS

// 404 DAS ROTAS DA API

app.use("/api", (_, res) => {
  return res.status(404).json({ message: "Rota API não encontrada." });
});

// ERRO GLOBAL

app.use((err: any, req: any, res: any, next: any) => {
  console.error(" ERRO GLOBAL:", err);
  return res.status(500).json({ message: "Erro interno no servidor." });
});

// INICIAR SERVIDOR

const PORT = 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log("🚀 Servidor iniciado!");
  console.log(`➡️ http://localhost:${PORT}`);
  console.log(`➡️ Login: http://localhost:${PORT}/auth/html/login.html`);
  console.log(`➡️ Painel: http://localhost:${PORT}/gerenciar/html/home.html`);

  try {
    const conn = await openConnection();
    await conn.close();
    console.log("🔗 Conectado ao Oracle com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao Oracle:", err);
  }
});
