import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const UpdateRoomBooking = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const myProperty = params.get("myProperty");

  const [bookingData, setBookingData] = useState(null);
  const [status,setStatus]=useState("");

  const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertAction, setAlertAction] = useState(null);
  
  const getRoomBookingDetails = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(
        `${API_URL}/roomBooking/getRoomBookingByHandle`,
        { handle: myProperty },
        { withCredentials: true }
      );
      console.log(response.data);
      setBookingData(response.data);
      if(response.data.status==="CHECKEDIN"){
        localStorage.setItem("room",response.data.roomHandle)
      }
    } catch (error) {
      // console.error(error);
      // alert("Error fetching booking details");
      // setShowAlert(true)
      // setAlertType("failed")
      // setAlertMessage("Error fetching booking details!");
      // setAlertAction(null);
    }
  };

  const handleUpdate=async()=>{
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      
      const response=await axios.post(`${API_URL}/roomBooking/updateBooking`,{
        handle:bookingData.handle,
        userHandle:bookingData.userHandle,
        roomHandle:bookingData.roomHandle,
        checkInDateTime:bookingData.checkInDateTime,
        checkOutDateTime:bookingData.checkOutDateTime,
        totalDays:bookingData.totalDays,
        totalPrice:bookingData.totalPrice,
        status:status?status:bookingData.status,
        bookedAt:bookingData.bookedAt
      },{
        withCredentials:true
      })
      // console.log(response.data)
      // alert(response.data)
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
      setAlertAction(null);
      
    } catch (error) {
      // console.log(error);
      // alert(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Failed to update booking status!");
      setAlertAction(null);
    }
  }



  useEffect(() => {
    getRoomBookingDetails();
  }, []);

 

  return (

    <>
    {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() =>{alertType==='success'?(setShowAlert(false),window.location.reload):setShowAlert(false)} }
        />
      }
    <Navbar />
    <div style={{ paddingTop: "14vh", padding: "20px" }}>
      <center><h1 className='text-2xl font-bold'>UPDATE ROOM BOOKING</h1></center>
      <br /><br />
      {bookingData ? (
        <div style={{ maxWidth: "800px", margin: "auto" }}>
          <h3 className='text-lg font-bold text-orange-400'>Booking Details</h3>
          
          <p><strong>Status:</strong> {bookingData.status}</p>
          <p><strong>Check In:</strong> {new Date(bookingData.checkInDateTime).toLocaleString()}</p>
          <p><strong>Check Out:</strong> {new Date(bookingData.checkOutDateTime).toLocaleString()}</p>
          <p><strong>Booked At:</strong> {new Date(bookingData.bookedAt).toLocaleString()}</p>
          <p><strong>Total Days:</strong> {bookingData.totalDays}</p>
          <p><strong>Total Price:</strong> ₹{bookingData.totalPrice}</p>

          <h4>User Info</h4>
          <p><strong>Name:</strong> {bookingData.userHandle.name}</p>
          <p><strong>Email:</strong> {bookingData.userHandle.email}</p>
          <p><strong>Phone:</strong> {bookingData.userHandle.phone}</p>
          <p><strong>Address:</strong> {bookingData.userHandle.address}</p>

          <h4>Room Info</h4>
          <p><strong>Room Number:</strong> {bookingData.roomHandle.roomNumber}</p>
          <p><strong>Room Type:</strong> {bookingData.roomHandle.roomType}</p>
          <p><strong>Price/Night:</strong> ₹{bookingData.roomHandle.pricePerNight}</p>
          <p><strong>Amenities:</strong> {bookingData.roomHandle.amenities.join(", ")}</p>

          <div style={{ marginTop: "20px" }}>
            <label><strong>Change Status:</strong></label>
            <select name="status" style={{ marginLeft: "10px" }} value={status} onChange={(e)=>{setStatus(e.target.value)}}>
              <option value="">Choose one</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="CHECKEDIN">Checked In</option>
              <option value="CHECKEDOUT">Checked Out</option>
            </select>
          </div>
          <button className='bg-green-400 rounded-md font-semibold text-white' style={{padding:"10px 30px",marginTop:"20px"}} onClick={(e) => {
              e.preventDefault();
              setAlertType("warning");
              setAlertMessage("Are you sure you want to update booking status?");
              setShowAlert(true);
              setAlertAction(() => handleUpdate);
            }}>Update</button>
        </div>
      ) : (
        <center><p>Loading booking details...</p></center>
      )}
    </div>
    </>
  );
};

export default UpdateRoomBooking;
