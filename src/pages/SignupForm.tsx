import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessages({});

        if (formData.password.length < 6) {
            setErrorMessages({ password: 'Пароль має містити щонайменше 6 символів' });
            return;
        }

        try {
            const response = await axios.post('https://formacafe-backend-60a4ca54e25f.herokuapp.com/auth/signup', formData);
            setSuccessMessage(response.data.message);
            setFormData({ username: '', email: '', password: '' });
            localStorage.setItem('token', response.data.jwt);
            localStorage.setItem('role', response.data.role);
            navigate("/");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response.data;

                let message = "Користувач з таким email вже існує";

                if (typeof data === 'string') {
                    message = data;
                } else if (typeof data === 'object' && data.message) {
                    message = data.message;
                }

                setErrorMessages({ general: message });
            } else {
                setErrorMessages({ general: "Користувач з таким email вже існує" });
            }
        }
    };

    return (
        // <div className="flex items-center justify-center min-h-screen bg-gray-100">
        //     <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        //         <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>

        //         {successMessage && (
        //             <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
        //         )}

        //         {errorMessages.general && (
        //             <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
        //                 {errorMessages.general}
        //             </div>
        //         )}

        //         <form onSubmit={handleSubmit} className="space-y-4">
        //             <div>
        //                 <label className="block text-gray-700">Ім'я користувача</label>
        //                 <input
        //                     type="text"
        //                     name="username"
        //                     value={formData.username}
        //                     onChange={handleChange}
        //                     className={`w-full p-2 border ${errorMessages.username ? 'border-red-500' : 'border-gray-300'} rounded`}
        //                 />
        //                 {errorMessages.username && (
        //                     <p className="text-red-500 text-sm">{errorMessages.username}</p>
        //                 )}
        //             </div>

        //             <div>
        //                 <label className="block text-gray-700">Email</label>
        //                 <input
        //                     type="email"
        //                     name="email"
        //                     value={formData.email}
        //                     onChange={handleChange}
        //                     className={`w-full p-2 border ${errorMessages.email ? 'border-red-500' : 'border-gray-300'} rounded`}
        //                 />
        //                 {errorMessages.email && (
        //                     <p className="text-red-500 text-sm">{errorMessages.email}</p>
        //                 )}
        //             </div>

        //             <div>
        //                 <label className="block text-gray-700">Пароль</label>
        //                 <input
        //                     type="password"
        //                     name="password"
        //                     value={formData.password}
        //                     onChange={handleChange}
        //                     className={`w-full p-2 border ${errorMessages.password ? 'border-red-500' : 'border-gray-300'} rounded`}
        //                 />
        //                 {errorMessages.password && (
        //                     <p className="text-red-500 text-sm">{errorMessages.password}</p>
        //                 )}
        //             </div>

        //             <button
        //                 type="submit"
        //                 className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        //             >
        //                 Зареєструватися
        //             </button>
        //         </form>
        //     </div>
        // </div>
        <div className="min-h-screen bg-gray-100">
            {/* Хедер — завжди зверху, фіксовано або звичайно */}
            <Header />

            {/* Форма */}
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>

                    {successMessage && (
                        <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
                    )}

                    {errorMessages.general && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                            {errorMessages.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... Всі поля ... */}
                        <div>
                            <label className="block text-gray-700">Ім'я користувача</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full p-2 border ${errorMessages.username ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errorMessages.username && (
                                <p className="text-red-500 text-sm">{errorMessages.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-2 border ${errorMessages.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errorMessages.email && (
                                <p className="text-red-500 text-sm">{errorMessages.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-2 border ${errorMessages.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errorMessages.password && (
                                <p className="text-red-500 text-sm">{errorMessages.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                        >
                            Зареєструватися
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
