import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import MyBarChart from '../MyBarChart/MyBarChart';
import MyLineChart from "../MyLineChart/MyLineChart";
import CustomShapeBarChart from "../CustomShapeBarChart/CustomShapeBarChart";
import CustomAlert from '../CustomAlert/CustomAlert';

const FoodIncomeChart = () => {

    const [foodIncome,setFoodIncome]=useState({})
    const [showAlert,setShowAlert]=useState(false);
    const [alertType,setAlertType]=useState("");
    const [alertMessage,setAlertMessage]=useState("");
    
        const handleFetchFoodIncome=async()=>{
          const API_URL = import.meta.env.VITE_API_URL;
            try{
                const response=await axios.get(`${API_URL}/food/foodIncome`)
                console.log(response.data);
                // alert(response.data);
                setFoodIncome(response.data);
            }catch(error){
                // console.log(error);
                // alert(error);
                setShowAlert(true)
                setAlertType("failed")
                setAlertMessage("Fetching Food Income Data Failed");
            }
        }
        
        useEffect(()=>{
            handleFetchFoodIncome();
            
        },[])

  return (
    <>
     {showAlert &&
  <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
  }
        <Navbar />
        <div className='px-4'>
            <div className='mt-10' style={{paddingTop:"14vh"}}>
                <h1 className='text-2xl font-bold text-center' style={{padding:"50px 0px"}}>Food Income Details</h1>
                  {/* Charts */}
                  <div className='w-full flex flex-col gap-8 mt-12 px-4'>
                    {/* Line Chart */}
                    <div>
                      <p className='text-xl sm:text-xl font-bold text-center mb-4'>Yearly Revenue Status</p>
                      <div className='w-full overflow-x-auto'>
                        <MyLineChart yearly={foodIncome?.lastThreeYearsTotalIncome} />
                      </div>
                    </div>
            
                    {/* Bar Chart */}
                    <div>
                      <p className='text-xl sm:text-xl font-bold text-center mb-4'>Monthly Revenue Status</p>
                      <div className='w-full overflow-x-auto'>
                        <MyBarChart monthly={foodIncome?.lastThreeMonthsTootalIncome}/>
                      </div>
                    </div>
            
                    {/* Custom Shape Bar Chart with Min Width */}
                    <div>
                      <p className='text-xl sm:text-xl font-bold text-center mb-4'>Daily Revenue Status</p>
                      <div className='w-full overflow-x-auto'>
                        <div style={{ minWidth: '700px' }}> {/* ✅ Helps fit long axis */}
                          <CustomShapeBarChart  daily={foodIncome?.lastSeveDaysTotalIncome}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
    </>
  )
}

export default FoodIncomeChart