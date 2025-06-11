import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from '../assets/icons/coffee.png';
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isOrderFormVisible, setIsOrderFormVisible] = useState(false);
    const [orderData, setOrderData] = useState({
        phoneNumber: "",
        city: "Ужгород",
        street: "",
        house: "",
        apartment: "",
        pickupPoint: "",
    });
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');

    const { cartItems, cartItemsCount, fetchCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserProfile(token);
            fetchCart();
        }
    }, []);

    const handleNavigateToSection = (sectionId: string) => {
        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`);
        } else {
            const section = document.getElementById(sectionId);
            section?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Форма успішно заповнена:", orderData);
    };


    const fetchUserProfile = async (token: string) => {
        try {
            const response = await axios.get('https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({
                username: response.data.username,
                email: response.data.email,
            });
        } catch (error) {
            console.error("Помилка при завантаженні профілю", error);
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const updateQuantity = async (dishId: number, quantity: number) => {
        const token = localStorage.getItem("token");
        if (!token || quantity < 1) return;

        try {
            await axios.put("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/cart/update", {
                dishId,
                quantity,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCart();
        } catch (error) {
            console.error("Помилка при оновленні кількості товару", error);
        }
    };


    // const handleOrderSubmit = async () => {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;

    //     try {
    //         const orderPayload = {
    //             phoneNumber: orderData.phoneNumber,
    //             deliveryType: deliveryMethod,
    //             city: deliveryMethod === 'delivery' ? orderData.city : undefined,
    //             street: deliveryMethod === 'delivery' ? orderData.street : undefined,
    //             building: deliveryMethod === 'delivery' ? orderData.house : undefined,
    //             apartment: deliveryMethod === 'delivery' ? orderData.apartment : undefined,
    //             pickupPoint: deliveryMethod === 'pickup'
    //                 ? orderData.pickupPoint || "м. Ужгород, вул. Корзо, 123"
    //                 : undefined,
    //         };
    //         await axios.post("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/create", orderPayload, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         fetchCart();
    //         setOrderData({ ...orderData, phoneNumber: "", city: "Ужгород", street: "", house: "", apartment: "", pickupPoint: "вул. Корзо, 123" });
    //         setIsOrderFormVisible(false);
    //         alert("Замовлення успішно оформлено!");
    //     } catch (error) {
    //         console.error("Помилка при оформленні замовлення", error);
    //     }
    // };

    const handleOrderSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!orderData.phoneNumber || orderData.phoneNumber.length !== 13) {
            alert("Будь ласка, введіть правильний номер телефону у форматі +380XXXXXXXXX.");
            return;
        }

        if (deliveryMethod === 'delivery') {
            if (!orderData.street || !orderData.house) {
                alert("Будь ласка, заповніть всі обов’язкові поля для доставки (вулиця та будинок).");
                return;
            }
        }

        if (deliveryMethod === 'pickup' && !orderData.pickupPoint) {
            alert("Будь ласка, вкажіть пункт самовивозу.");
            return;
        }

        try {
            const orderPayload = {
                phoneNumber: orderData.phoneNumber,
                deliveryType: deliveryMethod,
                city: deliveryMethod === 'delivery' ? orderData.city : undefined,
                street: deliveryMethod === 'delivery' ? orderData.street : undefined,
                building: deliveryMethod === 'delivery' ? orderData.house : undefined,
                apartment: deliveryMethod === 'delivery' ? orderData.apartment : undefined,
                pickupPoint: deliveryMethod === 'pickup' ? "м. Ужгород, вул. Корзо, 123" : undefined,
            };

            await axios.post("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/orders/create", orderPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchCart();
            setOrderData({
                phoneNumber: "",
                city: "Ужгород",
                street: "",
                house: "",
                apartment: "",
                pickupPoint: "вул. Корзо, 123"
            });
            setIsOrderFormVisible(false);
            alert("Замовлення успішно оформлено!");
        } catch (error) {
            console.error("Помилка при оформленні замовлення", error);
            alert("Сталася помилка під час оформлення замовлення.");
        }
    };


    const removeItemFromCart = async (dishId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.delete("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/cart/remove", {
                data: { dishId },
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCart();
        } catch (error) {
            console.error("Помилка при видаленні товару з кошика", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white shadow-md border-b sticky top-0 z-50">
            <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <span className="text-2xl font-bold text-gray-800">FormaCafe</span>
                </div>



                <nav className="flex-1 flex justify-center space-x-4">
                    <span
                        onClick={() => handleNavigateToSection("menu")}
                        className="text-black font-bold px-6 py-2 cursor-pointer hover:text-yellow-500 transition"
                    >
                        Меню
                    </span>
                    <span
                        onClick={() => handleNavigateToSection("contacts")}
                        className="text-black font-bold px-6 py-2 cursor-pointer hover:text-yellow-500 transition"
                    >
                        Контакти
                    </span>
                    <span
                        onClick={() => navigate("/about")}
                        className="text-black font-bold px-6 py-2 cursor-pointer hover:text-yellow-500 transition"
                    >
                        Про нас
                    </span>
                </nav>

                <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
                    {user ? (
                        <>
                            <div
                                className="w-10 h-10 bg-yellow-400 text-white flex items-center justify-center rounded-full text-lg font-bold cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-12 mt-2 w-48 bg-white border rounded-lg shadow-md py-2 z-50">
                                    <div className="px-4 py-2 text-gray-800">
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                    <div
                                        onClick={() => navigate("/my-orders")}
                                        className="px-4 py-2 text-blue-500 cursor-pointer hover:text-blue-700"
                                    >
                                        Мої замовлення
                                    </div>

                                    <div className="border-t my-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            )}

                            <div
                                onClick={toggleCart}
                                className="w-10 h-10 bg-yellow-400 text-white flex items-center justify-center rounded-full cursor-pointer relative"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/signin")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-3 rounded-lg transition"
                            >
                                Увійти
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-white hover:bg-yellow-400 hover:text-white text-gray-800 font-bold py-2 px-3 rounded-lg transition border border-yellow-400"
                            >
                                Зареєструватися
                            </button>
                        </>
                    )}
                </div>
            </div>



            {isCartOpen && (
                <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-96 z-50 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Кошик</h2>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center">Кошик порожній</p>
                    ) : (
                        <>
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src={item.dish.imageUrl}
                                                alt={item.dish.name}
                                                className="w-12 h-12 object-cover mr-4"
                                            />
                                            <div>
                                                <div className="font-semibold">{item.dish.name}</div>
                                                <div>{item.dish.price * item.quantity} грн</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="bg-yellow-400 text-white py-1 px-2 rounded-full"
                                                onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="bg-yellow-400 text-white py-1 px-2 rounded-full"
                                                onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-1 px-2 rounded-full"
                                                onClick={() => removeItemFromCart(item.dish.id)}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-between font-semibold mt-2">
                                <span>До оплати:</span>
                                <span>
                                    {cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0)} грн
                                </span>
                            </div>

                            {!isOrderFormVisible && (
                                <button
                                    onClick={() => setIsOrderFormVisible(true)}
                                    className="w-full bg-yellow-400 text-white py-2 rounded-lg mt-4"
                                >
                                    Оформити замовлення
                                </button>
                            )}

                            {isOrderFormVisible && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Оформити замовлення</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label className="block text-gray-700 font-semibold mb-2">Тип доставки</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                value={deliveryMethod}
                                                onChange={(e) => setDeliveryMethod(e.target.value as 'pickup' | 'delivery')}
                                            >
                                                <option value="pickup">Самовивіз</option>
                                                <option value="delivery">Доставка</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Номер телефону</label>
                                            <input
                                                type="tel"
                                                placeholder="+380XXXXXXXXX"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                value={orderData.phoneNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    if (value.startsWith('+380') || value === '') {
                                                        const cleanedValue = value.replace(/[^0-9+]/g, "");
                                                        if (cleanedValue.length <= 13) {
                                                            setOrderData({ ...orderData, phoneNumber: cleanedValue });
                                                        }
                                                    } else {
                                                        if (value === '') {
                                                            setOrderData({ ...orderData, phoneNumber: '' });
                                                        } else if (value.charAt(0) !== '+') {
                                                            setOrderData({ ...orderData, phoneNumber: '+380' });
                                                        }
                                                    }
                                                }}
                                                required
                                            />
                                            <small className="text-gray-500">Введіть номер у форматі +380XXXXXXXXX</small>
                                        </div>





                                        {deliveryMethod === "delivery" && (
                                            <>
                                                <div className="mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Місто</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                                        value="Ужгород"
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Вулиця</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        value={orderData.street}
                                                        onChange={(e) => setOrderData({ ...orderData, street: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Будинок</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        value={orderData.house}
                                                        onChange={(e) => setOrderData({ ...orderData, house: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-gray-700 font-semibold mb-2">Квартира</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border border-gray-300 rounded-md"
                                                        value={orderData.apartment}
                                                        onChange={(e) => setOrderData({ ...orderData, apartment: e.target.value })}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {deliveryMethod === "pickup" && (
                                            <div className="mt-4">
                                                <label className="block text-gray-700 font-semibold mb-2">Пункт самовивозу</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                                    value="м. Ужгород, вул. Корзо, 123"
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        <div className="mt-6 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                                onClick={() => setIsOrderFormVisible(false)}
                                            >
                                                Скасувати
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-yellow-500 text-white py-2 px-4 rounded-md"
                                                onClick={handleOrderSubmit}
                                            >
                                                Оформити замовлення
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}





        </header>
    );
};

export default Header;
