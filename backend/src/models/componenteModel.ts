import oracledb from "oracledb";
import { openConnection } from "../config/database";

// ====================================================================
// 1) LISTAR COMPONENTES DA DISCIPLINA
// ====================================================================
export async function listarPorDisciplina(disciplinaId: number) {
  const conn = await openConnection();

  const result = await conn.execute(
    `
      SELECT ID, NOME, SIGLA, PESO, DESCRICAO, TIPO_MEDIA
      FROM COMPONENTES_NOTA
      WHERE DISCIPLINA_ID = :id
      ORDER BY ID
    `,
    { id: disciplinaId }
  );

  await conn.close();

  // rows pode ser undefined, então garantimos array vazio
  return (result.rows as any[]) || [];
}

// ====================================================================
// 2) VERIFICAR NOME OU SIGLA DUPLICADOS
// ====================================================================
export async function existeComponenteIgual(
  disciplinaId: number,
  nome: string,
  sigla: string
) {
  const conn = await openConnection();

  const result = await conn.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM COMPONENTES_NOTA
      WHERE DISCIPLINA_ID = :disc
      AND (NOME = :nome OR SIGLA = :sigla)
    `,
    { disc: disciplinaId, nome, sigla }
  );

  await conn.close();

  const rows = (result.rows as any[]) || [];
  if (rows.length === 0) return false;

  const linha: any = rows[0];
  const total = linha.TOTAL ?? linha[0] ?? 0;

  return Number(total) > 0;
}

// ====================================================================
// 3) SOMA DOS PESOS DA DISCIPLINA
// ====================================================================
export async function somaPesos(disciplinaId: number) {
  const conn = await openConnection();

  const result = await conn.execute(
    `
      SELECT SUM(PESO) AS TOTAL
      FROM COMPONENTES_NOTA
      WHERE DISCIPLINA_ID = :disc
    `,
    { disc: disciplinaId }
  );

  await conn.close();

  const rows = (result.rows as any[]) || [];
  if (rows.length === 0) return 0;

  const linha: any = rows[0];
  const total = linha.TOTAL ?? linha[0] ?? 0;

  return Number(total);
}

// ====================================================================
// 4) INSERIR COMPONENTE (COM TODAS AS REGRAS DE NEGÓCIO)
// ====================================================================
export async function inserirComponente(dados: any) {
  const {
    disciplinaId,
    nome,
    sigla,
    descricao,
    peso,
    tipoMedia,
    usuario_id
  } = dados;

  console.log("========================================");
  console.log("NOVO COMPONENTE RECEBIDO:");
  console.log(dados);
  console.log("========================================");

  // --------------------------------------------------------------------
  // REGRA 1 — nome e sigla não podem repetir
  // --------------------------------------------------------------------
  const igual = await existeComponenteIgual(disciplinaId, nome, sigla);
  if (igual) {
    throw new Error("Já existe um componente com este nome OU sigla nesta disciplina.");
  }

  // --------------------------------------------------------------------
  // REGRA 2 — disciplina só pode ter um tipo de média
  // --------------------------------------------------------------------
  const existentes = await listarPorDisciplina(disciplinaId);

  if (existentes.length > 0) {
    const primeiro: any = existentes[0];
    const tipoExistente = primeiro.TIPO_MEDIA;

    if (tipoExistente !== tipoMedia) {
      throw new Error(
        `Esta disciplina já utiliza média "${tipoExistente}". Todos os componentes devem ser "${tipoExistente}".`
      );
    }
  }

  // --------------------------------------------------------------------
  // REGRA 3 — validar soma dos pesos
  // --------------------------------------------------------------------
  if (tipoMedia === "ponderada") {
    const totalAtual = await somaPesos(disciplinaId);
    const pesoNumero = Number(peso) || 0;
    const totalDepois = totalAtual + pesoNumero;

    if (totalDepois > 100) {
      throw new Error(
        `A soma dos pesos ultrapassa 100! Soma atual: ${totalAtual}. Soma com este: ${totalDepois}.`
      );
    }
  }

  // --------------------------------------------------------------------
  // INSERÇÃO NO BANCO
  // --------------------------------------------------------------------
  const conn = await openConnection();

  const sql = `
    INSERT INTO COMPONENTES_NOTA
      (DISCIPLINA_ID, NOME, SIGLA, PESO, DESCRICAO, USUARIO_ID, TIPO_MEDIA)
    VALUES
      (:disciplina, :nome, :sigla, :peso, :descricao, :usuario, :tipo_media)
    RETURNING ID INTO :id
  `;

  const binds = {
    disciplina: disciplinaId,
    nome,
    sigla,
    peso: tipoMedia === "simples" ? null : peso,
    descricao: descricao ?? null,
    usuario: usuario_id,
    tipo_media: tipoMedia,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result = await conn.execute(sql, binds, { autoCommit: true }) as any;
  await conn.close();

  const novoId = result.outBinds?.id?.[0] ?? null;
  return novoId;
}

// ====================================================================
// 5) REMOVER COMPONENTE
// ====================================================================
export async function removerComponente(id: number) {
  const conn = await openConnection();

  await conn.execute(
    `DELETE FROM COMPONENTES_NOTA WHERE ID = :id`,
    { id },
    { autoCommit: true }
  );

  await conn.close();
}
