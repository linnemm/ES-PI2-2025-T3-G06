import express from "express";
import cors from "cors";
import { openConnection } from "./config/database"; // Importa a função openConnection, responsável por abrir uma conexão com o banco de dados

const app = express();
app.use(cors());
// Permite que o servidor receba e interprete dados no formato JSON no corpo das requisições
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor ativo!");
});

// Servidor ficará rodando em http://localhost:3000
app.listen(3000, async () => {
  console.log("Servidor rodando na porta 3000");

  // Testa a conexão com Oracle ao iniciar o servidor
  try {
    const conn = await openConnection(); // abre conexão
    await conn.close(); // fecha a conexão (só teste)
  } catch (error) { //caso haja algum erro, mensagem aparece 
    console.error("Falha ao testar conexão:", error);
  }
});
