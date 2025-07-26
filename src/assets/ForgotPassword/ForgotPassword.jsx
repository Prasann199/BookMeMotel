import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
      const [alertType, setAlertType] = useState("");
      const [alertMessage, setAlertMessage] = useState("");

    const handleForgotPassword = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/password-reset/forgot-password`,
                { email:email }
            );
            // console.log(response.data);
            if(response.data==="OTP sent to your email!"){
                // alert(response.data);  
                setShowAlert(true)
                setAlertType("success")
                setAlertMessage(response.data);
                
            }else{
                setShowAlert(true)
                setAlertType("failed")
                setAlertMessage("Failed to send OTP. Please try again.");

            }
        } catch (error) {
            // console.log(error);
            // alert("Failed to send OTP. Please try again.");
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage("Failed to send OTP. Please try again.",error.message);
        }
    };

    return (
        <>{showAlert &&
        <CustomAlert type={alertType} message={alertMessage} onClose={() => {alertType==="success"?(setShowAlert(false),navigate(`/verifyOtp/${email}`)):setShowAlert(false)}} />
      }
            <Navbar />
            <div
                className="w-full flex flex-col items-center"
                style={{ paddingTop: "14vh", minHeight: "100vh" }}
            >
                <h1 className="text-2xl font-bold">Forgot Password</h1>

                <div
                    className="flex justify-center w-full"
                    style={{ marginTop: "20px" }}
                >
                    <div
                        className="max-w-lg min-w-sm border border-gray-300 shadow-md flex flex-col items-center gap-3 rounded-md"
                        style={{ padding: "30px 40px" }}
                    >
                        <label
                            htmlFor="email"
                            className="text-[1.2rem] font-semibold"
                        >
                            Enter Registered Email
                        </label>

                        <div
                            className="flex gap-2 w-full justify-center"
                            style={{ marginBottom: "5px" }}
                        >
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourname@example.com"
                                className="border border-gray-300 rounded-2xl w-full px-3 py-2"
                                style={{padding:"5px 15px"}}
                            />
                        </div>

                        {/* <p className="text-sm">
                            If you didn't receive a code,&nbsp;
                            <a href="#" className="text-blue-700 font-semibold">
                                Resend
                            </a>
                        </p> */}

                        <div className="w-full" style={{ marginTop: "5px" }}>
                            <button
                                onClick={handleForgotPassword}
                                className="bg-orange-500 w-full rounded-2xl font-semibold text-white"
                                style={{ padding: "5px 20px" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
