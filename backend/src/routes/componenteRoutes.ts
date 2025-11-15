import { Router } from "express";
import {
  criarComponente,
  listarComponentes,
  deletarComponente
} from "../controllers/componenteController";

const router = Router();

// Criar componente
router.post("/criar", criarComponente);

// Listar componentes por disciplina
router.get("/listar/:disciplinaId", listarComponentes);

// Remover componente
router.delete("/remover/:id", deletarComponente);

export default router;
