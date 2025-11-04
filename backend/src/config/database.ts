import oracledb from "oracledb";

// habilita modo de Promises
oracledb.initOracleClient?.(); // só é necessário se você usa Oracle Client local

export const dbConfig = {
  user: "PROJETO",
  password: "projeto",
  connectString: "localhost:1521/XEPDB1", // ajuste para seu banco
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
