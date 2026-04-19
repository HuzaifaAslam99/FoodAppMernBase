import {useState} from "react";
import { Wallet, CircleDollarSign, Landmark, X } from "lucide-react";

import removeItem from "../assets/svg/icon-remove-item.svg";
import carbonNeutral from "../assets/svg/icon-carbon-neutral.svg";
import { ethers } from "ethers";
import axios from "axios";
import { useCart } from '../CartContext';

function CartItems() {

  const { URL, cartItems, removeFromCart, totalPrice, setConfirmOrder, totalCount, setCartItems, _id, setMessage, setAlert } = useCart();

  const [paymentType, setPaymentType] = useState("USDC"); // "ETH" or "USDC"
  const [isProcessing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(false)

  const CONTRACT_ADDRESS = "0x176Aa4DA0f2940B4779eCb85089aA6C0C4c885D9";
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

  const UNIFIED_ABI = [
  "function payForOrder(string _orderId, uint8 _method, uint256 _amount) public payable", 
  "function getContractBalance() public view returns (uint256)",
  "function orders(string) view returns (string orderId, uint256 amountPaid, address buyer, uint8 method, uint256 timestamp)"
];

// The standard ABI for interacting with the USDC Token (ERC-20)
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

 const fetchEthPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd; // This will return a number like 2338.68    
  } catch (error) {
    console.error("Price fetch failed", error);
    return 2340; // Fallback price just in case
  }
  };


  const handleConfirm = async () => {

    setProcessingMessage("Processing Transaction... ")
    setProcessing(true)

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Logic: "If you're on a phone but NOT in the MetaMask Browser, go to MetaMask"
  if (isMobile && !window.ethereum) {
    const yourSite = "food-app-mern-base-omega.vercel.app"; // Your React Vercel URL
    
    // Attempt the direct protocol first (Better for 2026)
    window.location.href = `metamask://dapp/${yourSite}`;
    
    // Fallback if the protocol fails to trigger
    setTimeout(() => {
        window.location.href = `https://metamask.app.link/dapp/${yourSite}`;
    }, 1000);
    
    return; // Exit handleConfirm so the rest of the code doesn't crash
  }


    if (!window.ethereum) {
      setMessage("Please install MetaMask!");
      setAlert(true);
      setProcessing(false);
      return;
    }


    const verify = await axios.get(`${URL}/api/userProfile`, { params: { _id } });
    console.log(verify.data.phonenumber);
      
    if (!verify.data.phonenumber || !verify.data.address || !verify.data.city) {
      setMessage("Please complete your User Profile");
      setAlert(true);
      setProcessing(false);
      return;
    }

    // setProcessing(true);


    try {
      // 1. Network Check (Base Sepolia)
      const targetChainId = "0x14a34"; 
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== targetChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UNIFIED_ABI, signer);

      // 3. Create Database Order
      const orderRes = await axios.post(`${URL}/api/orders`, {
        userId: _id,
        items: cartItems.map(item => ({ productId: item._id, price: item.price, quantity: item.quantity })),
        totalPrice: totalPrice,
        status: "pending",
      });
      const orderId = orderRes.data.orderId;

      let tx;

      if (paymentType === "USDC") {
        // --- USDC FLOW ---
        const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);

        const amountUsdcWei = ethers.parseUnits(totalPrice.toString(), 6);
        const balance = await usdcContract.balanceOf(signer.address);
        // If allowance is already high enough, it skips the above and goes straight to payment!

        if (balance < amountUsdcWei){
            setProcessing(false)
            setMessage("Low USDC balance")
            setAlert(true)
            return
        } 

        const currentAllowance = await usdcContract.allowance(signer.address, CONTRACT_ADDRESS);


        if (currentAllowance < amountUsdcWei) {
        // Only show this and trigger pop-up if allowance is too low
          setProcessingMessage("Approving USDC");
          // const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, amountUsdcWei);
          // You can use it directly in the function like this:
          const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, ethers.MaxUint256);
          await approveTx.wait(); 
          // setProcessingMessage("Approval Success! Finalizing Payment (2/2)...");
        } else {
        // If allowance is already enough, go straight to this message
          setProcessingMessage("Confirming USDC Payment...");
        }
        // throw new Error("Low USDC balance");


        // setProcessingMessage("Approving USDC...")
        // setProcessing(true)
        // setMessage("Approving USDC...");
        // setAlert(true)

        // const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, amountUsdcWei);
        // await approveTx.wait();
        // setProcessingMessage("Confirming USDC Payment...")

        tx = await contract.payForOrder(orderId, 1, amountUsdcWei);

      } else {
        // --- ETH FLOW ---
        const currentPrice = await fetchEthPrice();
        const ethValue = (totalPrice / currentPrice).toFixed(18);
        const amountEthWei = ethers.parseEther(ethValue);

        const balance = await browserProvider.getBalance(signer.address);
        // if (balance < amountEthWei) throw new Error("Low ETH balance");

        if (balance < amountEthWei){
            // setProcessing(false)
            setMessage("Low ETH balance")
            setAlert(true)
            return
        } 

        // setMessage("Confirming ETH Payment...");
        setProcessingMessage("Confirming ETH Payment...")

        tx = await contract.payForOrder(orderId, 0, 0, { value: amountEthWei });
      }

      await tx.wait();

      // 4. Final Database Update
      await axios.put(`${URL}/api/orders/${orderId}`, {
        status: "paid",
        transactionHash: tx.hash,
      });

      // setMessage("Payment Successful!");
      // setAlert(true);
      setConfirmOrder(true);
      // setCartItems([]);

    } catch (err) {
      console.error("Order process failed:", err);
      // setMessage(err.message || "Transaction failed or rejected");
      setMessage("Transaction Canceled");
      setAlert(true);
    } finally {
      setProcessing(false);
    }
  };
  



  return (

    <div className="relative">

    {paymentMethod && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="bg-white w-full max-w-[400px] rounded-[20px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="bg-[#fff5f3] p-4 rounded-full">
          <Wallet className="w-8 h-8 text-[#db4242]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Payment</h2>
        <p className="text-sm text-[#b28d82] font-medium">Select your preferred crypto method</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {/* USDC Option */}
        <button
          onClick={() => setPaymentType("USDC")}
          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
            paymentType === "USDC" 
            ? "border-[#db4242] bg-[#fff5f3]" 
            : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <CircleDollarSign className={`w-6 h-6 ${paymentType === "USDC" ? "text-[#db4242]" : "text-gray-400"}`} />
            <div className="text-left">
              <p className="font-bold text-gray-900">USDC Token</p>
              <p className="text-[11px] text-gray-500">Fast & Stable (Sepolia Base Network)</p>
            </div>
          </div>
          {paymentType === "USDC" && <div className="w-3 h-3 bg-[#db4242] rounded-full" />}
        </button>

        {/* ETH Option */}
        <button
          onClick={() => setPaymentType("ETH")}
          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
            paymentType === "ETH" 
            ? "border-[#db4242] bg-[#fff5f3]" 
            : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <Landmark className={`w-6 h-6 ${paymentType === "ETH" ? "text-[#db4242]" : "text-gray-400"}`} />
            <div className="text-left">
              <p className="font-bold text-gray-900">Native ETH</p>
              <p className="text-[11px] text-gray-500">Pay with Sepolia Base Ethereum</p>
            </div>
          </div>
          {paymentType === "ETH" && <div className="w-3 h-3 bg-[#db4242] rounded-full" />}
        </button>
      </div>

      {/* Total Display */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
        <span className="text-sm font-bold text-gray-500">Amount Due:</span>
        <span className="text-xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={()=>{ setPaymentMethod(false), handleConfirm()}}
          className="w-full h-12 bg-[#db4242] text-white font-bold rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          Done
         
        </button>
        
        <button 
          onClick={() => setPaymentMethod(false)}
          className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Cancel Transaction
        </button>
      </div>
    </div>
  </div>
)}


{isProcessing && (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4">
    <span className="relative top-[50px] flex items-center gap-2 text-brand-red  font-bold text-[30px]">
      <div className="w-8 h-8 border-3 border-brand-red/30 border-t-brand-red rounded-full animate-spin" />
        {/* Processing Transaction... */}
        {processingMessage}
    </span>
  </div>
)}

    

    
    <div className=" max-w-[1200px] min-h-[220px] bg-white rounded-[10px] p-[15px] mx-5">

        <div className="your-cart h-[30px] flex items-start justify-between">
            <span className="your-cart-word text-[#D94545] text-[18px] font-bold font-redhat">
                Your Cart ({totalCount})
            </span>
            <img src={removeItem} className="w-5 h-5 cursor-pointer" alt="" onClick={() => setCartItems([])}/>
        </div>

      <div className="your-shown-cart w-full h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        { cartItems.map((product, index)=>{
            return(

        <div key={index} className="ordered-item flex items-center gap-2 p-2 border rounded-md border-[#e9e3e3] font-redhat">

          <img src={product.img} alt="" className="size-25 rounded-md shrink-0" />

          <div className="flex flex-col justify-center h-10 w-full font-bold text-[18px] min-w-0">
            <span className="dish-name">{product?.name}</span>
            <div className="price-number-close flex justify-between items-center w-full">
            
              <div className="price-number flex justify-between items-center w-[115px] font-bold text-[12px]">
                <span className="number-times text-[#da4d4d]">{product?.quantity}x</span>
                <div className="price-number-price flex gap-[12px] min-w-[85px] ml-[10px]">
                  <span className="fixed-price text-[#929090]">@{product?.price.toFixed(2)}</span>
                  <span className="varying-price text-[#b28d82]">${(product?.price * product?.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
            <img className="close rounded-full border-2 border-[#CAAFA7] size-[14px] cursor-pointer shrink-0" onClick={() => removeFromCart(product._id)} src={removeItem} alt=""/>
        </div> 
        )
        })}

      </div>

      <div className="total-order-confirm flex flex-col items-center w-full mt-[15px] gap-[15px] font-redhat">

        <div className="order-total-amount w-full flex items-center justify-between">
          <div className="order-total text-[#847c7c] font-bold text-[16px]">
            Order Total
          </div>  
          <div className="order-price text-[16px] font-bold">${totalPrice.toFixed(2)}</div>
        </div>

        <div className="carbon-neutral w-full flex justify-center items-center gap-[6px] h-[30px] rounded-[5px] bg-[#fff5f3] text-[#b28d82] font-bold text-[11px]">
          <img className="carbon-neutral-svg" src={carbonNeutral} alt="" />
          <div>
            This is a{" "}
            <span className="carbon-neutral-single-word text-[#6c5349]">
              carbon-neutral
            </span>{" "}
            delivery
          </div>
        </div>

        <button className="confirm-order w-full h-10 rounded-[30px] bg-brand-red text-white font-bold text-[16px] cursor-pointer hover:bg-black transition-all"
        // onClick={()=>setConfirmOrder(true)}
        
        // onClick={()=>setProcessing(true)}>
        onClick={() => setPaymentMethod(true)}>

          Confirm Order
        </button>

      </div>
   </div>
   </div>
  );
}

export default CartItems;
