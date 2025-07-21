import axios from "axios";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import {
  MdDashboard, MdFoodBank, MdOutlineBedroomChild, MdHistory,
  MdOutlineFastfood, MdHouse, MdNoFood
} from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaMoneyBillTransfer ,FaMoneyBillTrendUp} from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { LuNotebookText } from "react-icons/lu";
import { BsHouseAdd } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import { BiHome } from "react-icons/bi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [userRooms, setUserRooms] = useState([]);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const handleLogOut = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      await axios.get(`${API_URL}/user/logout`, {
        withCredentials: true,
      });
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRooms = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      let userFromSession
      if(sessionStorage.getItem("user")){

        userFromSession = JSON.parse(atob(sessionStorage.getItem("user")));
      }

      const response = await axios.post(
        `${API_URL}/roomBooking/fetchRoomByUser`,
        { user: userFromSession },
        { withCredentials: true }
      );

      setUserRooms(response.data);

      const storedRoomEncoded = sessionStorage.getItem("room");
      const storedRoom = storedRoomEncoded ? JSON.parse(atob(storedRoomEncoded)) : null;

      if (response.data.length > 0) {
        let validRoom = storedRoom
          ? response.data.find(room => room.roomHandle.roomNumber === storedRoom)
          : null;

        if (storedRoom && validRoom) {
          setRoomNumber(storedRoom);
        } else {
          const firstRoomNumber = response.data[0].roomHandle.roomNumber;
          setRoomNumber(firstRoomNumber);
          sessionStorage.setItem("room", btoa(JSON.stringify(firstRoomNumber)));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(
        `${API_URL}/user/profile`,
        { withCredentials: true }
      );
      handleRooms();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const storedUserEncoded = sessionStorage.getItem("user");
    const storedRoomEncoded = sessionStorage.getItem("room");

    if (storedUserEncoded) {
      const parsedUser = JSON.parse(atob(storedUserEncoded));
      setUser(parsedUser);
      setUsername(parsedUser.name);
    }

    if (storedRoomEncoded) {
      setRoomNumber(JSON.parse(atob(storedRoomEncoded)));
    }

    getProfile();
  }, []);

  useEffect(() => {
    const storedRoomEncoded = sessionStorage.getItem("room");
    if (!storedRoomEncoded && userRooms.length > 0) {
      const firstRoomNumber = userRooms[0].roomHandle.roomNumber;
      setRoomNumber(firstRoomNumber);
      sessionStorage.setItem("room", btoa(JSON.stringify(firstRoomNumber)));
    }
  }, [userRooms]);

  const renderRightContent = () => {
    if (username && user.role === "ADMIN") {
      return (
        <div className="flex flex-col gap-3">
          <a href="/admin"><div className="flex items-center gap-4 cursor-pointer"><MdDashboard className="text-2xl" /><span>Dashboard</span></div></a>
          <a href="/addRoom"><div className="flex items-center gap-4 cursor-pointer"><BsHouseAdd className="text-2xl" /><span>Add Room </span></div></a>
          <a href="/addFood"><div className="flex items-center gap-4 cursor-pointer"><MdFoodBank className="text-2xl" /><span>Add Food </span></div></a>
          <a href="/getAllRooms"><div className="flex items-center gap-4 cursor-pointer"><MdOutlineBedroomChild className="text-2xl" /><span>Get All Rooms </span></div></a>
          <a href="/ListFood"><div className="flex items-center gap-4 cursor-pointer"><IoFastFoodOutline className="text-2xl" /><span>Food List </span></div></a>
          <a href="/viewBookings"><div className="flex items-center gap-4 cursor-pointer"><LuNotebookText className="text-2xl" /><span>Room Bookings </span></div></a>
          <a href="/roomBookingHistory"><div className="flex items-center gap-4 cursor-pointer"><MdHistory className="text-2xl" /><span>Booking History </span></div></a>
          <a href="/foodIncomeChart"><div className="flex items-center gap-4 cursor-pointer"><MdOutlineFastfood className="text-2xl" /><span>Food Income </span></div></a>
          <a href="/roomIncomeChart"><div className="flex items-center gap-4 cursor-pointer"><MdHouse className="text-2xl" /><span>Room Income </span></div></a>
          <a href="/customIncomeChart"><div className="flex items-center gap-4 cursor-pointer"><FaMoneyBillTrendUp className="text-2xl" /><span>Custom Income Charts</span></div></a>
          <a href="/chiefCounter"><div className="flex items-center gap-4 cursor-pointer"><MdNoFood className="text-2xl" /><span>Chief Counter </span></div></a>
          <a href="/billReciept"><div className="flex items-center gap-4 cursor-pointer"><FaMoneyBillTransfer className="text-2xl" /><span>Billing counter </span></div></a>
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogOut}><TbLogout className="text-2xl" /><span>Logout</span></div>
        </div>
      );
    } else if(username && user.role=="USER"){
      return (
        <div className="flex flex-col gap-3">
          <a href="/customer"><div className="flex items-center gap-4 cursor-pointer"><BiHome className="text-2xl" /><span>Home </span></div></a>
          <a href="/getAllRooms"><div className="flex items-center gap-4 cursor-pointer"><MdOutlineBedroomChild className="text-2xl" /><span>Get All Rooms </span></div></a>
          <a href="/ListFood"><div className="flex items-center gap-4 cursor-pointer"><IoFastFoodOutline className="text-2xl" /><span>Food List </span></div></a>
          <a href="/billReciept"><div className="flex items-center gap-4 cursor-pointer"><FaMoneyBillTransfer className="text-2xl" /><span>Billing counter </span></div></a>
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogOut}><TbLogout className="text-2xl" /><span>Logout</span></div>
        </div>  
      )
    }
    else {
      return (
        <div className="flex flex-col gap-4">
          <button className="px-4 py-2 bg-[#ff3147] rounded hover:bg-[#e5283b]" onClick={() => { navigate("/login") }}>Login</button>
          <button className="px-4 py-2 border border-white rounded hover:bg-white hover:text-[#0c1a35]" onClick={() => { navigate("/register") }}>
            Register
          </button>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <nav className="bg-[#0c1a35] text-white fixed top-0 w-full z-50 shadow-md flex justify-center" style={{padding:"0px 10px"}}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between h-[13vh] w-[98%]">
          <div className="text-2xl font-bold font-sans tracking-wide">
            Book<span className="text-[#ff3147] italic">Me</span>Hotel
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 justify-end w-fit">
              {userRooms && userRooms.length > 0 && (
                <div className="flex items-center gap-2 text-sm ">
                  <FcHome className="text-xl" />
                  <span>
                    <select
                      name="roomSelect"
                      id="roomSelect"
                      className="focus:outline-none text-black bg-white px-2 py-1 rounded w-fit"
                      value={roomNumber}
                      onChange={(e) => {
                        setRoomNumber(e.target.value);
                        sessionStorage.setItem("room", btoa(JSON.stringify(e.target.value)));
                      }}
                    >
                      <option value="">Current Room</option>
                      {userRooms.map((room, idx) => (
                        <option key={idx} value={room.roomHandle.roomNumber}>
                          Room No: {room.roomHandle.roomNumber}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              )}
              {username && (
                <div className="flex items-center gap-2 text-sm">
                  <FaUserCircle className="text-xl" />
                  <span>{username}</span>
                </div>
              )}
            </div>
            {username &&
            <div className="text-3xl cursor-pointer" onClick={toggleMenu}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
            }
            
          </div>
        </div>
      </nav>

      <div className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-[#1a2b4c] text-white transform ${menuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-40 p-6`}>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Menu</div>
          <FaTimes onClick={toggleMenu} className="text-2xl cursor-pointer" />
        </div>

        <div className="flex flex-col gap-5 " style={{ margin: "12vh 20px" }}>
          {renderRightContent()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
