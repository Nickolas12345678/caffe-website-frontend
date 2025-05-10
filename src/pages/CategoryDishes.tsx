

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const CategoryDishes = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();  // Використовуємо для навігації
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryName, setCategoryName] = useState<string>("");

    const fetchDishes = () => {
        axios.get(`http://localhost:8080/api/dishes/category/${categoryId}?page=${page}&size=10`)
            .then((response) => {
                if (response.data && response.data.content) {
                    setDishes(response.data.content);
                    setTotalPages(response.data.totalPages);
                } else {
                    setDishes([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching dishes:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDishes();
        axios.get(`http://localhost:8080/api/categories/${categoryId}`)
            .then((response) => {
                if (response.data) {
                    setCategoryName(response.data.name);
                }
            })
            .catch((error) => {
                console.error("Error fetching category:", error);
            });
    }, [categoryId, page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleDishClick = (dishId: number) => {
        navigate(`/dish/${dishId}`);   // Перехід на сторінку детального перегляду товару
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <Header />
            <main>
                <section className="w-full py-12">
                    <h2 className="text-4xl font-bold text-center mb-12">{categoryName}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
                        {dishes.length > 0 ? (
                            dishes.map((dish) => (
                                <div key={dish.id} className="group relative" onClick={() => handleDishClick(dish.id)}>
                                    <img
                                        src={dish.imageUrl}
                                        alt={dish.name}
                                        className="w-full h-48 object-cover rounded-lg transition-all duration-300 transform group-hover:scale-110 cursor-pointer"
                                    />
                                    <div className="text-center mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800">{dish.name}</h3>
                                        <p className="text-sm text-gray-500">{dish.description}</p>
                                        <p className="text-lg font-bold">{dish.price} грн</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Страви не знайдено</p>
                        )}
                    </div>

                    {/* Пагінація */}
                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                disabled={index === page}
                                className={`px-4 py-2 mx-1 ${index === page ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-500'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CategoryDishes;
