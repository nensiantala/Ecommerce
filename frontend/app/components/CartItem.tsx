"use client";

interface CartItemType {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  };
  onUpdate?: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemType) {
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem();
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemIndex = cart.findIndex((i: any) => i.productId === item.productId);
    
    if (itemIndex >= 0) {
      cart[itemIndex].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      if (onUpdate) onUpdate();
    }
  };

  const removeItem = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = cart.filter((i: any) => i.productId !== item.productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    if (onUpdate) onUpdate();
  };

  return (
    <div className="bg-white p-6 rounded-sm shadow-luxury hover:shadow-luxury-lg transition-all duration-300 border border-luxury-light">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-luxury-dark mb-2">{item.name}</h3>
          <div className="flex items-center space-x-6 text-sm text-luxury-gray mb-4">
            <span>Price: <span className="font-semibold text-luxury-dark">₹{item.price.toLocaleString()}</span></span>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-luxury-gray">Quantity:</span>
            <div className="flex items-center border border-luxury-light rounded-lg">
              <button
                onClick={() => updateQuantity(item.quantity - 1)}
                className="px-3 py-1 hover:bg-luxury-light transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1 font-semibold text-luxury-dark min-w-[3rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.quantity + 1)}
                className="px-3 py-1 hover:bg-luxury-light transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={removeItem}
              className="text-red-500 hover:text-red-700 text-sm ml-4"
            >
              Remove
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-bold text-luxury-dark">₹{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
