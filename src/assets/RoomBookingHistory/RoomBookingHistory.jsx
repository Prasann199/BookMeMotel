import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import CustomAlert from '../CustomAlert/CustomAlert';

const RoomBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [searched,setSearched]=useState([]);

  const [showAlert,setShowAlert]=useState(false);
  const [alertType,setAlertType]=useState("");
  const [alertMessage,setAlertMessage]=useState("");
  

  const handleFetchHistoryByDetails = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/bookingHistory/getByfields`, {
        name,
        checkInDateTime: checkIn? `${checkIn}T00:00:00`:checkIn,
        checkOutDateTime: checkOut? `${checkOut}T00:00:00`:checkOut,
        roomNumber,
        phone
      }, { withCredentials: true });
      // console.log(response.data);
      setSearched(response.data);
      if(response.data.length>0){
        // alert("Filtered booking history fetched successfully.");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Filtered booking history fetched successfully.");
      }
    } catch (error) {
      // console.error(error);
      alert("Error fetching filtered history.");
      setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Error fetching filtered history!");
    }
  };



  const handleFetchHistory = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(
        `${API_URL}/bookingHistory/getAll`,
        { withCredentials: true }
      );
      // console.log(response.data);
      setBookingHistory(response.data);
    } catch (error) {
      // console.error(error);
      // alert("Error fetching booking history.");
    }
  };

  useEffect(() => {
    handleFetchHistory();
  }, []);

  return (
    <>
    {showAlert &&
      <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
      }
      <Navbar />
      <div className="pt-28 px-4 bg-gray-50 min-h-screen" style={{paddingTop:"14vh"}}>
        <div className="max-w-screen-xl mx-auto w-full" style={{padding:"10px"}}>
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800" style={{margin:"30px 0px"}}>Room Booking History</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-6 justify-center mb-6 bg-white p-4 rounded">
            <input type="text" placeholder="Name" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setName(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="text" placeholder="Phone" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setPhone(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="text" placeholder="Room Number" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setRoomNumber(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="date" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setCheckIn(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="date" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setCheckOut(e.target.value)} style={{padding:"0px 5px"}}/>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto min-w-20 font-semibold shadow-md" onClick={handleFetchHistoryByDetails}>Go</button>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-x-auto border border-gray-300 rounded-lg shadow bg-white" style={{marginTop:"20px"}}>
            <table className="min-w-full text-sm border-collapse table-auto">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-gray-900 font-medium text-left">
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">usernme</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Room Number</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Email</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Phone</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Check In</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Check Out</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Total Days</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Total Price</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 border border-gray-300 whitespace-nowrap text-center">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {(searched.length>0?searched:bookingHistory).map((history, idx) => (
                  <tr key={idx} className="text-gray-700 text-left hover:bg-gray-50">
                    <td className="px-4 py-2 border">{history.username}</td>
                    <td className="px-4 py-2 border">{history.roomNumber}</td>
                    <td className="px-4 py-2 border">{history.email}</td>
                    <td className="px-4 py-2 border">{history.phone}</td>
                    <td className={`px-4 py-2 border `}>{history.checkInDateTime}</td>
                    <td className="px-4 py-2 border">{history.checkOutDateTime}</td>
                    <td className="px-4 py-2 border">{history.totalDays}</td>
                    <td className="px-4 py-2 border">₹{history.totalPrice}</td>
                    <td className="px-4 py-2 border">{history.status}</td>
                    <td className="px-4 py-2 border">{history.bookedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomBookingHistory;
