import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formCategory, setFormCategory] = useState<Category>({
        id: 0,
        name: "",
        description: "",
        imageUrl: "",
    });

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get<Category[]>(
                    "https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories",
                    { headers: { token } }
                );
                setCategories(response.data);
            } catch (error) {
                console.error("Помилка при отриманні категорій", error);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (id: number) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю категорію?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories/${id}`, {
                headers: { token },
            });
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            alert("Категорію успішно видалено");
        } catch (error) {
            console.error("Помилка при видаленні категорії", error);
        }
    };

    const saveCategory = async () => {
        const token = localStorage.getItem("token");
        try {
            const categoryData = {
                name: formCategory.name,
                description: formCategory.description,
                imageUrl: formCategory.imageUrl,
            };

            if (editingCategory) {
                const response = await axios.put(
                    `https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories/${editingCategory.id}`,
                    categoryData,
                    { headers: { token } }
                );
                setCategories((prev) =>
                    prev.map((cat) => (cat.id === editingCategory.id ? response.data : cat))
                );
                alert("Категорію оновлено");
            } else {
                const response = await axios.post(
                    "https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories",
                    categoryData,
                    { headers: { token } }
                );
                setCategories((prev) => [...prev, response.data]);
                alert("Категорію додано");
            }

            setShowModal(false);
            setFormCategory({ id: 0, name: "", description: "", imageUrl: "" });
            setEditingCategory(null);
        } catch (error) {
            console.error("Помилка при збереженні категорії", error);
        }
    };


    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormCategory(category);
        } else {
            setEditingCategory(null);
            setFormCategory({ id: 0, name: "", description: "", imageUrl: "" });
        }
        setShowModal(true);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-semibold text-gray-800">Категорії</h2>
                <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Назва</th>
                            <th className="p-3 text-left">Опис</th>
                            <th className="p-3 text-left">Зображення</th>
                            <th className="p-3 text-center">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="p-3">{cat.id}</td>
                                <td className="p-3">{cat.name}</td>
                                <td className="p-3">{cat.description}</td>
                                <td className="p-3">
                                    <img src={cat.imageUrl} alt="category" className="h-16 w-16 object-cover rounded" />
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => openModal(cat)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full mb-2"
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={() => openModal()}
                    className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full mt-4 text-lg"
                >
                    Додати категорію
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">
                            {editingCategory ? "Редагувати категорію" : "Нова категорія"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Назва"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            value={formCategory.name}
                            onChange={(e) => setFormCategory({ ...formCategory, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Опис"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            value={formCategory.description}
                            onChange={(e) => setFormCategory({ ...formCategory, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL зображення"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            value={formCategory.imageUrl}
                            onChange={(e) => setFormCategory({ ...formCategory, imageUrl: e.target.value })}
                        />
                        <button onClick={saveCategory} className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2">
                            Зберегти
                        </button>
                        <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded w-full">
                            Скасувати
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoriesPage;
