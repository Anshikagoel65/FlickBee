"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

const HeroBanners = () => {
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <section className="mb-12 mt-8">
      <div
        className="
          max-w-[1000px]
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >
        {banners.length === 0
          ? [1, 2, 3].map((item) => (
              <div key={item} className="h-48 rounded-xl bg-gray-200"></div>
            ))
          : banners
              .slice(0, 3)
              .map((banner) => (
                <img
                  key={banner._id}
                  src={`${API_BASE}/uploads/${banner.image}`}
                  alt="Hero Banner"
                  className="h-48 w-full rounded-xl object-cover"
                />
              ))}
      </div>
    </section>
  );
};

export default HeroBanners;
