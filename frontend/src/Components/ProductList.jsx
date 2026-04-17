import { useEffect, useState } from 'react';
import axios from 'axios';

import addToCartIcon from '../assets/svg/icon-add-to-cart.svg';
import increementImg from "../assets/svg/icon-increment-quantity.svg";
import decreementImg from "../assets/svg/icon-decrement-quantity.svg";

import { useCart } from '../CartContext';

function ProductList() {

    const { cartItems, addToCart, updateQuantity, setFoodArray, setCategoryFood,
         selectedCategory, setFilteredFood, filteredFood } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setFoodArray(response.data.sort((a, b) => b._id.localeCompare(a._id)));
                setFilteredFood(response.data);
                setCategoryFood(response.data);
            } catch (error) {
                console.error("Error fetching food products:", error);
            }
        };
        fetchProducts();
    }, []);

  return (
    <div className='left w-full max-w-[1180px] h-auto'>

        <div className="desert w-full h-12.5 flex items-start p-[10px]">
            <span className='desert-word text-[20px] sm:text-[24px] font-redhat font-bold'>{selectedCategory}</span>
        </div>

        <div className="food-products-box w-full h-auto grid relative grid-cols-2 gap-y-5 gap-x-4 justify-items-center sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFood.map((product, index) => {
            const cartProduct = cartItems.find((item) => item._id === product._id);
            const isInCart = !!cartProduct;

            return (
              <div key={index} className="food-product w-full h-auto flex flex-col justify-between min-w-0">
                <img className="food-image w-full rounded-[10px] aspect-square object-cover" src={product.img} alt={product.name}
                  style={{ border: isInCart ? "4px solid rgb(218, 77, 77)" : "" }} />

                <div className="add-to-cart-number relative w-[70%] max-w-[140px] h-[40px] -mt-[20px] mx-auto rounded-full">
                  {!isInCart ? (
                   <div className="add-to-cart group font-redhat font-bold w-full h-full flex justify-center items-center gap-[5px] bg-white rounded-full text-[12px] cursor-pointer border border-gray-300 hover:bg-brand-red hover:border-brand-red transition-all"
                      onClick={() => addToCart(product)}>
                      <img className="img-add-to-cart w-[20px] group-hover:invert group-hover:brightness-0" src={addToCartIcon}
                        alt="Add to cart"/>
                      <span className="add-to-cart-word text-[12px] group-hover:text-white">
                        Add to Cart
                      </span>
                 </div>

                ) : (

               <div className="cart-number-items bg-brand-red font-redhat font-bold w-full h-full flex justify-between items-center px-4 rounded-full text-white">
                  <img className="decrement-increement w-[15px] h-[15px] rounded-full border-2 border-[#ece7e7] flex items-center justify-center cursor-pointer"
                    onClick={() => updateQuantity(product._id, -1)} src={decreementImg} alt="Decrease"/>
                    <span className="number-items">{cartProduct.quantity}</span>
                    <img className="decrement-increement w-[15px] h-[15px] rounded-full border-2 border-[#ece7e7] flex items-center justify-center cursor-pointer"
                      onClick={() => updateQuantity(product._id, 1)}
                      src={increementImg}
                      alt="Increase"/>
              </div>
            )}
        </div>

        <div className="food-info w-full h-auto flex flex-col gap-[3px] font-redhat font-bold leading-none mt-2">
          <span className="general-name text-[12px] text-[#929090]">
            {product.base}
          </span>
          <span className="specific-name text-[14px] sm:text-[16px] text-gray-900">
            {product.name}
          </span>
          <span className="price text-[14px] sm:text-[16px] text-brand-red">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    );
  })}
</div>
    </div>
  );
}

export default ProductList;
