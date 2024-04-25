// Importação de módulos necessários para o envio de e-mails
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Configuração do ambiente usando variáveis de ambiente
dotenv.config();

// Classe responsável por fornecer serviços relacionados ao envio de e-mails
export class EmailService {
    // Configuração do transporte de e-mails usando o serviço Gmail
    private transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "login",
            user: process.env.EMAIL_USER,        // Usuário de e-mail configurado nas variáveis de ambiente
            pass: process.env.EMAIL_PASSWORD,    // Senha de e-mail configurada nas variáveis de ambiente
        },
    });

    // Método para enviar e-mails de recuperação de senha
    async sendForgotPasswordEmail(email: string, code: string): Promise<void> {

        // Construção do link para a alteração de senha utilizando o código fornecido
        const resetPasswordLink = `${process.env.RESET_PASSWORD_URL}?token=${code}`;

        // Opções do e-mail, incluindo remetente, destinatário, assunto e corpo
        const mailOptions = {
            from: process.env.EMAIL_USER,        // Remetente do e-mail configurado nas variáveis de ambiente
            to: email,                          // Destinatário do e-mail
            subject: "Recuperação de Senha",    // Assunto do e-mail
            text: `
            Olá!
            
            Nós recebemos uma solicitação de redefinição de senha:
            
            Código de redefinição: ${code}
            
            Este código é válido por 20 minutos, além de ser pessoal, intransferível e não deve ser compartilhado com terceiros.
            
            Você pode também clicar no link abaixo para redefinir sua senha ou copie e cole o link no seu navegador:
            
            ${resetPasswordLink}
            
            Se você não solicitou este código, pode ignorar com segurança este e-mail. Outra pessoa pode ter digitado seu endereço de e-mail por engano.`,
        };

        // Envio do e-mail usando o transporte configurado
        await this.transporter.sendMail(mailOptions);
    }
}
