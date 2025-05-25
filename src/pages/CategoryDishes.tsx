import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import defaultFoodImage from '../assets/images/defaultfoodimage.png';
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
    const navigate = useNavigate();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryName, setCategoryName] = useState<string>("");
    const [priceRange, setPriceRange] = useState<[string, string]>(["", ""]);
    const [sortOrder, setSortOrder] = useState<string | null>(null);  // Для сортування
    const [searchName, setSearchName] = useState(""); // Для зберігання пошукового запиту

    // Функція для отримання страв
    const fetchDishes = () => {
        const queryParams: Record<string, string | undefined> = {
            page: String(page),
            size: "10",
            minPrice: priceRange[0] ? String(priceRange[0]) : undefined,  // Якщо значення є, передаємо
            maxPrice: priceRange[1] ? String(priceRange[1]) : undefined,  // Якщо значення є, передаємо
            name: searchName,
        };

        // Додаємо sortOrder тільки в тому випадку, якщо він не порожній
        if (sortOrder) {
            queryParams.sort = sortOrder;
        }

        // Видаляємо параметри, де значення undefined
        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([, value]) => value !== undefined)
        );

        const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();

        axios.get(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes/category/${categoryId}?${queryString}`)
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
        axios.get(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories/${categoryId}`)
            .then((response) => {
                if (response.data) {
                    setCategoryName(response.data.name);
                }
            })
            .catch((error) => {
                console.error("Error fetching category:", error);
            });
    }, [categoryId, page, priceRange, sortOrder, searchName]); // Додаємо пошуковий запит та сортування до залежностей

    // Функція для зміни сторінки
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // Функція для переходу до окремої страви
    const handleDishClick = (dishId: number) => {
        navigate(`/dish/${dishId}`);
    };

    // Обробка зміни сортування
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);  // Оновлюємо стан сортування
    };

    // Обробка зміни діапазону цін
    const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newPriceRange = [...priceRange]; // Створюємо копію масиву
        newPriceRange[index] = e.target.value;  // Оновлюємо відповідне значення
        setPriceRange(newPriceRange as [string, string]); // Оновлюємо стан з правильним типом
    };

    // Обробка зміни пошуку по назві
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value); // Оновлюємо пошуковий запит
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

                    {/* Фільтри */}
                    <div className="flex flex-wrap gap-6 justify-center mb-8 px-6">
                        {/* Пошук по назві */}
                        <div className="w-full sm:w-1/2 lg:w-1/4">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Пошук за назвою</h4>
                                <input
                                    type="text"
                                    placeholder="Шукати за назвою..."
                                    value={searchName}
                                    onChange={handleSearchChange} // Оновлюємо пошуковий запит
                                    className="w-full p-2 border rounded-md bg-gray-50 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Сортування */}
                        <div className="w-full sm:w-1/2 lg:w-1/4">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Сортування</h4>
                                <select
                                    onChange={handleSortChange}
                                    className="w-full p-2 border rounded-md bg-gray-50 text-gray-800"
                                    value={sortOrder || ""}
                                >
                                    <option value="">Без сортування</option>
                                    <option value="asc">Від найдешевшого до найдорожчого</option>
                                    <option value="desc">Від найдорожчого до найдешевшого</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full sm:w-1/2 lg:w-1/4">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Ціновий діапазон</h4>
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-sm text-gray-600 mb-1">Від</label>
                                        <input
                                            type="number"
                                            placeholder="грн."
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceRangeChange(e, 0)}
                                            className="w-full p-2 border rounded-md bg-gray-50 text-gray-800"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm text-gray-600 mb-1">До</label>
                                        <input
                                            type="number"
                                            placeholder="грн."
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceRangeChange(e, 1)}
                                            className="w-full p-2 border rounded-md bg-gray-50 text-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
                        {dishes.length > 0 ? (
                            dishes.map((dish) => (
                                <div key={dish.id} className="group relative cursor-pointer" onClick={() => handleDishClick(dish.id)}>
                                    <img
                                        src={dish.imageUrl?.trim() ? dish.imageUrl : defaultFoodImage}
                                        alt={dish.name}
                                        className="w-full h-48 object-cover rounded-lg transition-all duration-300 transform group-hover:scale-110"
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
