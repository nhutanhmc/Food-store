import React, { useEffect, useState } from "react";

export default function CommentSection({ storeId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!storeId) return;

        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/Store/comment?storeId=${storeId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch comments");
                }
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);

                // Nếu lỗi, sử dụng dữ liệu giả để test
                setComments([
                    { id: "1", user: { name: "Nguyễn Văn A" }, content: "Quán ăn rất ngon!", rating: 5 },
                    { id: "2", user: { name: "Trần Thị B" }, content: "Không gian sạch sẽ, giá hợp lý.", rating: 4 },
                    { id: "3", user: { name: "Lê Văn C" }, content: "Nhân viên phục vụ nhiệt tình.", rating: 5 },
                ]);
            } finally {
                setLoading(false); // Chỉ gọi `setLoading(false)` trong `useEffect`
            }
        };

        fetchComments();
    }, [storeId]);

    return (
        <div className="mt-8 w-[700px] h-[330px] bg-white rounded-lg shadow-2xl p-4 overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-2">Bình luận</h2>

            {loading ? (
                <p>Đang tải bình luận...</p>
            ) : comments.length === 0 ? (
                <p>Chưa có bình luận nào.</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment, idx) => (
                        <div key={comment.id || idx} className="border-b pb-2">
                            <p className="text-sm font-medium">{comment.user?.name || "Người dùng"}</p>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                            <p className="text-xs text-gray-500">{comment.rating ? `⭐ ${comment.rating}/5` : ""}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
