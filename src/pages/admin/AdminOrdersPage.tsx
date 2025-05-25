import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
    dish: { name: string; price: number };
    quantity: number;
}

interface Order {
    id: number;
    user: { email: string };
    phoneNumber: string;
    deliveryType: string;
    deliveryAddress: string;
    status: string;
    items: OrderItem[];
}

const statusFlow = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const statusTranslations: Record<string, string> = {
    PENDING: "Прийнято в обробку",
    IN_PROGRESS: "Готується",
    COMPLETED: "Завершено",
    CANCELLED: "Скасовано користувачем",
};

const deliveryTypeTranslations: Record<string, string> = {
    delivery: "Доставка",
    pickup: "Самовивіз",
};

const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
};


const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/all");
            setOrders(res.data);
        } catch (err) {
            console.error("Помилка при завантаженні замовлень", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/${orderId}/status?status=${newStatus}`);
            fetchOrders();
        } catch {
            alert("Не вдалося оновити статус");
        }
    };

    return (
        <div className="bg-gray-100 py-10 px-4 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto overflow-x-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Список замовлень</h2>
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Користувач</th>
                            <th className="p-3 text-left">Телефон</th>
                            <th className="p-3 text-left">Отримання замовлення</th>
                            <th className="p-3 text-left">Адреса</th>
                            <th className="p-3 text-left">Статус</th>
                            <th className="p-3 text-left">Страви</th>
                            <th className="p-3 text-left">Сума</th>
                            <th className="p-3 text-center">Змінити статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            .map((order, index) => {
                                const currentIndex = statusFlow.indexOf(order.status);
                                return (
                                    <tr
                                        key={order.id}
                                        className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                    >
                                        <td className="p-3 font-medium">{order.id}</td>
                                        <td className="p-3">{order.user?.email || "?"}</td>
                                        <td className="p-3">{order.phoneNumber}</td>
                                        <td className="p-3 font-medium">
                                            {deliveryTypeTranslations[order.deliveryType] || order.deliveryType}
                                        </td>

                                        <td className="p-3">{order.deliveryAddress}</td>
                                        <td className="p-3 font-semibold">{statusTranslations[order.status]}</td>
                                        <td className="p-3">
                                            <ul className="list-disc pl-4">
                                                {order.items.map((item, i) => (
                                                    <li key={i}>
                                                        {item.dish.name} x {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="p-3 font-semibold">{calculateTotal(order.items)} грн</td>
                                        <td className="p-3 text-center">
                                            {/* {order.status !== "COMPLETED" && order.status !== "CANCELLED" ? (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="border border-gray-300 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    {statusFlow
                                                        .filter(status => status !== "CANCELLED")
                                                        .map((status, i) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                                disabled={i <= currentIndex}
                                                            >
                                                                {statusTranslations[status]}
                                                            </option>
                                                        ))}
                                                    <option value="CANCELLED">{statusTranslations["CANCELLED"]}</option>
                                                </select>
                                            ) : (
                                                <span className="text-gray-400">Завершено</span>
                                            )} */}
                                            {order.status !== "COMPLETED" && order.status !== "CANCELLED" ? (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="border border-gray-300 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                >
                                                    {statusFlow
                                                        .filter(status => status !== "CANCELLED")
                                                        .map((status, i) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                                disabled={i <= currentIndex}
                                                            >
                                                                {statusTranslations[status]}
                                                            </option>
                                                        ))}
                                                    <option value="CANCELLED">{statusTranslations["CANCELLED"]}</option>
                                                </select>
                                            ) : (
                                                <span className="text-gray-400">
                                                    {order.status === "COMPLETED"
                                                        ? statusTranslations["COMPLETED"]
                                                        : statusTranslations["CANCELLED"]}
                                                </span>
                                            )}

                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
