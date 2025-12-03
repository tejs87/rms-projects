// src/pages/Billing.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function CartItem({ item, onQtyChange, onRemove }) {
  return (
    <div className="flex justify-between items-center border p-2 rounded">
      <div>
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-500">₹{item.price}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onQtyChange(item._id, Math.max(1, item.quantity - 1))} className="px-2">-</button>
        <div>{item.quantity}</div>
        <button onClick={() => onQtyChange(item._id, item.quantity + 1)} className="px-2">+</button>
        <button onClick={() => onRemove(item._id)} className="ml-3 text-red-600">Remove</button>
      </div>
    </div>
  );
}

export default function Billing() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const res = await api.get("/menu");
      // ensure array
      setMenu(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Menu Load Error:", err);
      alert("Menu load failed. Check console.");
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p._id === item._id);
      if (found) {
        return prev.map((p) => p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((p) => (p._id === id ? { ...p, quantity: qty } : p)));
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const discAmount = (subtotal * Number(discount || 0)) / 100;
  const taxable = subtotal - discAmount;
  const tax = (taxable * Number(taxPercent || 0)) / 100;
  const grandTotal = taxable + tax;

  const placeOrder = async () => {
    if (!tableNumber) {
      if (!confirm("Table number empty. Proceed as take-away?")) return;
    }
    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        tableNumber,
        items: cart.map((c) => ({
          menuItemId: c._id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
        })),
        discount: Number(discount || 0),
        taxPercent: Number(taxPercent || 0),
        totals: {
          subtotal,
          discount: discAmount,
          tax,
          grandTotal,
        },
      };

      const res = await api.post("/orders/create", payload);
      const orderId = res.data.orderId || res.data._id || null;
      const kotId = res.data.kotId || null;

      alert("Order created. OrderId: " + orderId + (kotId ? " KOT: " + kotId : ""));
      setCart([]);
      setTableNumber("");
      // optionally open payment modal or auto-pay
    } catch (err) {
      console.error("Place order error:", err.response?.data || err);
      alert("Order failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const payOrder = async (orderId, method = "cash") => {
    try {
      await api.put(`/orders/pay/${orderId}`, { paymentMethod: method });
      alert("Payment marked successful");
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert("Payment failed");
    }
  };

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      <div className="col-span-8 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <div className="grid grid-cols-3 gap-3">
          {menu.map((m) => (
            <div key={m._id} onClick={() => addToCart(m)} className="border p-3 rounded cursor-pointer hover:bg-gray-50">
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600">₹{m.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Cart</h2>
        <input value={tableNumber} onChange={(e)=>setTableNumber(e.target.value)} placeholder="Table number (optional)" className="w-full border p-2 mb-2" />
        <div className="space-y-2 max-h-64 overflow-auto">
          {cart.map((c) => <CartItem key={c._id} item={c} onQtyChange={updateQty} onRemove={removeItem} />)}
        </div>

        <div className="mt-3 space-y-2">
          <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div>
            Discount %: <input type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} className="w-20 inline border p-1 ml-2" />
          </div>
          <div>
            Tax %: <input type="number" value={taxPercent} onChange={(e)=>setTaxPercent(e.target.value)} className="w-20 inline border p-1 ml-2" />
          </div>
          <div>Tax: ₹{tax.toFixed(2)}</div>
          <div className="font-bold">Total: ₹{grandTotal.toFixed(2)}</div>
        </div>

        <button disabled={loading} onClick={placeOrder} className="mt-4 w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>
    </div>
  );
}
