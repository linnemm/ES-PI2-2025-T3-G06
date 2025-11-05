import express from "express";
import cors from "cors";
import { openConnection } from "./config/database";
import authRoutes from "./routes/authRoutes"; // 🟢 importe suas rotas

const app = express();
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  res.send("Servidor ativo!");
});

// 🟢 use as rotas de autenticação (prefixo /api/auth)
app.use("/api/auth", authRoutes);

// servidor
app.listen(3000, async () => {
  console.log("Servidor rodando na porta 3000");

  try {
    const conn = await openConnection();
    await conn.close();
    console.log("Conexão com Oracle bem-sucedida!");
  } catch (error) {
    console.error("Falha ao testar conexão:", error);
  }
});
