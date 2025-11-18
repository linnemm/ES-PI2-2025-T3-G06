// Autora: Alycia

import { Router } from "express";
import {
  cadastrarDisciplina,
  listarDisciplinasPorCurso,
  obterDisciplina,
  editarDisciplinaController,
  removerDisciplinaController,
  quantidadeDisciplinasPorCurso
} from "../controllers/disciplinaController";

const router = Router();


// Criar disciplina
router.post("/", cadastrarDisciplina);

// Listar disciplinas de um curso
router.get("/curso/:cursoId", listarDisciplinasPorCurso);

// verificar quantidade de disciplinas vinculadas a um curso
router.get("/quantidade/:cursoId", quantidadeDisciplinasPorCurso);

// buscar disciplina por ID
router.get("/:id", obterDisciplina);

// editar disciplina
router.put("/editar/:id", editarDisciplinaController);

// remover disciplina
router.delete("/remover/:id", removerDisciplinaController);

export default router;
