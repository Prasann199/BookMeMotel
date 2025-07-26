import React, { useEffect, useState } from 'react';

const OtpTimer = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <span className='text-sm text-red-600 font-semibold'>
      OTP expires in: {formatTime(timeLeft)}
    </span>
  );
};

export default OtpTimer;
