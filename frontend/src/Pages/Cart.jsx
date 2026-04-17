// import {useState} from "react";

import CheckCart from "../Components/CheckCart"
import OrderDone from "../Components/OrderDone"
import { useCart } from '../CartContext';

// import { CartProvider } from "../CartContext";


function Cart() {

  const {setAlert, showPassAlert, showMessage} = useCart();

  // console.log("Set Alert Cart: ", showPassAlert);

  return (

      <div className="w-full relative min-h-screen bg-background flex items-start justify-center pt-22.5 pb-12.5">


        <div
            className={`w-80 h-20 bg-brand-red z-50 text-white fixed flex justify-center items-center left-1/2 -translate-x-1/2 rounded-[8px]
              transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]
              ${ showPassAlert ? 'top-5 translate-y-0' : 'top-0 -translate-y-full'}`}
          >
            <h1 onClick={()=>{setAlert(false)}} 
            className="absolute top-2 right-3 cursor-pointer text-sm font-bold opacity-70 hover:opacity-100">
              X
            </h1>
            <p>{showMessage}</p>
        </div>

      <CheckCart/>
      <OrderDone/>

      </div>

  )
}

export default Cart;
