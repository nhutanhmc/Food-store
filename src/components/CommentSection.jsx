import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export default function CommentSection({ storeId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!storeId) return

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/Store/comment?storeId=${storeId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch comments")
        }
        const data = await res.json()
        const sortedComments = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setComments(sortedComments)
      } catch (error) {
        console.error("Error fetching comments:", error)

        // Dữ liệu giả để test
        setComments([
          { id: "1", user: { name: "Nguyễn Văn A" }, content: "Quán ăn rất ngon!", rating: 5, createdAt: new Date() },
          {
            id: "2",
            user: { name: "Trần Thị B" },
            content: "Không gian sạch sẽ, giá hợp lý.",
            rating: 4,
            createdAt: new Date(),
          },
          {
            id: "3",
            user: { name: "Lê Văn C" },
            content: "Nhân viên phục vụ nhiệt tình.",
            rating: 5,
            createdAt: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [storeId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert("Bạn cần đăng nhập để bình luận.")
      return
    }

    const newCommentData = {
      userId,
      storeId,
      content: newComment,
      rating,
    }

    try {
      const res = await fetch("http://localhost:3000/api/Store/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentData),
      })

      if (!res.ok) {
        throw new Error("Failed to submit comment")
      }

      const addedComment = await res.json()

      setComments((prevComments) => {
        const updatedComments = [addedComment, ...prevComments]
        return updatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      })

      setNewComment("")
      setRating(0)
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  return (
    <div className="relative mt-4 sm:mt-8 w-full max-w-[700px] h-[330px] sm:h-[400px] bg-white rounded-lg shadow-2xl">
      <div className="p-2 sm:p-4 overflow-y-scroll h-[220px] sm:h-[290px]">
        <h2 className="text-base sm:text-lg font-semibold mb-2">Bình luận</h2>

        {loading ? (
          <p className="text-sm">Đang tải bình luận...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm">Chưa có bình luận nào.</p>
        ) : (
          <div className="space-y-2 sm:space-y-4">
            {comments.map((comment, idx) => (
              <div key={comment.id || idx} className="border-b pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm font-medium">{comment.user?.name || "Người dùng"}</p>
                  <p className="text-xs text-gray-500">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">{comment.rating ? `⭐ ${comment.rating}/5` : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 bg-gray-100 p-2 sm:p-4 rounded-b-lg">
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            className="flex-grow p-1 sm:p-2 text-xs sm:text-sm border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  )
}

