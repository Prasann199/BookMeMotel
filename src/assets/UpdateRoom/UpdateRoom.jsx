import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const UpdateRoom = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const myProperty = params.get("myProperty");

  const formRef = useRef();
  const [room, setRoom] = useState({});
  const [oldImages, setOldImages] = useState([]); // images already saved in backend
  const [newImagesBase64, setNewImagesBase64] = useState([]); // new images added by user

  const [roomToBeUpdated, setRoomToBeUpdated] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(null);

  const amenitiesOptions = [
    "WiFi",
    "TV",
    "Air Conditioning",
    "Room Service",
    "Mini Bar",
    "Parking",
    "Pool",
    "Gym",
  ];


 

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(base64Images => {
        setNewImagesBase64(prev => [...prev, ...base64Images]);
      })
      .catch(error => console.error("Error reading files:", error));
  };

  const handleGetRoom = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/room/getRoomByNumber`, {
        roomNumber: myProperty
      });

      const roomData = response.data;
      const parsedImages = JSON.parse(JSON.parse(roomData.images || "[]"));
      setRoom({ ...roomData, amenities: roomData.amenities || [] });
      setOldImages(parsedImages);
    } catch (error) {
      // console.error(error);
      // alert("Failed to fetch room data!");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Failed to fetch room data!");
      setAlertAction(null);
    }
  };

  const handleRemoveOldImage = (idx) => {
    setOldImages(oldImages.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setNewImagesBase64(newImagesBase64.filter((_, i) => i !== idx));
  };

  const handleAmenitiesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setRoom(prev => ({ ...prev, amenities: selectedOptions }));
  };

  const handleUpdateRoom = async (e) => {
    const API_URL = import.meta.env.VITE_API_URL;
    // e.preventDefault();
    try {
      const updatedRoom = {
        ...room,
        images: JSON.stringify(JSON.stringify([...oldImages, ...newImagesBase64]))
      };

      const response = await axios.post(`${API_URL}/room/updateroom`, updatedRoom);
      if (response.data === "Room updated successfully!") {
        // alert("Room updated successfully!");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Room updated successfully!");
        setAlertAction(null);
      } else {
        // alert("Failed to update room!");
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Failed to update room!");
        setAlertAction(null);
      }
    } catch (error) {
      // console.error(error);
      // alert("Error updating room!");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error updating room!");
      setAlertAction(null);
    }
  };

  useEffect(() => {
    handleGetRoom();
  }, []);

  return (
    <>
      {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() => {setShowAlert(false),handleGetRoom()}}
        />
      }

      <Navbar />
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-screen flex items-center justify-center" style={{ padding: "14vh 10px 20px 10px" }}>
        <form ref={formRef} className="flex flex-col gap-4 w-xl max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg" style={{ padding: "10px" }}>
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Update Room</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Room Number</label>
              <input type="text" value={room.roomNumber || ""} readOnly className='border-1 w-full p-2 bg-gray-100' />
            </div>

            <div>
              <label>Room Type</label>
              <select readOnly value={room.roomType || ""} onChange={(e) => setRoom({ ...room, roomType: e.target.value })} className='border-1 w-full p-2 cursor-not-allowed'>
                <option className='capitalize' value={room.roomType}>{room.roomType}</option>

              </select>
            </div>

            <div>
              <label>Price Per Night</label>
              <input type="number" value={room.pricePerNight || ""} onChange={(e) => setRoom({ ...room, pricePerNight: e.target.value })} className='border-1 w-full p-2' />
            </div>

            <div>
              <label>Capacity</label>
              <input type="number" value={room.capacity || ""} onChange={(e) => setRoom({ ...room, capacity: e.target.value })} className='border-1 w-full p-2' />
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Amenities</label>
            <select
              multiple
              value={room.amenities || []}
              onChange={handleAmenitiesChange}
              className="border-1 w-full p-2 h-38"
            >
              {amenitiesOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Existing Images</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {oldImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={`data:image/*;base64,${img}`} alt={`old-${idx}`} width={100} className="border" />
                  <button type="button" onClick={() => handleRemoveOldImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs">X</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label>Add New Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className='border-1 w-full p-2' />
            <div className="flex flex-wrap gap-2 mt-2">
              {newImagesBase64.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={`data:image/*;base64,${img}`} alt={`new-${idx}`} width={100} className="border" />
                  <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs">X</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={room.available || false}
              onChange={(e) => setRoom({ ...room, available: e.target.checked })}
              className='border-2'
            />
            <label>Available</label>
          </div>

          <button type="submit" className='border-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded mt-4 font-semibold' style={{ padding: "3px 10px" }}
            onClick={(e) => {
              e.preventDefault();
              setAlertType("warning");
              setAlertMessage("Are you sure you want to update this room?");
              setShowAlert(true);
              setAlertAction(() => handleUpdateRoom);
            }}>
            Update Room
          </button>
        </form>
      </div>

    </>

  );
};

export default UpdateRoom;
