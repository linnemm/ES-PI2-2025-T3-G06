import oracledb from "oracledb";
import { openConnection } from "../config/database";

// ===========================================
// INSERIR COMPONENTE (COM LOG DE DEBUG)
// ===========================================
export async function inserirComponente(dados: any) {
  const conn = await openConnection();

  // LOG PARA DESCOBRIR O ERRO
  console.log("---- DADOS ENVIADOS PARA ORACLE ----");
  console.log("disciplinaId:", dados.disciplinaId);
  console.log("nome:", dados.nome);
  console.log("sigla:", dados.sigla);
  console.log("peso:", dados.peso);
  console.log("descricao:", dados.descricao);
  console.log("usuario:", dados.usuario_id);
  console.log("tipo_media:", dados.tipoMedia);
  console.log("-------------------------------------");

  const sql = `
    INSERT INTO COMPONENTES_NOTA
      (DISCIPLINA_ID, NOME, SIGLA, PESO, DESCRICAO, USUARIO_ID, TIPO_MEDIA)
    VALUES
      (:disciplina, :nome, :sigla, :peso, :descricao, :usuario, :tipo_media)
    RETURNING ID INTO :id
  `;

  const binds = {
    disciplina: dados.disciplinaId,
    nome: dados.nome,
    sigla: dados.sigla,
    peso: dados.peso,
    descricao: dados.descricao ?? null,
    usuario: dados.usuario_id,
    tipo_media: dados.tipoMedia,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result: any = await conn.execute(sql, binds, { autoCommit: true });
  await conn.close();

  return result.outBinds.id[0];
}


// ===========================================
// LISTAR POR DISCIPLINA
// ===========================================
export async function listarPorDisciplina(disciplinaId: number) {
  const conn = await openConnection();

  const sql = `
    SELECT ID, NOME, SIGLA, PESO, DESCRICAO, TIPO_MEDIA
    FROM COMPONENTES_NOTA
    WHERE DISCIPLINA_ID = :id
    ORDER BY ID
  `;

  const result = await conn.execute(sql, { id: disciplinaId });
  await conn.close();

  return result.rows;
}


// ===========================================
// EDITAR COMPONENTE
// ===========================================
export async function editarComponente(id: number, nome: string) {
  const conn = await openConnection();

  const sql = `
    UPDATE COMPONENTES_NOTA
    SET NOME = :nome
    WHERE ID = :id
  `;

  await conn.execute(sql, { nome, id }, { autoCommit: true });
  await conn.close();
}


// ===========================================
// REMOVER COMPONENTE
// ===========================================
export async function removerComponente(id: number) {
  const conn = await openConnection();

  const sql = `DELETE FROM COMPONENTES_NOTA WHERE ID = :id`;

  await conn.execute(sql, { id }, { autoCommit: true });
  await conn.close();
}
