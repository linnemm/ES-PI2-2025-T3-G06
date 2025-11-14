import { Request, Response } from "express";
import {
  criarDisciplina,
  buscarDisciplinasPorCurso,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  excluirDisciplina,
  contarDisciplinasPorCurso
} from "../models/disciplinaModel";

// ======================================================
//  CADASTRAR DISCIPLINA
// ======================================================
export const cadastrarDisciplina = async (req: Request, res: Response) => {
  try {
    const { nome, sigla, codigo, periodo, usuarioId, instituicaoId, cursoId } = req.body;

    if (!nome || !sigla || !codigo || !periodo || !usuarioId || !instituicaoId || !cursoId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    await criarDisciplina(
      nome,
      sigla,
      codigo,
      periodo,
      Number(usuarioId),
      Number(instituicaoId),
      Number(cursoId)
    );

    return res.status(201).json({ message: "Disciplina cadastrada com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar disciplina:", error);
    return res.status(500).json({ message: "Erro ao cadastrar disciplina." });
  }
};

// ======================================================
//  LISTAR DISCIPLINAS POR CURSO
// ======================================================
export const listarDisciplinasPorCurso = async (req: Request, res: Response) => {
  try {
    const cursoId = Number(req.params.cursoId);

    if (!cursoId) {
      return res.status(400).json({ message: "Curso inválido." });
    }

    const disciplinas = await buscarDisciplinasPorCurso(cursoId);
    return res.status(200).json(disciplinas);

  } catch (error) {
    console.error("Erro ao listar disciplinas:", error);
    return res.status(500).json({ message: "Erro ao listar disciplinas." });
  }
};

// ======================================================
//  BUSCAR DISCIPLINA POR ID
// ======================================================
export const obterDisciplina = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const disciplina = await buscarDisciplinaPorId(id);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    return res.status(200).json(disciplina);

  } catch (error) {
    console.error("Erro ao buscar disciplina:", error);
    return res.status(500).json({ message: "Erro ao buscar disciplina." });
  }
};

// ======================================================
//  ATUALIZAR DISCIPLINA
// ======================================================
export const editarDisciplinaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, sigla, codigo, periodo } = req.body;

    if (!id || !nome || !sigla || !codigo || !periodo) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    const existente = await buscarDisciplinaPorId(id);
    if (!existente) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    await atualizarDisciplina(id, nome, sigla, codigo, periodo);

    return res
      .status(200)
      .json({ message: "Disciplina atualizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
    return res.status(500).json({ message: "Erro ao atualizar disciplina." });
  }
};

// ======================================================
//  REMOVER DISCIPLINA
// ======================================================
export const removerDisciplinaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existente = await buscarDisciplinaPorId(id);
    if (!existente) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    await excluirDisciplina(id);

    return res.status(200).json({ message: "Disciplina removida com sucesso!" });

  } catch (error) {
    console.error("Erro ao excluir disciplina:", error);
    return res.status(500).json({ message: "Erro ao excluir disciplina." });
  }
};

// ======================================================
//  QUANTIDADES VINCULADAS AO CURSO (para excluir curso)
// ======================================================
export const quantidadeDisciplinasPorCurso = async (req: Request, res: Response) => {
  try {
    const cursoId = Number(req.params.cursoId);

    if (!cursoId) {
      return res.status(400).json({ message: "Curso inválido." });
    }

    const quantidade = await contarDisciplinasPorCurso(cursoId);

    return res.status(200).json({ quantidade });

  } catch (error) {
    console.error("Erro ao contar disciplinas:", error);
    return res.status(500).json({ message: "Erro ao contar disciplinas." });
  }
};
