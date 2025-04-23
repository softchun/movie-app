import { useEffect, useMemo, useState } from "react";
import { CartItem } from "../types";
import PaymentPopup from "./PaymentPopup";

type Props = {
  items: CartItem[];
  clearCart: () => void;
  increaseQuantity: (movieId: number) => void;
  decreaseQuantity: (movieId: number) => void;
  removeItem: (movieId: number) => void;
};

const Cart: React.FC<Props> = ({
  items,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
}) => {
  const [showCart, setShowCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(60);
  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showPopup, countdown]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subTotal = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
    return total;
  }, [items]);

  const discount = useMemo(() => {
    if (totalItems > 5) return subTotal * 0.2;
    if (totalItems > 3) return subTotal * 0.1;
    return 0;
  }, [totalItems, subTotal]);

  const handlePurchase = () => {
    setShowPopup(true);
    setCountdown(60);
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full bg-[#FBF5E5] flex justify-center items-center text-xl cursor-pointer relative"
        onClick={() => setShowCart(!showCart)}
      >
        🛒
        {items.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A35C7A] flex justify-center items-center text-[11px] text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </div>
        )}
      </div>
      {showCart && (
        <div className="absolute top-11 right-0 w-md max-w-[calc(100vw-32px)] h-fit bg-white p-6 rounded-lg shadow-lg">
          <div className="text-xl font-bold mb-2 flex items-center justify-between gap-4">
            Cart
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold rounded-xl text-[#A35C7A] py-1 px-2 bg-[#FBF5E5] hover:opacity-90"
              >
                Clear Cart
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-2"
              >
                <div className="font-medium leading-5">{item.title}</div>
                <div className="flex gap-2">
                  <div className="font-light flex items-center justify-center gap-1 w-[65px]">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                      className="text-[#A35C7A] text-sm w-5 h-5 flex items-center justify-center rounded-full bg-[#FBF5E5]"
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.quantity >= 99}
                      className="text-[#A35C7A] text-sm w-5 h-5 flex items-center justify-center p-1 rounded-full bg-[#FBF5E5]"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-nowrap text-[#A35C7A] flex flex-nowrap items-center justify-end gap-2 w-[85px]">
                    {((item.price ?? 0) * item.quantity).toLocaleString()} ฿
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#A35C7A] text-sm w-5 h-5 flex items-center justify-center p-1 rounded-full bg-[#FBF5E5]"
                    >
                      ✖
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-base text-gray-500 text-center my-6">
              No item
            </div>
          )}
          {items.length > 0 && (
            <>
              <div className="text-sm text-gray-500 flex justify-between mt-2">
                Subtotal ({totalItems.toLocaleString()}):{" "}
                <div>{subTotal.toLocaleString()} ฿</div>
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                Discount: <div>{discount.toLocaleString()} ฿</div>
              </div>
              <div className="text-xs text-gray-500">
                (Buy more than 3 items, get 10% off, buy more than 5 items, get
                20% off.)
              </div>
            </>
          )}
          <div className="flex justify-between items-center mt-3">
            <div className="text-xl font-bold">
              Total: {(subTotal - discount).toLocaleString()} ฿
            </div>
            <button
              onClick={handlePurchase}
              disabled={items.length === 0}
              className="text-base font-bold rounded-xl text-white py-1 px-2 bg-[#A35C7A] hover:opacity-90 disabled:bg-gray-300 disabled:hover:opacity-100"
            >
              Purchase
            </button>
          </div>
        </div>
      )}
      {showPopup && (
        <PaymentPopup
          totalPrice={subTotal - discount}
          countdown={countdown}
          handleClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Cart;
