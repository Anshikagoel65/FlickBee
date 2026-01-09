const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Hero Banners", "Categories", "Sections", "Products"].map((item) => (
          <div
            key={item}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">Manage</p>
            <p className="text-lg font-semibold mt-1">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
