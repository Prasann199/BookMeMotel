import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './RoomBooking.css';
import CustomAlert from '../CustomAlert/CustomAlert';

const RoomBooking = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const myProperty = params.get('myProperty');

  const [user, setUser] = useState({});
  const [flag, setFlag] = useState(false);
  const [roomDetail, setRoomDetail] = useState({});
  const [price, setPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const [roomToBeUpdated, setRoomToBeUpdated] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(null);



  const fetchRoom = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(
        `${API_URL}/roomBooking/getRoomByHandle`,
        { handle: myProperty },
        { withCredentials: true }
      );
      // console.log(response.data);
      setRoomDetail(response.data);
      if (response.data) {
        setPrice(response.data.pricePerNight);
        setFlag(response.data.available);
      }
    } catch (error) {
      // console.log(error);
      // alert("Failed to fetch room details.");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Failed to fetch room data!");
      setAlertAction(null);
    }
  };

  const handlecheckAvailability = async (event, checkIn, checkOut, totalPrice, totalDays, roomDetail) => {
    event.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const cIn = new Date(checkIn);
      const cOut = new Date(checkOut);
      const response = await axios.post(
        `${API_URL}/roomBooking/checkAvailability`,
        {
          handle: roomDetail.handle,
          roomNumber: roomDetail.roomNumber,
          roomType: roomDetail.roomType,
          pricePerNight: roomDetail.pricePerNight,
          available: roomDetail.available,
          amenities: roomDetail.amenities,
          images: roomDetail.images,
          checkInDateTime: cIn,
          checkOutDateTime: cOut
        },
        { withCredentials: true }
      );
      // console.log("Available:", response.data);
      setFlag(response.data);
    } catch (error) {
      // console.log(error);
      // alert("Error while checking availability.");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error while checking availability !");
      setAlertAction(null);
    }
  };

  const handleReserve = async ( checkIn, checkOut, totalPrice, totalDays, roomDetail) => {
    const API_URL = import.meta.env.VITE_API_URL;
    // event.preventDefault();
    try {
      const cIn = new Date(checkIn);
      const cOut = new Date(checkOut);
      const user = JSON.parse(atob(sessionStorage.getItem("user")));
      console.log("USER: ",user);
      const response = await axios.post(
        `${API_URL}/roomBooking/bookRoom`,
        {
          data: {
            checkInDateTime: cIn,
            checkOutDateTime: cOut,
            roomHandle: {
              handle: roomDetail.handle,
              roomNumber: roomDetail.roomNumber,
              roomType: roomDetail.roomType,
              pricePerNight: roomDetail.pricePerNight,
              available: roomDetail.available,
              amenities: roomDetail.amenities
            },
            totalDays,
            totalPrice
          },
          user: {
            handle: user.handle,
          }
        },
        { withCredentials: true }
      );
      // console.log(response.data);
      // alert(response.data);
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
      setAlertAction(null);
      setCheckIn("")
      setCheckOut("")
    } catch (error) {
      // console.log(error);
      // alert("Something went wrong during reservation.");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Something went wrong during reservation !");
      setAlertAction(null);
    }
  };

  const handleCheckout = async (event, checkIn, checkOut, totalPrice, totalDays, roomDetail) => {
    const API_URL = import.meta.env.VITE_API_URL;
    if(user.name==null){
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("User Not Present or User Been Deleted! ");
      // console.log(err);
      setAlertAction(null);
    }
    try {
      const { data } = await axios.post(`${API_URL}/payment/createOrder`, {
        amount: totalPrice * 100
      });

      const options = {
        key: "rzp_test_hKaLL2J3cQ84G1",
        amount: totalPrice * 100,
        currency: data.currency,
        name: "Book me hotel",
        description: "Room Booking Payment",
        order_id: data.orderId,
        handler: function (response) {
          // alert("Payment successful!");
          setShowAlert(true)
          setAlertType("success")
          setAlertMessage("Payment successfully transferred !");
          setAlertAction(null);
          handleReserve( checkIn, checkOut, totalPrice, totalDays, roomDetail);
          // window.location.reload();
          console.log(response);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        notes: {
          address: user.address
        },
        theme: {
          color: "#f97316"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      // console.error("Payment error", err);
      // alert("Payment failed");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Payment failed! "+ err);
      console.log(err);
      setAlertAction(null);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate - inDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays > 0 ? diffDays : 0);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    setTotalPrice(totalDays * price);
  }, [totalDays, price]);

  useEffect(() => {
    fetchRoom();
    setUser(JSON.parse(atob(sessionStorage.getItem("user"))));
  }, []);

  return (
    <>{showAlert &&
      <CustomAlert
        type={alertType}
        message={alertMessage}
        action={alertAction}
        onClose={() => {alertType==='success'? (window.location.reload(),setShowAlert(false)) :setShowAlert(false)}}
      />
    }
      <Navbar />
      <div className="bg-yellow-400 w-full min-h-screen pt-20 pb-10 flex flex-col justify-center items-center" style={{ paddingTop: "14vh" }}>
        <center>
          <h1 className="text-2xl font-bold uppercase" style={{ margin: "20px 0px" }}>Room Booking</h1>
        </center>

        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-md shadow-md overflow-hidden flex flex-col md:flex-row items-center justify-center ">
          {/* Left: Room Images */}
          <div className="md:w-1/2 w-[90%]" style={{ padding: "30px" }}>
            {roomDetail.handle &&
              JSON.parse(JSON.parse(roomDetail.images)).map((img, idx) => (
                <img
                  key={idx}
                  src={`data:image/jpeg;base64,${img}`}
                  alt={`room-${idx}`}
                  className="w-full object-cover h-64 md:h-full rounded-lg"
                />
              ))}
          </div>

          {/* Right: Details and Actions */}
          <div className="md:w-1/2 w-[90%] p-6 space-y-4 flex items-center" style={{ padding: "30px" }}>
            {roomDetail.handle ? (
              <div className="border-1 border-gray-400 w-full h-fit rounded-lg bg-gray-50 page-flip" style={{ padding: "50px 15px", boxShadow: "5px 3px 10px" }}>
                <div className="space-y-2">
                  <div className="flex justify-between" style={{ margin: "10px 0px" }}>
                    <p><strong>Room Number:</strong> {roomDetail.roomNumber}</p>
                    <p><strong>Room Type:</strong> {roomDetail.roomType}</p>
                    <p><strong>Capacity:</strong> {roomDetail.capacity}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="flex w-fit justify-between" style={{ margin: "10px 0px" }}>
                      <strong style={{ marginRight: "10px" }}>Available:</strong>
                      {flag ? (
                        <span className="bg-green-500 font-bold w-fit uppercase text-xs rounded-xl flex items-center px-3 py-1" style={{ padding: "3px 10px" }}>Available</span>
                      ) : (
                        <span className="bg-red-500 font-bold w-fit uppercase text-xs rounded-xl flex items-center px-3 py-1" style={{ padding: "3px 10px" }}>Unavailable</span>
                      )}
                    </p>
                    <p><strong>Price Per Night:</strong> ₹{price}</p>
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="flex justify-between items-end flex-wrap gap-2" style={{ margin: "10px 0px" }}>
                  <div className="flex flex-col min-w-60">
                    <label><strong>Check In Date:</strong></label>
                    <input type="date" onChange={(e) => setCheckIn(e.target.value)} className="border px-2 py-1 rounded-md" />
                  </div>
                  <div className="flex flex-col min-w-60">
                    <label><strong>Check Out Date:</strong></label>
                    <input type="date" onChange={(e) => setCheckOut(e.target.value)} className="border px-2 py-1 rounded-md" />
                  </div>
                  <div className="space-x-4 pt-2">
                    <button
                      onClick={(e) => handlecheckAvailability(e, checkIn, checkOut, totalPrice, totalDays, roomDetail)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      style={{ padding: "5px 10px" }}
                    >
                      Check Availability
                    </button>
                  </div>
                </div>

                {/* Summary & Reserve Button */}
                <div className="flex justify-between items-center pt-4" style={{ padding: "10px 0px" }}>
                  <p><strong>Total Days:</strong> {totalDays}</p>
                  <p><strong>Total Price:</strong> ₹{totalPrice}</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAlertType("warning");
                      setAlertMessage("Are you sure you want to reserve this room?");
                      setShowAlert(true);
                      setAlertAction(() => () => handleCheckout(e, checkIn, checkOut, totalPrice, totalDays, roomDetail))
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
                    style={{ padding: "10px 20px" }}
                  >
                    Reserve
                  </button>

                </div>
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomBooking;
