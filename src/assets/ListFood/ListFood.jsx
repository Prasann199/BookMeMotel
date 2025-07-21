import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const ListFood = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [items, setItems] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(false);
  const [foodToBeDeleted, setFoodToBeDeleted] = useState("");

  const handleUpdate = (foodHandle) => {
    navigate("/updateFood?myProperty=" + foodHandle);
  };

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
      // alert(response.data);
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage("food updated successfully!");
      setAlertAction(false);
    } catch (error) {
      // console.log(error);
      // alert("Error updating order");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error updating order");
      setAlertAction(false);
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
        // alert("Order already Present please update or wait to complete this order!")
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Order already Present please update or wait to complete this order!");
        setAlertAction(false);
      } else {
        // alert("Order Placed successfully! please pay to confirm!");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Order Placed successfully! please pay to confirm!");
        setAlertAction(false);
      }

      navigate("/billReciept");
    } catch (error) {
      console.log(error);
      // alert("Error during checkout");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error during checkout");
      setAlertAction(false);
    }
  };

  const handleDelete = async (foodHandle) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/food/deletefood`, { handle: foodHandle }, { withCredentials: true });
      if (response.data === "Food Deleted successFully!") {
        // alert("Deleted successfully!");
        setShowAlert(true)
        setAlertType("success")
        setAlertMessage("Food Deleted successfully!");
        setAlertAction(false);
        handlefetchAllFoods();
      } else {
        // alert("Error deleting food!");
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage("Error deleting food!");
        setAlertAction(false);
      }
    } catch (error) {
      // alert("Error deleting food!");
      // console.error(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error deleting food!");
      setAlertAction(false);
    }
  };

  const handlefetchAllFoods = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/food/getAllFoods`, { withCredentials: true });
      setFoods(response.data);
    } catch (error) {
      // alert("Error fetching foods!");
      // console.error(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error fetching foods!");
      setAlertAction(false);
    }
  };

  useEffect(() => {
    const storedRoom = sessionStorage.getItem("room");
    setUser(JSON.parse(atob(sessionStorage.getItem("user"))));
    handlefetchAllFoods();
    if (storedRoom) setRoomNumber(JSON.parse(atob(storedRoom)));
  }, []);

  return (
    <>
      {showAlert &&
        <CustomAlert type={alertType} message={alertMessage} action={
          alertAction
            ? () => {
              handleDelete(foodToBeDeleted);
              setAlertAction(false);
            }
            : undefined
        } onClose={() => {
          setShowAlert(false)
          window.location.reload()
        }
        } />
      }
      <Navbar />
      <div className="px-4 py-6" style={{ marginTop: "14vh" }}>
        <center>
          <div className='flex flex-wrap items-center justify-center gap-7 w-[93%]' style={{ margin: "25px 0px" }}>
            <h2 className="text-2xl font-bold mb-6 uppercase " style={{ marginTop: "5vh" }}>All Foods</h2>
            <div className='flex w-[75%] gap-5 justify-end'>
              <input
                type="text"
                placeholder='Enter room number'
                className='border border-gray-800 rounded-3xl min-w-30'
                style={{ padding: "5px 10px" }}
                onChange={(e) => setRoomNumber(e.target.value)}
                value={roomNumber}
              />
              <button
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition text-lg min-w-30"
                onClick={handleCheckOut}
              >
                Check Out
              </button>
            </div>
          </div>
        </center>

        <div
          className="grid gap-4 mt-8 max-w-7xl w-full justify-center "
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
            padding: "0px 10px",
            margin:"0px auto"
          }}
        >
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
  className="h-full border-[0.5px] gap-2 border-gray-300 rounded-xl shadow-md flex flex-col items-center p-4 cursor-pointer hover:shadow-lg transition w-full max-w-[390px]"
                style={{
                  maxWidth: "300px",
                  minWidth:"300px",
                  width: "auto"
                }}
                onClick={() => setSelectedFood({ ...food, images: imagesArray })}
              >
                <div className="w-full h-50 overflow-hidden rounded-xs mb-3">
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
                <div className="text-center w-full mb-4" style={{padding:"0px 10px"}}>
                  <div className=" flex justify-between gap-2  w-full mb-4">
                    <p ><span className="font-semibold">Name </span><span>{food.name}</span></p>
                    <p><span className="font-semibold">Category </span><span>{food.category}</span> </p>
                  </div>
                  <div className=" flex justify-between gap-2 w-full mb-4">
                    <p><span className="font-semibold">Price </span><span>₹{food.price}</span> </p>
                    <p><span className="font-semibold">Availability </span><span>{food.available ? "Available" : "Not Available"}</span> </p>
                  </div>
                </div>
                {user.role === "ADMIN" ?
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdate(food.handle); }}
                      className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition font-semibold"
                      style={{padding:"3px 0px"}}
                    >
                      Update Food
                    </button>
                    <button
                      onClick={(e) => {
                        setAlertType("failed"),
                          setAlertMessage("Are you sure? you want to delete this Food?")
                        setShowAlert(true)
                        setFoodToBeDeleted(food.handle);
                        setAlertAction(true)
                        e.stopPropagation()
                      }}
                      className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition font-semibold"
                      style={{padding:"3px 0px"}}
                    >
                      Delete Food
                    </button>
                  </div>
                  :
                  <>
                    <div className='flex justify-center w-full'>
                      <button className='w-fit bg-orange-500 rounded-md text-white font-semibold' style={{ padding: "3px 10px",marginBottom:"15px" }}>Order Now</button>
                    </div>
                  </>
                }
              </div>
            );
          })}
        </div>

        {selectedFood && (
          <div className=" fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 " onClick={() => setSelectedFood(null)} >
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative border-[0.5px] shadow-md border-gray-300 " onClick={(e) => e.stopPropagation()} style={{ padding: "15px" }}>
              <button onClick={() => setSelectedFood(null)} className="absolute top-0 right-1 text-4xl font-bold text-gray-800 " style={{ WebkitTextStroke: "0.7px white" }}>&times;</button>

              {selectedFood.images.length > 0 && (
                <img
                  src={`data:image/jpeg;base64,${selectedFood.images[0]}`}
                  alt="Selected"
                  className="w-full object-contain mb-4 rounded-md max-h-[50vh]"
                />
              )}
              <div className='flex justify-between' style={{ paddingTop: "15px" }}>
                <p className="mb-2"><strong>Name:</strong> {selectedFood.name}</p>
                <p className="mb-2"><strong>Price:</strong> ₹{selectedFood.price}</p>
                <p className="mb-2"><strong>Category:</strong> {selectedFood.category}</p>
              </div>
              <p className="mb-2" style={{ padding: "5px 0px" }}><strong>Description:</strong> {selectedFood.description}</p>

              <div className="flex items-center gap-3 mt-3 justify-between">
                <div >
                  <label>Quantity </label>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(+e.target.value)}
                    className="border px-3 py-1 w-20 border-gray-300 rounded-md"
                  />
                </div>
                <span>Total: ₹{quantity * selectedFood.price}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5" style={{ padding: "10px 0px" }}>
                <button
                  onClick={(e) => handleAddToCart(e, selectedFood.name, selectedFood, selectedFood.category, selectedFood.price, quantity)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition w-full font-semibold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full font-semibold"
                >
                  Continue
                </button>
                <button
                  onClick={handleCheckOut}
                  className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition w-full font-semibold"
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListFood;
