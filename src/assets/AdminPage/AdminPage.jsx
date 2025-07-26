import React, { useEffect, useState } from 'react';
import AddRoom from '../AddRoom/AddRoom';
import UpdateRoom from '../UpdateRoom/UpdateRoom';
import GetAllRooms from '../GetAllRooms/GetAllRooms';
import AddFood from '../AddFood/AddFood';
import UpdateFood from '../UpdateFood/UpdateFood';
import ListFood from '../ListFood/ListFood';
import RoomBooking from '../RoomBooking/RoomBooking';
import ViewAllBookings from '../ViewAllBookings/ViewAllBookings';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyBarChart from '../MyBarChart/MyBarChart';
import MyLineChart from "../MyLineChart/MyLineChart";
import CustomShapeBarChart from "../CustomShapeBarChart/CustomShapeBarChart";

export const AdminPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Admin Page");
  const [dashboard, setDashboard] = useState({});

  axios.defaults.withCredentials = true;

  // ✅ Added this to reload page once
  useEffect(() => {
    if (!sessionStorage.getItem("adminPageReloaded")) {
      sessionStorage.setItem("adminPageReloaded", "true");
      window.location.reload();
    }
  }, []);
  const defaultPage = () => (
    <div className='flex flex-wrap justify-center gap-4 mt-24 px-4' style={{ marginTop: "20px" }}>
      <button className='bg-orange-400 text-white rounded-md font-semibold px-5 py-2' onClick={() => setActive("Add Room")} style={{ padding: "5px 30px" }}>Add Room</button>
      <button className='bg-green-400 text-white rounded-md font-semibold px-5 py-2' onClick={() => setActive("Get All Rooms")} style={{ padding: "5px 20px" }}>Get All Rooms</button>
      <button className='bg-blue-400 text-white rounded-md font-semibold px-5 py-2' onClick={() => setActive("Add Food")} style={{ padding: "5px 20px" }}>Add Food</button>
      <button className='bg-black text-white rounded-md font-semibold px-5 py-2' onClick={() => setActive("List Food")} style={{ padding: "5px 20px" }}>Food List</button>
      <button className='bg-red-400 text-white rounded-md font-semibold px-5 py-2' onClick={() => setActive("RoomBookings")} style={{ padding: "5px 20px" }}>Room Bookings</button>
    </div>
  );

  const fetchDashBoradDetails = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.get(`${API_URL}/dashboard/getDashBoard`, { withCredentials: true });
      setDashboard(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      // alert(error);
    }
  };

  useEffect(() => {
    fetchDashBoradDetails();
  }, []);

  const handleSwitch = () => {
    switch (active) {
      case "Add Room": return navigate("/addRoom");
      case "Update Room": return navigate("/updateRoom");
      case "Get All Rooms": return navigate("/getAllRooms");
      case "Add Food": return navigate("/addFood");
      case "Update Food": return navigate("/updateFood");
      case "List Food": return navigate("/ListFood");
      case "RoomBookings": return navigate("/viewBookings");
      default: return defaultPage();
    }
  };

  return (
    <>
      <Navbar />

      <div className='relative min-h-screen bg-gray-50 ' style={{ paddingTop: "14vh" }}> {/* ✅ Avoids overlap with fixed navbar */}
        <div className='px-4' >
          <h1 className='text-3xl font-bold text-center ' style={{ margin: "3vh 0px" }}>Dashboard</h1>

          <div style={{ margin: "3vh 0px" }}>
            {handleSwitch()}
          </div>
          <div className='mt-1' >
            {/* <h2 className='text-2xl font-bold text-center mb-6' style={{margin:"20px"}}>Dashboard</h2> */}

            {/* Dashboard Stats */}
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl mx-auto' >
              {[
                { label: 'Total Users', value: dashboard.totalUsers >= 10000 ? `${(dashboard.totalUsers / 1000).toFixed(1)}k` : dashboard.totalUsers },
                { label: 'Total Income', value: dashboard.totalIncome },
                { label: 'Active Bookings', value: dashboard.activeBookings >= 10000 ? `${(dashboard.activeBookings / 1000).toFixed(1)}k` : dashboard.activeBookings },
                { label: 'Total Bookings', value: dashboard.totalBookings >= 10000 ? `${(dashboard.totalBookings / 1000).toFixed(1)}k` : dashboard.totalBookings },
                { label: 'Available Rooms', value: dashboard.totalAvailableRooms >= 10000 ? `${(dashboard.totalAvailableRooms / 1000).toFixed(1)}k` : dashboard.totalAvailableRooms },
                { label: 'Food Income', value: dashboard.totalFoodIncome },
                { label: 'Rooms Income', value: dashboard.totalRoomIncome },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[120px] p-3 hover:shadow-md transition duration-300 ease-in-out"
                  onClick={() => {
                    if (item.label === 'Total Users') {
                      navigate('/getAllUsers');
                    }
                  }}
                >
                  <h2 className="text-2xl font-bold text-[#0c1a35] mb-1">{(item.label === "Total Income" || item.label === "Food Income" || item.label === "Rooms Income") && item.value > 10000 ? `₹${(item.value / 1000).toFixed(1)}k` : item.value}</h2>
                  <p className="text-sm font-medium text-gray-600 text-center">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className='w-full flex flex-col gap-8 mt-12 px-4'>
              {/* Line Chart */}
              <div>
                <p className='text-xl sm:text-2xl font-bold text-center mb-4'>Yearly Revenue Status</p>
                <div className='w-full overflow-x-auto'>
                  <MyLineChart yearly={dashboard.lastThreeYearsTotalIncome} />
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <p className='text-xl sm:text-2xl font-bold text-center mb-4'>Monthly Revenue Status</p>
                <div className='w-full overflow-x-auto'>
                  <MyBarChart monthly={dashboard.lastThreeMonthsTootalIncome} />
                </div>
              </div>

              {/* Custom Shape Bar Chart with Min Width */}
              <div>
                <p className='text-xl sm:text-xl font-bold text-center mb-4'>Daily Revenue Status</p>
                <div className='w-full overflow-x-auto'>
                  <div style={{ minWidth: '700px' }}> {/* ✅ Helps fit long axis */}
                    <CustomShapeBarChart daily={dashboard.lastSeveDaysTotalIncome} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default AdminPage;
