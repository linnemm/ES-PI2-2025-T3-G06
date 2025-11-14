import express from "express";
import cors from "cors";
import path from "path";
import { openConnection } from "./config/database";

// Rotas API
import authRoutes from "./routes/authRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import disciplinaRoutes from "./routes/disciplinaRoutes"; // ✅ DISCIPLINAS

const app = express();
app.use(cors());
app.use(express.json());

// ======================================================
// FRONTEND – SERVIR ARQUIVOS HTML, CSS, JS, IMAGENS
// ======================================================

// Caminho do frontend de autenticação
const authPath = path.join(__dirname, "../frontend/autenticacao");

// Caminho do frontend de gerenciamento
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Servir frontend de autenticação
app.use("/auth", express.static(authPath));

// Servir frontend de gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página inicial → tela inicial de login
app.get("/", (req, res) => {
  res.sendFile(path.join(authPath, "html", "telainicial.html"));
});

// ======================================================
// ROTAS API
// ======================================================

// Autenticação (login, cadastro, redefinir senha)
app.use("/api/auth", authRoutes);

// Instituições
app.use("/api/instituicoes", instituicaoRoutes);

// Cursos
app.use("/api/cursos", cursoRoutes);

// Disciplinas
app.use("/api/disciplinas", disciplinaRoutes);

// ======================================================
// INICIAR SERVIDOR
// ======================================================

const PORT = 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log("🚀 Servidor rodando com sucesso!");
  console.log(`➡️  PC: http://localhost:${PORT}`);
  console.log(`➡️  Celular (mesma rede): http://SEU-IP:${PORT}`);

  try {
    const conn = await openConnection();
    await conn.close();
    console.log("✅ Conexão com Oracle bem-sucedida!");
  } catch (error) {
    console.error("❌ Erro ao testar conexão com Oracle:", error);
  }
});
