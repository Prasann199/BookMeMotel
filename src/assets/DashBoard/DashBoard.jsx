import React, { useEffect } from 'react';
import axios from 'axios';
import "../../assets/DashBoard/DashBoard.css";
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Navbar from '../Navbar/Navbar';

const DashBoard = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

    

  return (
    <div className="snap-y snap-mandatory overflow-y-scroll bg-gray-50 font-sans">
      <Navbar />

      {/* Hero + Carousel */}
      <section
        className="snap-start relative flex items-center justify-center text-white text-center"
        style={{
          minHeight: '100vh',
          overflow: 'hidden',
          padding: '1rem',
          marginTop:"1 min-h-403 style={{}}vh",
          position: 'relative',
        }}
      >
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={500}
          swipeable={false}
          emulateTouch
          className="absolute top-0 left-0 w-full h-full z-0"
        >
          <div style={{ height: '100vh' }}>
            <img
              src="https://images.unsplash.com/photo-1676193361762-f62d54f34402?w=600"
              alt="Lobby"
              className="object-cover w-full h-full"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </div>
          <div style={{ height: '100vh' }}>
            <img
              src="https://plus.unsplash.com/premium_photo-1745337150305-a7fadd0fa1f9?w=600"
              alt="Room"
              className="object-cover w-full h-full"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </div>
          <div style={{ height: '100vh' }}>
            <img
              src="https://plus.unsplash.com/premium_photo-1668651110291-a4e4fcbb0d03?w=600"
              alt="Resort View"
              className="object-cover w-full h-full"
              style={{ height: '100vh', objectFit: 'cover' }}
            />
          </div>
        </Carousel>

        <div
          className="relative z-10   rounded-xl flex flex-col items-center justify-center"
          style={{
            padding: '1.5rem',
            width: '90%',
            maxWidth: '600px',
            textAlign: 'center',
            
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: "bold",
              marginBottom: '1rem',
              lineHeight: '1.2',
            }}
          >
            Welcome to Book<span className="text-[#ff3147]"> Me </span>Hotel
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              maxWidth: '90%',
              marginBottom: '1.5rem',
            }}
          >
            Luxury Stays. Family Comfort. Best Deals.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              width: '100%',
            }}
          >
            <Link
              to="/login"
              className="bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              style={{
                width: '45%',
                minWidth: '120px',
                height: '6vh',
                fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
              style={{
                width: '45%',
                minWidth: '120px',
                height: '6vh',
                fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        className="h-auto snap-start flex flex-col justify-center items-center text-center bg-white"
        style={{ padding: '2rem 1rem' }}
      >
        <h2 className="text-4xl font-bold text-gray-800" style={{ marginBottom: '1.5rem' }}>
          About Us
        </h2>
        <p
          className="text-gray-600 max-w-3xl"
          style={{ marginBottom: '1.5rem', fontSize: '1rem' }}
        >
          Book Me Hotel offers a wide variety of rooms to cater to every traveler’s needs.
          Choose from deluxe rooms, family suites, and honeymoon specials with amenities
          designed to elevate your stay.
        </p>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full"
          style={{ marginTop: '1.5rem', padding: '0 1rem' }}
        >
          <div className="bg-green-100 p-6 rounded-xl shadow-md flex flex-col justify-center items-center min-h-40" style={{}}>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Deluxe Rooms</h3>
            <p>Perfect for business travelers with modern facilities.</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-xl shadow-md flex flex-col justify-center items-center min-h-40" style={{}}>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Family Suites</h3>
            <p>Spacious and comfortable for your whole family.</p>
          </div>
          <div className="bg-orange-100 p-6 rounded-xl shadow-md flex flex-col justify-center items-center min-h-40" style={{}}>
            <h3 className="text-lg font-semibold text-pink-700 mb-2">Romantic Packages</h3>
            <p>Specially curated experiences for couples.</p>
          </div>
        </div>
      </section>

      {/* Food Carousel */}
      <section
        className="h-auto snap-start flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 via-white to-yellow-200"
        style={{ padding: '2rem 1rem' }}
      >
        <h2 className="text-4xl font-bold text-gray-800" style={{ marginBottom: '1.5rem' }}>
          Our Dining
        </h2>
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          transitionTime={600}
          className="w-full"
        >
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?w=600"
              alt="Restaurant"
              className="object-cover rounded-md"
              style={{ maxHeight: '400px', width: '100%' }}
            />
            <p className="legend">Fine Dining</p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1662982696492-057328dce48b?w=600"
              alt="Buffet"
              className="object-cover rounded-md"
              style={{ maxHeight: '400px', width: '100%' }}
            />
            <p className="legend">Buffet Meals</p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1641924675534-bec33d867137?w=600"
              alt="Room Service"
              className="object-cover rounded-md"
              style={{ maxHeight: '400px', width: '100%' }}
            />
            <p className="legend">Room Service Breakfast</p>
          </div>
        </Carousel>
      </section>

      {/* Outdoor Section */}
      <section
        className="h-auto snap-start flex flex-col justify-center items-center bg-white"
        style={{ padding: '2rem 1rem' }}
      >
        <h2 className="text-4xl font-bold text-gray-800" style={{ marginBottom: '1.5rem' }}>
          Family & Outdoor Fun
        </h2>
        <p
          className="text-gray-600 max-w-3xl text-center"
          style={{ marginBottom: '2rem', fontSize: '1rem' }}
        >
          Book Me Hotel isn't just for adults. We have a kid-friendly play zone, lush gardens, and open areas perfect for family gatherings, kids’ play, and evening strolls.
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
          style={{ padding: '0 1rem' }}
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1733338550995-944253432e82?w=600"
            alt="Playground"
            className="rounded-xl shadow-md object-cover"
            style={{ width: '100%', height: '250px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1641483320968-d7e54a307421?w=600"
            alt="Garden"
            className="rounded-xl shadow-md object-cover"
            style={{ width: '100%', height: '250px' }}
          />
          <img
            src="https://images.unsplash.com/photo-1661016631778-d9f53113d04f?w=600"
            alt="Outdoor Area"
            className="rounded-xl shadow-md object-cover"
            style={{ width: '100%', height: '250px' }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-gray-100 text-center text-sm text-gray-500 border-t"
        style={{ padding: '1rem' }}
      >
        &copy; {new Date().getFullYear()} Book Me Hotel. All rights reserved.
      </footer>
    </div>
  );
};

export default DashBoard;
