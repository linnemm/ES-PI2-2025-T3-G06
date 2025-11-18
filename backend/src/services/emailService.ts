// Autora: Alinne

// carrega variáveis de ambiente do arquivo .env

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" }); 

// importa nodeMailer (responsavel por enviar o email)
import nodemailer from "nodemailer";


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// FUNÇÃO DE ENVIAR EMAIL
export async function enviarEmail(destinatario: string, assunto: string, conteudoHTML: string) {

  // configuração do transporte usando gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,        
    secure: true,     // usa SSL
    auth: {
      user: process.env.EMAIL_USER, // e-mail remetente
      pass: process.env.EMAIL_PASS, // senha de app
    },
    logger: true, 
    debug: true, 
  });

  // montagem do email a ser enviado
  const mailOptions = {
    from: `"NotaDez" <${process.env.EMAIL_USER}>`, // remetente com nome
    to: destinatario,                               // destinatário do e-mail
    subject: assunto,                               // assunto do e-mail
    html: conteudoHTML,                             // corpo HTML
  };

  // tenta enviar o email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 E-mail enviado para: ${destinatario}`);
    console.log("📦 Info:", info);

  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}
