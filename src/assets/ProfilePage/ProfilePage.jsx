import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import CustomAlert from '../CustomAlert/CustomAlert';

const ProfilePage = () => {
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/user/updateUser`, {
        handle: user.handle,
        name: name,
        phone: phone,
        email: email,
        address: address
      })
      // console.log(response.data)
      
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
      setAlertAction(null);
    } catch (error) {
      console.log(error)
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Updating profile failed! ",error);
      setAlertAction(null);
    }
  }

  const fetchUser = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const storedUserEncoded = sessionStorage.getItem("user");
    let userObj;
    if (storedUserEncoded) {
      const decodedUser = atob(storedUserEncoded);
      userObj = JSON.parse(decodedUser);
      setUser(userObj);
    }
    try {
      const response = await axios.post(`${API_URL}/user/getUser`, {
        handle: userObj.handle
      });
      // console.log(response.data)
      setName(response.data.name)
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setAddress(response.data.address);
      setRole(response.data.role);

    } catch (error) {
      console.log(error)
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("User data fetching Failed! ",error);
      setAlertAction(null);
    }
  }
  useEffect(() => {
    fetchUser()
  }, []);

  return (
    <>{showAlert &&
      <CustomAlert
        type={alertType}
        message={alertMessage}
        action={alertAction}
        onClose={() => alertType === 'success' ? (setShowAlert(false),
          fetchUser()) : setShowAlert(false)}
      />
    }
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-[14vh] px-4" style={{ padding: "15vh 10px 10vh 10px" }}>
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border-1 border-gray-200 " style={{ padding: "20px" }}>
          <h1 className="text-2xl font-bold text-center mb-6" style={{ marginBottom: "30px" }}>Profile</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[1rem]">
            <div>
              <p className="font-semibold">Name</p>
              <input className="bg-gray-100 rounded-md p-2 w-full" maxLength={50} value={name} style={{ padding: "5px" }} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <input type='text' className="bg-gray-100 rounded-md p-2 w-full" maxLength={50} value={email} style={{ padding: "5px" }} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <p className="font-semibold">Phone</p>
              <input type="text" className="bg-gray-100 rounded-md p-2 w-full" maxLength={10} value={phone} style={{ padding: "5px" }} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <p className="font-semibold">Role</p>
              <div className="bg-gray-100 rounded-md p-2" style={{ padding: "5px" }} >{role}</div>
            </div>
            <div className="sm:col-span-2">
              <p className="font-semibold">Address</p>
              <textarea className="bg-gray-100 rounded-md p-2 w-full max-h-20" value={address} style={{ padding: "5px" }} onChange={(e) => setAddress(e.target.value)}></textarea>
            </div>
          </div>
          <div className='w-full flex justify-center' style={{ marginTop: "10px" }}>
            <button className='w-fit bg-green-500 rounded-md font-semibold text-white uppercase hover:bg-green-600' style={{ padding: "3px 20px" }} onClick={handleUpdate}>Save</button>
          </div>
          <div className="text-center mt-6" style={{ marginTop: "10px" }}>
            <p className="text-gray-600">
              Want to delete your account?{' '}
              <a
                href="/deleteAccount"
                className="text-red-500 hover:underline font-medium"
              >
                Delete
              </a>
            </p>
            <p><a href={`/changePassword/${email}`} className='text-blue-700'>Change Password</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
