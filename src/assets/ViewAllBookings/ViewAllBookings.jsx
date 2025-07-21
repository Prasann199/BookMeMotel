import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const ViewAllBookings = () => {
  const [roomBookings, setRoomBookings] = useState([]);
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [searched,setSearched]=useState([]);
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertAction, setAlertAction] = useState(null);
  

  const handleFetchBookingByDetails=async()=>{
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      console.log(name,checkIn,checkOut,roomNumber,phone)
      const response = await axios.post(`${API_URL}/roomBooking/fetchByFields`, {
        name,
        checkInDateTime: checkIn? `${checkIn}T00:00:00`:checkIn,
        checkOutDateTime: checkOut? `${checkOut}T00:00:00`:checkOut,
        roomNumber,
        phone
      }, { withCredentials: true });
      console.log(response.data);
      setSearched(response.data);
    
    } catch (error) {
      console.error(error);
      alert("Error fetching filtered history.");
    }
  }

  const handleAction = (action, handle) => {
    if (action === 'edit') {
      handleEdit(handle);
    } else if(action==='delete') {
      
        setAlertType("warning");
        setAlertMessage("Are you sure you want to Delete this booking?");
        setShowAlert(true);
        setAlertAction(()=>()=>{handleDelete(handle)}
      );
      
    }
  };

  const handleEdit = (handle) => {
    console.log(`${handle} Editing..!`);
    navigate('/updateRoomBooking?myProperty=' + handle);
  };

  const handleDelete = async (handle) => {
    console.log("Handle: ",handle)
    const API_URL = import.meta.env.VITE_API_URL;

    console.log(`${handle} deleting..!`);
    try {
      const response = await axios.post(`${API_URL}/roomBooking/deleteByHandle`, {handle:handle}); // Replace URL and payload
      // console.log(response.data);
      if(response.data==="Booking Deleted Successfully!"){

        setShowAlert(true)
          setAlertType("success")
          setAlertMessage("Booking deleted successfully!");
          setAlertAction(null);
      }else{
        setShowAlert(true)
          setAlertType("failed")
          setAlertMessage("Error deleting Booking! ",response.data);
          setAlertAction(null);
      }
    } catch (error) {
      // console.error(error);
      // alert('Error deleting booking');
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Booking deleting failed!");
      setAlertAction(null);
    }
  };

  const fetchRoomBookings = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/roomBooking/viewAllBookings`);
      setRoomBookings(response.data);
      // console.log(response)
    } catch (error) {
      // console.error(error);
      // alert('Error fetching bookings');
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage("Error Fetching Bookings");
      setAlertAction(null);
    }
  };

  useEffect(() => {
    fetchRoomBookings();
  }, []);

  return (
    <>
    {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() => alertType==='success'?(setShowAlert(false),
          window.location.reload()):setShowAlert(false)}
        />
      }
      <Navbar />
      <div className="min-h-screen w-full mt-[90px] px-4 py-6" style={{ paddingTop: "14vh" }}>
        <h1 className="text-2xl font-bold text-center mb-6" style={{margin:"30px"}}>View All Bookings</h1>

        <div className="flex flex-wrap gap-6 justify-center mb-6 bg-white p-4 rounded">
            <input type="text" placeholder="Name" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setName(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="text" placeholder="Phone" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setPhone(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="text" placeholder="Room Number" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setRoomNumber(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="date" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setCheckIn(e.target.value)} style={{padding:"0px 5px"}}/>
            <input type="date" className="border px-3 py-1 rounded-md w-full sm:w-[18%]" onChange={(e) => setCheckOut(e.target.value)} style={{padding:"0px 5px"}}/>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto min-w-20 font-semibold shadow-md" onClick={handleFetchBookingByDetails}>Go</button>
          </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg" style={{ padding: "20px 10px",scrollbarWidth:"none" }}>
          <table className="min-w-full divide-y divide-gray-800 border border-gray-800">
            <thead className="bg-blue-200 text-gray-900 text-sm font-semibold">
              <tr>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Handle</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">User</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Room</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">CheckIn</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">CheckOut</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Total Days</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Total Price</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Status</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Booked At</th>
                <th className="px-3 py-2 whitespace-nowrap border border-gray-800">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800 text-sm text-gray-700">
              {(searched.length > 0 ? searched : roomBookings).length > 0 ? 
    (searched.length > 0 ? searched : roomBookings).map((booking, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800 font-medium">{booking.handle}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">{booking.userHandle?.handle || 'No User'}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">{booking.roomHandle?.handle || 'Not available'}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">{booking.checkInDateTime}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">{booking.checkOutDateTime}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800 text-center">{booking.totalDays}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800 text-center">{booking.totalPrice}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800 text-center">{booking.status}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">{booking.bookedAt}</td>
                    <td className="px-3 py-2 whitespace-nowrap border border-gray-800">
                      <select
                        className="border px-2 py-1 rounded"
                        onChange={(e) => handleAction(e.target.value, booking.handle)}
                      >
                        <option value="">Choose</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4 border border-gray-800">No bookings available</td>
                  </tr>
                )
              }
            </tbody>
          </table>


        </div>
      </div>
    </>
  );
};

export default ViewAllBookings;
