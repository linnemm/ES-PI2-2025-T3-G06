import oracledb from "oracledb";
import "dotenv/config";

// ===============================================
// CONFIGURAÇÃO GLOBAL DO ORACLE
// ===============================================

// Força o Oracle a retornar objetos ao invés de arrays
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Habilita commit automático
oracledb.autoCommit = true;

// Inicializa cliente local (se necessário)
oracledb.initOracleClient?.();

export const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
};

// ===============================================
// FUNÇÃO PARA ABRIR CONEXÃO
// ===============================================

export async function openConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Conexão com Oracle bem-sucedida!");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao Oracle:", error);
    throw error;
  }
}
