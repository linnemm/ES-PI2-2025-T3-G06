// ======================================================
// src/routes/alunoRoutes.ts
// Rotas de alunos (criação, edição, importação CSV)
// ======================================================

import { Router } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

import {
  cadastrarAluno,
  listarPorTurma,
  obterAluno,
  editarAlunoController,
  removerAlunoController,
  importarAlunosCsvController
} from "../controllers/alunoController";

const router = Router();

/* ======================================================
   GARANTIR QUE A PASTA /uploads/csv EXISTE
   ====================================================== */
const uploadDir = path.resolve("uploads/csv");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Pasta criada:", uploadDir);
}

/* ======================================================
   CONFIGURAÇÃO DO MULTER PARA CSV
   ====================================================== */
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `import_${Date.now()}_${file.originalname}`);
  }
});

const uploadCsv = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".csv")) {
      return cb(new Error("Envie um arquivo CSV válido."));
    }
    cb(null, true);
  }
});

/* ======================================================
   MIDDLEWARE DE TRATAMENTO DE ERROS DO MULTER
   ====================================================== */
function multerErrorHandler(
  err: any,
  req: any,
  res: any,
  next: any
) {
  if (err instanceof Error) {
    return res.status(400).json({ message: err.message });
  }
  next();
}

/* ======================================================
                    ROTAS API ALUNOS
   ====================================================== */

// Criar aluno individual
router.post("/criar", cadastrarAluno);

// Listar alunos por turma
router.get("/turma/:turmaId", listarPorTurma);

// Buscar aluno por ID
router.get("/detalhes/:id", obterAluno);

// Editar aluno
router.put("/editar/:id", editarAlunoController);

// Remover aluno
router.delete("/remover/:id", removerAlunoController);

// Importação CSV
router.post(
  "/importar-csv",
  uploadCsv.single("arquivo"),
  multerErrorHandler,          // evita que o servidor caia
  importarAlunosCsvController
);

export default router;
