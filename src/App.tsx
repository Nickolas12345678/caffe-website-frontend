import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignupForm from "./pages/SignupForm";
import SigninForm from "./pages/SigninForm";
import CategoryDishes from "./pages/CategoryDishes";
import ProtectedRoute from "./components/ProtectedRoute";
import DishDetails from "./pages/DishDetails";
import AdminPage from "./pages/admin/AdminPage";
import { AuthProvider } from "./context/AuthContext";
import About from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import MyOrdersPage from "./pages/MyOrdersPage";

function App() {

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/signin" element={<SigninForm />} />
                    <Route path="/category/:categoryId" element={<CategoryDishes />} />
                    <Route path="/dish/:dishId" element={<DishDetails />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                    <Route path="/about" element={<About />} />
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App;
