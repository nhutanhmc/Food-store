import { getImagesByStoreId, getImageById, createImage, updateImage, deleteImage } from "../../../services/imageService";

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

        const { image } = req.body;
        if (!image) {
          return res.status(400).json({ message: "Image URL is required" });
        }

        const createdImage = await createImage({ storeId, image });
        return res.status(201).json(createdImage);

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
