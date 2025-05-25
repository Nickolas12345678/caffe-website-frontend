import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface SigninResponse {
    jwt: string;
    message: string;
    role: string;
}



const SigninForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axios.post<SigninResponse>('https://formacafe-backend-60a4ca54e25f.herokuapp.com/auth/signin', formData);
            setSuccessMessage(response.data.message);
            setFormData({ email: '', password: '' });

            localStorage.setItem('token', response.data.jwt);
            localStorage.setItem('role', response.data.role);
            navigate("/");

        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
                setErrorMessage(axiosError.response.data.message);
            } else {
                setErrorMessage("Щось пішло не так. Спробуйте ще раз.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Вхід</h2>

                {successMessage && (
                    <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="mb-4 text-red-600 font-semibold">{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Увійти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SigninForm;
