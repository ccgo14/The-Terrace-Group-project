import { useEffect } from "react";
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
import MyComments from "./routes/MyComments";
import Bookmarks from "./routes/Bookmarks";
import MatchPredictorPage from "./routes/MatchPredictorPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="font-mono text-sm text-terracing/60 dark:text-floodlight/50">
          Loading...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <div className="w-full min-h-screen bg-floodlight text-night-pitch dark:bg-night-pitch dark:text-floodlight font-body overflow-x-hidden">
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />

            {/* Protected routes */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-comments"
              element={
                <ProtectedRoute>
                  <MyComments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/create-article"
              element={
                <ProtectedRoute>
                  <PostArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/match-predictor/:matchId"
              element={
                <ProtectedRoute>
                  <MatchPredictorPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
