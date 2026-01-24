import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import NavBar from "./components/NavBar";
import Search from "./pages/Search";
import { Toaster } from "react-hot-toast";
import Account from "./pages/account/Account";
import MyOrders from "./pages/account/MyOrders";
import MyAddresses from "./pages/account/MyAddresses";
import AccountMobile from "./pages/account/AccountMobile";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./components/ProductPage";
import { useAuthContext } from "./context/AuthContext";
import OrderInvoice from "./pages/account/OrderInvoice";

function App() {
  const { authLoading } = useAuthContext();

  if (authLoading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      {/* 🔔 TOASTER (GLOBAL) */}
      <Toaster position="top-center" reverseOrder={false} />

      <NavBar />

      {/* OFFSET FOR FIXED NAVBAR */}
      <div className="pt-[90px] md:pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/account" element={<Account />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="addresses" element={<MyAddresses />} />
            <Route path="orders/:orderId" element={<OrderInvoice />} />
          </Route>

          {/* MOBILE ACCOUNT */}
          <Route path="/account/mobile" element={<AccountMobile />}>
            <Route path="addresses" element={<MyAddresses />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
