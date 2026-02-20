import { ReceiptText, Truck, Package } from "lucide-react";

const BillDetails = ({
  itemsTotal,
  mrpTotal,
  totalSavings,
  deliveryCharge,
  isFreeDelivery,
  handlingCharge,
  grandTotal,
}) => {
  const DELIVERY_THRESHOLD = 100;

  return (
    <div className="bg-white rounded-2xl p-5 mt-4">
      <h3 className="font-semibold text-lg mb-4">Bill details</h3>

      <div className="space-y-3 text-sm">
        {/* SUB TOTAL */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <ReceiptText size={18} />
            <span className="font-medium text-gray-700">Sub total</span>

            {totalSavings > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                Saved ₹{totalSavings}
              </span>
            )}
          </div>

          <div className="text-right">
            {mrpTotal > itemsTotal && (
              <span className="line-through text-gray-700 mr-1">
                ₹{mrpTotal}
              </span>
            )}
            <span className="font-semibold text-gray-900">₹{itemsTotal}</span>
          </div>
        </div>

        {/* DELIVERY */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Truck size={18} />
            <span className="text-gray-700">Delivery charge</span>
          </div>

          {isFreeDelivery ? (
            <span className="text-blue-600 font-semibold">FREE</span>
          ) : (
            <span className="font-medium">₹{deliveryCharge}</span>
          )}
        </div>

        {/* HANDLING */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Package size={18} />
            <span className="text-gray-700">Handling charge</span>
          </div>

          <span className="font-medium">₹{handlingCharge}</span>
        </div>
      </div>

      {/* GRAND TOTAL */}
      <div className="flex justify-between font-bold text-lg mt-5 border-t pt-4">
        <span>Grand total</span>
        <span>₹{grandTotal}</span>
      </div>
      {!isFreeDelivery && itemsTotal > 0 && (
        <p className="text-xs text-gray-500">
          Add items worth{" "}
          <span className="font-medium">
            ₹{DELIVERY_THRESHOLD - itemsTotal}
          </span>{" "}
          more to get <span className="text-green-600">FREE</span> delivery
        </p>
      )}
    </div>
  );
};

export default BillDetails;
