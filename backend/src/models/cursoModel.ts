import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// ======================================================
// CRIAR CURSO
// ======================================================
export async function createCurso(
  nome: string,
  sigla: string,
  coordenador: string,
  instituicaoId: number,
  usuarioId: number
) {
  const conn = await oracledb.getConnection(dbConfig);

  await conn.execute(
    `
      INSERT INTO cursos (nome, sigla, coordenador, instituicao_id, usuario_id)
      VALUES (:nome, :sigla, :coordenador, :instituicaoId, :usuarioId)
    `,
    { nome, sigla, coordenador, instituicaoId, usuarioId },
    { autoCommit: true }
  );

  await conn.close();
}

// ======================================================
// BUSCAR CURSOS POR INSTITUIÇÃO
// ======================================================
export async function getCursosByInstituicao(instituicaoId: number) {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT 
        id            AS ID,
        nome          AS NOME,
        sigla         AS SIGLA,
        coordenador   AS COORDENADOR,
        criado_em     AS CRIADO_EM,
        usuario_id    AS USUARIO_ID
      FROM cursos
      WHERE instituicao_id = :id
      ORDER BY nome
    `,
    { id: instituicaoId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  return result.rows || [];
}
