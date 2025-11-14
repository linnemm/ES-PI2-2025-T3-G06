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

// ======================================================
//  ROTAS DE DISCIPLINAS
// ======================================================

// 1️⃣ Criar disciplina
router.post("/", cadastrarDisciplina);

// 2️⃣ Listar disciplinas de um curso
// (IMPORTANTE: rota específica vem antes da rota "/:id")
router.get("/curso/:cursoId", listarDisciplinasPorCurso);

// 3️⃣ Verificar quantidade de disciplinas vinculadas a um curso
router.get("/quantidade/:cursoId", quantidadeDisciplinasPorCurso);

// 4️⃣ Buscar disciplina por ID
router.get("/:id", obterDisciplina);

// 5️⃣ Editar disciplina
router.put("/editar/:id", editarDisciplinaController);

// 6️⃣ Remover disciplina
router.delete("/remover/:id", removerDisciplinaController);

export default router;
