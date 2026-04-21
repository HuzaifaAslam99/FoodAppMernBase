import { useState } from 'react';
import arrowDown from "../assets/svg/arrow-down.svg"
import { useCart } from '../CartContext';
import axios from 'axios';


function CenteredDropdown() {
  const {isSort, selected, setFoodArray, setSelected, selectedCategory, minPrice, maxPrice, URL} = useCart()
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Newest", "Low to High", "High to Low"];

    const fetchProducts = async (sort) => {
    try {
      if (minPrice > maxPrice) {
        console.log("Invalid price range");
        return; 
      }
      const response = await axios.get(`${URL}/api/products?category=${selectedCategory}&min=${minPrice}&max=${maxPrice}&sortBy=${sort}`)
      setFoodArray(response.data);
      
      } catch (error) {
        console.error("Error fetching food products:", error);
      }
    };

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 relative flex items-center pl-3 justify-start hover:border-brand-red border border-gray-300 rounded-md bg-white text-[12px] cursor-pointer"
      >
        {selected}
        <img src={arrowDown} className="size-4 absolute right-2" alt="" />
      </div>

      {isOpen && (
        <ul className="absolute top-9 w-full border border-gray-300 rounded-md bg-white z-20 overflow-hidden shadow-sm">
          {options.map((option) => (
            <li 
              key={option}
              onClick={() => { setSelected(option); setIsOpen(false); 
                // isSort(option, filteredFood)
                fetchProducts(option)
              }}
              className="h-8 pl-3 flex items-center justify-start text-[12px] hover:bg-brand-red hover:text-white cursor-pointer"
            >
              Price: {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CenteredDropdown