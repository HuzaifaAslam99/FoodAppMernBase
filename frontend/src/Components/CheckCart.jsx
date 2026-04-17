import React from 'react'
import EmptyCart from "../Components/EmptyCart"
import CartItems from "../Components/CartItems"
import {useCart} from "../CartContext";


function CheckCart() {
  const {displayCart} = useCart();

  return (
    <>

        {displayCart?
        <CartItems/>:
        <EmptyCart/>
        }  

    </>
  )
}

export default CheckCart
