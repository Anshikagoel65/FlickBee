import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ marginTop: "10px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
