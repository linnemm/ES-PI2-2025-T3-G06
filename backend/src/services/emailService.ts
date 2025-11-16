// ===============================
// 📌 Carrega variáveis de ambiente do arquivo .env
// ===============================
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" }); 
// O path acima garante que o .env seja lido corretamente mesmo em estruturas de pastas diferentes.

// ===============================
// 📌 Importa o Nodemailer (responsável por enviar e-mails)
// ===============================
import nodemailer from "nodemailer";

// ===============================
// ⚠️ Evita erro de certificado SSL em algumas máquinas Windows
// (caso o PC tenha problema com certificados do Gmail)
// ===============================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// ===============================
// 📌 Função responsável por enviar e-mails
// Parâmetros:
//  - destinatario: e-mail de quem vai receber
//  - assunto: título do e-mail
//  - conteudoHTML: corpo do e-mail em HTML
// ===============================
export async function enviarEmail(destinatario: string, assunto: string, conteudoHTML: string) {

  // ===============================
  // 📌 Configuração do transporte usando Gmail
  // host: servidor google
  // port: 465 = SMTP com SSL
  // secure: true = SSL ativado
  // auth: dados vindos do .env
  // logger/debug: ajudam a ver detalhes no console
  // ===============================
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,        // porta segura
    secure: true,     // usa SSL
    auth: {
      user: process.env.EMAIL_USER, // seu e-mail remetente
      pass: process.env.EMAIL_PASS, // senha de app
    },
    logger: true, // mostra logs detalhados
    debug: true,  // mostra detalhes técnicos
  });

  // ===============================
  // 📌 Monta o e-mail que será enviado
  // from = quem envia
  // to   = quem recebe
  // subject = assunto
  // html = corpo do e-mail
  // ===============================
  const mailOptions = {
    from: `"NotaDez" <${process.env.EMAIL_USER}>`, // remetente com nome
    to: destinatario,                               // destinatário do e-mail
    subject: assunto,                               // assunto do e-mail
    html: conteudoHTML,                             // corpo HTML
  };

  // ===============================
  // 📌 Tenta enviar o e-mail
  // Caso funcione → mostra no console
  // Caso dê erro → mostra erro detalhado
  // ===============================
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 E-mail enviado para: ${destinatario}`);
    console.log("📦 Info:", info);

  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}
