// src/models/turmaModel.ts
import { openConnection } from "../config/database";

interface TurmaData {
  instituicaoId: number;
  cursoId: number;
  disciplinaId: number;
  nome: string;
  diaSemana: string;
  horario: string;
  localTurma: string;
}

export async function criarTurma(dados: TurmaData): Promise<void> {
  const conn = await openConnection();

  const sql = `
    INSERT INTO TURMAS 
      (INSTITUICAO_ID, CURSO_ID, DISCIPLINA_ID, NOME, DIA_SEMANA, HORARIO, LOCAL_TURMA)
    VALUES
      (:instituicao, :curso, :disciplina, :nome, :diaSemana, :horario, :localTurma)
  `;

  const binds = {
    instituicao: dados.instituicaoId,
    curso: dados.cursoId,
    disciplina: dados.disciplinaId,
    nome: dados.nome,
    diaSemana: dados.diaSemana,
    horario: dados.horario,
    localTurma: dados.localTurma
  };

  await conn.execute(sql, binds, { autoCommit: true });
  await conn.close();

  return;
}
