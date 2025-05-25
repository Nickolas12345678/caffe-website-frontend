import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

interface OrderItem {
    dish: { name: string; price: number; imageUrl?: string };
    quantity: number;
}

interface Order {
    id: number;
    phoneNumber: string;
    deliveryType: string;
    deliveryAddress: string;
    status: string;
    items: OrderItem[];
}

const statusTranslations: Record<string, string> = {
    PENDING: "Прийнято в обробку",
    IN_PROGRESS: "Готується",
    COMPLETED: "Завершено",
    CANCELLED: "Скасовано",
};

const deliveryTypeTranslations: Record<string, string> = {
    delivery: "Доставка",
    pickup: "Самовивіз",
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Помилка при завантаженні замовлень", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrder = async (orderId: number) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/${orderId}/cancel`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchOrders();
            alert("Замовлення скасовано.");
        } catch (error) {
            console.error("Помилка при скасуванні замовлення", error);
            alert("Не вдалося скасувати замовлення.");
        }
    };

    return (
        <>
            <Header />
            <div className="bg-gray-100 py-10 px-4 min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Мої замовлення</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-600">У вас поки що немає замовлень.</p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-lg">Замовлення #{order.id}</span>
                                        <span className="text-sm text-blue-600 font-medium">
                                            {statusTranslations[order.status]}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700 mb-2">
                                        <div>Телефон: {order.phoneNumber}</div>
                                        <div>Тип доставки: {deliveryTypeTranslations[order.deliveryType] || order.deliveryType}</div>
                                        <div>Адреса: {order.deliveryAddress}</div>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white p-2 rounded-md shadow-sm">
                                                {item.dish.imageUrl ? (
                                                    <img
                                                        src={item.dish.imageUrl}
                                                        alt={item.dish.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
                                                        Нема фото
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-800">
                                                    {item.dish.name} x {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {order.status === "PENDING" && (
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="mt-4 px-4 py-2 w-full bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Скасувати замовлення
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyOrdersPage;
