// Autora: Alinne

import { Request, Response } from "express";
import {
  criarCurso,
  buscarCursosPorInstituicao,
  buscarCursoPorId,
  editarCurso,
  excluirCurso,
  cursoTemDisciplinas
} from "../models/cursoModel";

// CADASTRAR CURSO
export const cadastrarCurso = async (req: Request, res: Response) => {
  try {
    // extrai dados enviados pelo frontend
    const { nome, sigla, coordenador, instituicaoId, usuarioId } = req.body;

    // validação básica
    if (!nome || !sigla || !coordenador || !instituicaoId || !usuarioId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    // chama o model para inserir o curso
    await criarCurso(nome, sigla, coordenador, Number(instituicaoId), Number(usuarioId));

    return res.status(201).json({ message: "Curso cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    return res.status(500).json({ message: "Erro ao cadastrar curso." });
  }
};

// LISTAR CURSOS DE UMA INSTITUIÇÃO
export const listarCursosPorInstituicao = async (req: Request, res: Response) => {
  try {
    // ID da instituição vem pela URL
    const instituicaoId = Number(req.params.instituicaoId);

    // se inválido = erro
    if (!instituicaoId) {
      return res.status(400).json({ message: "Instituição inválida." });
    }

    // busca cursos no model
    const cursos = await buscarCursosPorInstituicao(instituicaoId);
    // retorna lista
    return res.status(200).json(cursos);

  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return res.status(500).json({ message: "Erro ao listar cursos." });
  }
};

// ATUALIZAR CURSO
export const atualizarCurso = async (req: Request, res: Response) => {
  try {
    // ID pela URL e outros dados pelo body
    const id = Number(req.params.id);
    const { nome, sigla, coordenador } = req.body;

    // validação básica
    if (!id || !nome || !sigla || !coordenador) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    // verifica se o curso existe antes de editar
    const existe = await buscarCursoPorId(id);
    if (!existe) return res.status(404).json({ message: "Curso não encontrado." });

    // atualiza no model
    await editarCurso(id, nome, sigla, coordenador);

    return res.status(200).json({ message: "Curso atualizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao editar curso:", error);
    return res.status(500).json({ message: "Erro ao editar curso." });
  }
};

// REMOVER CURSO
export const removerCurso = async (req: Request, res: Response) => {
  try {
    // ID pela URL
    const id = Number(req.params.id);

    // validação
    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    // verifica se o curso existe
    const existe = await buscarCursoPorId(id);
    if (!existe) return res.status(404).json({ message: "Curso não encontrado." });

    // verifica se há disciplinas vinculadas
    const temDisc = await cursoTemDisciplinas(id);
    if (temDisc) {
      return res.status(403).json({
        message: "Não é possível excluir: existem disciplinas vinculadas."
      });
    }

    // remove curso
    await excluirCurso(id);
    return res.status(200).json({ message: "Curso removido com sucesso!" });

  } catch (error) {
    console.error("Erro ao remover curso:", error);
    return res.status(500).json({ message: "Erro ao remover curso." });
  }
};

// CONTAR DISCIPLINAS DE UM CURSO
export const contarDisciplinasDoCurso = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // verifica se o curso tem disciplinas
    const temDisc = await cursoTemDisciplinas(id);

    // retorna apenas 1 ou 0 como quantidade
    return res.status(200).json({ quantidade: temDisc ? 1 : 0 });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao verificar disciplinas." });
  }
};
