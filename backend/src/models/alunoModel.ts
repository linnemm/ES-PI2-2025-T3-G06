// Autoria: Livia

// MODEL — ALUNOS 

import { openConnection } from "../config/database";
import oracledb from "oracledb";

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

export interface NovoAlunoInput {
  matricula: string;
  nome: string;
  instituicaoId: number;
  cursoId: number;
  disciplinaId: number;
  turmaId: number;
}

export interface ImportAlunoCsv {
  matricula: string;
  nome: string;
}

/* Verificar matrícula duplicada */

export async function verificarMatriculaDuplicada(
  matricula: string,
  turmaId: number,
  ignorarAlunoId?: number
): Promise<boolean> {

  const conn = await openConnection();

  try {
    let sql = `
      SELECT COUNT(*) AS TOTAL
      FROM ALUNOS
      WHERE MATRICULA = :matricula
        AND TURMA_ID = :turmaId
    `;

    const binds: any = { matricula, turmaId };

    if (ignorarAlunoId) {
      sql += ` AND ID <> :ignorarAlunoId`;
      binds.ignorarAlunoId = ignorarAlunoId;
    }

    const result = await conn.execute(
      sql,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return (result.rows as any)[0].TOTAL > 0;

  } finally {
    await conn.close();
  }
}

/* Criar aluno */

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
    if (error.errorNum === 1) {
      throw new Error("Já existe um aluno com essa matrícula.");
    }
    throw error;

  } finally {
    await conn.close();
  }
}

/* Listar alunos por turma */

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
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows as Aluno[];

  } finally {
    await conn.close();
  }
}

/* Buscar aluno por ID */
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
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows?.[0] as Aluno || null;

  } finally {
    await conn.close();
  }
}

/* Editar aluno */

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
    if (error.errorNum === 1) {
      throw new Error("Já existe outro aluno com essa matrícula.");
    }
    throw error;

  } finally {
    await conn.close();
  }
}

/* Remover aluno */

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

/* Importação CSV */

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
  let inseridos = 0;
  let ignoradosDuplicados = 0;

  try {
    for (const aluno of alunosCsv) {

      if (!aluno.matricula || !aluno.nome) continue;

      try {
        await conn.execute(
          `
          INSERT INTO ALUNOS
            (MATRICULA, NOME, INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID, TURMA_ID)
          VALUES
            (:matricula, :nome, :instituicaoId, :cursoId, :disciplinaId, :turmaId)
          `,
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

      } catch (err: any) {
        if (err.errorNum === 1) {
          ignoradosDuplicados++;
          continue;
        }
        throw err;
      }
    }

    await conn.commit();
    return { inseridos, ignoradosDuplicados };

  } catch (err) {
    try { await conn.rollback(); } catch {}
    throw err;

  } finally {
    await conn.close();
  }
}
