import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen flex flex-col">

            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-extrabold text-yellow-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Сторінку не знайдено</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    Повернутись на головну
                </button>
            </div>
        </div>
    );
};

export default NotFound;
