// Autora: Alinne

import { Router } from "express";
import {
  cadastrarCurso,
  listarCursosPorInstituicao,
  atualizarCurso,
  removerCurso,
  contarDisciplinasDoCurso
} from "../controllers/cursoController";

const router = Router();

// Cadastrar curso
router.post("/", cadastrarCurso);

// Listar cursos por instituição
router.get("/listar/:instituicaoId", listarCursosPorInstituicao);

// Editar curso
router.put("/editar/:id", atualizarCurso);

// Remover curso
router.delete("/remover/:id", removerCurso);

// Quantidade de disciplinas vinculadas
router.get("/quantidade/:id", contarDisciplinasDoCurso);

export default router;
