import axios from 'axios';
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const ChangePassword = () => {
    const [password,setPassword]=useState("");
    const [conpassword,setConpassword]=useState("");
    const {email}=useParams();
    const navigate=useNavigate();
    const [showAlert, setShowAlert] = useState(false);
      const [alertType, setAlertType] = useState("");
      const [alertMessage, setAlertMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showconPassword,setShowConPassword]=useState(false);
        
        const togglePassword = () => {
          setShowPassword((prev) => !prev);
        };
        const toggleconPassword = () => {
          setShowConPassword((prev) => !prev);
        };
        
    const handleChangePassword=async(e)=>{
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        try{
          if(password===conpassword && password.length>6 && conpassword.length>6){
            console.log("Password accepted! ",password)
            const response=await axios.post(`${API_URL}/user/change/password`,{email:email,password:password});
            // console.log(response.data);
            // alert(response.data);
            setShowAlert(true)
            setAlertType("success")
            setAlertMessage(response.data);
          
            

          }else{
            // alert("Please enter password of length greater then 6 and please confirm with same password!")
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage("Please enter password of length greater then 6 and please confirm with same password!");
          }
        }catch(error){
            // console.log(error);
            // alert(error);
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage(error.message);
        }
    }

    
  return (
    <>{showAlert &&
        <CustomAlert type={alertType} message={alertMessage} onClose={() => {setShowAlert(false),navigate("/login")} }/>
      }
      <Navbar />
    <div>
         <div
                className="w-full flex flex-col items-center"
                style={{ paddingTop: "14vh", minHeight: "100vh" }}
            >
                <h1 className="text-2xl font-bold">Change Password</h1>

                <div
                    className="flex justify-center w-full"
                    style={{ marginTop: "20px" }}
                >
                    <div
                        className="max-w-lg min-w-sm border border-gray-300 shadow-md flex flex-col items-start gap-3 rounded-md"
                        style={{ padding: "30px 40px 10px 40px" }}
                    >
                        <label
                            htmlFor="password"
                            className="text-[1.2rem] font-semibold"
                        >
                            Enter New Password
                        </label>

                        <div
                            className="flex gap-2 w-full justify-center border border-gray-300 rounded-2xl w-full items-center"
                            style={{ marginBottom: "10px" }}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                placeholder='password'
                                onChange={(e) => setPassword(e.target.value)}
                                className=" px-3 py-2 w-[95%] focus:outline-none"
                                style={{padding:"5px 20px"}}
                            />
                            <FaEye onClick={togglePassword}
                                                    style={{
                                                      marginRight:"5px",
                                                      background: "transparent",
                                                      cursor: "pointer",
                                                    }}/>
                        </div>
                        <label
                            htmlFor="conpassword"
                            className="text-[1.2rem] font-semibold"
                        >
                            Confirm New Password
                        </label>

                        <div
                            className="flex gap-2 w-full justify-center border border-gray-300 rounded-2xl items-center"
                            style={{ marginBottom: "10px" }}
                        >
                            <input
                                type={showconPassword ? "text" : "password"}
                                id="conpassword"
                                value={conpassword}
                                placeholder='Confirm Password'
                                onChange={(e) => setConpassword(e.target.value)}
                                className="  px-3 py-2 w-[95%] focus:outline-none"
                                style={{padding:"5px 20px"}}
                            />
                            <FaEye onClick={toggleconPassword}
                                                    style={{
                                                      marginRight:"5px",
                                                      background: "transparent",
                                                      cursor: "pointer",
                                                    }}/>
                        </div>

                        <div className="w-full" style={{ marginTop: "10px" }}>
                            <button
                                onClick={(e)=>handleChangePassword(e)}
                                className="bg-orange-500 w-full rounded-2xl font-semibold text-white"
                                style={{ padding: "5px 20px" }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    </>
  )
}

export default ChangePassword