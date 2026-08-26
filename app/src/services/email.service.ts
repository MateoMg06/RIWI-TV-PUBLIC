import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendActivationEmail(email: string, token: string, userName: string): Promise<void> {
    const activationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/api/auth/activate?token=${token}`;

    const mailOptions = {
      from: `"Riwi Cine" <${process.env.SMTP_USER || 'noreply@riwicine.com'}>`,
      to: email,
      subject: 'Activa tu cuenta - Riwi Cine',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">¡Bienvenido a Riwi Cine!</h1>
          <p style="color: #666; font-size: 16px;">Hola <strong>${userName}</strong>,</p>
          <p style="color: #666; font-size: 16px;">Gracias por registrarte en nuestra plataforma. Para completar tu registro y activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Activar mi cuenta</a>
          </div>
          <p style="color: #666; font-size: 14px;">Este enlace expirará en 24 horas. Si no has solicitado esta cuenta, puedes ignorar este correo.</p>
          <p style="color: #666; font-size: 14px;">Saludos,<br>El equipo de Riwi Cine</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending activation email:', error);
      throw new Error('No se pudo enviar el correo de activación');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection error:', error);
      return false;
    }
  }
}

export default new EmailService();
