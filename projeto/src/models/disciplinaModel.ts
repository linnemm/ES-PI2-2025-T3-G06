// Autora: Alycia

import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// tipo que representa uma disciplina vinda do banco de dados
export interface Disciplina {
  ID: number;
  NOME: string;
  SIGLA: string;
  CODIGO: string;
  PERIODO: string;
  INSTITUICAO_ID: number;
  CURSO_ID: number;
  USUARIO_ID: number;
  PROFESSOR_NOME?: string;
  CRIADO_EM?: Date;
}

// CRIAR DISCIPLINA
export async function criarDisciplina(
  nome: string,
  sigla: string,
  codigo: string,
  periodo: string,
  usuarioId: number,
  instituicaoId: number,
  cursoId: number
) {
  const conn = await oracledb.getConnection(dbConfig);

  // insere a disciplina no banco
  await conn.execute(
    `
      INSERT INTO disciplinas (
        nome, sigla, codigo, periodo, usuario_id, instituicao_id, curso_id
      )
      VALUES (
        :nome, :sigla, :codigo, :periodo, :usuarioId, :instituicaoId, :cursoId
      )
    `,
    { nome, sigla, codigo, periodo, usuarioId, instituicaoId, cursoId },
    { autoCommit: true }
  );

  await conn.close();
}




// BUSCAR DISCIPLINAS POR CURSO (COM NOME DO PROFESSOR)
export async function buscarDisciplinasPorCurso(cursoId: number) {
  const conn = await oracledb.getConnection(dbConfig);

  // LEFT JOIN para trazer o nome do professor (usuário)
  const result = await conn.execute(
    `
      SELECT
        d.id             AS ID,
        d.nome           AS NOME,
        d.sigla          AS SIGLA,
        d.codigo         AS CODIGO,
        d.periodo        AS PERIODO,
        d.instituicao_id AS INSTITUICAO_ID,
        d.curso_id       AS CURSO_ID,
        d.usuario_id     AS USUARIO_ID,
        u.nome           AS PROFESSOR_NOME,
        d.criado_em      AS CRIADO_EM
      FROM disciplinas d
      LEFT JOIN usuarios u
        ON u.id = d.usuario_id
      WHERE d.curso_id = :cursoId
      ORDER BY d.nome
    `,
    { cursoId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  return result.rows as Disciplina[];
}




// BUSCAR DISCIPLINA POR ID
export async function buscarDisciplinaPorId(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT
        d.id             AS ID,
        d.nome           AS NOME,
        d.sigla          AS SIGLA,
        d.codigo         AS CODIGO,
        d.periodo        AS PERIODO,
        d.instituicao_id AS INSTITUICAO_ID,
        d.curso_id       AS CURSO_ID,
        d.usuario_id     AS USUARIO_ID,
        u.nome           AS PROFESSOR_NOME,
        d.criado_em      AS CRIADO_EM
      FROM disciplinas d
      LEFT JOIN usuarios u
        ON u.id = d.usuario_id
      WHERE d.id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  // Retorna apenas uma disciplina ou null caso não exista
  return (result.rows as Disciplina[])[0] || null;
}



// ATUALIZAR DISCIPLINA
export async function atualizarDisciplina(
  id: number,
  nome: string,
  sigla: string,
  codigo: string,
  periodo: string
) {
  const conn = await oracledb.getConnection(dbConfig);

  await conn.execute(
    `
      UPDATE disciplinas
      SET nome = :nome, sigla = :sigla, codigo = :codigo, periodo = :periodo
      WHERE id = :id
    `,
    { id, nome, sigla, codigo, periodo },
    { autoCommit: true }
  );

  await conn.close();
}




// EXCLUIR DISCIPLINA
export async function excluirDisciplina(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  await conn.execute(
    `
      DELETE FROM disciplinas
      WHERE id = :id
    `,
    { id },
    { autoCommit: true }
  );

  await conn.close();
}




// CONTAR DISCIPLINAS POR CURSO (para excluir curso)
export async function contarDisciplinasPorCurso(
  cursoId: number
): Promise<number> {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM disciplinas
      WHERE curso_id = :cursoId
    `,
    { cursoId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  // retorna somente o numero
  return Number((result.rows as any)[0].TOTAL);
}



// VERIFICAR CÓDIGO REPETIDO NO MESMO CURSO
export async function verificarCodigoRepetido(cursoId: number, codigo: string) {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM disciplinas
      WHERE curso_id = :cursoId
        AND UPPER(codigo) = UPPER(:codigo)
    `,
    { cursoId, codigo },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  return Number((result.rows as any)[0].TOTAL) > 0;
}

// VERIFICAR SE A DISCIPLINA TEM TURMAS
export async function verificarDisciplinaTemTurmas(disciplinaId: number) {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM turmas
      WHERE disciplina_id = :disciplinaId
    `,
    { disciplinaId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  return Number((result.rows as any)[0].TOTAL) > 0;
}
