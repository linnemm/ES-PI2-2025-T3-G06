// src/routes/alunoRoutes.ts

import { Router } from "express";
import multer, { StorageEngine } from "multer";
import path from "path";

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
   CONFIGURAÇÃO DO MULTER PARA CSV
   ====================================================== */
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("uploads/csv"));
  },
  filename: (req, file, cb) => {
    cb(null, `import_${Date.now()}_${file.originalname}`);
  }
});

// Somente CSV
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
                    ROTAS API ALUNOS
   ====================================================== */

router.post("/criar", cadastrarAluno);

router.get("/turma/:turmaId", listarPorTurma);

router.get("/detalhes/:id", obterAluno);

router.put("/editar/:id", editarAlunoController);

router.delete("/remover/:id", removerAlunoController);

router.post(
  "/importar-csv",
  uploadCsv.single("arquivo"),
  importarAlunosCsvController
);

export default router;
