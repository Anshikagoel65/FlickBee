import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []); // ✅ important

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-6">Registered Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Orders</th>
              <th className="p-3 border">Total Spent</th>
              <th className="p-3 border">Joined On</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-3 border">{user.phone}</td>
                <td className="p-3 border">{user.totalOrders || 0}</td>
                <td className="p-3 border">₹ {user.totalSpent || 0}</td>
                <td className="p-3 border">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
