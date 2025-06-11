import { useEffect, useState } from "react";
import axios from "axios";
import defaultFoodImage from '../assets/images/defaultfoodimage.png';
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

interface Ingredient {
    name: string;
    quantity: string;
    unit?: string;
}

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ingredients: Ingredient[];  // Масив інгредієнтів
    weight: string;  // Вага страви
    preparationTime: string;  // Час приготування
}

const DishDetails = () => {
    const { fetchCart } = useCart();
    const { dishId } = useParams();
    const [dish, setDish] = useState<Dish | null>(null);
    const [isItemAdded, setIsItemAdded] = useState(false);

    useEffect(() => {
        if (dishId) {
            axios.get(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes/${dishId}`)
                .then(response => {
                    setDish(response.data);
                })
                .catch(error => {
                    console.error("Error fetching dish details:", error);
                });
        }
    }, [dishId]);


    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Щоб зробити замовлення, увійдіть у свій обліковий запис.");
            return;
        }

        if (!dish) return;

        try {
            await axios.post('https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/cart/add', {
                dishId: dish.id,
                quantity: 1,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsItemAdded(true);
            fetchCart();

            setTimeout(() => setIsItemAdded(false), 2000);
        } catch (error) {
            console.error("Error adding dish to cart:", error);
        }
    };

    if (!dish) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <Header />
            <main>
                <section className="w-full py-12">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
                        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                            <img
                                src={dish.imageUrl?.trim() ? dish.imageUrl : defaultFoodImage}
                                alt={dish.name}
                                className="w-full h-96 object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        <div className="w-full lg:w-1/2 lg:ml-12">
                            <h2 className="text-4xl font-bold text-gray-800">{dish.name}</h2>
                            <p className="text-gray-500 mt-4">{dish.description}</p>

                            <div className="mt-8">
                                <p className="text-lg text-gray-700 font-semibold">Інгредієнти:</p>
                                <ul className="text-gray-500 mt-2">
                                    {dish?.ingredients?.map((ing, idx) => (
                                        <li key={idx}>
                                            {ing.name} – {ing.quantity} {ing.unit ?? ''}
                                        </li>
                                    )) || <p>Інгредієнти відсутні</p>}
                                </ul>

                                <p className="text-lg text-gray-700 font-semibold mt-4">Вага:</p>
                                <p className="text-gray-500 mt-2">{dish.weight}</p>

                                <p className="text-lg text-gray-700 font-semibold mt-4">Час приготування:</p>
                                <p className="text-gray-500 mt-2">{dish.preparationTime}</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-2xl font-bold text-yellow-500">{dish.price} грн</p>
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-yellow-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-yellow-400 transition"
                                >
                                    Додати в кошик
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Повідомлення про успішне додавання в кошик */}
            {isItemAdded && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
                    Страву успішно додано до кошика!
                </div>
            )}
        </div>
    );
};

export default DishDetails;
