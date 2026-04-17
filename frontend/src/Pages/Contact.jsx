import React from 'react';
import {  Mail, MapPin, Phone } from 'lucide-react';
import  Facebook from '../assets/svg/facebook.svg';
import  X  from '../assets/svg/x.svg';
import Instagram from '../assets/svg/instagram.svg';

const ContactForm = () => {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-22.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row font-redhat">
        
        {/* Left Side: Form */}
        <div className="flex-1 p-6 sm:p-8 md:p-12 bg-white">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-red mb-6 sm:mb-8">
            Contact Us
          </h1>
          
          <form className="space-y-6">
            <div className="relative">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Phone Number
              </label>
              <input 
                type="tel" 
                className="w-full bg-transparent border-b-2 border-gray-200 py-2 focus:border-[#D64545] outline-none transition-all duration-300"
                placeholder="+92 000 0000000"
              />
            </div>

            <div className="relative">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Subject
              </label>
              <input 
                type="text" 
                className="w-full bg-transparent border-b-2 border-gray-200 py-2 focus:border-[#D64545] outline-none transition-all duration-300"
                placeholder="How can we help?"
              />
            </div>

            <div className="relative">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Message
              </label>
              <textarea 
                rows="4"
                className="w-full bg-transparent border-gray-200 py-2 outline-none transition-all duration-300 resize-none leading-7"
                placeholder="Write your message here..."
                style={{
                /* This creates the lined paper effect */
                      backgroundImage: 'linear-gradient(transparent 95%, #e5e7eb 5%)',
                      backgroundSize: '100% 32px',
                      lineHeight: '32px',
                /* This ensures the first line of text aligns with the first visual line */
                      paddingTop: '0px', 
                      marginTop: '8px'
                    }}
              />
            </div>

            <button className="mt-4 bg-black hover:bg-[#D64545] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer w-full sm:w-auto">
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side: Info Panel */}
        <div className="w-full md:w-80 bg-brand-red p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between">
          <div className="space-y-8 sm:space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Mail size={20} />
                <h3 className="text-xl font-bold">Contact</h3>
              </div>
              <p className="opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                GoodFood@gmail.com
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={20} />
                <h3 className="text-xl font-bold">Location</h3>
              </div>
              <p className="opacity-90 leading-relaxed">
                Islamabad, Pakistan<br />
                Blue Area, Sector F-7
              </p>
            </div>
          </div>

          <div className="pt-8 sm:pt-10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70">Follow Us</h3>
            <div className="flex gap-5">
              <img src={Facebook} className="cursor-pointer hover:invert-0 invert transition-colors" alt="" />
              <img src={Instagram} className="cursor-pointer hover:invert-0 invert transition-colors" alt="" />
              <img src={X} className="cursor-pointer hover:invert-0 invert transition-colors" alt=""/>  
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactForm;
