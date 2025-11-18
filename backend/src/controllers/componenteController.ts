// ===========================================
// componenteController.ts — VERSÃO APROVADA
// ===========================================

import { Request, Response } from "express";
import {
  inserirComponente,
  listarPorDisciplina,
  removerComponente
} from "../models/componenteModel";

// ===========================
// CRIAR COMPONENTE
// ===========================
export async function criarComponente(req: Request, res: Response) {
  try {
    const {
      disciplinaId,
      nome,
      sigla,
      descricao,
      peso,
      tipoMedia,
      usuario_id
    } = req.body;

    // Básico
    if (!disciplinaId || !nome || !sigla || !tipoMedia) {
      return res.status(400).json({ message: "Campos obrigatórios faltando." });
    }

    if (!usuario_id || usuario_id === "null" || usuario_id === "undefined") {
      return res.status(400).json({ message: "Usuário não identificado." });
    }

    const tipo = String(tipoMedia).trim().toLowerCase();

    if (tipo !== "simples" && tipo !== "ponderada") {
      return res.status(400).json({
        message: "Tipo de média inválido. Use 'simples' ou 'ponderada'."
      });
    }

    // Peso → só se for ponderada
    let pesoNormalizado: number | null = null;

    if (tipo === "ponderada") {
      if (!peso && peso !== 0) {
        return res.status(400).json({
          message: "Peso é obrigatório para média ponderada."
        });
      }

      const pesoNum = Number(peso);

      if (isNaN(pesoNum) || pesoNum <= 0) {
        return res.status(400).json({
          message: "Peso inválido. Deve ser maior que 0."
        });
      }

      pesoNormalizado = pesoNum;
    }

    // INSERE NO BANCO — regras no model
    const novoId = await inserirComponente({
      disciplinaId: Number(disciplinaId),
      nome,
      sigla,
      descricao,
      peso: pesoNormalizado,
      tipoMedia: tipo,
      usuario_id: Number(usuario_id)
    });

    return res.status(201).json({
      message: "Componente criado com sucesso!",
      id: novoId
    });

  } catch (error: any) {
    console.error("Erro ao criar componente:", error);
    return res.status(400).json({ message: error.message });
  }
}

// ===========================
// LISTAR COMPONENTES POR DISCIPLINA
// ===========================
export async function listarComponentes(req: Request, res: Response) {
  try {
    const { disciplinaId } = req.params;

    const lista = await listarPorDisciplina(Number(disciplinaId));

    return res.status(200).json(lista);

  } catch (error: any) {
    console.error("Erro ao listar componentes:", error);
    return res.status(500).json({ message: error.message });
  }
}

// ===========================
// REMOVER COMPONENTE
// ===========================
export async function deletarComponente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await removerComponente(Number(id));

    return res.status(200).json({
      message: "Componente removido com sucesso!"
    });

  } catch (error: any) {
    console.error("Erro ao remover componente:", error);
    return res.status(500).json({ message: error.message });
  }
}
