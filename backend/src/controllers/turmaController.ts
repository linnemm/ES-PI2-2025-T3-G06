import { Request, Response } from "express";
import { criarTurma } from "../models/turmaModel";

export async function cadastrarTurma(req: Request, res: Response) {
  try {
    const {
      instituicaoId,
      cursoId,
      disciplinaId,
      nome,
      diaSemana,
      horario,
      localTurma
    } = req.body;

    if (!instituicaoId || !cursoId || !disciplinaId || !nome || !diaSemana || !horario || !localTurma) {
      return res.status(400).json({ message: "Campos obrigatórios faltando." });
    }

    await criarTurma({
      instituicaoId,
      cursoId,
      disciplinaId,
      nome,
      diaSemana,
      horario,
      localTurma
    });

    return res.status(201).json({ message: "Turma criada com sucesso!" });

  } catch (error: any) {
    console.error("Erro ao criar turma:", error);
    return res.status(500).json({ message: error.message });
  }
}
