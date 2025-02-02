"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";
export default function StoreInforPage() {
    // Lấy query "id" từ URL, ví dụ /storeInfor?id=6797cf65f6d3c5e2579eca15
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    // Gọi API để lấy thông tin Store
    useEffect(() => {
        if (!id) return;
        const fetchStore = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/Store/store?id=${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch store data");
                }
                const data = await res.json();
                setStore(data);
            } catch (error) {
                console.error("Error fetching store data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id]);

    // Nếu đang loading
    if (loading) {
        return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    }

    // Nếu store không tồn tại hoặc lỗi
    if (!store) {
        return <div className="text-center py-8">Không tìm thấy dữ liệu.</div>;
    }

    // Render trang
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Phần trên: Thông tin store */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h1 className="text-3xl font-bold mb-4">{store.name}</h1>
                    <p className="mb-2">{store.description}</p>
                    <p className="mb-2">
                        <strong>Price Type:</strong> {store.priceType}
                    </p>
                    <p className="mb-2">
                        <strong>Address:</strong> {store.address}
                    </p>
                    <CommentSection storeId={store.id} />
                </div>

                <div
                    className="relative w-[700px] h-[500px] border rounded-lg overflow-hidden shadow-2xl"
                >
                    <Image
                        src={store.image || "/placeholder.svg"}
                        alt={store.name}
                        fill
                        className="object-contain"
                    />
                </div>


            </div>

            {/* Phần dưới: Gallery ảnh */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Gallery</h2>
            {store.images && store.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
                    {store.images.map((imgObj, idx) => (
                        <div
                            key={imgObj.id || idx}
                            onClick={() => setSelectedImage(imgObj.image)}
                            className="relative w-full pb-[75%] cursor-pointer hover:opacity-80 transition-opacity rounded-md overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={imgObj.image || "/placeholder.svg"}
                                alt={`Image ${idx}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Không có ảnh nào.</p>
            )}


            {/* Modal phóng to ảnh khi click */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Nền mờ */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setSelectedImage(null)}
                    />
                    {/* Khung chứa ảnh */}
                    <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 text-gray-800 hover:text-gray-600"
                        >
                            X
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Enlarged image"
                            width={1200}
                            height={800}
                            className="object-contain w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
