import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert/CustomAlert';

const CustomerPage = () => {
  const [user, setUser] = useState("");
  const [top7Rooms, setTop7Rooms] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [items, setItems] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [active, setActive] = useState("customer Page");

  useEffect(() => {
      if (!sessionStorage.getItem("customerPageReloaded")) {
        sessionStorage.setItem("customerPageReloaded", "true");
        window.location.reload();
      }
    }, []);

  const handleUpdateOrder = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const user = JSON.parse(atob(sessionStorage.getItem("user")));
      const response = await axios.post(`${API_URL}/foodOrder/updateOrderByHandle`, {
        orderRequest: {
          roomNumber: roomNumber,
          orderItems: items,
        },
        user: user
      }, { withCredentials: true });
      alert(response.data);
    } catch (error) {
      console.log(error);
      alert("Error updating order");
    }
  };

  const handleAddToCart = (e, food_name, food_handle, foodCategory, foodPrice, foodQuantity) => {
    e.preventDefault();
    const item = {
      name: food_name,
      foodHandle: { handle: food_handle.handle },
      category: foodCategory,
      price: foodPrice,
      quantity: foodQuantity
    };
    const updatedItems = [...items, item];
    setItems(updatedItems);
    console.log(updatedItems);
    setQuantity(0);
  };

  const handleCheckOut = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const user = JSON.parse(atob(sessionStorage.getItem("user")));
      const response = await axios.post(`${API_URL}/foodOrder/place`, {
        orderRequest: {
          roomNumber: roomNumber,
          orderItems: items,
        },
        user: user
      }, { withCredentials: true });
      if (response.data === null) {
        alert("Order already Present please update or wait to complete this order!")
      } else {
        alert("Order Placed successfully! please pay to confirm!");
      }

      navigate("/billReciept");
    } catch (error) {
      console.log(error);
      alert("Error during checkout");
    }
  };



  const navigate = useNavigate();
  const handleBooking = (roomhandle) => {
    navigate("/roomBooking?myProperty=" + roomhandle)
  }



  const fetchTop7Rooms = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/room/getTopRooms`,);
      // console.log(response.data);
      // alert(response.data);
      setTop7Rooms(response.data);
    } catch (error) {
      // console.log(error);
      // alert(error);
      setShowAlert(true);
      setAlertMessage(error);
      setAlertType("failed")
    }
  }
  const fetchTop7Foods = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/food/topFoods`,);
      // console.log(response.data);
      // alert(response.data)
      setFoods(response.data);
    } catch (error) {
      setShowAlert(true);
      setAlertMessage(error);
      setAlertType("failed")
      // console.log(error);
      // alert(error);
    }
  }
  useEffect(() => {
    setUser(JSON.parse(atob(sessionStorage.getItem("user"))));
    fetchTop7Rooms();
    fetchTop7Foods();
  }, [])
  return (
    <div>
      {showAlert &&
      <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
      }
      <Navbar />
      <div className='' style={{ paddingTop: "14vh" }}>
        <center><h1 className='text-2xl font-bold'>Welcome Back! <span className='text-orange-500 '>{user.name}</span></h1></center>

        <div style={{ marginTop: "40px", padding: "10px 20px" }}>
          <h1 className='text-xl font-bold'>Top Rooms</h1>
        </div>
        <div className="w-full flex gap-5 overflow-x-auto" style={{ marginTop: "10px", padding: "0px 15px", scrollbarWidth: 'none' }}>
          {top7Rooms.map((room, idx) => {
            console.log("Room Data:", room);  // Log the entire room data for debugging

            let imagesArray = [];
            let parsed = JSON.parse(room.images);
            if (room.images) {
              if (typeof room.images === "string") {
                try {
                  imagesArray = JSON.parse(parsed);
                } catch (error) {
                  console.error("Error parsing images:", error);
                  imagesArray = [];
                }
              } else if (Array.isArray(room.images)) {
                imagesArray = room.images;
              } else {
                console.warn("Unexpected images format:", room.images);
                imagesArray = [];
              }
            } else {
              console.warn("Images are missing for room:", room.roomNumber);
            }
            console.log("Parsed Images Array:", imagesArray);

            return (
              <div
                key={idx}
                className="border rounded-md shadow-md p-4"
                style={{
                  width: "32.5%",
                  minWidth: "350px",
                  maxWidth: "370px",
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
                  <div className='flex justify-end' style={{ marginTop: "10px" }}>
                    <button onClick={() => { handleBooking(room.handle) }} className='bg-orange-500 text-white font-semibold text-sm p-6 rounded-md' style={{ padding: "5px 10px" }} >Book Now</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: "40px", padding: "5px 20px" }}>
          <h1 className='text-xl font-bold'>Top Foods</h1>
        </div>
        <div className='flex gap-5 overflow-x-auto' style={{ padding: "0px 15px", scrollbarWidth: "none" }}>
          {foods.map((food, idx) => {
            let imagesArray = [];
            if (food.image) {
              try {
                const parsed = JSON.parse(food.image);
                if (Array.isArray(parsed)) imagesArray = parsed;
              } catch (error) {
                console.error("Error parsing image:", food.image, error);
              }
            }
            const firstImage = imagesArray.length > 0 ? imagesArray[0] : null;

            return (
              <div
                key={idx}
                className="border-[0.5px] border-gray-300 rounded-xl shadow-md flex gap-2 flex-col items-center p-4 cursor-pointer hover:shadow-lg transition w-[90%] sm:w-[47%] md:w-[31%] lg:w-[22%] xl:w-[20%] max-w-xs min-w-85"
                style={{ padding: "10px", margin: "20px 0px" }}
                onClick={() => setSelectedFood({ ...food, images: imagesArray })}
              >
                <div className="w-full h-48 overflow-hidden rounded-xs mb-3">
                  {firstImage ? (
                    <img
                      src={`data:image/jpeg;base64,${firstImage}`}
                      alt={`food ${food.name}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-center text-gray-500">No image available</p>
                  )}
                </div>
                <div className=" flex justify-between gap-2  w-full mb-4">
                  <p ><span className="font-semibold">Name </span><span>{food.name}</span></p>
                  <p><span className="font-semibold">Category </span><span>{food.category}</span> </p>
                </div>
                <div className=" flex justify-between gap-2 w-full mb-4">
                  <p><span className="font-semibold">Price </span><span>₹{food.price}</span> </p>
                  <p><span className="font-semibold">Availability </span><span>{food.available ? "Available" : "Not Available"}</span> </p>
                </div>
                <div className='flex justify-center w-full'>
                  <button className='w-fit bg-orange-500 rounded-md text-white font-semibold' style={{ padding: "3px 10px" }}>Order Now</button>
                </div>
                {/* <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFoodUpdate(food.handle); }}
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-semibold"
                    style={{padding:"3px"}}
                  >
                    Update Food
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFoodDelete(food.handle); }}
                    className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold"
                    style={{padding:"3px"}}
                  >
                    Delete Food
                  </button>
                </div> */}
              </div>
            );
          })}
        </div>
        {selectedFood && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 " onClick={() => setSelectedFood(null)}>
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative border-[0.5px] shadow-md border-gray-400" onClick={(e) => e.stopPropagation()} style={{ padding: "15px" }}>
              <button onClick={() => setSelectedFood(null)} className="absolute top-0 right-1 text-4xl font-bold text-gray-800 " style={{ WebkitTextStroke: "0.7px white" }}>&times;</button>

              {selectedFood.images.length > 0 && (
                <img
                  src={`data:image/jpeg;base64,${selectedFood.images[0]}`}
                  alt="Selected"
                  className="w-full object-contain mb-4 rounded-md"
                />
              )}
              <div className='flex justify-between' style={{ paddingTop: "10px" }}>
                <p className="mb-2"><strong>Name:</strong> {selectedFood.name}</p>
                <p className="mb-2"><strong>Price:</strong> ₹{selectedFood.price}</p>
                <p className="mb-2"><strong>Category:</strong> {selectedFood.category}</p>
              </div>
              <p className="mb-2"><strong>Description:</strong> {selectedFood.description}</p>

              <div className="flex items-center gap-3 mt-3 justify-between" style={{ padding: "5px 0px" }}>
                <div>
                  <label>Quantity </label>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(+e.target.value)}
                    className="border px-3 py-1 w-20 border-gray-300 rounded-md"
                    style={{ padding: "0px 5px" }}
                  />
                </div>
                <span style={{ marginRight: "20px" }}>Total: ₹{quantity * selectedFood.price}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={(e) => handleAddToCart(e, selectedFood.name, selectedFood, selectedFood.category, selectedFood.price, quantity)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition w-full font-semibold"
                  style={{ padding: "3px" }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full font-semibold"
                  style={{ padding: "3px" }}
                >
                  Continue
                </button>
                <button
                  onClick={handleCheckOut}
                  className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition w-full font-semibold"
                  style={{ padding: "3px" }}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPage