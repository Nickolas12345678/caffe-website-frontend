import Footer from "../components/Footer";
import Header from "../components/Header";

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            <Header />

            <section className="relative bg-[url('/src/assets/images/aboutimage.png')] bg-cover bg-center bg-no-repeat h-[80vh] flex items-center justify-center">
                <div className=" bg-opacity-60 absolute inset-0"></div>
                <div className="relative z-10 text-white text-center max-w-3xl px-4">
                    <h1 className="text-5xl font-bold mb-4">Про FormaCafe</h1>
                    <p className="text-xl">
                        FormaCafe — це місце, де кожна чашка кави розповідає історію. Затишна атмосфера, ароматні напої та найкращі десерти для душі.
                    </p>
                </div>
            </section>

            <section className="py-16 px-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <img src="/src/assets/images/caffe.png" alt="Кав'ярня" className="rounded-2xl shadow-lg" />
                    <div>
                        <h2 className="text-4xl font-bold text-yellow-600 mb-4">Наша історія</h2>
                        <p className="text-gray-700 text-lg mb-4">
                            FormaCafe народилось із пристрасті до кави та бажання створити місце, де кожен гість почувається як вдома. З 2018 року ми тішимо гостей натуральними напоями, домашніми десертами та щирим обслуговуванням.
                        </p>
                        <p className="text-gray-600">
                            Ми — не просто кафе. Ми — простір, де формується настрій, з’являються ідеї та трапляються смачні моменти. Тут кожна деталь — від кавового зерна до інтер’єру — продумана з любов’ю.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-yellow-50 py-16 pb-0 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-10 text-yellow-700">Наші цінності</h2>
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
                            <div className="text-4xl mb-4">☕</div>
                            <h3 className="text-xl font-semibold mb-2 text-yellow-800">Якість зерен</h3>
                            <p className="text-gray-600 text-sm">Ми обираємо тільки найкращі сорти кавових зерен для досконалого смаку.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
                            <div className="text-4xl mb-4">🍰</div>
                            <h3 className="text-xl font-semibold mb-2 text-yellow-800">Домашні десерти</h3>
                            <p className="text-gray-600 text-sm">Наші десерти створені з любов’ю, щоб запам’ятовуватись надовго.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
                            <div className="text-4xl mb-4">🛋️</div>
                            <h3 className="text-xl font-semibold mb-2 text-yellow-800">Атмосфера</h3>
                            <p className="text-gray-600 text-sm">Затишний простір для роботи, розмов та відпочинку.</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
                            <div className="text-4xl mb-4">😊</div>
                            <h3 className="text-xl font-semibold mb-2 text-yellow-800">Обслуговування</h3>
                            <p className="text-gray-600 text-sm">Ми даруємо посмішку кожному гостю і завжди щирі у спілкуванні.</p>
                        </div>
                    </div>
                </div>
            </section>


            <Footer />
        </div>
    );
};

export default About;
