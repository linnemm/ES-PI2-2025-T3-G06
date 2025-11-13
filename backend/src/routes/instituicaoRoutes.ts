import { Router } from "express";
import {
  cadastrarInstituicao,
  listarInstituicoesPorUsuario,
  atualizarInstituicao,
  removerInstituicao
} from "../controllers/instituicaoController";

const router = Router();

// =======================================
// CADASTRAR INSTITUIÇÃO
// POST /api/instituicoes
// =======================================
router.post("/", cadastrarInstituicao);

// =======================================
// LISTAR INSTITUIÇÕES DO USUÁRIO
// GET /api/instituicoes/listar/:usuarioId
// =======================================
router.get("/listar/:usuarioId", listarInstituicoesPorUsuario);

// =======================================
// EDITAR INSTITUIÇÃO
// PUT /api/instituicoes/:id
// =======================================
router.put("/:id", atualizarInstituicao);

// =======================================
// EXCLUIR INSTITUIÇÃO
// DELETE /api/instituicoes/:id
// (somente se NÃO houver cursos vinculados)
// =======================================
router.delete("/:id", removerInstituicao);

export default router;
