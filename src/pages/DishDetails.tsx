import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

interface Ingredient {
    name: string;
    quantity: string;
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
    const { dishId } = useParams(); // Отримуємо dishId з URL
    const [dish, setDish] = useState<Dish | null>(null);  // Змінна для збереження інформації про товар

    useEffect(() => {
        if (dishId) {
            axios.get(`http://localhost:8080/api/dishes/${dishId}`)
                .then(response => {
                    setDish(response.data); // Отримуємо деталі товару
                })
                .catch(error => {
                    console.error("Error fetching dish details:", error);
                });
        }
    }, [dishId]);

    const handleAddToCart = () => {
        console.log(`${dish?.name} додано в кошик!`);
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
                                src={dish.imageUrl}
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
                                        <li key={idx}>{ing.name} – {ing.quantity}</li>
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
        </div>
    );
};

export default DishDetails;

