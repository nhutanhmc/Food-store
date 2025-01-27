import { PrismaClient } from "@prisma/client";
import cloudinary from "cloudinary";
const prisma = new PrismaClient();

cloudinary.v2.config({
    cloud_name: "ddyhzrir5",
    api_key: "252455369624395",
    api_secret: "EBpnkCipGiUVJ7Ixi2eI_V6OG28",
  });

export const getAllStores = async () => {
  return await prisma.store.findMany({
    include: {
      images: true, // Bao gồm ảnh khác (nếu cần)
    },
  });
};

export const getStoreById = async (id) => {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      images: true, // Bao gồm ảnh khác (nếu cần)
    },
  });
};

export const createStore = async (data) => {
  const { name, description, priceType, address, image, images } = data;

  // Tạo store và liên kết với ảnh khác (nếu có)
  return await prisma.store.create({
    data: {
      name,
      description,
      priceType,
      address,
      image, // Ảnh đại diện
      images: {
        create: images.map((img) => ({ image: img.image })), // Tạo ảnh khác
      },
    },
    include: {
      images: true, // Bao gồm ảnh khác trong response
    },
  });
};

export const updateStore = async (id, data) => {
    const { name, description, priceType, address, image } = data;
  
    return await prisma.store.update({
      where: { id },
      data: {
        name,
        description,
        priceType,
        address,
        image, // Chỉ cập nhật các trường này
      },
      include: {
        images: true, // Bao gồm danh sách ảnh hiện tại (nếu cần)
      },
    });
  };
  

export const deleteStore = async (id) => {
  return await prisma.store.delete({
    where: { id },
  });
};

// Service for Cloudinary upload
export async function uploadImageToCloudinary(file) {
    try {
      const result = await cloudinary.v2.uploader.upload(file, {
        folder: "my_store_images",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
      throw new Error("Upload ảnh thất bại");
    }
  }
  
  export async function updateStoreWithImage(id, data, file) {
    try {
      let imageUrl = data.image;
  
      // Nếu có file, upload lên Cloudinary
      if (file) {
        imageUrl = await uploadImageToCloudinary(file);
      }
  
      const updatedStore = await prisma.store.update({
        where: { id },
        data: { ...data, image: imageUrl },
      });
  
      return updatedStore;
    } catch (error) {
      console.error("Lỗi khi cập nhật cửa hàng:", error);
      throw new Error("Cập nhật cửa hàng thất bại");
    }
  }
  