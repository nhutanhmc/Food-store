"use client";

import ListStore from "../../components/ListStore";

export default function ListStoresPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách cửa hàng</h1>
      <ListStore />
    </div>
  );
}
