import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      await API.put("/admin/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password changed successfully. Please login again.");
      setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={show.old ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, old: !show.old })}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {show.old ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={show.new ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, new: !show.new })}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {show.new ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShow({ ...show, confirm: !show.confirm })}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {show.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
