//Autoria: Miriã

import { Request, Response } from "express";
import {
  criarTurma,
  buscarTurmasPorCurso,
  buscarTurmasPorDisciplina,
  buscarTurmaPorId,
  editarTurmaModel,
  removerTurmaModel
} from "../models/turmaModel";


// Cadastrar Turma

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
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    await criarTurma({
      instituicaoId: Number(instituicaoId),
      cursoId: Number(cursoId),
      disciplinaId: Number(disciplinaId),
      nome,
      diaSemana,
      horario,
      localTurma
    });

    return res.status(201).json({ message: "Turma criada com sucesso!" });

  } catch (error: any) {
    console.error("Erro ao criar turma:", error);
    return res.status(500).json({ message: "Erro interno ao criar turma." });
  }
}

//Listar Turmas por Curso
export async function listarTurmasPorCurso(req: Request, res: Response) {
  try {
    const cursoId = Number(req.params.cursoId);

    if (isNaN(cursoId)) {
      return res.status(400).json({ message: "courseId inválido." });
    }

    const lista = await buscarTurmasPorCurso(cursoId);
    return res.status(200).json(lista);

  } catch (e: any) {
    console.error("Erro ao listar turmas por curso:", e);
    return res.status(500).json({ message: "Erro ao buscar turmas deste curso." });
  }
}

//Listar Turmas por Disciplina
export async function listarTurmasPorDisciplina(req: Request, res: Response) {
  try {
    const disciplinaId = Number(req.params.disciplinaId);

    if (isNaN(disciplinaId)) {
      return res.status(400).json({ message: "disciplinaId inválido." });
    }

    const lista = await buscarTurmasPorDisciplina(disciplinaId);
    return res.status(200).json(lista);

  } catch (e: any) {
    console.error("Erro ao listar turmas por disciplina:", e);
    return res.status(500).json({ message: "Erro ao buscar turmas desta disciplina." });
  }
}

//Buscar Turma por ID
export async function obterTurmaPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const turma = await buscarTurmaPorId(id);

    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada." });
    }

    return res.status(200).json(turma);

  } catch (e: any) {
    console.error("Erro ao buscar turma:", e);
    return res.status(500).json({ message: "Erro ao buscar turma." });
  }
}

//Editar Turma
export async function editarTurma(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nome, diaSemana, horario, localTurma } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!nome || !diaSemana || !horario || !localTurma) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    await editarTurmaModel(id, nome, diaSemana, horario, localTurma);

    return res.status(200).json({ message: "Turma atualizada com sucesso!" });

  } catch (e: any) {
    console.error("Erro ao editar turma:", e);
    return res.status(500).json({ message: "Erro ao editar turma." });
  }
}

//Remover Turma
export async function removerTurma(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    await removerTurmaModel(id);

    return res.status(200).json({ message: "Turma removida com sucesso!" });

  } catch (e: any) {
    console.error("Erro ao remover turma:", e);
    return res.status(500).json({ message: "Erro ao remover turma." });
  }
}
