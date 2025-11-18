import oracledb from "oracledb";
import { openConnection } from "../config/database";

// ============================================================
// 1) LISTAR COMPONENTES DE UMA DISCIPLINA
// ============================================================
export async function listarPorDisciplina(disciplinaId: number) {
  const conn = await openConnection();

  const result = await conn.execute(
    `
      SELECT 
        ID,
        NOME,
        SIGLA,
        PESO,
        DESCRICAO,
        TIPO_MEDIA
      FROM COMPONENTES_NOTA
      WHERE DISCIPLINA_ID = :id
      ORDER BY ID
    `,
    { id: disciplinaId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  return (result.rows as any[]) || [];
}

// ============================================================
// 2) VERIFICAR SE EXISTE NOME OU SIGLA REPETIDOS
// ============================================================
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
    { disc: disciplinaId, nome, sigla },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  const total = Number((result.rows as any)[0]?.TOTAL || 0);
  return total > 0;
}

// ============================================================
// 3) SOMA DOS PESOS DA DISCIPLINA
// ============================================================
export async function somaPesos(disciplinaId: number) {
  const conn = await openConnection();

  const result = await conn.execute(
    `
      SELECT SUM(PESO) AS TOTAL
      FROM COMPONENTES_NOTA
      WHERE DISCIPLINA_ID = :disc
    `,
    { disc: disciplinaId },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();

  return Number((result.rows as any)[0]?.TOTAL || 0);
}

// ============================================================
// 4) INSERIR COMPONENTE COM TODAS AS REGRAS DE NEGÓCIO
// ============================================================
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
  console.log(" NOVO COMPONENTE RECEBIDO ");
  console.log(dados);
  console.log("========================================");

  // -------------------------
  // REGRA 1 — Nome ou sigla duplicados
  // -------------------------
  const duplicado = await existeComponenteIgual(disciplinaId, nome, sigla);
  if (duplicado) {
    throw new Error("Já existe um componente com este nome OU sigla nesta disciplina.");
  }

  // -------------------------
  // REGRA 2 — Tipo de média deve ser único na disciplina
  // -------------------------
  const existentes = await listarPorDisciplina(disciplinaId);

  if (existentes.length > 0) {
    const tipoExistente = existentes[0].TIPO_MEDIA;

    if (tipoExistente !== tipoMedia) {
      throw new Error(
        `Esta disciplina já utiliza média "${tipoExistente}". Todos os componentes devem ser "${tipoExistente}".`
      );
    }
  }

  // -------------------------
  // REGRA 3 — Soma de pesos não pode passar de 100
  // -------------------------
  if (tipoMedia === "ponderada") {
    const pesoAtual = await somaPesos(disciplinaId);
    const pesoNovo = Number(peso) || 0;

    if (pesoAtual + pesoNovo > 100) {
      throw new Error(
        `A soma dos pesos ultrapassa 100%. Soma atual: ${pesoAtual}%. Soma após este: ${pesoAtual + pesoNovo}%.`
      );
    }
  }

  // -------------------------
  // INSERIR NO BANCO
  // -------------------------
  const conn = await openConnection();

  const sql = `
    INSERT INTO COMPONENTES_NOTA
    (
      DISCIPLINA_ID,
      NOME,
      SIGLA,
      PESO,
      DESCRICAO,
      USUARIO_ID,
      TIPO_MEDIA
    )
    VALUES
    (
      :disciplina,
      :nome,
      :sigla,
      :peso,
      :descricao,
      :usuario,
      :tipo_media
    )
    RETURNING ID INTO :id
  `;

  const binds = {
    disciplina: disciplinaId,
    nome,
    sigla,
    peso: tipoMedia === "simples" ? null : Number(peso),
    descricao: descricao || null,
    usuario: usuario_id,
    tipo_media: tipoMedia,
    id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  };

  const result = await conn.execute(sql, binds, { autoCommit: true }) as any;
  await conn.close();

  return result.outBinds?.id?.[0] ?? null;
}

// ============================================================
// 5) REMOVER COMPONENTE
// ============================================================
export async function removerComponente(id: number) {
  const conn = await openConnection();

  await conn.execute(
    `DELETE FROM COMPONENTES_NOTA WHERE ID = :id`,
    { id },
    { autoCommit: true }
  );

  await conn.close();
}
