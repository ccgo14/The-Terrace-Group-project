import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./routes/Categories";
import ArticleDetail from "./routes/ArticleDetail";
import Admin from "./routes/AdminDashboard";
import Signup from "./routes/CreateAccount";
import LogInPage from "./components/LoginPage";

export default function App() {
  return (
    <Router>
      <div className="bg-night-pitch text-floodlight min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LogInPage />} />
        </Routes>
      </div>
    </Router>
  );
}