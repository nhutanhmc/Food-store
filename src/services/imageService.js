import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getImagesByStoreId = async (storeId) => {
  try {
    return await prisma.image.findMany({
      where: { storeId },
    });
  } catch (error) {
    console.error("Error fetching images by storeId:", error);
    throw new Error("Unable to fetch images. Please try again later.");
  }
};

export const getImageById = async (id) => {
  try {
    return await prisma.image.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching image by id:", error);
    throw new Error("Unable to fetch the image. Please try again later.");
  }
};

export const createImage = async (data) => {
  try {
    return await prisma.image.create({
      data,
    });
  } catch (error) {
    console.error("Error creating image:", error);
    throw new Error("Unable to create the image. Please try again later.");
  }
};

export const updateImage = async (id, data) => {
  try {
    return await prisma.image.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Unable to update the image. Please try again later.");
  }
};

export const deleteImage = async (id) => {
    try {
      if (!id) {
        throw new Error("Image ID is required for deletion.");
      }
      return await prisma.image.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error(error.message || "Unable to delete the image. Please try again later.");
    }
  };
  
