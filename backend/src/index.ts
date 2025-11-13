import express from "express";
import cors from "cors";
import path from "path";
import { openConnection } from "./config/database";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Caminho da pasta do frontend
const frontendPath = path.join(__dirname, "../autenticacao_frontend");

// Servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(frontendPath));

// Página inicial (Tela Inicial)
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html", "telainicial.html"));
});

// Rotas da API (login, cadastro, esqueci senha, redefinir senha)
app.use("/api/auth", authRoutes);

// Inicia o servidor na porta 3000, aceitando conexões externas
app.listen(3000, "0.0.0.0", async () => {
  console.log("🚀 Servidor disponível em:");
  console.log("➡️  PC: http://localhost:3000");
  console.log("➡️  Celular (mesma rede): use o IP do seu PC, ex: http://192.168.X.X:3000");

  try {
    const conn = await openConnection();
    await conn.close();
    console.log("✅ Conexão com Oracle bem-sucedida!");
  } catch (error) {
    console.error("❌ Falha ao testar conexão:", error);
  }
});
