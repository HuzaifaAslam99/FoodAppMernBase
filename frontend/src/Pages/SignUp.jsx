import React from 'react'
import { useForm } from "react-hook-form";
import {useState} from 'react'
import {Link} from "react-router-dom"
import {useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useCart } from "../CartContext";


function SignUp() {

  const { URL } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setConfirmPass] = useState(false);
  const [showPassAlert, setAlert] = useState(false)
  const [alertMessage, setMessage] = useState("")
  const [showError, setShowError] = useState({username: false, email: false, password: false, confirmPass: false}); 

  const { register, handleSubmit,  formState: { errors } } = useForm();
  
  const onError = (errors) => {
    const newErrorState = {
      username: !!errors.username,
      email: !!errors.email,
      password: !!errors.password,
      confirmPass: !!errors.confirmPass
    };
    setShowError(newErrorState);
  }

  const navigate = useNavigate();

  const onSubmit = async (Data) => {
    if (Data.password!==Data.confirmPass){
      setMessage("Passwords do not match");
      setAlert(true);
      return
    }

    try {
      // await axios.post('http://localhost:3000/auth/register', Data);
      await axios.post(`${URL}/auth/register`, Data);
      setMessage("Registration successful! Please login.");
      setAlert(true)

      navigate('/login');
    } catch (err) {
      console.log(err)
      setMessage(err.response?.data?.message || "Registration failed");    
      setAlert(true)
    }
  };


  return (
    <div className="bg-background relative min-h-screen w-screen flex flex-col justify-center items-center">

      {/* FIXED: slide-in from top using translateY instead of top */}
      <div
        className={`w-80 h-20 bg-brand-red z-50 text-white fixed flex justify-center items-center left-1/2 -translate-x-1/2 rounded-[8px]
          transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]
          ${ showPassAlert ? 'top-5 translate-y-0' : 'top-0 -translate-y-full'}`}
      >
        <h1 onClick={()=>setAlert(false)} className="absolute top-2 right-3 cursor-pointer text-sm font-bold opacity-70 hover:opacity-100">
          X
        </h1>
        <p>{alertMessage}</p>
      </div>

      {/* UNCHANGED form, only w-[350px] → w-[90vw] max-w-[350px] for responsiveness */}
      <form 
        action="" 
        className="w-[90vw] max-w-[350px] min-h-[450px] bg-white p-8 flex flex-col justify-between items-center rounded-xl border-t-8 border-brand-red shadow-lg"
        onSubmit={handleSubmit(onSubmit,onError)}
      >

        <h1 className="text-3xl font-extrabold text-gray-800">
          Create Account
        </h1>

        <div className="w-full flex flex-col gap-4 my-6">

          <div className="flex flex-col">
          <input 
            type="text" 
            placeholder="Enter Username" 
            className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all"
            {...register("username", { required: "Please Enter Username" })}
            onInput={() => setShowError({...showError, username:false})}
          />
          {errors.username && showError.username && <p className="text-red-500 leading-none text-xs mt-1">{errors.username.message}</p>}
         </div>

          <div className="flex flex-col">
          <input 
            type="email"
            placeholder="Enter Email Address" 
            className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all"
            {...register("email", { 
              required: "Please Enter Email",
             })}
            onInput={() => setShowError({...showError, email:false})}
          />
          {errors.email && showError.email && <p className="text-red-500 leading-none text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all pr-10"
            {...register("password", { 
              required: "Please Enter Password",
              minLength: { value: 5, message: "Password must be at least 5 characters"}
            })}
            onInput={() => setShowError({...showError, password:false})}
            />
            <button
              type="button"
              tabIndex="-1"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-brand-red focus:outline-none cursor-pointer"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && showError.password && <p className="text-red-500 leading-none text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col">
           <div className="relative flex items-center">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all pr-10"
              {...register("confirmPass", { required: "Please Enter Confirm Password" })}
              onInput={() => setShowError({...showError, confirmPass:false})}
            />
            <button
              type="button"
              tabIndex="-1"
              onClick={() => setConfirmPass(!showConfirmPass)}
              className="absolute right-3 text-gray-500 hover:text-brand-red focus:outline-none cursor-pointer"
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
           </div>
             {errors.confirmPass && showError.confirmPass && <p className="text-red-500 text-xs mt-1">{errors.confirmPass.message}</p>}
          </div>

        </div>

        <button 
          type="submit" 
          className="w-full bg-brand-red cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all mt-4"
        >
          SIGN UP
        </button>

        <p className="text-xs text-gray-400 mt-2">
          Already have an account? {" "}
          <Link to="/login">
            <span className="text-brand-red font-bold cursor-pointer hover:underline">
                Log in
            </span>
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp