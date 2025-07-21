import React, { useEffect, useRef, useState } from 'react';
import "../Register/Register.css";
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import CustomAlert from '../CustomAlert/CustomAlert';

const Register = () => {
  const formRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showAlert,setShowAlert]=useState(false);
  const [alertType,setAlertType]=useState("");
  const [alertMessage,setAlertMessage]=useState("");

  const [showPassword, setShowPassword] = useState(false);

  
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    const API_URL = import.meta.env.VITE_API_URL;
    e.preventDefault();
    try {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(password.trim())) {
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage(`Password length must be greater then 6! 
          at least 1 uppercase letter
          at least 1 lowercase letter
          at least 1 number
          at least 1 special character`)
          
      }else{
      const response = await axios.post(`${API_URL}/user/register`, {
        name,
        email,
        phone,
        password,
        role:"USER",
        address,
      });

      console.log(response);
      if (response.data === "User Registered Successfully!") {
        setAlertType("success")
        setAlertMessage("Registered successfully!");
        setShowAlert(true)
        formRef.current.reset();
       
      } else {
        setAlertType("failed")
        setAlertMessage(response.data);
        setShowAlert(true)
      }}
    } catch (err) {
      console.log(err);
      setAlertType("failed")
      setAlertMessage("Error during registration!");
      setShowAlert(true)
    }
  };



  return (

    <>
    {showAlert &&
    <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
    }
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-blue-200 flex items-center justify-center px-4 py-8" style={{padding:"10px"}}>
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center"
        style={{ padding: '1.5rem 1rem' }}
      >
        <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">User Registeration</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Join us and book your perfect stay!</p>

        <form className="w-full px-2 sm:px-4 space-y-5" ref={formRef} style={{ marginTop: "20px" }}>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              style={{ margin: "0px 0px 10px 0px", padding: "5px" }}
            />
          </div>
          <div className='flex justify-between'>
            {/* Email */}
            <div className='w-[45%]'>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                maxLength={50}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}

                style={{ margin: "0px 0px 10px 0px", padding: "5px" }}
              />
            </div>

            {/* Phone */}
            <div className='w-[45%]'>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9876543210"
                maxLength={10}
                onChange={(e) => setPhone(e.target.value)}
                style={{ margin: "0px 0px 10px 0px", padding: "5px" }}
              />
            </div>

          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, City, ZIP"
              onChange={(e) => setAddress(e.target.value)}
              style={{ margin: "0px 0px 10px 0px", padding: "5px" ,scrollbarWidth:"none"}}
            ></textarea>
          </div>

          {/* Role
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onChange={(e) => setRole(e.target.value)}

              style={{ margin: "0px 0px 10px 0px", padding: "5px" }}
            >
              <option value="">-- Choose Role --</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div> */}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className='flex items-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[95%]  px-4 py-2  focus:outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="true"
              style={{ padding: "5px" }}
            />
            
        <FaEye onClick={togglePassword}
        style={{
          marginRight:"5px",
          background: "transparent",
          cursor: "pointer",
        }}/>
      
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            onClick={handleRegister}
            style={{ margin: "20px 0px", padding: "5px 0px" }}
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline cursor-pointer">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
