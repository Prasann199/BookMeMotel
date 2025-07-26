import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const GetAllUsers = () => {
    const [users,setUsers]=useState([]);
    const [showAlert, setShowAlert] = useState(false);
        const [alertType, setAlertType] = useState("");
        const [alertMessage, setAlertMessage] = useState("");
        const [alertAction, setAlertAction] = useState(null);

    const handleFetchAllUsers=async()=>{
       const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response=await axios.get(`${API_URL}/user/getUsers`);
            console.log(response.data);
            setUsers(response.data)
        } catch (error) {
            console.log(error)
            setShowAlert(true)
          setAlertType("failed")
          setAlertMessage("Failed to fetch users!");
          setAlertAction(null);
        }
    }
    const handleUserDelete=async(user)=>{
        const API_URL = import.meta.env.VITE_API_URL;
        try {
            const response=await axios.post(`${API_URL}/user/deleteByHandle`,{handle:user.handle,email:user.email})
            console.log(response.data)
            if(response.data==="User Deleted Successfully!"){
                setShowAlert(true)
          setAlertType("success")
          setAlertMessage("User deleted successfully!");
          setAlertAction(null);
            }
        } catch (error) {
            console.log(error)
            setShowAlert(true)
          setAlertType("failed")
          setAlertMessage("Failed to Delete User!");
          setAlertAction(null);
        }
    }
   
    useEffect(()=>{
        handleFetchAllUsers();
        
    },[])
  return (
    <>
    {showAlert &&
        <CustomAlert
          type={alertType}
          message={alertMessage}
          action={alertAction}
          onClose={() => alertType==='success'?(setShowAlert(false),
         handleFetchAllUsers()):setShowAlert(false)}
        />
      }
    <Navbar />
    <div style={{paddingTop:"14vh"}}>
        <center><h1>Manage Users</h1></center>
        <div>
            <div className='overflow-x-auto'>
          <table className='table-auto w-full border-collapse border border-gray-200'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2' style={{padding:"5px"}}>Name</th>
                <th className='border p-2' style={{padding:"5px"}}>Email</th>
                <th className='border p-2' style={{padding:"5px"}}>Phone</th>
                <th className='border p-2' style={{padding:"5px"}}>Role</th>
                <th className='border p-2' style={{padding:"5px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,idx) => (
                <tr key={idx}>
                  <td className='border p-2' style={{padding:"5px"}}>{user.name}</td>
                  <td className='border p-2' style={{padding:"5px"}}>{user.email}</td>
                  <td className='border p-2' style={{padding:"5px"}}>{user.phone}</td>
                  <td className='border p-2'style={{padding:"5px"}} >{user.role}</td>
                  <td className='border ' style={{padding:"5px"}}><button onClick={(e)=>{setAlertType("warning");
                    setAlertMessage("Are you sure you want to Delete this user?");
                    setShowAlert(true);
                    setAlertAction(()=>()=>handleUserDelete(user))
                    }} className='w-full text-center p-1 bg-red-500 hover:bg-red-600 font-semibold text-white' style={{padding:"3px"}}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
    </div>
    </>
  )
}

export default GetAllUsers