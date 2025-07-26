import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import MyBarChart from '../MyBarChart/MyBarChart';
import MyLineChart from "../MyLineChart/MyLineChart";
import CustomShapeBarChart from "../CustomShapeBarChart/CustomShapeBarChart";
import CustomAlert from '../CustomAlert/CustomAlert';

const CustomIncomeChart = () => {
    const [type, setType] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [startMonth, setstartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [startDate, setSatrtDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [customChart, setCustomChart] = useState({});
    
    const [showAlert,setShowAlert]=useState(false);
    const [alertType,setAlertType]=useState("");
    const [alertMessage,setAlertMessage]=useState("");
    
    
    const handleFetch = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        try {
            if(type===""){
                // alert("please choose one type!")
                setShowAlert(true)
                setAlertType("failed")
                setAlertMessage("Please choose one type");
                return
            }
            const response = await axios.post(`${API_URL}/dashboard/getCustomIncome`, {
                incomeType: type,
                startingYear: startYear ? `${startYear}T00:00:00` : startYear,
                endingYear: endYear ? `${endYear}T00:00:00` : endYear,
                startingMonth: startMonth ? `${startMonth}T00:00:00` : startMonth,
                endingMonth: endMonth ? `${endMonth}T00:00:00` : endMonth,
                startingDate: startDate ? `${startDate}T00:00:00` : startDate,
                endingDate: endDate ? `${endDate}T00:00:00` : endDate
            },{withCredentials:true})
            // console.log(response.data);
            // alert(response.data);
            setCustomChart(response.data);
        } catch (error) {
            // console.log(error);
            // alert(error);
            setShowAlert(true)
                setAlertType("failed")
                setAlertMessage("Fetching Income Data Failed");
        }
    }

    return (
        <>  {showAlert &&
          <CustomAlert type={alertType}  message={alertMessage} onClose={() => setShowAlert(false)}/>
          }
            <Navbar />
            <div className='w-full h-full' style={{ paddingTop: "14vh" }}>
                <div className='w-full ' style={{ padding: "10px" }}>
                    <div className='w-full flex justify-center' style={{ padding: "20px 0px" }}>
                        <div className='border-gray-200 border-1 shadow-sm w-fit flex justify-center' style={{ padding: "5px 10px" }}>
                            <label htmlFor="" className='font-semibold' style={{ paddingRight: "10px" }}>Chart Type </label>
                            <select name="" id="" value={type} onChange={(e) => { setType(e.target.value) }}>
                                <option value="">choose one</option>
                                <option value="TotalIncome" >Total Income</option>
                                <option value="RoomIncome">Room Income</option>
                                <option value="FoodIncome">Food Income</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex w-full gap-3 flex-wrap justify-center items-center'>
                        <div className='flex justify-between item-center gap-3'>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Statring Year</label>
                                <input type="date" name="" id="" onChange={(e) => setStartYear(e.target.value)} />
                            </div>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Ending Year</label>
                                <input type="date" name="" id="" onChange={(e) => setEndYear(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex justify-between item-center gap-3'>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Starting Month</label>
                                <input type="date" name="" id="" onChange={(e) => { setstartMonth(e.target.value) }} />
                            </div>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Ending Month</label>
                                <input type="date" name="" id="" onChange={(e) => { setEndMonth(e.target.value) }} />
                            </div>
                        </div>
                        <div className='flex justify-between item-center gap-3'>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Starting Date</label>
                                <input type="date" name="" id="" onChange={(e) => { setSatrtDate(e.target.value) }} />
                            </div>
                            <div className='w-fit border-1 border-gray-200 shadow-sm rounded-md flex flex-col' style={{ padding: "5px 20px" }}>
                                <label htmlFor="" style={{ marginRight: "10px", fontWeight: 600 }}>Ending Date</label>
                                <input type="date" name="" id="" onChange={(e) => { setEndDate(e.target.value) }} />
                            </div>
                        </div>
                        <div >
                            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md' style={{ padding: "5px 50px" }} onClick={handleFetch}>Go</button>
                        </div>
                    </div>
                </div>
                {(customChart.lastSeveDaysTotalIncome ||customChart.lastThreeYearsTotalIncome ||customChart.lastThreeMonthsTootalIncome) && 
                <div className='w-full '>
                    <div className='mt-10' style={{ paddingTop: "100px" }}>
                        <h1 className='text-2xl font-bold text-center' style={{ padding: "50px 0px" }}>Food Income Details</h1>
                        {/* Charts */}
                        <div className='w-full flex flex-col gap-8 mt-12 px-4'>
                            {/* Line Chart */}
                            {customChart?.lastThreeYearsTotalIncome?.length>0 &&
                            <div>
                                <p className='text-xl font-bold text-center mb-4'>Yearly Revenue Status</p>
                                <div className='w-full overflow-x-auto'>
                                    <div style={{ minWidth: `${Math.max(700, (customChart?.lastThreeYearsTotalIncome?.length || 1) * 150)}px` }}>
                                        <MyLineChart yearly={customChart?.lastThreeYearsTotalIncome} />
                                    </div>
                                </div>
                            </div>
                            }
                            {/* Bar Chart */}
                            {customChart?.lastThreeMonthsTootalIncome?.length>0 &&                            <div>
                                <p className='text-xl font-bold text-center mb-4'>Monthly Revenue Status</p>
                                <div className='w-full overflow-x-auto'>
                                    <div style={{ minWidth: `${Math.max(700, (customChart?.lastThreeMonthsTootalIncome?.length || 1) * 100)}px` }}>
                                        <MyBarChart monthly={customChart?.lastThreeMonthsTootalIncome} />
                                    </div>
                                </div>
                            </div>
                            }

                            {/* Custom Shape Bar Chart with Min Width */}
                            {customChart?.lastSeveDaysTotalIncome?.length>0 &&
                            
                            <div>
                                <p className='text-xl font-bold text-center mb-4'>Daily Revenue Status</p>
                                <div className='w-full overflow-x-auto'>
                                    <div style={{ minWidth: `${Math.max(700, (customChart?.lastSeveDaysTotalIncome?.length || 1) * 80)}px` }}>
                                        <CustomShapeBarChart daily={customChart.lastSeveDaysTotalIncome} />
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>}
            </div>
        </>
    );
};

export default CustomIncomeChart;
