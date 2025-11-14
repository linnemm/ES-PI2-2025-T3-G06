import { Request, Response } from "express";
import {
  inserirComponente,
  listarPorDisciplina,
  editarComponente,
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
      usuario_id   // ⭐ RECEBE AGORA COMO usuario_id (igual ao front)
    } = req.body;

    // -----------------------------
    // VALIDAÇÕES
    // -----------------------------
    if (!disciplinaId || !nome || !sigla || !tipoMedia) {
      return res.status(400).json({
        message: "Campos obrigatórios faltando."
      });
    }

    if (
      !usuario_id ||
      usuario_id === "null" ||
      usuario_id === "undefined"
    ) {
      return res.status(400).json({
        message: "Usuário não identificado."
      });
    }

    // -----------------------------
    // INSERIR NO BANCO
    // -----------------------------
    const novoId = await inserirComponente({
      disciplinaId,
      nome,
      sigla,
      descricao,
      peso,
      tipoMedia,
      usuario_id: Number(usuario_id) // ⭐ ENVIA PRO MODEL NO PADRÃO CERTO
    });

    return res.status(201).json({
      message: "Componente criado com sucesso!",
      id: novoId
    });

  } catch (e: any) {
    console.error("Erro ao criar componente:", e);
    return res.status(500).json({ message: e.message });
  }
}

// ===========================
// LISTAR COMPONENTES
// ===========================
export async function listarComponentes(req: Request, res: Response) {
  try {
    const { disciplinaId } = req.params;

    const lista = await listarPorDisciplina(Number(disciplinaId));

    return res.status(200).json(lista);

  } catch (e: any) {
    console.error("Erro ao listar componentes:", e);
    return res.status(500).json({ message: e.message });
  }
}

// ===========================
// EDITAR COMPONENTE
// ===========================
export async function atualizarComponente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    await editarComponente(Number(id), nome);

    return res.status(200).json({
      message: "Componente atualizado com sucesso!"
    });

  } catch (e: any) {
    console.error("Erro ao editar componente:", e);
    return res.status(500).json({ message: e.message });
  }
}

// ===========================
// DELETAR COMPONENTE
// ===========================
export async function deletarComponente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await removerComponente(Number(id));

    return res.status(200).json({
      message: "Componente removido com sucesso!"
    });

  } catch (e: any) {
    console.error("Erro ao remover componente:", e);
    return res.status(500).json({ message: e.message });
  }
}
