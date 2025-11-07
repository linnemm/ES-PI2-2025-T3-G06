import oracledb from "oracledb";
import "dotenv/config";

// habilita modo de Promises
oracledb.initOracleClient?.(); 

export const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
};

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
