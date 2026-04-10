import nodemailer from "nodemailer";

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOrderConfirmation(email: string, order: any, temporaryPassword?: string): Promise<void> {
    const loginSection = temporaryPassword
      ? `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #dee2e6;">
          <h3 style="margin-top: 0; color: #333;">Thông tin tài khoản của bạn</h3>
          <p style="margin: 5px 0;">Chúng tôi đã tự động tạo tài khoản để bạn tiện theo dõi đơn hàng:</p>
          <p style="margin: 5px 0;"><b>Tên đăng nhập:</b> ${email}</p>
          <p style="margin: 5px 0;"><b>Mật khẩu tạm thời:</b> <span style="color: #e83e8c; font-family: monospace; font-size: 1.1em;">${temporaryPassword}</span></p>
          <p style="margin: 10px 0 0 0; font-size: 0.9em; color: #666;"><i>* Vui lòng đăng nhập và đổi mật khẩu để bảo mật tài khoản.</i></p>
        </div>
      ` : "";

    const mailOptions = {
      from: process.env.MAIL_FROM || `"E-Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[E-Shop] Xác nhận đơn hàng #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #28a745; text-align: center;">Cảm ơn bạn đã đặt hàng!</h1>
          <p>Xin chào,</p>
          <p>Đơn hàng <b>#${order.id}</b> của bạn đã được tiếp nhận và đang trong quá trình xử lý.</p>
          
          <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Tổng giá trị:</b> ${order.final_amount.toLocaleString()}đ</p>
            <p style="margin: 5px 0;"><b>Phương thức thanh toán:</b> ${order.payment_method}</p>
          </div>

          ${loginSection}

          <p>Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #888; font-size: 12px;">© 2026 E-Shop - Mỹ Phẩm Cao Cấp</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
    }
  }
}
