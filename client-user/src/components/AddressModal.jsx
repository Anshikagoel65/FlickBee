import { X } from "lucide-react";
import { Home, Building2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { addAddress, updateAddress } from "../services/addressApi";
import { useAuthContext } from "../context/AuthContext";

const AddressModal = ({ onClose, onSave, initialData }) => {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    type: "home",
    houseNo: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    landmark: "",
    name: "",
    phone: user?.phone || "",
    latitude: 0,
    longitude: 0,
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.houseNo || !form.street1 || !form.city || !form.state) {
      alert("Please fill all required fields");
      return;
    }

    try {
      initialData
        ? await updateAddress(initialData._id, form)
        : await addAddress(form);

      onSave();
      onClose();
    } catch (err) {
      console.error("SAVE ADDRESS ERROR:", err);
      alert("Failed to save address");
    }
  };

  const TypeButton = ({ icon, label, active, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition
        ${
          active
            ? "border-green-600 text-green-600 bg-green-50"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center px-2">
      <div
        className="bg-white w-full sm:max-w-md h-full sm:h-auto rounded-none sm:rounded-xl shadow-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-lg">
            {initialData ? "Edit address" : "Add new address"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <p className="text-sm text-gray-500 mb-2">Save address as</p>
            <div className="flex gap-3 flex-wrap">
              <TypeButton
                icon={<Home size={16} />}
                label="Home"
                active={form.type === "home"}
                onClick={() => setForm({ ...form, type: "home" })}
              />

              <TypeButton
                icon={<Building2 size={16} />}
                label="Work"
                active={form.type === "work"}
                onClick={() => setForm({ ...form, type: "work" })}
              />

              <TypeButton
                icon={<MapPin size={16} />}
                label="Other"
                active={form.type === "other"}
                onClick={() => setForm({ ...form, type: "other" })}
              />
            </div>
          </div>

          <input
            name="houseNo"
            value={form.houseNo}
            onChange={handleChange}
            className="input"
            placeholder="House / Flat / Building *"
            required
          />

          <input
            name="street1"
            value={form.street1}
            onChange={handleChange}
            className="input"
            placeholder="Street / Area *"
            required
          />

          <input
            name="street2"
            value={form.street2}
            onChange={handleChange}
            className="input"
            placeholder="Nearby area (optional)"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="input"
            placeholder="City *"
            required
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            className="input"
            placeholder="State *"
            required
          />

          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className="input"
            placeholder="Pincode *"
            required
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="Your name *"
            required
          />

          <input
            name="phone"
            value={form.phone}
            className="input bg-gray-100"
            readOnly
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            {initialData ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
