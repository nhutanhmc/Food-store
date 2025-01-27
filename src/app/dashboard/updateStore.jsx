import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UpdateStore() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get("id"); // Lấy store ID từ query string

  const [store, setStore] = useState(null);
  const [newImage, setNewImage] = useState(null); // Dùng để lưu ảnh mới
  const [file, setFile] = useState(null); // Lưu trữ file ảnh người dùng chọn

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/Store/store?id=${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setStore(data);
        } else {
          console.error("Failed to fetch store details");
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Hiển thị ảnh mới trên giao diện
      setNewImage(imageUrl);
      setFile(file); // Lưu file để gửi lên Cloudinary
    }
  };

  const handleUpdateStore = async () => {
    let imageUrl = store.image;
  
    console.log("Bắt đầu cập nhật cửa hàng...");
    
    // Nếu có file mới, upload lên Cloudinary
    if (file) {
      console.log("File được chọn:", file);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_store_images"); // Thay bằng upload preset của bạn
  
      try {
        console.log("Bắt đầu upload ảnh lên Cloudinary...");
  
        const response = await fetch(`https://api.cloudinary.com/v1_1/ddyhzrir5/image/upload`, {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        console.log("Phản hồi từ Cloudinary:", data);
  
        if (response.ok) {
          imageUrl = data.secure_url; // Lấy link ảnh từ Cloudinary
          console.log("Ảnh đã upload thành công. Link ảnh:", imageUrl);
        } else {
          console.error("Cloudinary báo lỗi:", data);
          alert("Upload ảnh thất bại!");
          return;
        }
      } catch (error) {
        console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
        alert("Có lỗi xảy ra khi upload ảnh!");
        return;
      }
    } else {
      console.log("Không có file mới, giữ nguyên ảnh hiện tại.");
    }
  
    // Gửi dữ liệu cập nhật về backend
    const updatedStore = { ...store, image: imageUrl };
    console.log("Dữ liệu cập nhật chuẩn bị gửi:", updatedStore);
  
    try {
      console.log("Bắt đầu gửi yêu cầu cập nhật đến backend...");
  
      const response = await fetch(`http://localhost:3000/api/Store/store?id=${storeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStore),
      });
  
      const data = await response.json();
      console.log("Phản hồi từ backend:", data);
  
      if (response.ok) {
        alert("Cập nhật cửa hàng thành công!");
        setNewImage(null); // Xóa ảnh mới sau khi cập nhật
        setFile(null); // Reset file
      } else {
        console.error("Backend báo lỗi:", data);
        alert("Cập nhật thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };
  

  if (!store) {
    return <p>Loading store details...</p>;
  }

  return (
    <form className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Sửa Cửa Hàng</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên cửa hàng</label>
          <input
            type="text"
            value={store.name}
            onChange={(e) => setStore({ ...store, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            value={store.address}
            onChange={(e) => setStore({ ...store, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            value={store.description}
            onChange={(e) => setStore({ ...store, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ảnh hiện tại</label>
          <img
            src={newImage || store.image}
            alt="Current Store"
            className="w-full max-h-72 object-contain rounded-lg mt-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chọn ảnh mới</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <button
          type="button"
          onClick={handleUpdateStore}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
