import { useNavigate } from "react-router-dom";

export default function Store({ store, onDelete }) {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/updatedStore?id=${store.id}`); // Thêm store.id vào query string
    };

    const handleStoreClick = () => {
        navigate(`/storeInfor?id=${store.id}`);
    };

    return (
        <div className="flex flex-col justify-center">
            <div
                className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white cursor-pointer hover:border-purple-500 transition-colors duration-200"
                onClick={handleStoreClick} // Thêm sự kiện onClick vào toàn bộ thẻ Store
            >


                {/* Container của ảnh */}
                <div className="w-full md:w-1/3 bg-white grid place-items-center h-48">
                    <img
                        src={store.image}
                        alt={store.name}
                        className="rounded-xl object-cover w-full h-full"
                    />
                </div>
                {/* Container của nội dung */}
                <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 font-medium hidden md:block truncate">
                            {store.priceType}
                        </p>
                    </div>
                    <h3 className="font-black text-gray-800 md:text-3xl text-xl truncate">
                        {store.name}
                    </h3>
                    <p className="md:text-lg text-gray-500 text-base truncate">
                        {store.description}
                    </p>
                    <p className="text-xl font-black text-gray-800 truncate">
                        {store.address}
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                                handleEdit();
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Sửa
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                                onDelete(store.id);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
