import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" }); // garante que o .env é carregado

import nodemailer from "nodemailer";

// evita erro de certificado SSL em algumas máquinas do Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function enviarEmail(destinatario: string, assunto: string, conteudoHTML: string) {
  // Configuração segura para Gmail (SSL + logs)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true, // mostra log detalhado
    debug: true,
  });

  const mailOptions = {
    from: `"NotaDez" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html: conteudoHTML,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 E-mail enviado para: ${destinatario}`);
    console.log("📦 Info:", info);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}
