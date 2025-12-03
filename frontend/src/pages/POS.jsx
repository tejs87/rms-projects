// src/pages/POS.jsx
import { useState, useEffect } from "react";
import api from "../api/axios"; // central axios instance (see note below)
import { useNavigate } from "react-router-dom";

export default function POS() {
  const [menu, setMenu] = useState([]); // default array safe for .map
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoadingMenu(true);
    api.get("/menu")
      .then((res) => {
        // backend may return array or { menu: [...] }
        const data = Array.isArray(res.data) ? res.data : (res.data?.menu || []);
        if (mounted) setMenu(data);
      })
      .catch((err) => {
        console.error("Menu Load Error:", err.response?.data || err.message);
        if (err.response?.data?.message) alert("Menu load failed: " + err.response.data.message);
      })
      .finally(() => mounted && setLoadingMenu(false));
    return () => { mounted = false; };
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const idA = item._id || item.id;
      const idx = prev.findIndex(p => (p._id || p.id) === idA);
      if (idx !== -1) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: (clone[idx].quantity || 1) + 1 };
        return clone;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const changeQuantity = (index, delta) => {
    setCart(prev => {
      const clone = [...prev];
      clone[index] = { ...clone[index], quantity: Math.max(1, (clone[index].quantity || 1) + delta) };
      return clone;
    });
  };

  const removeFromCart = (index) => setCart(prev => prev.filter((_, i) => i !== index));

  const subtotal = cart.reduce((s, c) => s + (Number(c.price || 0) * Number(c.quantity || 1)), 0);

  const placeOrder = async () => {
    if (!tableNumber) { alert("Enter table number"); return; }
    if (cart.length === 0) { alert("Cart is empty"); return; }

    setPlacingOrder(true);
    const orderData = {
      tableNumber,
      items: cart.map(c => ({
        menuItemId: c._id || c.id,
        name: c.name,
        quantity: c.quantity,
        price: c.price
      }))
    };

    try {
      // use central api -> it will attach Authorization header from interceptor
      const res = await api.post("/orders/create", orderData);

      // Expect backend to respond with: { message, orderId, kotId }
      const kotId = res.data?.kotId;
      const orderId = res.data?.orderId || res.data?._id || null;

      alert("Order created" + (kotId ? (" — KOT: " + kotId) : ""));

      // clear cart & table input
      setCart([]);
      setTableNumber("");

      // navigate to billing for immediate payment (if orderId available)
      if (orderId) {
        navigate(`/billing?orderId=${orderId}`);
      } else {
        // fallback: open billing list
        navigate("/billing");
      }
    } catch (err) {
      console.error("Order Error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Order failed. See console.";
      alert(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      {/* MENU */}
      <div className="col-span-8 bg-white p-4 shadow rounded min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Menu</h1>

        {loadingMenu ? (
          <div>Loading menu...</div>
        ) : menu.length === 0 ? (
          <div>No menu items found.</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {menu.map(item => (
              <div
                key={item._id || item.id}
                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                onClick={() => addToCart(item)}
              >
                <h2 className="font-bold text-lg">{item.name}</h2>
                <p className="text-gray-600">₹{item.price}</p>
                {item.description && <p className="text-sm text-gray-500 mt-2">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
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

        <div className="space-y-2 max-h-[50vh] overflow-auto">
          {cart.length === 0 && <div className="text-gray-500">Cart is empty</div>}
          {cart.map((c, index) => (
            <div key={index} className="border p-2 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">₹{c.price} × {c.quantity}</div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-2 border rounded" onClick={() => changeQuantity(index, -1)}>-</button>
                <div className="w-6 text-center">{c.quantity}</div>
                <button className="px-2 border rounded" onClick={() => changeQuantity(index, +1)}>+</button>
                <button className="ml-2 text-red-600" onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-medium">
            <div>Subtotal</div>
            <div>₹{subtotal.toFixed(2)}</div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className={`mt-4 p-2 w-full rounded text-white ${placingOrder ? "bg-gray-400" : "bg-green-600"}`}
          >
            {placingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
