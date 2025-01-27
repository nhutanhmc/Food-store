import { registerService } from "../../../services/authService";

export default async function handler(req, res) {
  console.log("Phương thức HTTP:", req.method); // Kiểm tra phương thức được gọi
  console.log("Dữ liệu gửi lên:", req.body); // Log dữ liệu từ frontend

  if (req.method === "POST") {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      console.log("Lỗi: Thiếu thông tin!"); // Log lỗi nếu thiếu dữ liệu
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    try {
      const result = await registerService(email, name, password);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Lỗi tại Controller:", error); // Log lỗi
      return res.status(500).json({ message: "Có lỗi xảy ra trong quá trình xử lý!" });
    }
  } else {
    console.log("Phương thức không được hỗ trợ:", req.method); // Log nếu không phải POST
    return res.status(405).json({ message: "Phương thức không hợp lệ!" });
  }
}
