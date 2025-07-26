import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const GetAllRooms = () => {
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [roomTodeleted, setRoomDeleted] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(false);

  const handleUpdate = (room_number) => {
    // console.log(room_number);
    navigate("/updateRoom?myProperty=" + room_number);
  }

  const handleDelete = async (roomHandle) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {

      // console.log(roomHandle);
      const response = await axios.post(`${API_URL}/room/deleteRoom`, { handle: roomHandle }, { withCredentials: true });
      // console.log(response.data);
      if (response.data === "room deleted SuccessFully!") {
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Room Deleted successful!");
        setAlertAction(false);
        // alert("Deleted successfully!");
        handlefetchAllRooms(); // Refresh the list after deletion
      } else {
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Error deleting room!");
        setAlertAction(false);
        // alert("Error deleting!");
      }
    } catch (error) {
      // alert(error);
      // console.log(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error deleting room!", error);
      setAlertAction(false)
    }
  }

  const handlefetchAllRooms = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/room/getAllRooms`, { withCredentials: true });
      // console.log("All Rooms Response:", response.data);  // Log full response data
      setRooms(response.data);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }
  const handleBooking = (roomhandle) => {
    navigate("/roomBooking?myProperty=" + roomhandle)
  }
 
  useEffect(() => {
    // console.log("calling..")
    setUser(JSON.parse(atob(sessionStorage.getItem("user"))));
    handlefetchAllRooms();
    
  }, [])

  return (
    <>
      {showAlert &&
        <CustomAlert type={alertType} message={alertMessage} action={
          alertAction
            ? () => {
              handleDelete(roomTodeleted);
              setAlertAction(false);
            }
            : undefined
        } onClose={() => setShowAlert(false)} />
      }
      <Navbar />
      <div className=' flex flex-col items-center justify-center  w-full' style={{ paddingTop: "14vh" }}>
        <center><h2 className='text-3xl font-bold uppercase'>All Rooms</h2></center>
        <div
          className="min-w-fit max-w-full max-w-7xl  grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            padding: "5px",
            margin: "25px auto 0px auto"
          }}
        >          {rooms.map((room, idx) => {
          // console.log("Room Data:", room);  // Log the entire room data for debugging

          let imagesArray = [];
          let parsed = JSON.parse(room.images);
          if (room.images) {
            if (typeof room.images === "string") {
              try {
                imagesArray = JSON.parse(parsed);
              } catch (error) {
                // console.error("Error parsing images:", error);
                imagesArray = [];
              }
            } else if (Array.isArray(room.images)) {
              imagesArray = room.images;
            } else {
              // console.warn("Unexpected images format:", room.images);
              imagesArray = [];
            }
          } else {
            // console.warn("Images are missing for room:", room.roomNumber);
          }
          // console.log("Parsed Images Array:", imagesArray);

          return (
            <div
              key={idx}
              className="border rounded-md shadow-md p-4"
              style={{
                width: "32.5%",
                minWidth: "370px",
                maxWidth: "450px",
                marginBottom: "30px",
                border: "1px solid #ccc",
                padding: "0px 10px",
                paddingBottom: "10px"
              }}
            >                <div>

                {/* Images Section */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap", width: "100%", justifyContent: "center" }}>
                  {imagesArray.length > 0 ? (
                    imagesArray.map((img, index) => (
                      <img
                        key={index}
                        src={`data:image/jpeg;base64,${img}`}
                        alt={`Room ${room.roomNumber} Image ${index}`}
                        style={{ width: "370px", height: "250px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    ))
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
                <div className='flex justify-between'>
                  <label>Room Number: {room.roomNumber}</label><br />
                  <label>Room Type: {room.roomType}</label><br />
                </div>
                <label>Amenities: </label><br />
                <div className="flex flex-wrap gap-2 px-2 py-2 overflow-y-auto overflow-x-hidden whitespace-nowrap max-h-7 scrollbar-hide">
                  {room.amenities.map((amen, idx) => (
                    <div key={idx} className="inline-block">
                      <span className="inline-flex items-center border border-yellow-500 bg-yellow-100 text-xs font-semibold text-yellow-800 rounded-2xl px-3 py-1" style={{ padding: "3px 6px" }}>
                        {amen}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='flex justify-between'>
                  <label>Price Per Night: {room.pricePerNight}</label>
                  <label>Capacity: {room.capacity}</label>
                  <label>Available: {room.available ? "Yes" : "No"}</label>
                </div>


                {/* Buttons */}
                <div className={`flex ${user.role === "ADMIN" ? "justify-between" : "justify-end"}`} style={{ marginTop: "10px" }}>
                  {user.role === "ADMIN" ? <>
                    <button onClick={() => { handleUpdate(room.roomNumber) }} className='bg-green-500 text-white font-semibold text-sm p-6 rounded-md' style={{ padding: "5px 10px" }}>Update Room</button>
                    <button onClick={() => {
                      setAlertType("failed"),
                        setAlertMessage("Are you sure? you want to delete this Room?")
                      setShowAlert(true)
                      setRoomDeleted(room.handle);
                      setAlertAction(true)
                    }} className='bg-red-500 text-white font-semibold text-sm p-6 rounded-md' style={{ padding: "5px 10px" }} >Delete Room</button>
                    <button onClick={() => { handleBooking(room.handle) }} className='bg-orange-500 text-white font-semibold text-sm p-6 rounded-md' style={{ padding: "5px 10px" }} >Book Now</button>
                  </>
                    :
                    <button onClick={() => { handleBooking(room.handle) }} className='bg-orange-500 text-white font-semibold text-sm p-6 rounded-md' style={{ padding: "5px 10px" }} >Book Now</button>

                  }</div>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </>
  )
}

export default GetAllRooms;
