// Autoria: Alinne

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

// CADASTRAR INSTITUIÇÃO
export const cadastrarInstituicao = async (req: Request, res: Response) => {
  try {
    const { nome, sigla, usuarioId } = req.body;

    // validação básica
    if (!nome || !sigla || !usuarioId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    // salva a instituição no banco através do model
    await criarInstituicao(nome, sigla, usuarioId);

    // ao cadastrar a primeira instituição, remove o "primeiro acesso" do usuário
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `UPDATE usuarios SET primeiro_acesso = 0 WHERE id = :id`,
      { id: usuarioId }
    );
    await conn.close();
    //retorno de sucesso
    return res.status(201).json({ message: "Instituição cadastrada com sucesso!" });

  } catch (error) {
    console.error("Erro ao cadastrar instituição:", error);
    return res.status(500).json({ message: "Erro ao cadastrar instituição." });
  }
};

// LISTAR INSTITUIÇÕES DO USUÁRIO
export const listarInstituicoesPorUsuario = async (req: Request, res: Response) => {
  try {
    // converte o ID vindo da URL para número
    const usuarioId = Number(req.params.usuarioId);
    // se não for um número válido, retorna erro
    if (!usuarioId || isNaN(usuarioId)) {
      return res.status(400).json({ message: "Usuário inválido." });
    }
    // busca instituições no model
    const instituicoes = await buscarInstituicoesPorUsuario(usuarioId);

    //retorna para o front
    return res.status(200).json(instituicoes);

  } catch (error) {
    console.error("Erro ao listar instituições:", error);
    return res.status(500).json({ message: "Erro ao listar instituições." });
  }
};

// EDITAR INSTITUIÇÃO
export const atualizarInstituicao = async (req: Request, res: Response) => {
  try {
    // extrai os dados enviados pelo front
    const { id, nome, sigla } = req.body;

    //validação básica
    if (!id || !nome || !sigla) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    //verifica se a instituição existe
    const instituicao = await buscarInstituicaoPorId(id);

    if (!instituicao) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }

    // atualiza no model
    await editarInstituicao(id, nome, sigla);

    return res.status(200).json({ message: "Instituição atualizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao editar instituição:", error);
    return res.status(500).json({ message: "Erro ao editar instituição." });
  }
};

// REMOVER INSTITUIÇÃO
export const removerInstituicao = async (req: Request, res: Response) => {
  try {
    // captura o ID da instituição pela URL
    const id = Number(req.params.id);

    //validação
    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    // verifica se existe
    const existe = await buscarInstituicaoPorId(id);
    if (!existe) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }

    // verifica se há cursos vinculados
    const temCursos = await instituicaoTemCursos(id);
    if (temCursos) {
      return res.status(400).json({
        message: "Você não pode excluir uma instituição que possui cursos."
      });
    }

    // remove
    await excluirInstituicao(id);

    return res.status(200).json({ message: "Instituição removida com sucesso!" });

  } catch (error) {
    console.error("Erro ao excluir instituição:", error);
    return res.status(500).json({ message: "Erro ao excluir instituição." });
  }
};
