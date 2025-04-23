type Props = {
  totalPrice: number;
  countdown: number;
  handleClose: () => void;
};

const PaymentPopup: React.FC<Props> = ({
  totalPrice,
  countdown,
  handleClose,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <div
          className="absolute top-2 right-4 text-black cursor-pointer"
          onClick={handleClose}
        >
          ✖
        </div>
        <div className="text-xl font-bold mb-4">Payment</div>
        <div className="text-lg font-medium">Total price: {totalPrice.toLocaleString()} ฿</div>
        <div className="font-medium">Transfer money to: 123-xxx-xxxx (Bank ABC)</div>
        <div className="text-[#A35C7A] mt-2">
          {countdown > 0
            ? `Complete transaction within: ${countdown} seconds`
            : "Payment time has expired. Please try again."}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
