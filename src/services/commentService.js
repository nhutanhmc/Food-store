import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lấy tất cả comments
export const getAllComments = async () => {
  try {
    return await prisma.comment.findMany({
      include: { user: true, store: true }, // Lấy thông tin user và store
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    throw new Error("Không thể lấy danh sách bình luận");
  }
};

// Lấy 1 comment theo ID
export const getCommentById = async (id) => {
  try {
    return await prisma.comment.findUnique({
      where: { id },
      include: { user: true, store: true }, // Lấy thông tin user và store
    });
  } catch (error) {
    console.error(`Error fetching comment with ID ${id}:`, error);
    throw new Error("Không tìm thấy bình luận");
  }
};

// Lấy danh sách comments theo `storeId` (bao gồm thông tin user)
export const getCommentsByStoreId = async (storeId) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { storeId },
      include: {
        user: true, // Bao gồm toàn bộ thông tin user
      },
    });

    return comments;
  } catch (error) {
    console.error(`Error fetching comments for storeId ${storeId}:`, error);
    throw new Error("Không thể lấy danh sách bình luận của cửa hàng");
  }
};

// Tạo comment mới
export const createComment = async (data) => {
  try {
    return await prisma.comment.create({
      data,
      include: { user: true, store: true }, // Trả về cả thông tin user và store sau khi tạo
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Không thể tạo bình luận");
  }
};

// Cập nhật 1 comment theo ID
export const updateComment = async (id, data) => {
  try {
    return await prisma.comment.update({
      where: { id },
      data,
      include: { user: true, store: true }, // Trả về thông tin user và store sau khi cập nhật
    });
  } catch (error) {
    console.error(`Error updating comment with ID ${id}:`, error);
    throw new Error("Không thể cập nhật bình luận");
  }
};

// Xóa 1 comment theo ID
export const deleteComment = async (id) => {
  try {
    return await prisma.comment.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting comment with ID ${id}:`, error);
    throw new Error("Không thể xóa bình luận");
  }
};
