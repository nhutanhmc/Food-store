"use client";

import { useEffect, useState } from "react";
import Store from "./Store";

export default function ListStore() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {stores.length > 0 ? (
        stores.map((store) => <Store key={store.id} store={store} />)
      ) : (
        <p className="col-span-3 text-center">No stores found.</p>
      )}
    </div>
  );
}
