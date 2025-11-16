import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  usuarioId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta_notadez";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.usuarioId = Number(payload.id);
    next();
    return; // <-- Adicionado para garantir retorno
  } catch (error) {
    console.error("Erro ao validar token:", error);
    res.status(401).json({ message: "Token inválido ou expirado." });
    return;
  }
}
