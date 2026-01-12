import {
  MoreVertical,
  Home,
  Building2,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAddresses, deleteAddress } from "../../services/addressApi";
import AddressModal from "../../components/AddressModal";

/* ICON BY TYPE */
const getTypeIcon = (type) => {
  switch (type) {
    case "home":
      return <Home size={18} className="text-green-600" />;
    case "work":
      return <Building2 size={18} className="text-blue-600" />;
    default:
      return <MapPin size={18} className="text-gray-600" />;
  }
};

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <div className="bg-white rounded-xl p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My addresses</h2>
        <button
          onClick={() => {
            setEditData(null);
            setOpenModal(true);
          }}
          className="text-green-600 font-medium"
        >
          + Add new address
        </button>
      </div>

      {/* EMPTY STATE */}
      {addresses.length === 0 ? (
        <p className="text-gray-500 mt-10 text-center">No saved addresses</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a._id}
              className="border rounded-lg p-4 flex justify-between items-start relative"
            >
              {/* LEFT */}
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(a.type)}
                </div>

                <div>
                  <p className="font-semibold">{a.type}</p>
                  <p className="text-sm text-gray-600">
                    {a.name}, {a.houseNo}, {a.street1}
                  </p>
                </div>
              </div>

              {/* RIGHT (⋮ MENU) */}
              <button
                onClick={() =>
                  setMenuOpenId(menuOpenId === a._id ? null : a._id)
                }
              >
                <MoreVertical />
              </button>

              {menuOpenId === a._id && (
                <div className="absolute right-3 top-12 w-32 bg-white border rounded-lg shadow-md z-20">
                  <button
                    onClick={() => {
                      setEditData(a);
                      setOpenModal(true);
                      setMenuOpenId(null);
                    }}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={async () => {
                      await deleteAddress(a._id);
                      loadAddresses();
                      setMenuOpenId(null);
                    }}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {openModal && (
        <AddressModal
          initialData={editData}
          onClose={() => setOpenModal(false)}
          onSave={loadAddresses}
        />
      )}
    </div>
  );
};

export default MyAddresses;
