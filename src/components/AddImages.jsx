import { useState, useCallback } from "react"

export default function ImageUploadModal({ storeId }) {
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({})

  const handleFileChange = useCallback((e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      }))
      setImages((prev) => [...prev, ...newImages])
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      }))
      setImages((prev) => [...prev, ...newImages])
    }
  }, [])

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "my_store_images") 

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ddyhzrir5/image/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        return data.secure_url
      } else {
        throw new Error(data.error?.message || "Upload failed")
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw error
    }
  }

  const handleConfirm = async () => {
    const uploadedUrls = []

    for (let i = 0; i < images.length; i++) {
      setUploadStatus((prev) => ({ ...prev, [i]: "uploading" }))
      try {
        const url = await uploadToCloudinary(images[i].file)
        uploadedUrls.push(url)
        setUploadStatus((prev) => ({ ...prev, [i]: "success" }))
      } catch (error) {
        setUploadStatus((prev) => ({ ...prev, [i]: "error" }))
      }
    }

    if (uploadedUrls.length > 0) {
      try {
        const response = await fetch(`http://localhost:3000/api/Store/images?storeId=${storeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ images: uploadedUrls }),
        })

        if (response.ok) {
          alert("Images uploaded successfully!")
          setIsModalOpen(false)
          setImages([])
          setUploadStatus({})
        } else {
          throw new Error("Failed to save image URLs")
        }
      } catch (error) {
        console.error("Error saving image URLs:", error)
        alert("Failed to save image URLs")
      }
    }
  }

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Thêm ảnh
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm ảnh</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p>Kéo và thả ảnh vào đây hoặc click để chọn ảnh</p>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  {uploadStatus[index] === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                  {uploadStatus[index] === "success" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-50 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {uploadStatus[index] === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {!uploadStatus[index] && (
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => removeImage(index)}
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
                  )}
                </div>
              ))}
            </div>

            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
              onClick={handleConfirm}
              disabled={images.length === 0}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </>
  )
}

