//Autoria: Miriã

// src/routes/turmaRoutes.ts
import { Router } from "express";
import {
  cadastrarTurma,
  listarTurmasPorCurso,
  listarTurmasPorDisciplina,
  removerTurma,
  obterTurmaPorId,
  editarTurma
} from "../controllers/turmaController";

const router = Router();

/*Cadastrar Turmas */
router.post("/criar", cadastrarTurma);

/*Listar Turmas por curso */
router.get("/curso/:cursoId", listarTurmasPorCurso);

/*Listar Turmas por Disciplina */
router.get("/disciplina/:disciplinaId", listarTurmasPorDisciplina);

/*Listar Turmas (Roat que o front usa)*/
router.get("/listar/:disciplinaId", listarTurmasPorDisciplina);

/*Buscar Turmas por ID*/
router.get("/detalhes/:id", obterTurmaPorId);

/*Editar Turmas */
router.put("/editar/:id", editarTurma);

/*Remover Turmas */
router.delete("/remover/:id", removerTurma);

export default router;
