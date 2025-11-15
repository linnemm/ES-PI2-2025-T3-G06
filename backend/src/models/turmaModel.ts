// src/models/turmaModel.ts
import { openConnection } from "../config/database";

export interface Turma {
  ID: number;
  NOME: string;
  DIA_SEMANA: string;
  HORARIO: string;
  LOCAL_TURMA: string;
  CURSO_ID: number;
  DISCIPLINA_ID: number;
  INSTITUICAO_ID: number;
  DISCIPLINA_NOME?: string;
  CODIGO?: string;
}

/* ======================================================
   FUNÇÃO AUXILIAR → Converte linhas do Oracle
====================================================== */
function mapRows(rows: any[] | undefined) {
  if (!rows || rows.length === 0) return [];

  return rows.map((r: any) => ({
    ID: r.ID,
    NOME: r.NOME,
    DIA_SEMANA: r.DIA_SEMANA,
    HORARIO: r.HORARIO,
    LOCAL_TURMA: r.LOCAL_TURMA,
    CURSO_ID: r.CURSO_ID,
    DISCIPLINA_ID: r.DISCIPLINA_ID,
    INSTITUICAO_ID: r.INSTITUICAO_ID,
    DISCIPLINA_NOME: r.DISCIPLINA_NOME,
    CODIGO: r.CODIGO,
  }));
}

/* ======================================================
   1) Criar Turma
====================================================== */
export async function criarTurma(dados: any): Promise<void> {
  const conn = await openConnection();

  try {
    await conn.execute(
      `
      INSERT INTO TURMAS
        (INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID, NOME, DIA_SEMANA, HORARIO, LOCAL_TURMA)
      VALUES
        (:instituicaoId, :cursoId, :disciplinaId, :nome, :diaSemana, :horario, :localTurma)
      `,
      dados,
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

/* ======================================================
   2) Listar turmas por CURSO
====================================================== */
export async function buscarTurmasPorCurso(cursoId: number) {
  const conn = await openConnection();

  try {
    const result = await conn.execute(
      `
        SELECT 
          t.id AS ID,
          t.nome AS NOME,
          t.dia_semana AS DIA_SEMANA,
          t.horario AS HORARIO,
          t.local_turma AS LOCAL_TURMA,
          t.curso_id AS CURSO_ID,
          t.disciplina_id AS DISCIPLINA_ID,
          t.instituicao_id AS INSTITUICAO_ID,
          d.nome AS DISCIPLINA_NOME,
          d.codigo AS CODIGO
        FROM turmas t
        JOIN disciplinas d ON d.id = t.disciplina_id
        WHERE t.curso_id = :cursoId
        ORDER BY t.nome
      `,
      { cursoId }
    );

    return mapRows(result.rows);

  } finally {
    await conn.close();
  }
}

/* ======================================================
   3) Listar turmas por DISCIPLINA
====================================================== */
export async function buscarTurmasPorDisciplina(disciplinaId: number) {
  const conn = await openConnection();

  try {
    const result = await conn.execute(
      `
        SELECT 
          t.id AS ID,
          t.nome AS NOME,
          t.dia_semana AS DIA_SEMANA,
          t.horario AS HORARIO,
          t.local_turma AS LOCAL_TURMA,
          t.curso_id AS CURSO_ID,
          t.disciplina_id AS DISCIPLINA_ID,
          t.instituicao_id AS INSTITUICAO_ID,
          d.nome AS DISCIPLINA_NOME,
          d.codigo AS CODIGO
        FROM turmas t
        JOIN disciplinas d ON d.id = t.disciplina_id
        WHERE t.disciplina_id = :disciplinaId
        ORDER BY t.nome
      `,
      { disciplinaId }
    );

    return mapRows(result.rows);

  } finally {
    await conn.close();
  }
}

/* ======================================================
   4) Buscar turma por ID (detalhes)
====================================================== */
export async function buscarTurmaPorId(id: number) {
  const conn = await openConnection();

  try {
    const result = await conn.execute(
      `
        SELECT 
          t.id AS ID,
          t.nome AS NOME,
          t.dia_semana AS DIA_SEMANA,
          t.horario AS HORARIO,
          t.local_turma AS LOCAL_TURMA,
          t.curso_id AS CURSO_ID,
          t.disciplina_id AS DISCIPLINA_ID,
          t.instituicao_id AS INSTITUICAO_ID,
          d.nome AS DISCIPLINA_NOME,
          d.codigo AS CODIGO
        FROM turmas t
        JOIN disciplinas d ON d.id = t.disciplina_id
        WHERE t.id = :id
      `,
      { id }
    );

    const mapped = mapRows(result.rows);
    return mapped[0] || null;

  } finally {
    await conn.close();
  }
}

/* ======================================================
   5) Editar Turma
====================================================== */
export async function editarTurmaModel(
  id: number,
  nome: string,
  diaSemana: string,
  horario: string,
  localTurma: string
) {
  const conn = await openConnection();

  try {
    await conn.execute(
      `
        UPDATE turmas
        SET nome = :nome,
            dia_semana = :diaSemana,
            horario = :horario,
            local_turma = :localTurma
        WHERE id = :id
      `,
      { id, nome, diaSemana, horario, localTurma },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}

/* ======================================================
   6) Remover Turma
====================================================== */
export async function removerTurmaModel(id: number) {
  const conn = await openConnection();

  try {
    await conn.execute(
      `DELETE FROM turmas WHERE id = :id`,
      { id },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
}
