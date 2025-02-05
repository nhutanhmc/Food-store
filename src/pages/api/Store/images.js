// pages/api/Store/images/index.js
import { getImagesByStoreId, getImageById, createImage, updateImage, deleteImage } from "../../../services/imageService";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary sử dụng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  const { method } = req;
  const { storeId, imageId } = req.query; // Nhận cả `storeId` và `imageId` từ query

  try {
    switch (method) {
      case "GET":
        if (imageId) {
          // Lấy thông tin chi tiết của một ảnh
          const image = await getImageById(imageId);
          if (!image) {
            return res.status(404).json({ message: "Image not found" });
          }
          return res.status(200).json(image);
        }

        if (storeId) {
          // Lấy danh sách ảnh của một Store
          const images = await getImagesByStoreId(storeId);
          return res.status(200).json(images);
        }

        return res.status(400).json({ message: "Store ID or Image ID is required" });

      case "POST":
        if (!storeId) {
          return res.status(400).json({ message: "Store ID is required" });
        }

        // Giả sử client gửi dữ liệu theo dạng: { "images": ["url1", "url2", ...] }
        const { images } = req.body;
        if (!images || !Array.isArray(images) || images.length === 0) {
          return res.status(400).json({
            message: "Images array is required and cannot be empty",
          });
        }

        // Tạo record cho từng ảnh trong mảng
        const createdImages = await Promise.all(
          images.map(async (imgUrl) => {
            return await createImage({ storeId, image: imgUrl });
          })
        );
        return res.status(201).json(createdImages);

      case "PUT":
        if (!imageId) {
          return res.status(400).json({ message: "Image ID is required for update" });
        }

        const updatedData = req.body;
        const updatedImage = await updateImage(imageId, updatedData);
        return res.status(200).json(updatedImage);

      case "DELETE":
        if (!imageId) {
          return res.status(400).json({ message: "Image ID is required for deletion" });
        }

        // Tìm record ảnh để lấy URL (để trích xuất public_id)
        const imageRecord = await getImageById(imageId);
        if (!imageRecord) {
          return res.status(404).json({ message: "Image not found" });
        }
        const imageUrl = imageRecord.image;

        // Trích xuất public_id từ URL.
        // Ví dụ: https://res.cloudinary.com/ddyhzrir5/image/upload/v167123456/sample-image.jpg
        // public_id ở đây sẽ là "sample-image" (nếu ảnh được upload theo cấu trúc mặc định)
        const publicId = imageUrl.split("/").pop().split(".")[0];

        // Gọi Cloudinary API để xóa ảnh
        const cloudinaryRes = await cloudinary.uploader.destroy(publicId);
        if (cloudinaryRes.result !== "ok") {
          console.error("Cloudinary deletion error:", cloudinaryRes);
          return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
        }

        // Xóa record ảnh trong cơ sở dữ liệu
        await deleteImage(imageId);
        return res.status(204).end();

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
