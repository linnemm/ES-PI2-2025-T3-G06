import { Request, Response } from "express";
import { createCurso, getCursosByInstituicao } from "../models/cursoModel";

export const cadastrarCurso = async (req: Request, res: Response) => {
  const { nome, sigla, coordenador, instituicaoId, usuarioId } = req.body;

  if (!nome || !sigla || !coordenador || !instituicaoId || !usuarioId) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }

  try {
    await createCurso(nome, sigla, coordenador, Number(instituicaoId), Number(usuarioId));

    return res.status(201).json({ message: "Curso cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    return res.status(500).json({ message: "Erro ao cadastrar curso." });
  }
};

export const listarCursos = async (req: Request, res: Response) => {
  const { instituicaoId } = req.params;

  if (!instituicaoId) {
    return res.status(400).json({ message: "Instituição não informada." });
  }

  try {
    const cursos = await getCursosByInstituicao(Number(instituicaoId));
    return res.json(cursos);

  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return res.status(500).json({ message: "Erro ao listar cursos." });
  }
};
