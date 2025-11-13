import { Request, Response } from "express";
import {
  criarInstituicao,
  buscarInstituicoesPorUsuario,
  buscarInstituicaoPorId,
  editarInstituicao,
  excluirInstituicao,
  instituicaoTemCursos
} from "../models/instituicaoModel";

import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// ======================================================
//  CADASTRAR INSTITUIÇÃO
// ======================================================
export const cadastrarInstituicao = async (req: Request, res: Response) => {
  try {
    const { nome, sigla, usuarioId } = req.body;

    if (!nome || !sigla || !usuarioId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    await criarInstituicao(nome, sigla, usuarioId);

    // Marca primeiro acesso como concluído
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `UPDATE usuarios SET primeiro_acesso = 0 WHERE id = :id`,
      { id: usuarioId },
      { autoCommit: true }
    );
    await conn.close();

    return res.status(201).json({ message: "Instituição cadastrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar instituição:", error);
    return res.status(500).json({ message: "Erro ao cadastrar instituição." });
  }
};

// ======================================================
//  LISTAR INSTITUIÇÕES DO USUÁRIO
// ======================================================
export const listarInstituicoesPorUsuario = async (req: Request, res: Response) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    if (!usuarioId) {
      return res.status(400).json({ message: "Usuário inválido." });
    }

    const instituicoes = await buscarInstituicoesPorUsuario(usuarioId);
    return res.status(200).json(instituicoes);
  } catch (error) {
    console.error("Erro ao listar instituições:", error);
    return res.status(500).json({ message: "Erro ao listar instituições." });
  }
};

// ======================================================
//  EDITAR INSTITUIÇÃO  (BODY → ID, nome, sigla)
// ======================================================
export const atualizarInstituicao = async (req: Request, res: Response) => {
  try {
    const { id, nome, sigla } = req.body;

    if (!id || !nome || !sigla) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    const existe = await buscarInstituicaoPorId(id);
    if (!existe) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }

    await editarInstituicao(id, nome, sigla);

    return res.status(200).json({ message: "Instituição atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar instituição:", error);
    return res.status(500).json({ message: "Erro ao editar instituição." });
  }
};

// ======================================================
//  REMOVER INSTITUIÇÃO  (BODY → id)
// ======================================================
export const removerInstituicao = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    const existe = await buscarInstituicaoPorId(id);
    if (!existe) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }

    const temCursos = await instituicaoTemCursos(id);
    if (temCursos) {
      return res.status(403).json({
        message: "Não é possível excluir: existem cursos vinculados."
      });
    }

    await excluirInstituicao(id);

    return res.status(200).json({ message: "Instituição removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir instituição:", error);
    return res.status(500).json({ message: "Erro ao excluir instituição." });
  }
};
