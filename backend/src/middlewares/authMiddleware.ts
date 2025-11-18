// Autora: Alinne

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Estende o Request do Express para permitir guardar o usuário autenticado
export interface AuthRequest extends Request {
  usuarioId?: number;
}

// Chave usada para validar o JWT
const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta_notadez";

// Middleware de autenticação
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  // Lê o header Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // Se não existir, o usuário não está autenticado
  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido." });
    return;
  }

  // Divide a string: ["Bearer", "token_aqui"]
  const [, token] = authHeader.split(" ");

  try {
    // Verifica se o token é válido e não expirou
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // Salva o ID do usuário na requisição para uso nas rotas protegidas
    req.usuarioId = Number(payload.id);
    next(); // continua para a proxima função
    return; 
  } catch (error) {
    // se o token for invalido, bloqueia o acesso
    console.error("Erro ao validar token:", error);
    res.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
}
