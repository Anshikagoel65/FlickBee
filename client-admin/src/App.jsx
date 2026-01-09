import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HeroBanners from "./pages/HeroBanners";
import Categories from "./pages/Categories";
import Sections from "./pages/Sections";
import AdminLayout from "./components/AdminLayout";
import Products from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="banners" element={<HeroBanners />} />
          <Route path="categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="sections" element={<Sections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
