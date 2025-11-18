// Autoria: Livia

import { Router } from "express";
import { listarNotas, salvarNotas } from "../controllers/notasController";

// Criando uma instância do roteador do Express
const router = Router();

// ROTA: GET /:turmaId/:disciplinaId
router.get("/:turmaId/:disciplinaId", listarNotas);

// ROTA: POST /
router.post("/", salvarNotas);

// Exporta o roteador para ser usado no arquivo principal de rotas
export default router;
