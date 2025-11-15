// src/models/alunoModel.ts
// Autor: (coloque seu nome aqui)
// Descrição: Acesso à tabela ALUNOS (cadastro e importação via CSV)

import { openConnection } from "../config/database";

// Representa uma linha da tabela ALUNOS
export interface Aluno {
  ID: number;
  MATRICULA: string;
  NOME: string;
  CRIADO_EM: Date;
  INSTITUICAO_ID: number;
  CURSO_ID: number;
  DISCIPLINA_ID: number;
  TURMA_ID: number;
}

// Dados necessários para criar um aluno na turma
export interface NovoAlunoInput {
  matricula: string;
  nome: string;
  instituicaoId: number;
  cursoId: number;
  disciplinaId: number;
  turmaId: number;
}

// Para importação via CSV: só matrícula e nome vêm do arquivo
export interface ImportAlunoCsv {
  matricula: string;
  nome: string;
}

/* ======================================================
   1) Criar aluno (cadastro individual)
   ====================================================== */
export async function criarAluno(dados: NovoAlunoInput): Promise<void> {
  const conn = await openConnection();

  try {
    await conn.execute(
      `
      INSERT INTO ALUNOS
        (MATRICULA, NOME, INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID, TURMA_ID)
      VALUES
        (:matricula, :nome, :instituicaoId, :cursoId, :disciplinaId, :turmaId)
      `,
      {
        matricula: dados.matricula,
        nome: dados.nome,
        instituicaoId: dados.instituicaoId,
        cursoId: dados.cursoId,
        disciplinaId: dados.disciplinaId,
        turmaId: dados.turmaId
      },
      { autoCommit: true }
    );
  } catch (error: any) {
    // ORA-00001 = violação de UNIQUE (UK_ALUNOS_MATRICULA)
    if (error && error.errorNum === 1) {
      throw new Error("Já existe um aluno com essa matrícula.");
    }
    throw error;
  } finally {
    await conn.close();
  }
}

/* ======================================================
   2) Listar alunos por turma
   ====================================================== */
export async function listarAlunosPorTurma(turmaId: number): Promise<Aluno[]> {
  const conn = await openConnection();

  try {
    const result = await conn.execute(
      `
      SELECT
        ID,
        MATRICULA,
        NOME,
        CRIADO_EM,
        INSTITUICAO_ID,
        CURSO_ID,
        DISCIPLINA_ID,
        TURMA_ID
      FROM ALUNOS
      WHERE TURMA_ID = :turmaId
      ORDER BY NOME
      `,
      { turmaId },
      {
        outFormat: (require("oracledb").OUT_FORMAT_OBJECT || undefined)
      }
    );

    return (result.rows || []) as Aluno[];
  } finally {
    await conn.close();
  }
}

/* ======================================================
   3) Buscar aluno por ID (se precisar em edição detalhada)
   ====================================================== */
export async function buscarAlunoPorId(id: number): Promise<Aluno | null> {
  const conn = await openConnection();

  try {
    const result = await conn.execute(
      `
      SELECT
        ID,
        MATRICULA,
        NOME,
        CRIADO_EM,
        INSTITUICAO_ID,
        CURSO_ID,
        DISCIPLINA_ID,
        TURMA_ID
      FROM ALUNOS
      WHERE ID = :id
      `,
      { id },
      {
        outFormat: (require("oracledb").OUT_FORMAT_OBJECT || undefined)
      }
    );

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Aluno;
  } finally {
    await conn.close();
  }
}

/* ======================================================
   4) Editar aluno
   - Você pode decidir se a matrícula pode mudar ou não.
   - Aqui deixei possível editar nome + matrícula.
   ====================================================== */
export async function editarAluno(
  id: number,
  nome: string,
  matricula: string
): Promise<void> {
  const conn = await openConnection();

  try {
    await conn.execute(
      `
      UPDATE ALUNOS
      SET
        NOME = :nome,
        MATRICULA = :matricula
      WHERE ID = :id
      `,
      { id, nome, matricula },
      { autoCommit: true }
    );
  } catch (error: any) {
    if (error && error.errorNum === 1) {
      // Bateu na UNIQUE da matrícula
      throw new Error("Já existe outro aluno com essa matrícula.");
    }
    throw error;
  } finally {
    await conn.close();
  }
}

/* ======================================================
   5) Remover aluno (um único)
   ====================================================== */
export async function removerAluno(id: number): Promise<void> {
  const conn = await openConnection();

  try {
    await conn.execute(
      `DELETE FROM ALUNOS WHERE ID = :id`,
      { id },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

/* ======================================================
   6) Importar lista de alunos (CSV)
   - Recebe o contexto da turma (ids) + array de {matricula, nome}
   - Ignora duplicatas de matrícula (não sobrescreve, como diz o escopo)
   ====================================================== */
export async function importarAlunosCsv(
  contexto: {
    instituicaoId: number;
    cursoId: number;
    disciplinaId: number;
    turmaId: number;
  },
  alunosCsv: ImportAlunoCsv[]
): Promise<{ inseridos: number; ignoradosDuplicados: number }> {
  const conn = await openConnection();

  const sql = `
    INSERT INTO ALUNOS
      (MATRICULA, NOME, INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID, TURMA_ID)
    VALUES
      (:matricula, :nome, :instituicaoId, :cursoId, :disciplinaId, :turmaId)
  `;

  let inseridos = 0;
  let ignoradosDuplicados = 0;

  try {
    for (const aluno of alunosCsv) {
      // garante que tem algo nas duas colunas
      if (!aluno.matricula || !aluno.nome) continue;

      try {
        await conn.execute(
          sql,
          {
            matricula: aluno.matricula,
            nome: aluno.nome,
            instituicaoId: contexto.instituicaoId,
            cursoId: contexto.cursoId,
            disciplinaId: contexto.disciplinaId,
            turmaId: contexto.turmaId
          },
          { autoCommit: false }
        );
        inseridos++;
      } catch (error: any) {
        if (error && error.errorNum === 1) {
          // ORA-00001 → matrícula já existe: ignorar e seguir
          ignoradosDuplicados++;
          continue;
        }
        throw error;
      }
    }

    await conn.commit();
    return { inseridos, ignoradosDuplicados };
  } catch (error) {
    // se algo MUITO errado acontecer, desfaz
    try {
      await conn.rollback();
    } catch {}
    throw error;
  } finally {
    await conn.close();
  }
}
