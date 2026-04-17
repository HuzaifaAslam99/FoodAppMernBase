import React from 'react'
import { useForm } from "react-hook-form";
import {useState} from "react"
import axios from 'axios';
import {Link} from "react-router-dom"
import {useNavigate } from 'react-router-dom';
import {Eye, EyeOff } from 'lucide-react';
import apiClient from '../api/axiosConfig';
import { useCart } from "../CartContext";

function Login() {
  
  const { setID } = useCart();

  const [inputData, setInputData] = useState({email:"", password:""})
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState({email: false, password: false});
  const [showPassAlert, setAlert] = useState(false)
  const [alertMessage, setMessage] = useState("")

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onError = (errors) => {
    const newErrorState = {
      email: !!errors.email,
      password: !!errors.password,
    };
    setShowError(newErrorState);
  };

  const onSubmit = async (Data) => {
    try {
      const res = await apiClient.post('/auth/login', {
        email: Data.email,
        password: Data.password
      });

      setID(res.data._id)
      
      localStorage.setItem('token', res.data.token);
      // localStorage.setItem('id', res.data._id);

      navigate('/');

    } catch (err) {
      console.error(err);
      console.log(err);
      setMessage(err.response?.data?.message || "Login failed!");    
      setAlert(true)
    }
  };

  return (
    <div className="bg-background relative min-h-screen w-screen flex flex-col justify-center items-center font-sans">

      {/* FIXED: slide-down alert */}
      <div
        className={`w-80 h-20 bg-brand-red z-50 text-white fixed flex justify-center items-center left-1/2 -translate-x-1/2 rounded-[8px]
          transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]
          ${ showPassAlert ? "top-5 translate-y-0" : "top-0 -translate-y-full" }`}
      >
        <h1 onClick={()=>setAlert(false)} className="absolute top-2 right-3 cursor-pointer text-sm font-bold opacity-70 hover:opacity-100">
          X
        </h1>
        <p>{alertMessage}</p>
      </div>

      <form 
        action="" 
        onSubmit={handleSubmit(onSubmit, onError)}
        className="w-[90vw] max-w-[350px] min-h-[350px] bg-white p-8 flex flex-col justify-between items-center rounded-xl border-t-8 border-brand-red shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Login
          </h1>
          <p className="text-gray-500 text-sm mt-2">Welcome back!</p>
        </div>

        <div className="w-full flex flex-col gap-4 my-6">

          <div className="flex flex-col">
            <input 
              type="email"
              placeholder="Enter Email" 
              className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all"
              {...register("email", { required: "Please Enter Email" })}
              onInput={() => setShowError({...showError, email: false})}
            />
            {errors.email && showError.email && <p className="text-red-500 leading-none text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col">
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full px-4 py-2 border-l-4 border-brand-red bg-gray-50 outline-none focus:bg-white focus:ring-1 focus:ring-red-400 transition-all"
                {...register("password", { required: "Please Enter Password" })}
                onInput={() => setShowError({...showError, password: false})}        
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

        </div>

        <div className="w-full">
          <button 
            type="submit"
            className="w-full bg-brand-red cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all shadow-md active:scale-95" 
          >
            Login
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-brand-red font-bold cursor-pointer hover:underline">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login