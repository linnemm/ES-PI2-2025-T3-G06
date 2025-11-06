"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.openConnection = openConnection;
const oracledb_1 = __importDefault(require("oracledb"));
require("dotenv/config");
// habilita modo de Promises
(_a = oracledb_1.default.initOracleClient) === null || _a === void 0 ? void 0 : _a.call(oracledb_1.default);
exports.dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
};
function openConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield oracledb_1.default.getConnection(exports.dbConfig);
            console.log("Conexão com Oracle bem-sucedida!");
            return connection;
        }
        catch (error) {
            console.error("Erro ao conectar ao Oracle:", error);
            throw error;
        }
    });
}
//# sourceMappingURL=database.js.map