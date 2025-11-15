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

/* ============================================================
   📌 CRIAR TURMA
   POST /api/turmas/criar
   ============================================================ */
router.post("/criar", cadastrarTurma);

/* ============================================================
   📌 LISTAR TURMAS POR CURSO
   GET /api/turmas/curso/:cursoId
   ============================================================ */
router.get("/curso/:cursoId", listarTurmasPorCurso);

/* ============================================================
   📌 LISTAR TURMAS POR DISCIPLINA
   GET /api/turmas/disciplina/:disciplinaId
   ============================================================ */
router.get("/disciplina/:disciplinaId", listarTurmasPorDisciplina);

/* ============================================================
   📌 *** LISTAR TURMAS (ROTA QUE O FRONT USA) ***
   GET /api/turmas/listar/:disciplinaId
   ============================================================ */
router.get("/listar/:disciplinaId", listarTurmasPorDisciplina);

/* ============================================================
   📌 BUSCAR TURMA POR ID
   GET /api/turmas/detalhes/:id
   ============================================================ */
router.get("/detalhes/:id", obterTurmaPorId);

/* ============================================================
   📌 EDITAR TURMA
   PUT /api/turmas/editar/:id
   ============================================================ */
router.put("/editar/:id", editarTurma);

/* ============================================================
   📌 REMOVER TURMA
   DELETE /api/turmas/remover/:id
   ============================================================ */
router.delete("/remover/:id", removerTurma);

export default router;
