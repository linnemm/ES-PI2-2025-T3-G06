import express from "express";
import cors from "cors";
import path from "path";
import { openConnection } from "./config/database";

// Rotas API
import authRoutes from "./routes/authRoutes";
import instituicaoRoutes from "./routes/instituicaoRoutes";
import cursoRoutes from "./routes/cursoRoutes";
import disciplinaRoutes from "./routes/disciplinaRoutes";
import componenteRoutes from "./routes/componenteRoutes"; // ⭐ COMPONENTES DE NOTA

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// ======================================================
// FRONTEND – SERVIR ARQUIVOS ESTÁTICOS
// ======================================================

// Caminho do frontend de autenticação
const authPath = path.join(__dirname, "../frontend/autenticacao");

// Caminho do frontend de gerenciamento
const gerenciamentoPath = path.join(__dirname, "../frontend/gerenciamento");

// Servir frontend de autenticação
app.use("/auth", express.static(authPath));

// Servir frontend de gerenciamento
app.use("/gerenciar", express.static(gerenciamentoPath));

// Página inicial → Tela de login
app.get("/", (req, res) => {
  res.sendFile(path.join(authPath, "html", "telainicial.html"));
});

// ======================================================
// ROTAS API — BACKEND
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/componentes", componenteRoutes); // ⭐ ROTA NOVA E ATIVA

// ======================================================
// INICIAR SERVIDOR
// ======================================================

const PORT = 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log("🚀 Servidor rodando com sucesso!");
  console.log(`➡️  Acesse no PC: http://localhost:${PORT}`);
  console.log(`➡️  Acesse no celular (mesma rede): http://SEU-IP:${PORT}`);

  try {
    // Testa conexão com Oracle
    const conn = await openConnection();
    await conn.close();
    console.log("✅ Conexão com Oracle bem-sucedida!");
  } catch (error) {
    console.error("❌ Erro ao conectar no Oracle:", error);
  }
});
