import { Router } from "express";
import { listarNotas, salvarNotas } from "../controllers/notasController";

const router = Router();

router.get("/:turmaId/:disciplinaId", listarNotas);
router.post("/", salvarNotas);

export default router;
