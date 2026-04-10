export const verifyEmailTemplate = (fullName: string, verifyLink: string) => `
<div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px;">
    <h2 style="color: #333; text-align: center;">Xác thực tài khoản E-Shop</h2>

    <p style="font-size: 16px; color: #555;">
      Xin chào <b>${fullName}</b>,
    </p>

    <p style="font-size: 15px; color: #555;">
      Cảm ơn bạn đã đăng ký tài khoản tại <b>E-Shop</b>.  
      Vui lòng nhấn vào nút bên dưới để xác thực email và kích hoạt tài khoản:
    </p>

    <div style="text-align: center; margin: 25px 0;">
      <a href="${verifyLink}"
         style="display:inline-block; padding: 12px 20px; background: #007bff; color: white; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
        Xác thực tài khoản
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      Link có hiệu lực trong <b>24 giờ</b>.  
      Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 13px; color: #aaa; text-align: center;">
      © E-Shop 2026 - Mỹ Phẩm Cao Cấp
    </p>
  </div>
</div>
`;
