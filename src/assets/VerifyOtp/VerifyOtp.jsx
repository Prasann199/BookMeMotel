import React, { useRef, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import CustomAlert from '../CustomAlert/CustomAlert';
import OtpTimer from './OtpTimer'; // import the timer component

const VerifyOtp = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [one, setOne] = useState("");
    const [two, setTwo] = useState("");
    const [three, setThree] = useState("");
    const [four, setFour] = useState("");
    const [five, setFive] = useState("");
    const [six, setSix] = useState("");
    const formRef = useRef();
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const handleVerify = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        try {
            const OTP = one.trim() + two.trim() + three.trim() + four.trim() + five.trim() + six.trim();
            const response = await axios.post(`${API_URL}/password-reset/verifyOtp`, { email: email, otp: OTP })
            console.log(response.data);
            if (response.data === "OTP Verified!") {
                setShowAlert(true)
                setAlertType("success")
                setAlertMessage("OTP Verified!");
                
            } else {
                setShowAlert(true)
                setAlertType("failed")
                setAlertMessage(response.data);
            }
        } catch (error) {
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage(error);
        }
    }

    const sendOtp = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(
                `${API_URL}/password-reset/forgot-password`,
                { email: email }
            );
            setShowAlert(true)
            setAlertType("success")
            setAlertMessage(response.data);
            navigate(`/verifyOtp/${email}`);
        } catch (error) {
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage("Failed to send OTP. Please try again.", error.message);
        }
    }

    return (
        <>
            {showAlert &&
                <CustomAlert type={alertType} message={alertMessage} onClose={() => {alertType==="success"?(setShowAlert(false),navigate(`/changePassword/${email}`)):setShowAlert(false)}} />
            }
            <Navbar />
            <div className='w-full' style={{ paddingTop: "14vh" }}>
                <center><h1 className='text-2xl font-bold'>Verify OTP</h1></center>
                <div className='flex justify-center' style={{ marginTop: "20px" }}>

                    <div className='min-w-sm max-w-lg border-1 border-gray-300 shadow-md flex flex-col items-center gap-3 rounded-md min-h-50 justify-center' style={{ padding: "30px 40px" }}>
                        <form ref={formRef} className='flex flex-col items-center gap-3 justify-center'>
                            <label htmlFor="" className='text-[1.2rem] font-semibold'>Enter verification code</label>
                            <div className='flex gap-2'>
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={one} onChange={(e) => { setOne(e.target.value) }} />
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={two} onChange={(e) => { setTwo(e.target.value) }} />
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={three} onChange={(e) => { setThree(e.target.value) }} />
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={four} onChange={(e) => { setFour(e.target.value) }} />
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={five} onChange={(e) => { setFive(e.target.value) }} />
                                <input type="text" maxLength={1} className='w-10 h-10 rounded-3xl border-1 text-center' value={six} onChange={(e) => { setSix(e.target.value) }} />
                            </div>
                            <p className='text-center'>If you didn't recieve a code! <span onClick={sendOtp} className='text-blue-700 font-semibold cursor-pointer'>Resend</span></p>
                            <div className='w-full'>
                                <button className='bg-orange-500 w-full rounded-2xl font-semibold text-white cursor-pointer' style={{ padding: "5px 20px" }} onClick={(e) => { handleVerify(e) }}>Verify</button>
                                <div className='w-full flex justify-end mt-2'>
                                    <OtpTimer />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyOtp;
