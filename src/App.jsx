import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Backoffice from "./pages/Backoffice";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
