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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
const oracledb_1 = __importDefault(require("oracledb"));
const database_1 = require("../config/database");
// busca um ou mais usuários no banco pelo e-mail informado
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield oracledb_1.default.getConnection(database_1.dbConfig);
        //executa comando sql de consulta
        const result = yield connection.execute(`SELECT id, nome, email, telefone, senha, criado_em FROM usuarios WHERE email = :email`, [email], { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT } // define o formato do retorno (objeto JS)
        );
        yield connection.close();
        // retorna os resultados da consulta já convertidos para o tipo UsuarioDB (objeto js e propriedades do usuario)
        return result.rows;
    });
}
// cria novo usuário
function createUser(nome, email, telefone, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield oracledb_1.default.getConnection(database_1.dbConfig);
        yield connection.execute(`INSERT INTO usuarios (nome, email, telefone, senha) VALUES (:nome, :email, :telefone, :senha)`, [nome, email, telefone, senha], { autoCommit: true } // salva no banco automaticamente
        );
        yield connection.close();
    });
}
//# sourceMappingURL=userModel.js.map