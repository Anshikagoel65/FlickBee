import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import NavBar from "./components/NavBar";
import Search from "./pages/Search";
import { Toaster } from "react-hot-toast";
import Account from "./pages/account/Account";
import MyOrders from "./pages/account/MyOrders";
import MyAddresses from "./pages/account/MyAddresses";
import AccountMobile from "./pages/account/AccountMobile";

function App() {
  return (
    <BrowserRouter>
      {/* 🔔 TOASTER (GLOBAL) */}
      <Toaster position="top-center" reverseOrder={false} />

      <NavBar />

      {/* OFFSET FOR FIXED NAVBAR */}
      <div className="pt-[70px] md:pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/account" element={<Account />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="addresses" element={<MyAddresses />} />
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
