import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const ChiefCounter = () => {

    const [orders, setOrders] = useState([]);
    const [showAlert,setShowAlert]=useState(false);
    const [alertType,setAlertType]=useState("");
    const [alertMessage,setAlertMessage]=useState("");
    

    const handleUpdateStatus = async (e, uname) => {
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${API_URL}/foodOrder/updateOrderStatus`, {
                userHandle: { name: uname },
                status: "SENT"
            }, { withCredentials: true })
            // console.log(response.data)
            // alert(response.data)
            setShowAlert(true)
            setAlertType("success")
            setAlertMessage("Status Changed Successfully!");
           
            
        } catch (error) {
            // console.log(error)
            // alert(error)
            setShowAlert(true)
            setAlertType("failed")
            setAlertMessage("Status changing failed!");
        }
    }
    const handleFetchOrders = async () => {
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.get(`${API_URL}/foodOrder/all`, { withCredentials: true })
            console.log(response.data)
            setOrders(response.data);

            // alert(response.data);
        } catch (error) {
            console.log(error)
            alert(error);
        }
    }
    useEffect(() => {
        handleFetchOrders();
    }, [])

    return (
        <>
        {showAlert &&
  <CustomAlert type={alertType}  message={alertMessage} onClose={() => {setShowAlert(false)
    window.location.reload()
  }}/>
  }
            <Navbar />
            <div className='' style={{ padding: "14vh 15px 15px 15px",fontSize:"0.8rem"}}>

                {
                    orders.map((order, idx) => (
                        <div key={idx}>
                            <div className='flex justify-between items-center border-1 border-gray-300 shadow-md flex-wrap' style={{ padding: "10px" }}>
                                <div className='w-[40%] min-w-40 '>

                                    <p>Name: {order.userHandle.name}</p>
                                    <p>Email: {order.userHandle.email}</p>
                                    <p>Phone No: {order.userHandle.handle}</p>
                                    <p>Room No: {order.roomHandle.roomNumber}</p>
                                    <p>Ordered Time: {order.orderedAt}</p>
                                    {order.status === "PAID" ? <p>Payment Status: <span className='text-xs bg-green-500 font-semibold w-fit rounded-md ' style={{ padding: "2px 10px" }}>{order.status}</span></p> : <p>Payment Status: <span className='text-xs bg-red-500 font-semibold w-fit rounded-md ' style={{ padding: "2px 10px" }}>{order.status}</span></p>}

                                </div>
                                <div className='w-[30%] min-w-40  flex flex-wrap ' style={{font:"0.7rem"}}>
                                    <table className="table-auto border border-gray-300 w-full text-sm text-left text-gray-700">
                                        <thead className="bg-gray-100 text-gray-900 font-semibold">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-2 text-lg" style={{font:"0.7rem"}}>Food Name</th>
                                                <th className="border border-gray-300 px-4 py-2 text-lg " style={{font:"0.7rem"}}>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems?.map((item, id) => (
                                                <tr key={id} className="hover:bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2 text-lg font-semibold">{item.foodHandle.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-lg font-semibold">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>



                                </div>
                                <div className='w-[20%]  flex justify-center items-center min-w-20 '>
                                    {order.status === "SENT" ? <button className='uppercase bg-green-500 rounded-md font-semibold text-white' style={{ padding: "10px 20px" }} >Sent</button>
                                        : <button className='uppercase bg-orange-500 rounded-md font-semibold text-white' style={{ padding: "10px 20px" }} onClick={(e) => { handleUpdateStatus(e, order.userHandle.name) }}>Sent</button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ChiefCounter