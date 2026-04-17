import React from 'react';
import {useState, useEffect} from "react"
import {Package, ChevronRight, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { useCart } from "../CartContext";
import axios from 'axios';

import { Link} from "react-router-dom"; 

function OrderHistory (){

  const { _id, URL } = useCart();

  const [orders, setOrder] = useState([])

useEffect(() => {

    if (!_id) return; 

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${URL}/api/customerOrders`, {
          params: { _id: _id }
        });
        // console.log("Username fetched:", response.data);

        setOrder(response.data)

      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
  
    fetchOrders();
  }, [_id]); 

  var totalPrice = 0;
  orders.forEach((order)=>[
    totalPrice += order.totalPrice
  ])

  return (

    // <div className="min-h-screen bg-[#FDF2F0] font-redhat flex items-start justify-center pt-20 p-4 sm:p-6">

      <div className="min-h-screen bg-background font-redhat flex items-start justify-center pt-20 pb-10 p-6">
      <div className="max-w-5xl w-full flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-5xl font-black text-[#D64545] tracking-tight">Order History</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em]">Manage your past cravings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Side: Order List */}
          <div className="flex-1 space-y-4">

            {orders.length > 0 ? (

          


            orders.map((order, index) => (
              <Link key={index} to={`/order/${order.orderId}`} className="group bg-white rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-0 items-center justify-between border-2 border-transparent hover:border-[#D64545] transition-all cursor-pointer shadow-sm hover:shadow-xl">
                
                <div className="flex flex-row items-center gap-3 sm:gap-6 min-w-0 ">

                  <div className="bg-[#FFF5F3] p-3 sm:p-4 rounded-2xl group-hover:bg-[#D64545] transition-colors shrink-0">
                    <Package className="text-[#D64545] group-hover:text-white" size={24} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-black text-black truncate">Order ID:<span className="ml-2">{order._id.slice(-5)}</span></h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-gray-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={14}/> {new Date(order.OrderTime).toLocaleDateString('en-GB')} </span>
                      <span>•</span>
                      <span>{order.items.reduce((total, item) => total + item.quantity, 0)} Items</span>
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-3 sm:gap-8 shrink-0">

                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-black text-black">${order.totalPrice.toFixed(2)}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                      Delivered
                    </span>
                  </div>

                  <ChevronRight className="text-gray-300 group-hover:text-[#D64545] transition-colors" />
                </div>

              </Link>
            ))

          ):(
           <div className="group bg-white rounded-3xl p-4 sm:m-4 flex flex-col
            gap-5 sm:gap-0 items-center justify-between border-2 border-transparent 
            transition-all shadow-sm font-redhat text-brand-red font-bold">
              No Past Orders
          </div>
          )}
          </div>

          {/* Right Side: Total Spent (Sticky on lg) */}
          <div className="w-full lg:w-80 space-y-6">

            <div className="bg-[#D64545] rounded-3xl p-6 text-white text-center">
              <p className="text-sm font-bold uppercase opacity-70 tracking-tighter">Total Spent</p>
              <h4 className="text-4xl font-black mt-1">${totalPrice}</h4>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
