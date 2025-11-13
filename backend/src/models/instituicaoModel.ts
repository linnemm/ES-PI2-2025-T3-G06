import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// ======================================================
// CRIAR INSTITUIÇÃO
// ======================================================
export async function criarInstituicao(
  nome: string,
  sigla: string,
  usuarioId: number
) {
  const connection = await oracledb.getConnection(dbConfig);

  await connection.execute(
    `
      INSERT INTO instituicoes (usuario_id, nome, sigla)
      VALUES (:usuarioId, :nome, :sigla)
    `,
    { usuarioId, nome, sigla },
    { autoCommit: true }
  );

  await connection.close();
}

// ======================================================
// BUSCAR INSTITUIÇÕES VINCULADAS AO USUÁRIO
// ======================================================
export async function buscarInstituicoesPorUsuario(usuarioId: number) {
  const connection = await oracledb.getConnection(dbConfig);

  const result = await connection.execute(
    `
      SELECT 
        id        AS ID,
        nome      AS NOME,
        sigla     AS SIGLA,
        criado_em AS CRIADO_EM
      FROM instituicoes
      WHERE usuario_id = :usuarioId
      ORDER BY nome
    `,
    { usuarioId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();
  return result.rows || [];
}

// ======================================================
// BUSCAR UMA INSTITUIÇÃO PELO ID
// ======================================================
export async function buscarInstituicaoPorId(id: number) {
  const connection = await oracledb.getConnection(dbConfig);

  const result = await connection.execute(
    `
      SELECT 
        id AS ID,
        nome AS NOME,
        sigla AS SIGLA,
        usuario_id AS USUARIO_ID
      FROM instituicoes
      WHERE id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();
  return (result.rows && result.rows[0]) || null;
}

// ======================================================
// EDITAR INSTITUIÇÃO
// ======================================================
export async function editarInstituicao(
  id: number,
  nome: string,
  sigla: string
) {
  const connection = await oracledb.getConnection(dbConfig);

  await connection.execute(
    `
      UPDATE instituicoes
      SET nome = :nome,
          sigla = :sigla
      WHERE id = :id
    `,
    { nome, sigla, id },
    { autoCommit: true }
  );

  await connection.close();
}

// ======================================================
// VERIFICAR SE A INSTITUIÇÃO TEM CURSOS VINCULADOS
// ======================================================
export async function instituicaoTemCursos(id: number): Promise<boolean> {
  const connection = await oracledb.getConnection(dbConfig);

  const result = await connection.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM cursos
      WHERE instituicao_id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();

  const total = Number((result.rows as any)[0].TOTAL);
  return total > 0;
}

// ======================================================
// EXCLUIR INSTITUIÇÃO
// ======================================================
export async function excluirInstituicao(id: number) {
  const connection = await oracledb.getConnection(dbConfig);

  await connection.execute(
    `
      DELETE FROM instituicoes
      WHERE id = :id
    `,
    { id },
    { autoCommit: true }
  );

  await connection.close();
}
