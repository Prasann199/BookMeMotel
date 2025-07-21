import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const UpdateFood = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const myProperty = params.get('myProperty');

  const [food, setFood] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [available, setAvailable] = useState(false);
  const [category, setCategory] = useState('');
  const [imageArray, setImageArray] = useState([]);
  const [imageBase64, setImageBase64] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertAction, setAlertAction] = useState(null);
    const [foodToBeUpdated, setFoodToBeUpdated] = useState("");

  useEffect(() => {
    handleGetFood();
  }, []);

  const handleGetFood = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/food/getFoodByHandle`, {
        handle: myProperty,
      });

      const data = response.data;
      setFood(data);
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setAvailable(data.available);
      setCategory(data.category || data.cateogry);

      if (data.image) {
        const parsedImages = JSON.parse(data.image);
        setImageArray(parsedImages);
      }
    } catch (error) {
      // console.log(error);
      // alert('Error fetching food data');
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage('Error fetching food data!');
      setAlertAction(false);
    }
  };

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
        setPreviewImages([...previewImages, ...fullBase64Array]);
        const onlyBase64 = fullBase64Array.map((img) => img.split(',')[1]);
        setImageBase64([...imageBase64, ...onlyBase64]);
      })
      .catch((error) => console.error('Error reading files:', error));
  };

  const handleRemoveExistingImage = (index) => {
    const updatedImages = [...imageArray];
    updatedImages.splice(index, 1);
    setImageArray(updatedImages);
  };

  const handleRemovePreviewImage = (index) => {
    const updatedPreview = [...previewImages];
    const updatedBase64 = [...imageBase64];
    updatedPreview.splice(index, 1);
    updatedBase64.splice(index, 1);
    setPreviewImages(updatedPreview);
    setImageBase64(updatedBase64);
  };

  const handleUpdate = async (event) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const combinedImages = [...imageArray, ...imageBase64];

    try {
      await axios.post(`${API_URL}/food/updatefood`, {
        handle: myProperty,
        name,
        description,
        price,
        available,
        category,
        image: JSON.stringify(combinedImages),
      });

      // alert('Food updated successfully');
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage('Food updated successfully!');
      setAlertAction(null);
      handleGetFood();
    } catch (error) {
      // console.log(error);
      // alert('Error updating food');
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage('Error updating food');
      setAlertAction(null);
    }
  };

  return (
    <>
    {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() => setShowAlert(false)}
        />
      }
    <Navbar />
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-blue-500 to-green-400 flex items-center justify-center py-10" style={{padding:"14vh 15px 0px 15px"}}>
      
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8" style={{padding:"20px",marginBottom:"30px"}}>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Update Food</h1>

        <form  className="space-y-5">
          <div>
            <label className="block text-lg font-medium mb-2">Existing Images:</label>
            <div className="flex flex-wrap gap-4">
              {imageArray.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={`data:image/jpeg;base64,${img}`} alt={`existing-${idx}`} className="w-24 h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">New Uploaded Images:</label>
            <div className="flex flex-wrap gap-4">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`preview-${idx}`} width={100} className=" border" />
                  <button
                    type="button"
                    onClick={() => handleRemovePreviewImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-1">Food Name:</label>
            <input
              type="text"
              value={name}
              readOnly
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-1">Price (₹):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-1">Category:</label>
            <select
              value={category}
              readOnly
              // onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 cursor-not-allowed"
            >
              <option value="">Select one</option>
              <option value="breakFast">Break Fast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-lg font-medium">Available:</label>
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-1">Upload New Images:</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="text-center pt-4">
            <button
              onClick={(e) => {
              e.preventDefault();
              setAlertType("warning");
              setAlertMessage("Are you sure you want to update this Food?");
              setShowAlert(true);
              setAlertAction(() => handleUpdate);
            }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 w-[100%]"
            >
              Update Food
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default UpdateFood;
