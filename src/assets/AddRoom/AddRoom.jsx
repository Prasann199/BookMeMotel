import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const AddRoom = () => {
  const formRef = useRef();
  const [roomNumber, setRoomNumber] = useState('');
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [imageBase64, setImageBase64] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showAlert,setShowAlert]=useState(false);
  const [alertType,setAlertType]=useState("");
  const [alertMessage,setAlertMessage]=useState("");

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((fullBase64Array) => {
        setPreviewImages(fullBase64Array);
        const onlyBase64Array = fullBase64Array.map((img) => img.split(',')[1]);
        setImageBase64(onlyBase64Array);
      })
      .catch((error) => console.error('Error reading files:', error));
  };

  const handleAmenitiesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setAmenities(selected);
  };

  const handleAddRoom = async (event) => {
    const API_URL = import.meta.env.VITE_API_URL;
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/room/addroom`, {
        roomNumber,
        roomType,
        pricePerNight: price,
        available,
        capacity,
        amenities,
        images: JSON.stringify(imageBase64),
      });

      if (response.data === 'room added successfully!') {
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage('Room added successfully!');
        
        formRef.current.reset();
        setPreviewImages([]);
        setAmenities([]);
        setRoomNumber('');
        setPrice(0);
        setRoomType('');
        setCapacity(1);
        setAvailable(true);
      }else if(response.data === "Room Already Exist with the same RoomNumber!"){
        // alert("Room Already Exist with the same RoomNumber!");
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage('Room Already Exist with the same RoomNumber!');
      } else {
        // alert('Error in adding room!');
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage('Error in adding room!');
      }
    } catch (error) {
      console.log(error);
      // alert('Error: ' + error.message);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage('Error in adding room! ',error);
    }
  };


  

  return (
    <>
     {showAlert &&
          <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
          }
      <Navbar />
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-screen  px-4 flex items-center justify-center" style={{padding:"15px", paddingTop:"14vh"}}>
        <div className="bg-white w-full max-w-4xl p-6 sm:p-10 rounded-xl shadow-xl" style={{padding:"15px"}}>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Add Room</h1>
          <form ref={formRef} onSubmit={handleAddRoom} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded"
                placeholder="Enter room number"
                required
                maxLength={10}
                style={{padding:"0px 5px"}}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Price Per Night</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded"
                placeholder="Enter price"
                required
                style={{padding:"0px 5px"}}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded"
                required
              >
                <option value="">Select type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded"
                placeholder="Number of people"
                required
                style={{padding:"0px 5px"}}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Amenities</label>
              <select
                multiple
                value={amenities}
                onChange={handleAmenitiesChange}
                required
                className="w-full border border-gray-300 p-3 rounded h-32"
              >
                <option value="WiFi">WiFi</option>
                <option value="TV">TV</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Room Service">Room Service</option>
                <option value="Mini Bar">Mini Bar</option>
                <option value="Parking">Parking</option>
                <option value="Pool">Pool</option>
                <option value="Gym">Gym</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-gray-700 font-medium">Available</label>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                required
                onChange={handleImageUpload}
                className="w-full border border-gray-300 p-3 rounded"
              />
              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {previewImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`preview-${idx}`}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition font-semibold" style={{padding:"3px"}}
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoom;
