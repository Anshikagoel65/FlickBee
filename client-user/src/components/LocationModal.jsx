import { useState, useEffect } from "react";
import {
  MapPin,
  X,
  Home,
  Building2,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";

import { useLocationContext } from "../context/LocationContext";
import AddressModal from "./AddressModal";
import { getAddresses, deleteAddress } from "../services/addressApi";
import { useAuthContext } from "../context/AuthContext";

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

const NOMINATIM_REVERSE_URL = process.env.REACT_APP_NOMINATIM_REVERSE_URL;

const LocationModal = () => {
  const { setAddress, setDeliveryTime, setIsModalOpen } = useLocationContext();
  const { user } = useAuthContext();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [input, setInput] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const hasSavedAddresses = savedAddresses.length > 0;

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setSavedAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load saved addresses", err);
    }
  };

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `${NOMINATIM_REVERSE_URL}?format=json&lat=${latitude}&lon=${longitude}`,
        );
        const data = await res.json();

        const house = data.address.house_number || "";
        const road = data.address.road || "";
        const city =
          data.address.city || data.address.town || data.address.village || "";

        setAddress(`${house} ${road}, ${city}`);
        setDeliveryTime(10);
        setIsModalOpen(false);
      },
      () => alert("Location permission denied"),
    );
  };

  const handleConfirmLocation = () => {
    if (!input.trim()) return;

    let time = 20;
    if (input.toLowerCase().includes("sector")) time = 10;
    if (input.toLowerCase().includes("village")) time = 30;

    setAddress(input);
    setDeliveryTime(time);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setIsModalOpen(false)}
      />

      <div
        className="
          fixed z-50 bg-[#f5f7fa]
          w-full bottom-0 rounded-t-2xl p-4
          md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:bottom-auto md:w-[520px] md:rounded-xl
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Change Location</h2>
          <button onClick={() => setIsModalOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleDetectLocation}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Detect my location
          </button>

          <span className="text-gray-400 text-sm">OR</span>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="search delivery location"
            className="flex-1 px-3 py-2 border rounded-lg outline-none"
          />
        </div>
        {hasSavedAddresses && (
          <>
            <div className="text-sm text-gray-500 mb-2">
              Your saved addresses
            </div>

            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <AddressItem
                  key={addr._id}
                  address={addr}
                  onSelect={() => {
                    setAddress(
                      `${addr.houseNo}, ${addr.street1}${
                        addr.landmark ? ", " + addr.landmark : ""
                      }`,
                    );

                    setDeliveryTime(15);
                    setIsModalOpen(false);
                  }}
                  onEdit={() => {
                    setEditData(addr);
                    setOpenEditModal(true);
                  }}
                  onDelete={async () => {
                    await deleteAddress(addr._id);
                    loadAddresses();
                  }}
                />
              ))}
            </div>
          </>
        )}
        <button
          onClick={handleConfirmLocation}
          className="w-full bg-black text-white py-3 rounded-lg mt-4"
        >
          Confirm location
        </button>
      </div>
      {openEditModal && (
        <AddressModal
          initialData={editData}
          onClose={() => {
            setOpenEditModal(false);
            setEditData(null);
          }}
          onSave={() => {
            loadAddresses();
            setOpenEditModal(false);
            setEditData(null);
          }}
        />
      )}
    </>
  );
};

const AddressItem = ({ address, onSelect, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 flex justify-between items-start hover:bg-gray-50 transition">
      <div className="flex gap-3 cursor-pointer items-start" onClick={onSelect}>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {getTypeIcon(address.type)}
        </div>
        <div>
          <p className="font-semibold capitalize">{address.type}</p>
          <p className="text-sm text-gray-600">
            {address.name}, {address.houseNo}, {address.street1}
          </p>
        </div>
      </div>
      <div className="relative">
        <button onClick={() => setOpen(!open)}>
          <MoreVertical size={18} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-md z-50">
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <Pencil size={14} /> Edit
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationModal;
