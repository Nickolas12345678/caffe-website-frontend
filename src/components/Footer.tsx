const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-12">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo & Description */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-yellow-500">FormaCafe</h2>
                    <p className="text-sm text-gray-300">
                        Затишна кав’ярня, де кожна чашка кави — це історія. Завітайте до нас і відчуйте тепло справжнього обслуговування.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Навігація</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><a href="/" className="hover:text-yellow-500 transition">Головна</a></li>
                        <li><a href="/about" className="hover:text-yellow-500 transition">Про нас</a></li>
                        <li><a href="#menu" className="hover:text-yellow-500 transition">Меню</a></li>
                        <li><a href="/contacts" className="hover:text-yellow-500 transition">Контакти</a></li>
                    </ul>
                </div>

                {/* Contacts */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Контакти</h3>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>📍 вул. Корзо,123, Ужгород</li>
                        <li>📞 +380 (50) 123 45 67</li>
                        <li>📧 info@formacafe.ua</li>
                        <li className="flex space-x-4 mt-2">
                            <a href="#" className="hover:text-yellow-500 transition">Facebook</a>
                            <a href="#" className="hover:text-yellow-500 transition">Instagram</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} FormaCafe. Всі права захищені.
            </div>
        </footer>
    );
};

export default Footer;
