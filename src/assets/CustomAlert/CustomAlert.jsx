import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import "../CustomAlert/CustomAlert.css";

const CustomAlert = ({ type, message, action, onClose }) => {
  return (
    <div className='w-full bg-transparent h-fit fixed z-[999]'>
      <div className='relative w-full flex justify-center h-fit'>
        <div
          className={`w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] h-fit shadow-lg rounded-xl absolute bg-white overflow-hidden alertmodel`}
          style={{
            margin: "20px auto",
            border: "1px solid #ddd",
            transition: "all ease 0.4s"
          }}
        >
          <div
            className={`border-l-[6px] ${type === 'success' ? 'border-green-500' : 'border-orange-500'} h-full`}
            style={{ backgroundColor: "#f9fafb" }}
          >
            <div className='flex w-full h-full'>
              {/* Icon */}
              <div
                className='w-[20%] flex justify-center items-center'
                style={{ margin: "auto", padding: "10px" }}
              >
                {type === "success" ? (
                  <FaCheckCircle className='text-green-500 text-3xl' />
                ) : (
                  <MdError className='text-orange-500 text-3xl' />
                )}
              </div>

              {/* Message + Action */}
              <div
                className='flex flex-col justify-center gap-3 w-full min-h-25'
                style={{ padding: "10px 15px" }}
              >
                <p
                  className='text-sm text-gray-700 font-medium leading-5'
                  style={{ wordWrap: "break-word" }}
                >
                  {message}
                </p>

                {action && (
                  <div
                    className='flex w-full text-sm justify-between items-center gap-4'
                    style={{ padding: "0px 10px", marginTop: "10px" }}
                  >
                    <button
                      className='border border-gray-400 rounded-md font-medium hover:bg-gray-700 hover:text-white'
                      style={{
                        padding: "3px 12px",
                        fontSize: "0.75rem",
                        transition: "all ease 0.3s"
                      }}
                      onClick={onClose}
                    >
                      No
                    </button>
                    <button
                      className={`${type === 'success'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                        } text-white rounded-md font-medium`}
                      style={{
                        padding: "3px 12px",
                        fontSize: "0.75rem",
                        transition: "all ease 0.3s"
                      }}
                      onClick={() => {
                        action();
                        onClose();
                      }}
                    >
                      Yes
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              {!action && (
                <div
                  className='flex w-fit text-sm justify-end items-start'
                  style={{ padding: "8px 10px" }}
                >
                  <button
                    className={`${type === 'success' ? 'text-green-500' : 'text-orange-500'} text-lg font-semibold`}
                    onClick={onClose}
                  >
                    ×
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
