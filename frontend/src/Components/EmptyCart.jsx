import React from 'react'
import emptyCart from '../assets/svg/illustration-empty-cart.svg';

function EmptyCart() {
  return (
    <div className="right w-full max-w-[420px] min-h-[330px] bg-white rounded-[15px] p-[22.5px] mx-5">
        <div className="your-cart w-4/5 h-[45px] flex items-start">
            <span className="your-cart-word text-brand-red text-[27px] font-bold font-redhat">
                Your Cart 0
            </span>
        </div>
   
        <div className="added-cart-box w-full h-[300px] flex flex-col justify-center items-center">
            <img className="empty-cart w-[165px]" src={emptyCart} alt=""/>
            <p className="items-will-appear-here font-redhat text-[16px] sm:text-[18px] font-bold text-[#9B3A3A] text-center px-4">
              Your added items will appear here
            </p>
        </div>
    </div>
  )
}

export default EmptyCart;
