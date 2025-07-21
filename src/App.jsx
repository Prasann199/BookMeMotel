
import './App.css'
import { IoBeer } from "react-icons/io5";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import DashBoard from './assets/DashBoard/DashBoard';
import Login from './assets/Login/Login';
import Register from './assets/Register/Register';
import  AdminPage  from './assets/AdminPage/AdminPage';
import CustomerPage from './assets/CustomerPage/CustomerPage';
import AddRoom from './assets/AddRoom/AddRoom';
import AddFood from './assets/AddFood/AddFood';
import UpdateFood from './assets/UpdateFood/UpdateFood';
import ListFood from './assets/ListFood/ListFood';
import UpdateRoom from './assets/UpdateRoom/UpdateRoom';
import GetAllRooms from './assets/GetAllRooms/GetAllRooms';
import RoomBooking from './assets/RoomBooking/RoomBooking';
import ViewAllBookings from './assets/ViewAllBookings/ViewAllBookings';
import UpdateRoomBooking from './assets/UpdateRoomBooking/UpdateRoomBooking';
import Navbar from './assets/Navbar/Navbar';
import BillReciept from './assets/BillReciept/BillReciept';
import ChiefCounter from './assets/ChiefCounter/ChiefCounter';
import RoomBookingHistory from './assets/RoomBookingHistory/RoomBookingHistory';
import FoodIncomeChart from './assets/FoodIncomeCharts/FoodIncomeChart';
import RoomIncomeChart from './assets/RoomIncomeChart/RoomIncomeChart';
import CustomIncomeChart from './assets/CustomIncomeChart/CustomIncomeChart';
import VerifyOtp from './assets/VerifyOtp/VerifyOtp';
import ForgotPassword from './assets/ForgotPassword/ForgotPassword';
import ChangePassword from './assets/ChangePassword/ChangePassword';
import CustomAlert from './assets/CustomAlert/CustomAlert';
import AdminRegister from './assets/AdminRegister/AdminRegister';
function App() {
  

  return (
    <>
      
      <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/ListFood' element={<ListFood />}></Route>
        <Route path='/addFood' element={<AddFood />}></Route>
        <Route path='/updateFood' element={<UpdateFood />}></Route>
        <Route path='/' element={<DashBoard />}></Route>
        <Route path='/addRoom' element={<AddRoom />}></Route>
        <Route path='/updateRoom' element={<UpdateRoom />}></Route>
        <Route path='/getAllRooms' element={<GetAllRooms />}></Route>
        <Route path='/customer' element={<CustomerPage />}></Route>
        <Route path='/admin' element={<AdminPage/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path="/register/admin" element={<AdminRegister />}/>
        <Route path='/roomBooking' element={<RoomBooking />}></Route>
        <Route path='/viewBookings' element={<ViewAllBookings />}></Route>
        <Route path='/updateRoomBooking' element={<UpdateRoomBooking />}></Route>
        <Route path='/billReciept' element={<BillReciept />}></Route>
        <Route path='/chiefCounter' element={<ChiefCounter />}></Route>
        <Route path="/roomBookingHistory" element={<RoomBookingHistory />}></Route>
        <Route path='/foodIncomeChart' element={<FoodIncomeChart />}/>
        <Route path='/roomIncomeChart' element={<RoomIncomeChart />}/>
        <Route path='/customIncomeChart' element={<CustomIncomeChart />}/>
        <Route path='/verifyOtp/:email' element={<VerifyOtp />}/>
        <Route path='/forgotPassword' element={<ForgotPassword />}/>
        <Route path='/changePassword/:email' element={<ChangePassword />}/>
        <Route path='/alert' element={<CustomAlert />}/>
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
