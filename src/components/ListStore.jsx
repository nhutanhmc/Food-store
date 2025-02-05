"use client";

import { useEffect, useState } from "react";
import Store from "./Store";

export default function ListStore() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // State để lưu trữ từ khóa tìm kiếm

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/Store/store"); // Thay đổi API nếu cần
        if (response.ok) {
          const data = await response.json();
          setStores(data);
        } else {
          console.error("Failed to fetch stores");
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return <p>Loading stores...</p>;
  }

  // Lọc danh sách cửa hàng theo từ khóa tìm kiếm (ví dụ: theo tên cửa hàng)
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm cửa hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Danh sách cửa hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => <Store key={store.id} store={store} />)
        ) : (
          <p className="col-span-2 text-center">Không tìm thấy cửa hàng nào.</p>
        )}
      </div>
    </div>
  );
}
