import { useEffect, useState } from "react";
import defaultFoodImage from '../../assets/images/defaultfoodimage.png';

interface Ingredient {
    name: string;
    quantity: string;
    unit?: string;
}

interface Category {
    id: number;
    name: string;
}

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    weight?: string;
    preparationTime?: string;
    category: Category;
    ingredients: Ingredient[];
}

const AdminDishesPage = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [ingredientStocks, setIngredientStocks] = useState<{ name: string, availableQuantity: number, unit: string }[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // const [form, setForm] = useState({
    //     name: "",
    //     description: "",
    //     price: 0,
    //     imageUrl: "",
    //     weight: "",
    //     preparationTime: "",
    //     categoryId: 1,
    //     ingredients: [{ name: "", quantity: "" }],
    // });

    const [form, setForm] = useState<{
        name: string;
        description: string;
        price: number;
        imageUrl: string;
        weight: string;
        preparationTime: string;
        categoryId: number;
        ingredients: Ingredient[];
    }>({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        weight: "",
        preparationTime: "",
        categoryId: 1,
        ingredients: [{ name: "", quantity: "", unit: "" }],
    });


    const loadDishes = async () => {
        try {
            const res = await fetch(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes?page=${page}&size=10`);
            const data = await res.json();

            if (Array.isArray(data.content)) {
                setDishes(data.content);
                setTotalPages(data.totalPages);
            } else {
                console.error("Очікувався об'єкт із content, отримано:", data);
                setDishes([]);
            }
        } catch (err) {
            console.error("Помилка при отриманні страв", err);
            setDishes([]);
        }
    };


    const loadCategories = async () => {
        try {
            const res = await fetch("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.error("Invalid category response:", data);
            }
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const loadIngredientStocks = async () => {
        try {
            const res = await fetch("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/ingredient-stocks");
            const data = await res.json();
            setIngredientStocks(data);
        } catch (err) {
            console.error("Failed to fetch ingredient stocks", err);
        }
    };

    useEffect(() => {
        loadDishes();
        loadCategories();
        loadIngredientStocks();
    }, [page]);

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert("Поле 'Назва' є обов’язковим.");
            return;
        }
        if (!form.preparationTime.trim()) {
            alert("Поле 'Час приготування' є обов’язковим.");
            return;
        }
        if (form.price < 5) {
            alert("Ціна повинна бути не меншою за 5 грн.");
            return;
        }

        for (const ing of form.ingredients) {
            const stock = ingredientStocks.find(i => i.name === ing.name.trim());
            const requestedQty = parseFloat(ing.quantity);

            if (!stock) {
                alert(`Інгредієнт "${ing.name}" відсутній на складі.`);
                return;
            }

            if (isNaN(requestedQty) || requestedQty > stock.availableQuantity) {
                alert(`Недостатньо інгредієнту "${ing.name}". Доступно: ${stock.availableQuantity} ${stock.unit}`);
                return;
            }
        }

        try {
            const url = editId
                ? `https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes/${editId}`
                : `https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes`;

            const method = editId ? "PUT" : "POST";

            const payload = {
                name: form.name,
                description: form.description,
                price: form.price,
                imageUrl: form.imageUrl,
                weight: form.weight,
                preparationTime: form.preparationTime,
                categoryId: form.categoryId,
                ingredients: form.ingredients,
            };

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            setModalOpen(false);
            setEditId(null);
            resetForm();
            loadDishes();
            alert(editId ? "Страву оновлено" : "Страву додано");
        } catch {
            alert("Помилка при збереженні страви");
        }
    };


    const handleDelete = async (id: number) => {
        if (window.confirm("Видалити страву?")) {
            try {
                await fetch(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/dishes/${id}`, { method: "DELETE" });
                loadDishes();
            } catch {
                alert("Помилка при видаленні");
            }
        }
    };

    const openEditModal = (dish: Dish) => {
        setEditId(dish.id);
        setForm({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            imageUrl: dish.imageUrl,
            weight: dish.weight || "",
            preparationTime: dish.preparationTime || "",
            categoryId: dish.category?.id ?? categories[0]?.id ?? 1,
            ingredients: dish.ingredients.length ? dish.ingredients : [{ name: "", quantity: "" }],
        });
        setModalOpen(true);

    };


    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            weight: "",
            preparationTime: "",
            categoryId: 1,
            ingredients: [{ name: "", quantity: "" }],
        });
    };

    const addIngredient = () => {
        setForm((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: "", quantity: "" }],
        }));
    };

    const updateIngredient = (index: number, key: keyof Ingredient, value: string) => {
        const updated = [...form.ingredients];
        updated[index][key] = value;
        setForm({ ...form, ingredients: updated });
    };

    const removeIngredient = (index: number) => {
        const updated = [...form.ingredients];
        updated.splice(index, 1);
        setForm({ ...form, ingredients: updated });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-7xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Страви</h2>
                <div className="overflow-x-auto">
                    <table className="w-full  border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Фото</th>
                                <th className="p-3 text-left">Назва</th>
                                <th className="p-3 text-left">Опис</th>
                                <th className="p-3 text-left">Ціна</th>
                                <th className="p-3 text-left">Вага</th>
                                <th className="p-3 text-left">Час приготування</th>
                                <th className="p-3 text-left">Категорія</th>
                                <th className="p-3 text-left">Інгредієнти</th>
                                <th className="p-3 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dishes.map((dish, i) => (
                                <tr key={dish.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="p-3">{dish.id}</td>
                                    <td className="p-3 align-middle">
                                        <img
                                            src={dish.imageUrl?.trim() ? dish.imageUrl : defaultFoodImage}
                                            alt={dish.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3 align-middle">{dish.name}</td>
                                    <td className="p-3 align-middle">{dish.description}</td>
                                    <td className="p-3 align-middle">{dish.price.toFixed(2)}</td>
                                    <td className="p-3 align-middle">{dish.weight || "-"}</td>
                                    <td className="p-3 align-middle">{dish.preparationTime || "-"}</td>
                                    <td className="p-3 align-middle">{dish.category?.name || "Без категорії"}</td>
                                    <td className="p-3 align-middle">
                                        <ul className="list-disc list-inside">
                                            {dish.ingredients.map((ing, idx) => (
                                                <li key={idx}>{ing.name} – {ing.quantity} {ing.unit || ""}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-3 text-center space-y-2">
                                        <button
                                            onClick={() => openEditModal(dish)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
                                        >
                                            Редагувати
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dish.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded w-full"
                                        >
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 rounded ${page === i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setEditId(null);
                        setModalOpen(true);
                    }}
                    className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full text-lg"
                >
                    Додати страву
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            {editId ? "Редагувати страву" : "Додати страву"}
                        </h2>

                        <input className="w-full p-2 mb-2 border rounded" placeholder="Назва" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <textarea className="w-full p-2 mb-2 border rounded" placeholder="Опис" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <input type="number" className="w-full p-2 mb-2 border rounded" placeholder="Ціна" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
                        <input className="w-full p-2 mb-2 border rounded" placeholder="URL зображення" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                        <input className="w-full p-2 mb-2 border rounded" placeholder="Вага" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                        <input className="w-full p-2 mb-2 border rounded" placeholder="Час приготування" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />

                        <select className="w-full p-2 mb-4 border rounded" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <div className="space-y-2 mb-4">
                            <label className="block font-semibold">Інгредієнти</label>
                            {form.ingredients.map((ing, idx) => (
                                <div key={idx} className="flex gap-2 mb-1">
                                    <select
                                        className="w-1/2 p-2 border rounded"
                                        value={ing.name}
                                        onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                                    >
                                        <option value="">Оберіть інгредієнт</option>
                                        {ingredientStocks.map(stock => (
                                            <option key={stock.name} value={stock.name}>
                                                {stock.name} (доступно: {stock.availableQuantity} {stock.unit})
                                            </option>
                                        ))}
                                    </select>

                                    <input className="w-1/2 p-2 border rounded" placeholder="Кількість" value={ing.quantity} onChange={(e) => updateIngredient(idx, "quantity", e.target.value)} />
                                    <button onClick={() => removeIngredient(idx)} className="text-red-500 font-bold">×</button>
                                </div>
                            ))}
                            <button onClick={addIngredient} className="text-blue-600 underline">+ Додати інгредієнт</button>
                        </div>

                        <div className="flex justify-between mt-4 gap-2">
                            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Зберегти</button>
                            <button onClick={() => { setModalOpen(false); resetForm(); setEditId(null); }} className="bg-gray-300 text-black px-4 py-2 rounded w-full">Скасувати</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDishesPage;
