import { Outlet } from "react-router";

import Header from "~/components/Header";
import Footer from "~/components/Footer";

import { CartProvider } from "~/contexts/CartContext";

export default function Layout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
