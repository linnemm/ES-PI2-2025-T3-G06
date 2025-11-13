import { Router } from "express";
import { cadastrarCurso, listarCursos } from "../controllers/cursoController";

const router = Router();

router.post("/", cadastrarCurso); // cadastrar curso
router.get("/:instituicaoId", listarCursos); // listar cursos de uma instituição

export default router;
