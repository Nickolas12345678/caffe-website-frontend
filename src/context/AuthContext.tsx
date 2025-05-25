import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}



interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    console.log("User data:", res.data);
                    setUser(res.data);
                })
                .catch(() => {
                    console.error("Failed to fetch user");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("jwt", token);
        setLoading(true);
        axios
            .get("https://formacafe-backend-60a4ca54e25f.herokuapp.com/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log("User logged in:", res.data);
                setUser(res.data);
            })
            .catch(() => {
                console.error("Login failed");
                setUser(null);
            })
            .finally(() => setLoading(false));
    };

    const logout = () => {
        console.log("User logged out.");
        localStorage.removeItem("jwt");
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin: user?.role === "ROLE_ADMIN",
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
