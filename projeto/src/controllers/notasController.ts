import { Request, Response } from "express";
import {
  listarNotasBD,
  salvarNotasBD,
  excluirNotaBD
} from "../models/notasModel";

// BUSCAR NOTAS POR TURMA + DISCIPLINA
// GET /api/notas/:turmaId/:disciplinaId
export async function listarNotas(req: Request, res: Response) {
  try {
    const { turmaId, disciplinaId } = req.params;

    if (!turmaId || !disciplinaId) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    const notas = await listarNotasBD(turmaId, disciplinaId);

    return res.status(200).json(notas);
  } catch (error: any) {
    console.error("Erro ao listar notas:", error);
    return res.status(500).json({
      message: "Erro ao buscar notas.",
      error: error.message
    });
  }
}

// SALVAR / ATUALIZAR NOTAS 
// POST /api/notas
export async function salvarNotas(req: Request, res: Response) {
  try {
    const lista = req.body;

    if (!Array.isArray(lista) || lista.length === 0) {
      return res.status(400).json({
        message: "Nenhuma nota enviada."
      });
    }

    // Envia para o Model salvar
    const result = await salvarNotasBD(lista);

    return res.status(200).json({
      message: "Notas salvas com sucesso.",
      linhasAfetadas: result
    });

  } catch (error: any) {
    console.error("Erro ao salvar notas:", error);

    return res.status(500).json({
      message: "Erro ao salvar notas.",
      error: error.message
    });
  }
}

// Excluir nota de um aluno
// DELETE /api/notas/excluir/:alunoId/:componenteId
export async function excluirNota(req: Request, res: Response) {
  try {
    const { alunoId, componenteId } = req.params;  // Recebe os parâmetros alunoId e componenteId

    // Chama o model para excluir a nota
    const result = await excluirNotaBD(Number(alunoId), Number(componenteId));

    // Verificar se a nota foi excluída
    if (result === 0) {
      return res.status(404).json({ message: "Nota não encontrada." });
    }

    return res.status(200).json({ message: "Nota excluída com sucesso!" });

  } catch (error: any) {
    console.error("Erro ao excluir nota:", error);
    return res.status(500).json({ message: "Erro ao excluir nota.", error: error.message });
  }
}
