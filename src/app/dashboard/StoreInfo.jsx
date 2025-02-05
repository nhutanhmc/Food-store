"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import CommentSection from "@/components/CommentSection"
import AddImages from "@/components/AddImages"

export default function StoreInforPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (!id) return
    fetchStore()
  }, [id])

  const fetchStore = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/Store/store?id=${id}`)
      if (!res.ok) {
        throw new Error("Failed to fetch store data")
      }
      const data = await res.json()
      setStore(data)
    } catch (error) {
      console.error("Error fetching store data:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = async (imageId) => {
    try {
      const dbRes = await fetch(`http://localhost:3000/api/Store/images?imageId=${imageId}`, {
        method: "DELETE",
      })

      if (!dbRes.ok) {
        throw new Error("Failed to delete image from database")
      }

      await fetchStore()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image. Please try again.")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu...</div>
  }

  if (!store) {
    return <div className="text-center py-8">Không tìm thấy dữ liệu.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Phần thông tin store */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{store.name}</h1>
          <p className="text-sm md:text-base">{store.description}</p>
          <p className="text-sm md:text-base">
            <strong>Price Type:</strong> {store.priceType}
          </p>
          <p className="text-sm md:text-base">
            <strong>Address:</strong> {store.address}
          </p>
          <div className="mt-8">
            <CommentSection storeId={store.id} />
          </div>
        </div>

        <div className="relative w-full h-[300px] md:h-[500px] border rounded-lg overflow-hidden shadow-2xl">
          <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-contain" />
        </div>
      </div>

      {/* Gallery */}
      <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Gallery</h2>
      <div className="fixed right-4 md:right-10 z-50 bottom-4 md:bottom-15">
        <AddImages storeId={store.id} />
      </div>

      {store.images && store.images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {store.images.map((imgObj, idx) => (
            <div
              key={imgObj.id || idx}
              className="relative w-full pb-[75%] cursor-pointer hover:opacity-80 transition-opacity rounded-md overflow-hidden shadow-2xl group"
            >
              <Image
                src={imgObj.image || "/placeholder.svg"}
                alt={`Image ${idx}`}
                fill
                className="object-contain"
                onClick={() => setSelectedImage(imgObj.image)}
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteImage(imgObj.id)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Không có ảnh nào.</p>
      )}

      {/* Modal phóng to ảnh khi click */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedImage(null)} />
          <div className="relative bg-white p-4 rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 text-xl font-bold"
            >
              X
            </button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged image"
              width={1200}
              height={800}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}

