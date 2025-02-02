import {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByStoreId, // << thêm import
  } from "@/services/commentService";
  
  export default async function handler(req, res) {
    const { method } = req;
    const { id, storeId } = req.query; // Lấy id hoặc storeId từ query
  
    try {
      switch (method) {
        case "GET":
          if (id) {
            // Lấy 1 comment theo id
            const comment = await getCommentById(id);
            if (!comment) {
              return res.status(404).json({ message: "Comment not found" });
            }
            return res.status(200).json(comment);
          }
          if (storeId) {
            // Lấy tất cả comment của 1 store
            const storeComments = await getCommentsByStoreId(storeId);
            return res.status(200).json(storeComments);
          }
          // Mặc định: lấy tất cả comment
          const comments = await getAllComments();
          return res.status(200).json(comments);
  
        case "POST":
          // Tạo comment mới
          const { userId, content, rating } = req.body;
          const storeIdInBody = req.body.storeId;
          if (!userId || !storeIdInBody || !content) {
            return res
              .status(400)
              .json({ message: "userId, storeId và content là bắt buộc" });
          }
          const createdComment = await createComment({
            userId,
            storeId: storeIdInBody,
            content,
            rating,
          });
          return res.status(201).json(createdComment);
  
        case "PUT":
          // Cập nhật comment
          if (!id) {
            return res
              .status(400)
              .json({ message: "Comment ID is required for update" });
          }
          const updatedComment = await updateComment(id, req.body);
          return res.status(200).json(updatedComment);
  
        case "DELETE":
          // Xoá comment
          if (!id) {
            return res
              .status(400)
              .json({ message: "Comment ID is required for deletion" });
          }
          await deleteComment(id);
          return res.status(204).end();
  
        default:
          res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
          return res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (error) {
      console.error("API Error (Comment):", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  