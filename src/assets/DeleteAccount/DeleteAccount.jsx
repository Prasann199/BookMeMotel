import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { FaEye } from 'react-icons/fa'
import axios from 'axios';
import CustomAlert from '../CustomAlert/CustomAlert';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const navigate=useNavigate();
        const [alertType, setAlertType] = useState("");
        const [alertMessage, setAlertMessage] = useState("");
        const [alertAction, setAlertAction] = useState(null);
        const [reRender,setReRender]=useState(false)

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleDeleteAccount = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/user/deleteAccount`, {
                email: email,
                password: password
            }, { withCredentials: true })
            console.log(response.data);
            if(response.data==="Account Deleted Successfully!"){
                setShowAlert(true)
                setAlertType("success")
                setAlertMessage("Account Deleted Successfully!");
                setAlertAction(null);
            }else{
                 setShowAlert(true)
                setAlertType("failed")
                setAlertMessage(response.data);
                setAlertAction(null);
            }
        } catch (error) {
            console.log(error);
            // alert(error);
            setShowAlert(true)
                setAlertType("failed")
                setAlertMessage(error.message);
                setAlertAction(null);
        }
    }
    useEffect(() => {
        const storedUserEncoded = sessionStorage.getItem("user");
        if (storedUserEncoded) {
            const decodedUser = atob(storedUserEncoded);
            const userObj = JSON.parse(decodedUser);
            // console.log("User object:", userObj);
            setEmail(userObj.email);
            console.log("Email: ", userObj.email)
        }
    }, []);
    return (
        <>
        {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() => alertType==='success'?(setShowAlert(false),sessionStorage.clear(),
          navigate("/login")):setShowAlert(false)}
        />
      }
            <Navbar />
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <div className='w-md h-fit border-gray-300 shadow-md border-1' style={{ padding: "30px" }}>
                    <center><h1 className='text-2xl font-bold text-red-500' style={{ marginBottom: "10vh" }}>Delete My Acount</h1></center>
                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" style={{ marginBottom: "10px" }}>
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
                    <div style={{marginTop:"10px"}}>
                        <button className='w-full rounded-md bg-red-500 text-white font-semibold hover:bg-red-600' style={{padding:"5px"}} onClick={handleDeleteAccount}>Delete Account</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteAccount