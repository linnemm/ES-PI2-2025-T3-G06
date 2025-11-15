import { Router } from "express";
import { cadastrarTurma } from "../controllers/turmaController";

const router = Router();

router.post("/criar", cadastrarTurma);

export default router;
