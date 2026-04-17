import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "../Components/ProductList";
import Cart from "./Cart";
import Sidebar from "../Components/Sidebar";
import cartImg from "../assets/svg/shopping-cart.svg";
import apiClient from "../api/axiosConfig";
import { SlidersHorizontal } from "lucide-react";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await apiClient.get("/api/dashboard");
      } catch (err) {
        console.log("Token expired or invalid, interceptor is redirecting...");
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-row items-start justify-between px-4 sm:px-10 gap-4 pb-7.5 pt-17.5">

      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden fixed bottom-6 left-6 z-30 bg-brand-red text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 md:w-auto md:shadow-none md:bg-transparent md:block
        ${sidebarOpen ? "translate-x-0 z-40" : "-translate-x-full"}`}
      >
        {/* Close button (mobile only) */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-brand-red text-xl cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
        <Sidebar />
      </div>

      <ProductList />

    </div>
  );
}

export default Home;
