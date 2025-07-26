import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CustomAlert from '../CustomAlert/CustomAlert';

const BillReciept = () => {

  const [bill, setBill] = useState({});
  const billRef = useRef(); // Ref for the content
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [billPaid, setBillPaid] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  const getOrderDetails = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const user = JSON.parse(atob(sessionStorage.getItem("user")));
      const response = await axios.post(`${API_URL}/foodOrder/getbill`, {
        handle: user.handle,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }, {
        withCredentials: true
      });
      // If it's a custom message and not a bill, exit early
      if (response.data.message === "There is no order on your name.") {
        setBill(null); // Set bill to null so nothing is rendered
        // console.log(response.data.message)
        setShowAlert(true)
        setAlertType("failed")
        setAlertMessage(response.data.message);

        return;
      } else {
        // If valid bill data is received
        setBill(response.data);
      }
      setBillPaid(response.data.status);
      setStatus(response.data.status)
      setHandle(response.data.handle)
      setName(response.data.userHandle.name);
      // console.log(response.data);

    } catch (error) {
      console.log(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage(error.response.data.message);
      // alert("Failed to fetch bill");
    }
  };
  const handleRemoveItem = async (handle) => {
    const user = JSON.parse(atob(sessionStorage.getItem("user")));
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/foodOrder/removeItem`, {
        user: user,
        orderItemHandle: handle
      }, { withCredentials: true })
      console.log(response);
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
    } catch (error) {
      console.log(error)
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error Removing Order.");
    }
  }
  const removeOrder = async () => {
    console.log("remove order called...")
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/foodOrder/removeOrder`, {
        userHandle: { name: name },
        handle: handle,
        status: "DELIVERED"
      }, { withCredentials: true })
      // console.log(response.data)
      // alert(response.data);
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
      setBill(null);
    } catch (error) {
      // console.log(error);
      // alert(error)
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Error Removing Order.");

    }
  }
  const handleupdateStatus = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${API_URL}/foodOrder/updateOrderStatus`, {
        userHandle: { name: name },
        status: "DELIVERED"
      }, { withCredentials: true })
      // console.log(response.data);
      // alert(response.data)
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);
      removeOrder();
    } catch (error) {
      // console.log(error);
      // alert(error)
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Failed updating status.");

    }
  }
  const handlePaymentDone = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const user = JSON.parse(atob(sessionStorage.getItem("user")));
      const response = await axios.post(`${API_URL}/foodOrder/paymentRecieved`, {
        user: {
          handle: user.handle,
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          role: user.role,
          address: user.address,
          createdAt: user.createdAt
        },
        orderRequest: {
          status: "PAID"
        },
      }, {
        withCredentials: true
      })
      // console.log(response.data);
      // alert(response.data);
      setShowAlert(true)
      setAlertType("success")
      setAlertMessage(response.data);

    } catch (error) {
      // console.log(error);
      // alert(error);
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Failed Payment.");

    }
  }

  useEffect(() => {
    getOrderDetails();

  }, []);


  const handleCheckout = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      // 1. Call backend to create Razorpay order
      const { data } = await axios.post(`${API_URL}/payment/createOrder`, {
        amount: bill.totalPrice * 100 // ₹500 in paise
      });

      // 2. Open Razorpay payment popup
      const options = {
        key: "rzp_test_hKaLL2J3cQ84G1", // Replace with your actual Razorpay key_id
        amount: bill.totalPrice,
        currency: data.currency,
        name: "Book me hotel ",
        description: "Food Order Payment",
        order_id: data.orderId,
        handler: function (response) {
          // alert("Payment successful!");
          setShowAlert(true)
          setAlertType("success")
          setAlertMessage("Payment transferred Successfully!");

          handlePaymentDone();
          // window.location.reload();
          // console.log(response);
          // You can now call backend to update the booking/payment status
        },
        prefill: {
          name: bill?.userHandle?.name,
          email: bill?.userHandle?.email,
          contact: bill?.userHandle?.phone
        },
        notes: {
          address: bill?.userHandle?.address
        },
        theme: {
          color: "#f97316"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      // console.error("Payment error", err);
      // alert("Payment failed");
      setShowAlert(true)
      setAlertType("failed")
      setAlertMessage("Payment failed!");

    }
  };


  const downloadPDF = () => {
    setIsGeneratingPDF(true); // Hide "Update" button
    setTimeout(() => {
      const input = billRef.current;
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a6');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("bill-receipt.pdf");
        setIsGeneratingPDF(false); // Show it back
      });
    }, 100); // Slight delay to allow re-render
  };


  return (
    <>
      {showAlert &&
        <CustomAlert type={alertType} message={alertMessage} onClose={() => { alertType === 'success' ? (setShowAlert(false), getOrderDetails()) : setShowAlert(false) }} />
      }
      <Navbar />
      <div className='w-full min-h-screen flex justify-center items-center' style={{ paddingTop: "15vh" }}>

        <div className='w-[75%] h-fit flex flex-col items-center ' >

          {(bill && Object.keys(bill).length > 0 && bill?.message !== "There is no order on your name.") ? (
            <>
              {/* Bill Popup model */}
              <div
                ref={billRef}
                className='w-full border-[#f3f4f6] border-1 relative  shadow-lg p-4 border-1 border-gray-300'
                style={{ padding: "15px", fontSize: "0.8rem" }}
              >
                <p>Name: {bill?.userHandle?.name}</p>
                <p>Phone Number: {bill?.userHandle?.phone}</p>
                <p>Room Number: {bill?.roomHandle?.roomNumber}</p>
                {/* <p>Handle: {bill.handle}</p> */}
                <p>Bill Ordered At: {bill.orderedAt}</p>
                <p>Status: {bill.status}</p>
                <hr style={{ margin: "5px 0px" }} />

                {bill.orderItems?.map((orderItem, idx) => (
                  <div key={idx}>
                    {!isGeneratingPDF &&
                      <div className='w-full flex justify-end cursor-pointer' style={{ marginRight: "30px" }}><p className='text-xl text-red-500 font-semibold w-fit ' onClick={() => handleRemoveItem(orderItem.handle)}>&times;</p></div>
                    }
                    <ul className='flex w-full justify-between items-center h-fit flex-wrap gap-1'>
                      <div className='w-fit min-w-35 flex flex-col justify-center items-start  '>
                        <li>Order Handle: {orderItem.handle}</li>
                        <li>Food Name: {orderItem.foodHandle.name}</li>
                        <li>Category: {orderItem.foodHandle.category}</li>
                        <li>
                          Order Price: {orderItem.foodHandle.price} × {orderItem.quantity} = {orderItem.price}
                        </li>
                      </div>

                      <div className='w-fit min-w-35 flex justify-end pr-10 ' style={{marginRight:"50px"}}>
                        {orderItem?.foodHandle?.image ? (
                          <img
                            src={`data:image/jpeg;base64,${JSON.parse(orderItem.foodHandle.image)[0]}`}
                            alt={`food ${orderItem.foodHandle.name}`}
                            className='w-[200px] h-auto object-contain'
                          />
                        ) : (
                          <p className='text-gray-400'>No image available</p>
                        )}
                      </div>
                    </ul>
                    <hr style={{ margin: "10px 0px", borderTop: "1px dotted #000" }} />
                  </div>
                ))}

                <hr style={{ margin: "5px 0px" }} />
                <div className='flex justify-between items-center' style={{ margin: "10px 0px" }}>
                  <p className='w-[60%]'>Total Price: ₹{bill.totalPrice}</p>
                  {!isGeneratingPDF && billPaid !== "PAID" && billPaid !== "SENT" && (
                    <div className='w-[40%] flex justify-between flex-wrap gap-1'>
                      <button
                        className='bg-[#25b130] text-white font-semibold min-w-20 rounded-md px-4 py-1'
                        onClick={handleCheckout}
                        style={{ padding: "0.3rem 1rem" }}
                      >
                        Pay
                      </button>
                      <button
                        className='bg-[#f97316] text-white font-semibold min-w-20 rounded-md px-4 py-1'
                        onClick={() => navigate('/ListFood')}
                        style={{ padding: "0.3rem 1rem" }}
                      >
                        Update
                      </button>
                    </div>
                  )}
                  {status === 'SENT' && (
                    <div className='w-[30%] flex justify-between'>
                      <button
                        className='bg-blue-600 text-white font-semibold min-w-20 rounded-md px-4 py-1'
                        onClick={handleupdateStatus}
                        style={{ padding: "0.3rem 1rem" }}
                      >
                        Delivered
                      </button>
                    </div>
                  )}
                </div>
                <hr />
              </div>

              {/* Download Button */}
              <button
                onClick={downloadPDF}
                className='bg-green-600 text-white font-semibold px-4 py-2 rounded-md my-4 hover:bg-green-700'
                style={{ padding: "0.5rem 1rem", marginTop: "1.5rem" }}
              >
                Download Bill as PDF
              </button>
            </>
          ) : (
            <></> // Render nothing if bill is invalid or empty
          )}
        </div>
      </div>
    </>
  );
};

export default BillReciept;
