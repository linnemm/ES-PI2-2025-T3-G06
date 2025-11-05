import nodemailer from "nodemailer";

export async function enviarEmail(destinatario: string, assunto: string, conteudoHTML: string) {
  
// Configura a conta gmail que enviará o email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define o conteúdo do e-mail
  const mailOptions = {
    from: `"NotaDez" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html: conteudoHTML,
  };

  // Envia o e-mail
  await transporter.sendMail(mailOptions);
  console.log(`📨 E-mail enviado para: ${destinatario}`);
}
