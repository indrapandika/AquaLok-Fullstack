/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Membaca keranjang dari localStorage saat pertama kali dibuka
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("aqualok_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Menyimpan keranjang setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("aqualok_cart", JSON.stringify(cart));
  }, [cart]);

  // Menambahkan produk ke keranjang
  const addToCart = (product, quantity = 1) => {
    if (quantity <= 0 || quantity > product.stock) {
      return false;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        const newQty = existingItem.qty + quantity;

        if (newQty > product.stock) {
          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: newQty }
            : item
        );
      }

      return [...prevCart, { ...product, qty: quantity }];
    });

    return true;
  };

  // Mengubah jumlah produk (+ / -)
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + amount;

          if (newQty < 1 || newQty > item.stock) {
            return item;
          }

          return { ...item, qty: newQty };
        }

        return item;
      })
    );
  };

  // Menghapus produk dari keranjang
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // Mengosongkan keranjang
  const clearCart = () => setCart([]);

  // Menghitung total barang
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  // Menghitung total harga
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
