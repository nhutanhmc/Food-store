import { loginService } from "../../../services/authService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    try {
      const result = await loginService(email, password);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Lỗi tại Controller:", error);
      return res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
  } else {
    return res.status(405).json({ message: "Phương thức không hợp lệ!" });
  }
}
