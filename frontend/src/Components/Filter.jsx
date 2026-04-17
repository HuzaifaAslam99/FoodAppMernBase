import {useEffect, useState} from 'react'
import { useCart } from '../CartContext';
import arrowDown from "../assets/svg/arrow-down.svg";


function Filter() {
  const { checkCategory, filterPrice, selectedCategory, setSelectedCategory} = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Price"); // Keeps track of Price vs Category
 // Tracks the specific food type
  // const [checkCategory, setCheckCategory] = useState(null)
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filterTypes = ["Price", "Category"];
  const categoryOptions = ["All","Desserts", "Fries", "Pasta", "Salad", "Drinks"];

  // const Category = (type)=> {
  //   setCategory(type)
  // }

  return (
    <div className="flex flex-col gap-3 relative w-full">
      {/* Main Dropdown Toggle */}
      <div className="relative w-full">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-8 relative flex items-center pl-3 border border-gray-300 rounded-md bg-white text-[12px] cursor-pointer hover:border-brand-red transition-colors"
        >
          {/* Display the active filter type, or the specific category if one is chosen */}
          <span className="capitalize">
            {activeFilter === "Category" && selectedCategory ? selectedCategory : activeFilter}
          </span>
          
          <img 
            src={arrowDown} 
            className={`size-4 absolute right-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            alt="arrow" 
          />
        </div>

        {/* Filter Type Selection Menu */}
        {isOpen && (
          <ul className="absolute top-9 w-full border border-gray-300 rounded-md bg-white z-20 overflow-hidden shadow-sm">
            {filterTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setActiveFilter(type);
                  setIsOpen(false);
                  if (type === "Category") {
                    setMinPrice("");
                    setMaxPrice("");
                  }
                }}
                className={`h-8 pl-3 flex items-center text-[12px] cursor-pointer hover:bg-brand-red hover:text-white transition-colors ${activeFilter === type ? 'bg-gray-50' : ''}`}
              >
                {type}
              </li>
            ))}
          </ul>
        )}
      </div>
      

      {/* Logic for Price Inputs */}
      {activeFilter === "Price" && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[11px] text-gray-500 italic">
              Range: <span className="font-medium">${minPrice || ""} — ${maxPrice || ""}</span>
            </p> 
            <button className="bg-gray-100 cursor-pointer hover:bg-brand-red hover:text-white px-2 
            py-0.5 text-[10px] rounded transition-colors" onClick={() => filterPrice(minPrice, maxPrice)}>
              Apply
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-7 pl-2 text-[11px] border-b border-gray-300 focus:border-brand-red outline-none bg-transparent"
            />
            <span className="text-gray-400 text-[10px]">TO</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-7 pl-2 text-[11px] border-b border-gray-300 focus:border-brand-red outline-none bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Logic for Category Selection */}
      {activeFilter === "Category" && (
        <div className="grid  grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                checkCategory(cat)
              }}
              className={`text-[11px] text-center py-1 rounded-full border transition-all ${
                selectedCategory === cat 
                ? "bg-brand-red border-brand-red text-white" 
                : "border-gray-300 text-gray-600 hover:border-brand-red cursor-pointer"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Filter;