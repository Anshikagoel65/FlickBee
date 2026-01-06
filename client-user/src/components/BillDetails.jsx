import { ReceiptText, Truck, Package } from "lucide-react";

const BillDetails = ({
  itemsTotal,
  deliveryCharge,
  isFreeDelivery,
  handlingCharge,
  grandTotal,
}) => {
  const DELIVERY_CHARGE = 25;
  const DELIVERY_THRESHOLD = 100;

  return (
    <div className="bg-white rounded-xl p-4 mt-4">
      <h3 className="font-semibold mb-3">Bill details</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ReceiptText size={16} />
            <span>Items total</span>
          </div>
          <span>₹{itemsTotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck size={16} />
            <span>Delivery charge</span>
          </div>

          {isFreeDelivery ? (
            <span className="text-blue-600 font-medium">
              <span className="line-through text-gray-400 mr-1">
                ₹{DELIVERY_CHARGE}
              </span>
              FREE
            </span>
          ) : (
            <span>₹{deliveryCharge}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span>Handling charge</span>
          </div>
          <span>₹{handlingCharge}</span>
        </div>
      </div>

      <div className="flex justify-between font-semibold mt-4 border-t pt-3">
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
