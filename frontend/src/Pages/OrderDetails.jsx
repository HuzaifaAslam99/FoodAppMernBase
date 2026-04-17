import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from "../CartContext";


function OrderDetails() {
  const { URL } = useCart();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return; 
    
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${URL}/api/customerOrders/single`, {
          params: { orderId }
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="p-20 text-center font-bold">Loading Order...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDF2F0] pt-22.5 pb-10 font-redhat px-6 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-[#FFF5F3]">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#D64545] font-bold mb-6 hover:gap-3 cursor-pointer transition-all"
        >
          ← Back to History
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">Order Summary</h1>
            <p className="text-gray-400 font-bold text-xs mt-1">Order ID: {order.orderId}</p>
          </div>
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-black text-xs uppercase self-start">
            Delivered
          </span>
        </div>

        {/* Product Items List */}
        <div className="space-y-4 sm:space-y-6 mb-8">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-[#FFF5F3] rounded-2xl">
              <img 
                src={item.productId?.img || "https://via.placeholder.com/100"} 
                alt={item.productId?.name} 
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-white shadow-sm shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-black">{item.productId?.name || "Delicious Food"}</h3>
                <p className="text-gray-500 font-bold text-sm sm:text-base">Quantity: {item.quantity}</p>
                <p className="text-[#D64545] font-black">${item.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Details */}
        <div className="border-t-2 border-dashed border-[#FFF5F3] pt-6 space-y-4">
          
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-400 font-bold text-sm sm:text-base">Ordered On</span>
            <span className="font-bold text-black text-sm sm:text-base text-right">{new Date(order.OrderTime).toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-xl sm:text-2xl">
            <span className="font-black text-black">Total Amount</span>
            <span className="font-black text-[#D64545]">${order.totalPrice.toFixed(2)}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
