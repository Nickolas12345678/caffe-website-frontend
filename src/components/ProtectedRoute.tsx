import { useAuth } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAdmin, loading } = useAuth();

    console.log("Auth in ProtectedRoute:", { user, isAdmin, loading });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !isAdmin) {
        console.warn("Access denied! Redirecting...");
        return <NotFound />;
    }

    return children;
};

export default ProtectedRoute;
