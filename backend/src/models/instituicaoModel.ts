// Autora: Alinne

import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// CRIAR INSTITUIÇÃO
export async function criarInstituicao(
  nome: string,
  sigla: string,
  usuarioId: number
) {
  //abre conexão com o banco
  const connection = await oracledb.getConnection(dbConfig);

  // insere uma nova instituição
  await connection.execute(
    `
      INSERT INTO instituicoes (usuario_id, nome, sigla)
      VALUES (:usuarioId, :nome, :sigla)
    `,
    // parâmetros enviados para a query
    { usuarioId, nome, sigla },
    { autoCommit: true }
  );

  // fecha a conexão
  await connection.close();
}

// BUSCAR TODAS AS INSTITUIÇÕES DO USUÁRIO
export async function buscarInstituicoesPorUsuario(usuarioId: number) {
  // conecta ao banco
  const connection = await oracledb.getConnection(dbConfig);

  // busca as instituições do usuário
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
    // retorna objeto ao invés de array de posições
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  // fecha conexão
  await connection.close();
  // retorna lista de instituições ou array vazio
  return result.rows || [];
}

// BUSCAR INSTITUIÇÃO POR ID
export async function buscarInstituicaoPorId(id: number) {
  // conecta ao banco
  const connection = await oracledb.getConnection(dbConfig);

  // busca instituição específica
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

  // fecha conexão
  await connection.close();
  // retorna primeira linha (ou null caso não exista)
  return (result.rows && result.rows[0]) || null;
}

// EDITAR INSTITUIÇÃO
export async function editarInstituicao(
  id: number,
  nome: string,
  sigla: string
) {
  // abre conexão
  const connection = await oracledb.getConnection(dbConfig);

  // atualiza dados da instituição
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

  // fecha conexão
  await connection.close();
}

// VERIFICAR SE UMA INSTITUIÇÃO POSSUI CURSO
export async function instituicaoTemCursos(id: number): Promise<boolean> {
  // conexão
  const connection = await oracledb.getConnection(dbConfig);

  // conta quantos cursos estão vinculados à instituição
  const result = await connection.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM cursos
      WHERE instituicao_id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  // fecha conexão
  await connection.close();

  // extrai numero total de cursos
  const total = Number((result.rows as any)[0].TOTAL);
  // retorna verdadeiro se tiver pelo menos 1 curso
  return total > 0;
}

// EXCLUIR INSTITUIÇÃO
export async function excluirInstituicao(id: number) {
  // abre conexão
  const connection = await oracledb.getConnection(dbConfig);

  // deleta instituição específica
  await connection.execute(
    `
      DELETE FROM instituicoes
      WHERE id = :id
    `,
    { id },
    { autoCommit: true }
  );

  // fecha conexão
  await connection.close();
}
