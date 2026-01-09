import { Menu } from "lucide-react";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";

const Topbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden h-14 bg-white border-b flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu />
        </button>

        <h1 className="font-bold text-green-600">FlickBee Admin</h1>
      </header>

      {open && <MobileSidebar onClose={() => setOpen(false)} />}
    </>
  );
};

export default Topbar;
