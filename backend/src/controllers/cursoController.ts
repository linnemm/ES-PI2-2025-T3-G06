import { Request, Response } from "express";
import {
  criarCurso,
  buscarCursosPorInstituicao,
  buscarCursoPorId,
  editarCurso,
  excluirCurso,
  cursoTemDisciplinas
} from "../models/cursoModel";

// ======================================================
// CADASTRAR CURSO
// ======================================================
export const cadastrarCurso = async (req: Request, res: Response) => {
  try {
    const { nome, sigla, coordenador, instituicaoId, usuarioId } = req.body;

    if (!nome || !sigla || !coordenador || !instituicaoId || !usuarioId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    await criarCurso(nome, sigla, coordenador, Number(instituicaoId), Number(usuarioId));

    return res.status(201).json({ message: "Curso cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    return res.status(500).json({ message: "Erro ao cadastrar curso." });
  }
};

// ======================================================
// LISTAR CURSOS POR INSTITUIÇÃO
// ======================================================
export const listarCursosPorInstituicao = async (req: Request, res: Response) => {
  try {
    const instituicaoId = Number(req.params.instituicaoId);

    if (!instituicaoId) {
      return res.status(400).json({ message: "Instituição inválida." });
    }

    const cursos = await buscarCursosPorInstituicao(instituicaoId);
    return res.status(200).json(cursos);

  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return res.status(500).json({ message: "Erro ao listar cursos." });
  }
};

// ======================================================
// EDITAR CURSO
// ======================================================
export const atualizarCurso = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nome, sigla, coordenador } = req.body;

    if (!id || !nome || !sigla || !coordenador) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    const existe = await buscarCursoPorId(id);
    if (!existe) return res.status(404).json({ message: "Curso não encontrado." });

    await editarCurso(id, nome, sigla, coordenador);

    return res.status(200).json({ message: "Curso atualizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao editar curso:", error);
    return res.status(500).json({ message: "Erro ao editar curso." });
  }
};

// ======================================================
// REMOVER CURSO (somente se NÃO tiver disciplinas)
// ======================================================
export const removerCurso = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existe = await buscarCursoPorId(id);
    if (!existe) return res.status(404).json({ message: "Curso não encontrado." });

    const temDisc = await cursoTemDisciplinas(id);
    if (temDisc) {
      return res.status(403).json({
        message: "Não é possível excluir: existem disciplinas vinculadas."
      });
    }

    await excluirCurso(id);
    return res.status(200).json({ message: "Curso removido com sucesso!" });

  } catch (error) {
    console.error("Erro ao remover curso:", error);
    return res.status(500).json({ message: "Erro ao remover curso." });
  }
};

// ======================================================
// CONSULTAR QUANTIDADE DE DISCIPLINAS PARA EXCLUSÃO
// ======================================================
export const contarDisciplinasDoCurso = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const temDisc = await cursoTemDisciplinas(id);

    return res.status(200).json({ quantidade: temDisc ? 1 : 0 });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao verificar disciplinas." });
  }
};
