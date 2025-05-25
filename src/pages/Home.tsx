import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import dessertAndCoffee from "../assets/images/dessertandcoffee.png";

interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

const Home = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/categories")
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (categoryId: number) => {
        navigate(`/category/${categoryId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white">
            <Header />

            <main>
                <section className="w-full h-screen relative flex items-center justify-center overflow-hidden">
                    <img
                        src={dessertAndCoffee}
                        alt="Dessert and coffee"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="bg-black bg-opacity-50 absolute inset-0"></div>
                    <div className="relative z-10 text-center text-white px-6">
                        <h2 className="text-5xl font-extrabold mb-6">Ласкаво просимо до FormaCafe</h2>
                        <p className="text-xl mb-8">Скуштуйте найсмачнішу каву та десерти у затишній атмосфері</p>
                        <a href="#menu" className="bg-yellow-500 text-yellow-900 px-6 py-3 text-lg rounded-lg hover:bg-yellow-400 transition">
                            Переглянути меню
                        </a>
                    </div>
                </section>

                <section id="menu" className="w-full py-12">
                    <h2 className="text-4xl font-bold text-center mb-12">Меню</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-6">
                        {categories.map((category) => (
                            <div key={category.id} className="group relative" onClick={() => handleCategoryClick(category.id)}>
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-56 object-cover rounded-lg transition-all duration-300 transform group-hover:scale-110 cursor-pointer"
                                />
                                <div className="text-center mt-4">
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-yellow-500 transition duration-300 cursor-pointer">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{category.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default Home;
