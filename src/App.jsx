import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./routes/LoginPage";
import CreateAccount from "./routes/CreateAccount";
import ResetPassword from "./routes/ResetPassword";
import Home from "./routes/Home";
import Feed from "./routes/Feed";
import Categories from "./routes/Categories";
import ArticleDetail from "./routes/ArticleDetail";
import UserProfile from "./routes/UserProfile";
import AdminDashboard from "./routes/AdminDashboard";
import PostArticle from "./routes/PostArticle";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="w-full min-h-screen bg-floodlight dark:bg-night-pitch text-slate-900 dark:text-stone-100 font-body transition-colors duration-200 overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          {/* Protected routes */}
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-article"
            element={
              <ProtectedRoute>
                <PostArticle />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
