import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const AddFood = () => {
  const formRef = useRef();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(true);
  const [category, setCategory] = useState('');
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
        reader.onloadend = () => {
          resolve(reader.result);
        };
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

  const handleAddFood = async (event) => {
    const API_URL = import.meta.env.VITE_API_URL;
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/food/addfood`, {
        name:name,
        category:category,
        price:price,
        description:description,
        image: JSON.stringify(imageBase64),
        available:available,
      },{withCredentials:true});
      if (response.data === 'food added successfully!') {
        // alert('Food added successfully!');
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage('Food added successfully!');
        // Reset all form fields
      setName('');
      setDescription('');
      setPrice(0);
      setAvailable(true);
      setCategory('');
      setImageBase64([]);
      setPreviewImages([]);

      // Optionally clear the file input manually if needed
      formRef.current.reset();
        setPreviewImages([]);
      }else if(response.data === "food already present with the same name!"){
        // alert("food already present with the same name!");
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("food already present with the same name!");
        setName('');
      setDescription('');
      setPrice(0);
      setAvailable(true);
      setCategory('');
      setImageBase64([]);
      setPreviewImages([]);
      } else {
        // alert('Error in adding food!');
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage('Error in adding food!');
      }
    } catch (error) {
      // console.log(error);
      // alert(error);
      setShowAlert(true)
        setAlertType("failed")
        setAlertMessage('Error in adding food!',error);
    }
  };

 
  return (
    <>
    {showAlert &&
              <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
              }
    <Navbar />
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 min-h-screen flex items-center justify-center h-[100%]" style={{padding:"14vh 15px 15px 15px"}}>
      <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-xl transform transition-all duration-500 " style={{padding:"15px"}}>
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Add Food</h1>
        <form ref={formRef} className="space-y-6" onSubmit={handleAddFood}>
          {/* Food Name Field */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Food Name</label>
            <input
              type="text"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter food name"
              required
              style={{padding:"0px 5px"}}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              maxLength={120}
              placeholder="Enter food description"
              required
              style={{padding:"0px 5px"}}
            ></textarea>
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
              required
              style={{padding:"0px 5px"}}
            />
          </div>

          {/* Available Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 text-blue-500"
            />
            <label className="text-gray-700">Available</label>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose Category</option>
              <option value="breakFast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {previewImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`preview-${idx}`}
                  width={120}
                  className=" object-cover rounded-lg border-2 border-gray-300"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-4 rounded-lg hover:from-pink-700 hover:to-red-700 transition duration-300 font-semibold"
            style={{padding:"3px"}}
          >
            Add Food
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddFood;
