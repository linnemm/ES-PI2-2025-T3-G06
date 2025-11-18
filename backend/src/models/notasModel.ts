// Autoria: Livia

// Model: notasModel.ts

import { openConnection } from "../config/database";

// LISTAR NOTAS POR TURMA + DISCIPLINA

export async function listarNotasBD(turmaId: string, disciplinaId: string) {
  const conn = await openConnection();

  try {
    const sql = `
      SELECT 
        N.ID,
        N.ALUNO_ID,
        N.COMPONENTE_ID,
        N.VALOR
      FROM NOTAS N
      INNER JOIN COMPONENTES_NOTA C 
        ON C.ID = N.COMPONENTE_ID
      WHERE N.TURMA_ID = :turmaId
      AND C.DISCIPLINA_ID = :disciplinaId
    `;

    const result = await conn.execute(sql, { turmaId, disciplinaId });
    return result.rows || [];

  } catch (error) {
    console.error("Erro ao listar notas:", error);
    throw error;

  } finally {
    await conn.close();
  }
}



// SALVAR / ATUALIZAR NOTAS EM MASSA
// lista[] = { turmaId, alunoId, componenteId, valor }

export async function salvarNotasBD(lista: any[]) {
  const conn = await openConnection();

  try {
    let linhasAfetadas = 0;

    for (const item of lista) {
      const { turmaId, alunoId, componenteId, valor } = item;

      // Verificar se já existe nota para (turma, aluno, componente)
     
      const existe = await conn.execute(
        `
        SELECT ID FROM NOTAS
        WHERE TURMA_ID = :turmaId
          AND ALUNO_ID = :alunoId
          AND COMPONENTE_ID = :componenteId
        `,
        { turmaId, alunoId, componenteId }
      );

      const linhas = existe.rows || [];

      // UPDATE se já existe
      
      if (linhas.length > 0) {
        await conn.execute(
          `
          UPDATE NOTAS
          SET VALOR = :valor
          WHERE TURMA_ID = :turmaId
            AND ALUNO_ID = :alunoId
            AND COMPONENTE_ID = :componenteId
          `,
          { valor, turmaId, alunoId, componenteId }
        );
      }

      // INSERT caso não exista
      
      else {
        await conn.execute(
          `
          INSERT INTO NOTAS (
            TURMA_ID, ALUNO_ID, COMPONENTE_ID, VALOR
          ) VALUES (
            :turmaId, :alunoId, :componenteId, :valor
          )
          `,
          { turmaId, alunoId, componenteId, valor }
        );
      }

      linhasAfetadas++;
    }

    await conn.commit();
    return linhasAfetadas;

  } catch (error) {
    console.error("Erro ao salvar notas no model:", error);
    throw error;

  } finally {
    await conn.close();
  }
}
