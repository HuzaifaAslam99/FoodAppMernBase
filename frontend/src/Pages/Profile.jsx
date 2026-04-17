import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, Save, Camera, Home, Eye, EyeOff, LogOut } from 'lucide-react';
import {Link} from "react-router-dom"
import { useCart } from "../CartContext";


const ProfilePage = () => {

  const { _id } = useCart();
  const [inputData, setInputData] = useState({_id:_id, username: "", email: "", oldPassword: "", newPassword: "", confirmPass: "", 
        address: "", city: "", phonenumber: ""});
  const [showPassAlert, setAlert] = useState(false)
  const [alertMessage, setMessage] = useState("")


useEffect(() => {
  
  if (!_id) return; 

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/userProfile', {
        params: { _id: _id }
      });
      // console.log("Username fetched:", response.data);
      const data = response.data;
      setInputData({
        _id:_id,
        username: data.username,
        email: data.email,
        oldPassword: "",
        newPassword: "",
        confirmPass: "",
        address: data.address,
        city: data.city,
        phonenumber: data.phonenumber
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  fetchProfile();
}, [_id]); 


  const [showOldPassword, setOldPassword] = useState(false);
  const [showNewPassword, setNewPassword] = useState(false);
  const [showConfirmPass, setConfirmPass] = useState(false);

    const handleChanges = async (e) => {
      e.preventDefault();

      try {
        await axios.put('http://localhost:3000/api/userProfile', inputData);
        // alert("Changes Saved");
        setMessage("Changes Saved");    
        setAlert(true)
      } catch (err) {
        console.log(err)
        setMessage(err.response?.data?.message || "Failed to Save Changes");    
        setAlert(true)
      }
    };

  return (
    <div className="min-h-screen bg-background flex items-start font-redhat justify-center pt-22.5 pb-12.5 px-4 sm:px-6 lg:px-8">

      <div
        className={`w-90 h-20 bg-white z-50 text-brand-red text-[15px] font-bold fixed flex justify-center items-center left-1/2 -translate-x-1/2 border-3 border-brand-red rounded-[8px]
          transition-transform duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]
          ${ showPassAlert ? 'top-5 translate-y-0' : 'top-0 -translate-y-full'}`}
      >
        <h1 onClick={()=>setAlert(false)} className="absolute top-2 right-3 cursor-pointer text-sm font-bold opacity-70 hover:opacity-100">
          X
        </h1>
        <p>{alertMessage}</p>
      </div>


      <div className="max-w-5xl w-full rounded-3xl shadow-xl flex flex-col md:flex-row font-redhat overflow-hidden">
        
        {/* Left Side: Current Profile (Black and White Panel) */}
        <div className="w-full md:w-100 bg-brand-red px-8 py-8 md:px-12 text-white flex flex-col items-center justify-between gap-6">
          <div className="flex flex-col items-center gap-6 text-center w-full">

            <div className="relative w-32 h-32 flex justify-center items-center rounded-full border-4 border-white shadow-lg object-cover">
              <h1 className="text-[50px]">{inputData.username.charAt(0).toUpperCase()}</h1>
              {/* <button className="absolute bottom-0 right-0 bg-[#D64545] text-white rounded-full p-2 hover:bg-white hover:text-black transition-colors">
                <Camera size={18} />
              </button> */}
            </div>


            <h2 className="text-3xl font-black tracking-tight"></h2>
            <div className="w-full h-[1px] bg-white opacity-20"></div>

            <div className="space-y-6 w-full text-left">

              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <p className="text-lg opacity-90">{inputData.username}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <p className="text-lg opacity-90 break-all">{inputData.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <p className="text-lg opacity-90">{inputData.phonenumber || 'Add Phone Number'}</p>
              </div>

            </div>

          </div>

          {/* <> */}
            <Link to="/login" className="w-full sm:w-50 bg-white text-black flex justify-center items-center gap-2 py-4 hover:bg-black hover:text-white
              rounded-full font-bold cursor-pointer transition-all shadow-lg">
                <LogOut size={18} />
                  Log Out
            </Link>
          {/* </> */}

        </div>

        {/* Right Side: Account Settings (Editable Form) */}
        <div className="bg-white flex-1 px-6 sm:px-10 md:px-12 py-8 flex flex-col gap-10 md:gap-12">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red tracking-tight">
            Account Settings
          </h1>
          
          <form className="flex flex-col gap-10">
            {/* Update Username + Phone */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-5">

              <div className="relative w-full sm:w-65 flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500 block">
                  Update Username
                </label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-0 text-gray-400" />
                  <input 
                    type="text" 
                    value={inputData.username} 
                    onChange={(e)=>setInputData({...inputData, username: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-gray-200 pl-8 focus:border-brand-red outline-none transition-all duration-300"
                    placeholder="Enter a new username"
                  />
                </div>
              </div>

              {/* Update Phone Number */}
              <div className="relative w-full sm:w-65 flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500 block">
                  Update Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone size={18} className="absolute left-0 text-gray-400" />
                  <input 
                    type="number" 
                    value={inputData.phonenumber} 
                    onChange={(e)=>setInputData({...inputData, phonenumber: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-gray-200 pl-8 focus:border-brand-red outline-none transition-all duration-300"
                    placeholder="e.g., 03XX XXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* --- Address Section --- */}
            <div className="font-redhat flex flex-col gap-3">

              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <Home size={20} className="text-brand-red"/> Delivery Address
              </h3>
              
              <div className="group">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">Street Address</label>
                <div className="relative border-b-2 border-gray-100 focus-within:border-brand-red transition-colors py-2">
                  <input 
                    type="text" 
                    value={inputData.address} 
                    onChange={(e)=>setInputData({...inputData, address: e.target.value})}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">City</label>
                <div className="relative border-b-2 border-gray-100 focus-within:border-brand-red transition-colors py-2">
                  <input 
                    type="text" 
                    value={inputData.city} 
                    onChange={(e)=>setInputData({...inputData, city: e.target.value})}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="font-redhat flex flex-col gap-3">

              <h3 className="text-lg font-bold text-gray-700 leading-none">Change Password</h3>

              <div className="w-full sm:w-65 relative flex items-center">
                <Lock size={18} className="absolute left-0 text-gray-400" />
                <input 
                  type={showOldPassword ? "text" : "password"}
                  className="w-full bg-transparent border-b-2 border-gray-200 pl-8 py-2 focus:border-brand-red outline-none transition-all duration-300"
                  placeholder="Old Password"
                  autoComplete="new-password"
                  value={inputData.oldPassword} 
                  onChange={(e)=>setInputData({...inputData, oldPassword: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setOldPassword(!showOldPassword)}
                  className="absolute right-3 text-gray-500 hover:text-brand-red focus:outline-none cursor-pointer"
                  >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>         
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-5">

                <div className="w-full sm:w-65 relative flex items-center">
                  <Lock size={18} className="absolute left-0 text-gray-400" />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    className="w-full bg-transparent border-b-2 border-gray-200 pl-8 py-2 focus:border-brand-red outline-none transition-all duration-300"
                    placeholder="New Password"
                    value={inputData.newPassword} 
                    onChange={(e)=>setInputData({...inputData, newPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setNewPassword(!showNewPassword)}
                    className="absolute right-3 text-gray-500 hover:text-brand-red focus:outline-none cursor-pointer"
                    >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>         
                </div>

                <div className="w-full sm:w-65 relative flex items-center">
                  <Lock size={18} className="absolute left-0 text-gray-400" />
                  <input 
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full bg-transparent border-b-2 border-gray-200 pl-8 py-2 focus:border-brand-red outline-none transition-all duration-300"
                    placeholder="Confirm New Password"
                    value={inputData.confirmPass}
                    onChange={(e) => setInputData({ ...inputData, confirmPass: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmPass(!showConfirmPass)}
                    className="absolute right-3 text-gray-500 hover:text-brand-red focus:outline-none cursor-pointer"
                    >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>  
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full sm:w-50 bg-black flex justify-center items-center gap-2 py-4 hover:bg-brand-red text-white 
            rounded-full font-bold cursor-pointer transition-all shadow-lg" onClick={handleChanges}>
              <Save size={18} />
              Save Changes
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
