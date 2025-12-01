import { Router } from "express";
import { listarNotas, salvarNotas, excluirNota } from "../controllers/notasController";

// Criando uma instância do roteador do Express
const router = Router();

// Rota para listar as notas de uma turma e disciplina
router.get("/:turmaId/:disciplinaId", listarNotas);

// Rota para salvar ou atualizar notas
router.post("/", salvarNotas);

// Rota para excluir uma nota de um aluno
router.delete("/excluir/:alunoId/:componenteId", excluirNota);

export default router;
