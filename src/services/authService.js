import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
const prisma = new PrismaClient();

export async function loginService(email, password) {
  try {
    // Tìm người dùng qua email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { status: 401, message: "Email không tồn tại!" };
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, message: "Mật khẩu không chính xác!" };
    }

    // Nếu hợp lệ, trả về thành công
    return {
      status: 200,
      message: "Đăng nhập thành công!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Lỗi tại Service:", error);
    throw new Error("Lỗi xử lý tại Service");
  }
}

export async function registerService(email, name, password) {
    try {
      // Kiểm tra email đã tồn tại
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return { status: 409, message: "Email đã tồn tại!" };
      }
  
      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo người dùng mới
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword },
      });
  
      // Gửi email chào mừng
      await sendEmail(email, name);
  
      return { status: 201, message: "Đăng ký thành công! Email đã được gửi.", user };
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      throw new Error("Có lỗi xảy ra!");
    }
  }

  export async function sendEmail(toEmail, name) {
    // Cấu hình transporter với SMTP của Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Sử dụng TLS
      auth: {
        user: "anhnhnse161473@fpt.edu.vn", // Email của bạn
        pass: process.env.EMAIL_PASS, // App Password từ Google
      },
    });
  
    // Tạo nội dung email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">Xin chào, ${name}!</h1>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi.</p>
        <p>Bạn đã chính thức trở thành một phần trong cộng đồng của chúng tôi. Hãy tận hưởng trải nghiệm tốt nhất!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #555;">
          Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
        </p>
        <p style="font-size: 0.9em; color: #555;">
          Trân trọng,<br>
          Đội ngũ hỗ trợ.
        </p>
      </div>
    `;
  
    // Cấu hình nội dung email
    const mailOptions = {
      from: '"Nine school sell rib rice" <anhnhnse161473@fpt.edu.vn>', // Tên và email người gửi
      to: toEmail, // Email người nhận
      subject: "Chào mừng bạn đến với hệ thống!", // Tiêu đề email
      html: htmlContent, // Nội dung email (HTML)
    };
  
    // Gửi email
    return await transporter.sendMail(mailOptions);
  }