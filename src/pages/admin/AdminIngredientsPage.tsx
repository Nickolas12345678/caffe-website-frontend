import { useEffect, useState } from "react";
import axios from "axios";

interface IngredientStock {
    id: number;
    name: string;
    availableQuantity: number;
    unit: string;
}

const IngredientStocksPage = () => {
    const [ingredients, setIngredients] = useState<IngredientStock[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: "", availableQuantity: "", unit: "" });

    const fetchIngredients = async () => {
        try {
            const res = await axios.get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/ingredient-stocks");
            setIngredients(res.data);
        } catch (err) {
            console.error("Помилка при завантаженні інгредієнтів", err);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.availableQuantity.trim() || !form.unit.trim()) {
            alert("Заповніть всі поля");
            return;
        }

        const data = {
            name: form.name.trim(),
            availableQuantity: parseFloat(form.availableQuantity),
            unit: form.unit.trim()
        };

        try {
            if (editId) {
                await axios.put(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/ingredient-stocks/${editId}`, data);
                alert("Інгредієнт оновлено");
            } else {
                await axios.post("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/ingredient-stocks", data);
                alert("Інгредієнт створено");
            }
            setModalOpen(false);
            setEditId(null);
            resetForm();
            fetchIngredients();
        } catch {
            alert("Помилка при збереженні інгредієнта");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви впевнені, що хочете видалити інгредієнт?")) {
            try {
                await axios.delete(`https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/ingredient-stocks/${id}`);
                fetchIngredients();
            } catch {
                alert("Помилка при видаленні інгредієнта");
            }
        }
    };

    const openEditModal = (ing: IngredientStock) => {
        setEditId(ing.id);
        setForm({
            name: ing.name,
            availableQuantity: ing.availableQuantity.toString(),
            unit: ing.unit,
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setForm({ name: "", availableQuantity: "", unit: "" });
    };

    return (
        <div className="bg-gray-100 py-10 px-4 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full  mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Список інгредієнтів</h2>
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">Назва</th>
                            <th className="p-3 text-left">Кількість</th>
                            <th className="p-3 text-left">Одиниця</th>
                            <th className="p-3 text-center">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ing, index) => (
                            <tr key={ing.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                <td className="p-3 text-gray-900 font-bold">{ing.name}</td>
                                <td className="p-3 text-gray-800">{ing.availableQuantity}</td>
                                <td className="p-3 text-gray-700">{ing.unit}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => openEditModal(ing)}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full mb-2"
                                    >
                                        Змінити
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ing.id)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={() => { setModalOpen(true); setEditId(null); resetForm(); }}
                    className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full mt-6 text-lg"
                >
                    Додати інгредієнт
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">
                            {editId ? "Редагування інгредієнта" : "Новий інгредієнт"}
                        </h2>
                        <input
                            className="w-full mb-2 p-2 border rounded bg-white text-black"
                            placeholder="Назва"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                        <input
                            type="number"
                            className="w-full mb-2 p-2 border rounded bg-white text-black"
                            placeholder="Кількість"
                            value={form.availableQuantity}
                            onChange={e => setForm({ ...form, availableQuantity: e.target.value })}
                        />
                        <input
                            className="w-full mb-4 p-2 border rounded bg-white text-black"
                            placeholder="Одиниця вимірювання"
                            value={form.unit}
                            onChange={e => setForm({ ...form, unit: e.target.value })}
                        />
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                        >
                            Зберегти
                        </button>
                        <button
                            onClick={() => { setModalOpen(false); resetForm(); }}
                            className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientStocksPage;
