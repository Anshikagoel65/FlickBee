import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  const items = Object.values(wishlist);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
