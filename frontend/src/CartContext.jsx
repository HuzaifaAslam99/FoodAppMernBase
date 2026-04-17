import React, { createContext, useEffect, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [foodArray, setFoodArray] = useState([]);
  const [filteredFood, setFilteredFood] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryFood, setCategoryFood] = useState([])

  const [cartItems, setCartItems] = useState([]);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [showPassAlert, setAlert] = useState(false);
  const [showMessage, setMessage] = useState(false);

  const [selected, setSelected] = useState("Newest");

  // const [email, setEmail] = useState("")
  const [_id, setID] = useState(() => {
    return localStorage.getItem("id") || ""; 
  });

// 2. Update localStorage whenever the email state changes
  // useEffect(() => {
  //   localStorage.setItem("id", _id);
  // }, [_id]);


  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) return prev; 
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (_id, delta) => {
    setCartItems((prev) =>
      prev.map(item =>
        item._id === _id 
          ? { ...item, quantity: Math.max(0, item.quantity + delta) } 
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (_id) =>{
    setCartItems(cartItems.filter(item => item._id !== _id));
  }

  const checkCategory = (category) => {

    let result;
      if (category === "All") {
        result = foodArray;
      } else {
        result = foodArray.filter(item => item.category === category);
      }
      setFilteredFood(result);
      setCategoryFood(result)
      // setFilteredPrice(result)
      isSort(selected, result);
      // console.log(filteredFood);
  };

  
    const filterPrice = (min, max) => {
      const food = [...categoryFood]

      const minNum = Number(min);
      const maxNum = Number(max);
      
      if (min === "" || max === "" || minNum > maxNum) {
        return
      }
      const result = food.filter(item => {
        return item.price >= minNum && item.price <= Number(maxNum);
      });
      setFilteredFood(result)
      isSort(selected, result);
      console.log("Filtered Food: ", filteredFood);
    };


    const isSort = (option, foodList)=> {
      let result
      if (option=="Low to High"){
        result = [...foodList].sort((a, b) => a.price - b.price);
      }
      else if (option === "High to Low") {
        result = [...foodList].sort((a, b) => b.price - a.price);
      }  
      else {
        result = [...foodList].sort((a, b) => b._id.localeCompare(a._id));
      }
      setFilteredFood(result);
  }
  
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const displayCart = cartItems.length > 0;


  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, updateQuantity, foodArray, setFoodArray,removeFromCart, 
      totalPrice, displayCart, totalCount, setConfirmOrder, confirmOrder, showPassAlert, setAlert, showMessage, setMessage,
      checkCategory, filterPrice,  selectedCategory, setCategoryFood, setSelectedCategory, setFilteredFood, filteredFood, selected, 
      setSelected, isSort, setID, _id}}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier usage
export const useCart = () => useContext(CartContext);