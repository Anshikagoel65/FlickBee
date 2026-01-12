const mongoose = require("mongoose");
require("dotenv").config();

const Address = require("./models/Address");

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const addresses = await Address.find();
  console.log(`Found ${addresses.length} addresses`);

  for (let addr of addresses) {
    // REQUIRED fields (with fallback)
    addr.houseNo = addr.house || "NA";
    addr.street1 = addr.area || "NA";
    addr.street2 = addr.floor || "";

    // Enum fix
    addr.type = addr.type?.toLowerCase() || "home";

    // Other required fields
    addr.city = addr.city || "Unknown";
    addr.state = addr.state || "Unknown";
    addr.postalCode = addr.postalCode || "000000";

    // Geo (temporary)
    addr.latitude = addr.latitude ?? 0;
    addr.longitude = addr.longitude ?? 0;

    addr.isDefault = addr.isDefault ?? false;

    // Remove old fields
    addr.house = undefined;
    addr.area = undefined;
    addr.floor = undefined;

    await addr.save();
  }

  console.log("🎉 Address migration completed successfully");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed", err);
  process.exit(1);
});
