import React, { useRef, useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaEye } from "react-icons/fa";
import CustomAlert from '../CustomAlert/CustomAlert';
import Navbar from '../Navbar/Navbar';

const Login = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [user, setUser] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const getProfile = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/user/profile`, { withCredentials: true });
      setUser(response.data.user ?? null);

      sessionStorage.setItem('user', btoa(JSON.stringify(response.data.user ?? null)));
      sessionStorage.setItem('room', btoa(JSON.stringify(response.data.room ?? null)));
      setUsername(response.data.user?.name ?? null);
      setRoomNumber(response.data.room?.roomNumber ?? null);
    } catch (error) {
      // console.log(error);
      // alert("Error fetching profile.");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error fetching profile.");
    }
  }

  const handleSignin = async (e) => {
    const API_URL = import.meta.env.VITE_API_URL;
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/user/login`, { email, password }, { withCredentials: true });

      if (response.data === "User Login successfully!") {
        // alert("User login successful!");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("User login successful!");
        formRef.current.reset();
        getProfile();
        navigate("/customer");
      } else if (response.data === "admin Login successfully!") {
        // alert("Admin login successful!");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Admin login successful!");
        formRef.current.reset();
        getProfile();
        navigate("/admin");
      } else {
        // alert("Invalid credentials");
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      // alert("Login failed");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Login failed");
    }
  }

  return (

    <>
      {showAlert &&
        <CustomAlert type={alertType} message={alertMessage} onClose={() => setShowAlert(false)} />
      }
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-200 via-white to-blue-200" style={{ padding: "10px" }}>
        <div
          className="w-full max-w-lg bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden"
          style={{ padding: '1rem' }}
        >
          {/* Right Side (Form Area) */}
          <div className="flex flex-col justify-center items-center w-full " >
            <div className="w-full sm:w-4/5 md:w-full px-4 py-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
              <form className="space-y-5 w-full" ref={formRef} style={{ marginTop: "20px" }}>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='true'
                    style={{ padding: "5px", margin: "0px 0px 10px 0px" }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className='flex items-center border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500'>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="block w-[95%] px-4 py-2  focus:outline-none"
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete='true'
                      style={{ padding: "5px" }}
                    />
                    <FaEye onClick={togglePassword}
                      style={{
                        marginRight: "5px",
                        background: "transparent",
                        cursor: "pointer",
                      }} />
                  </div>
                </div>

                {/* Remember me + Forgot */}
                <div className="flex items-center justify-end text-sm">
                  <a href="/forgotPassword" className="text-pink-600 hover:text-pink-500 font-medium">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
                  onClick={handleSignin}
                  style={{ padding: "5px 0px", margin: "20px 0px" }}
                >
                  Sign In
                </button>

                {/* Register link */}
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{' '}
                  <a href="/register" className="text-pink-600 font-medium hover:text-pink-500">
                    Register here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
