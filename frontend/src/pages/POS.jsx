import { useState, useEffect } from "react";
import axios from "axios";

export default function POS() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/menu", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Menu Load Error:", err));
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, quantity: 1 }]);
  };

  // Place Order
  const placeOrder = async () => {
    if (!tableNumber) {
      alert("Enter table number");
      return;
    }

    const token = localStorage.getItem("token");

    const orderData = {
      tableNumber,
      items: cart.map((c) => ({
        menuItemId: c._id,
        name: c.name,
        quantity: c.quantity,
        price: c.price,
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order Created! KOT ID: " + res.data.kotId);
      setCart([]);
    } catch (err) {
      console.error("Order Error:", err.response?.data || err);
      alert("Order failed. Check console.");
    }
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      {/* MENU LIST */}
      <div className="col-span-8 bg-white p-4 shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Menu</h1>

        <div className="grid grid-cols-3 gap-4">
          {menu.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => addToCart(item)}
            >
              <h2 className="font-bold text-lg">{item.name}</h2>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="col-span-4 bg-white p-4 shadow rounded">
        <h1 className="text-xl font-bold mb-2">Cart</h1>

        <input
          type="number"
          placeholder="Table Number"
          className="border p-2 w-full mb-2"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <div className="space-y-2">
          {cart.map((c, index) => (
            <div key={index} className="border p-2 rounded flex justify-between">
              <span>{c.name}</span>
              <span>₹{c.price}</span>
            </div>
          ))}
        </div>

        <button
          onClick={placeOrder}
          className="mt-4 bg-green-600 text-white p-2 w-full rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
