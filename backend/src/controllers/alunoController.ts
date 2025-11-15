// src/controllers/alunoController.ts
// Autor: <seu nome>
// Controlador responsável por operações com alunos

import { Request, Response } from "express";
import {
  criarAluno,
  listarAlunosPorTurma,
  buscarAlunoPorId,
  editarAluno,
  removerAluno,
  importarAlunosCsv,
  ImportAlunoCsv
} from "../models/alunoModel";
import * as fs from "fs";
import * as path from "path";

/* ======================================================
   1) Cadastrar aluno individual
   ====================================================== */
export async function cadastrarAluno(req: Request, res: Response) {
  try {
    const {
      matricula,
      nome,
      instituicaoId,
      cursoId,
      disciplinaId,
      turmaId
    } = req.body;

    if (!matricula || !nome || !instituicaoId || !cursoId || !disciplinaId || !turmaId) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios."
      });
    }

    await criarAluno({
      matricula,
      nome,
      instituicaoId,
      cursoId,
      disciplinaId,
      turmaId
    });

    return res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao cadastrar aluno:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ======================================================
   2) Listar alunos de uma turma
   ====================================================== */
export async function listarPorTurma(req: Request, res: Response) {
  try {
    const turmaId = Number(req.params.turmaId);

    if (!turmaId) return res.status(400).json({ message: "turmaId inválido." });

    const alunos = await listarAlunosPorTurma(turmaId);

    return res.status(200).json(alunos);
  } catch (error: any) {
    console.error("Erro ao listar alunos da turma:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ======================================================
   3) Buscar aluno por ID
   ====================================================== */
export async function obterAluno(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const aluno = await buscarAlunoPorId(id);

    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado." });
    }

    return res.status(200).json(aluno);
  } catch (error: any) {
    console.error("Erro ao buscar aluno:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ======================================================
   4) Editar aluno
   ====================================================== */
export async function editarAlunoController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nome, matricula } = req.body;

    if (!nome || !matricula) {
      return res.status(400).json({ message: "Nome e matrícula são obrigatórios." });
    }

    await editarAluno(id, nome, matricula);

    return res.status(200).json({ message: "Aluno atualizado com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao editar aluno:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ======================================================
   5) Remover aluno
   ====================================================== */
export async function removerAlunoController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await removerAluno(id);

    return res.status(200).json({ message: "Aluno removido com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao remover aluno:", error);
    return res.status(500).json({ message: error.message });
  }
}

/* ======================================================
   6) Importar alunos via CSV
   (somente duas colunas: matrícula e nome)
   ====================================================== */
export async function importarAlunosCsvController(req: Request, res: Response) {
  try {
    const { instituicaoId, cursoId, disciplinaId, turmaId } = req.body;

    if (!instituicaoId || !cursoId || !disciplinaId || !turmaId) {
      return res.status(400).json({
        message: "Os IDs de instituição, curso, disciplina e turma são obrigatórios."
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo CSV enviado." });
    }

    const filePath = path.resolve(req.file.path);

    // Lê CSV
    const conteudo = fs.readFileSync(filePath, "utf8");

    // Remove arquivo após leitura
    fs.unlinkSync(filePath);

    const linhas = conteudo.split("\n").map(l => l.trim()).filter(l => l !== "");

    const alunosCsv: ImportAlunoCsv[] = [];

    for (const linha of linhas) {
      const partes = linha.split(",");

      if (partes.length < 2) continue;

      alunosCsv.push({
        matricula: partes[0].trim(),
        nome: partes[1].trim()
      });
    }

    const resultado = await importarAlunosCsv(
      { instituicaoId, cursoId, disciplinaId, turmaId },
      alunosCsv
    );

    return res.status(200).json({
      message: "Importação concluída!",
      inseridos: resultado.inseridos,
      ignoradosDuplicados: resultado.ignoradosDuplicados
    });

  } catch (error: any) {
    console.error("Erro ao importar CSV:", error);
    return res.status(500).json({ message: error.message });
  }
}
