// Autora: Alycia

import { Request, Response } from "express";

import {
  criarDisciplina,
  buscarDisciplinasPorCurso,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  excluirDisciplina,
  contarDisciplinasPorCurso,
  verificarCodigoRepetido,
  verificarDisciplinaTemTurmas
} from "../models/disciplinaModel";


// CADASTRAR DISCIPLINA
export const cadastrarDisciplina = async (req: Request, res: Response) => {
  try {
    // dados enviados pelo front
    const { nome, sigla, codigo, periodo, usuarioId, instituicaoId, cursoId } = req.body;

    // verificação basica
    if (!nome || !sigla || !codigo || !periodo || !usuarioId || !instituicaoId || !cursoId) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    // evita códigos duplicados dentro do mesmo curso
    const codigoExiste = await verificarCodigoRepetido(cursoId, codigo);
    if (codigoExiste) {
      return res.status(400).json({
        message: "Já existe uma disciplina com esse código neste curso."
      });
    }

    // grava no banco
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

// LISTAR DISCIPLINAS POR CURSO
export const listarDisciplinasPorCurso = async (req: Request, res: Response) => {
  try {
    // ID do curso vem pels URL
    const cursoId = Number(req.params.cursoId);

    if (!cursoId) {
      return res.status(400).json({ message: "Curso inválido." });
    }

    // busca no banco todas as disciplinas ligadas a esse curso
    const disciplinas = await buscarDisciplinasPorCurso(cursoId);

    // retorna lista para o front
    return res.status(200).json(disciplinas);

  } catch (error) {
    console.error("Erro ao listar disciplinas:", error);
    return res.status(500).json({ message: "Erro ao listar disciplinas." });
  }
};


// OBTER DADOS DE UMA DISCIPLINA ESPECÍFICA PELO ID
export const obterDisciplina = async (req: Request, res: Response) => {
  try {
    // id da disciplina vem pela URL
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    // busca a disciplina no banco
    const disciplina = await buscarDisciplinaPorId(id);
    if (!disciplina) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    // retorna os dados da disciplina
    return res.status(200).json(disciplina);

  } catch (error) {
    console.error("Erro ao buscar disciplina:", error);
    return res.status(500).json({ message: "Erro ao buscar disciplina." });
  }
};


// RETORNAR UMA DISCIPLINA EXISTENTE
export const editarDisciplinaController = async (req: Request, res: Response) => {
  try {
    // id da disciplina vem pela URL
    const id = Number(req.params.id);
    // novos dados vem no corpo da requisição
    const { nome, sigla, codigo, periodo } = req.body;

    // valida se tudo necessário foi enviado
    if (!id || !nome || !sigla || !codigo || !periodo) {
      return res.status(400).json({ message: "Dados insuficientes." });
    }

    // confere se a disciplina realmente existe antes de editar
    const existente = await buscarDisciplinaPorId(id);
    if (!existente) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    // verificar código duplicado ao editar
    // se o código foi alterado, verifica se não existe outro igual
    if (codigo !== existente.CODIGO) {
      const codigoRepetido = await verificarCodigoRepetido(existente.CURSO_ID, codigo);

      if (codigoRepetido) {
        return res.status(400).json({
          message: "Já existe uma disciplina com esse código neste curso."
        });
      }
    }

    // atualiza os dados da disciplina no banco
    await atualizarDisciplina(id, nome, sigla, codigo, periodo);

    return res.status(200).json({ message: "Disciplina atualizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
    return res.status(500).json({ message: "Erro ao atualizar disciplina." });
  }
};


// REMOVER DISCIPLINAS
export const removerDisciplinaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID inválido." });
    }

    // verifica se a disciplina existe
    const existente = await buscarDisciplinaPorId(id);
    if (!existente) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    // não pode excluir disciplinas que tenham turmas vinculadas
    const temTurmas = await verificarDisciplinaTemTurmas(id);
    if (temTurmas) {
      return res.status(400).json({
        message: "Não é possível excluir: existem turmas vinculadas."
      });
    }

    // remove disciplina
    await excluirDisciplina(id);

    return res.status(200).json({ message: "Disciplina removida com sucesso!" });

  } catch (error) {
    console.error("Erro ao excluir disciplina:", error);
    return res.status(500).json({ message: "Erro ao excluir disciplina." });
  }
};

// retorna apenas a quantidade de disciplinas de um curso | auxilia tela de dashboard
export const quantidadeDisciplinasPorCurso = async (req: Request, res: Response) => {
  try {
    const cursoId = Number(req.params.cursoId);

    if (!cursoId) {
      return res.status(400).json({ message: "Curso inválido." });
    }

    // busca no banco o total de disciplinas ligadas ao curso
    const quantidade = await contarDisciplinasPorCurso(cursoId);

    // retorna só o número, em um JSON
    return res.status(200).json({ quantidade });

  } catch (error) {
    console.error("Erro ao contar disciplinas:", error);
    return res.status(500).json({ message: "Erro ao contar disciplinas." });
  }
};
