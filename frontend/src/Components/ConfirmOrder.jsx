import React from "react";
import { useState } from "react";
import confirmOrder from "../assets/svg/icon-order-confirmed.svg";
import removeItem from "../assets/svg/icon-remove-item.svg";
import { useCart } from "../CartContext";


 function ConfirmOrder() {

  const { cartItems, setCartItems, totalPrice, setConfirmOrder, _id } = useCart();
  // const [showPassAlert, setAlert] = useState(false)
  // const [alertMessage, setMessage] = useState("")

  return (
    /* Backdrop */
 
    <div className="relative">
     

      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
        {/* Modal box */}
        <div
          className="confirm-order-box font-redhat flex flex-col gap-6
          w-full max-w-[350px] h-auto bg-white rounded-[15px] p-5"
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <img className="w-7 h-7" src={confirmOrder} alt="Confirmed" />
              <img className="w-5 h-5 cursor-pointer" src={removeItem} alt="close" onClick={()=>setConfirmOrder(false)}/>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-[24px] font-bold text-black leading-tight">
                Order Confirmed
              </h1>
              <p className="enjoy text-[10px] font-bold text-[#b28d82]">
                We hope you enjoy your food
              </p>
            </div>
          </div>

          <div className="your-confirm-orders w-full max-h-[55vh] overflow-y-auto bg-[#fff5f3] rounded-[10px] py-4 px-6 flex flex-col gap-4">
            {cartItems.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b-2 border-[#e9e3e3] pb-4"
                >
                  <div className="flex w-full items-center gap-3">
                    <img
                      src={product.img}
                      alt=""
                      className="w-10 h-10 rounded-md shrink-0"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold text-[16px] text-black truncate">
                        {product.name}
                      </span>
                      <div className="flex justify-between">
                        <div className="flex gap-4">
                          <span className="text-[#db4242] font-bold text-[13px]">
                            {product.quantity}x
                          </span>
                          <span className="text-[#929090] text-[13px] font-bold">
                            @${product.price}
                          </span>
                        </div>
                        <span className="font-bold text-black text-[13px]">
                          ${product.price * product.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center">
              <span className="text-[12px] text-[#929090] font-bold">
                Order Total
              </span>
              <span className="text-[18px] font-bold text-black">
                ${totalPrice}
              </span>
            </div>
          </div>

          <button
            className="start-new-order w-full h-[40px] flex justify-center items-center bg-[#db4242] font-bold text-[12px] rounded-[30px] text-white hover:bg-[#b83232] cursor-pointer"
            onClick={()=>{setConfirmOrder(false), setCartItems([])}}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>

  );
}

export default ConfirmOrder;
