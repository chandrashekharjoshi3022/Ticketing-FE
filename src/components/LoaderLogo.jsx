import React from 'react';
import './Loader.css'; // Make sure to import the CSS file
// import logo from '../../public/Images/IconLogoB.png'; // Replace with your image path
import loader_logo from '../../public/Images/loader_logo.gif'


const LoaderLogo = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <img src={loader_logo} alt="Loading Logo" className="loader-logo" />
        {/* <div className="spinner"> </div> */}
      </div>
    </div>
  );
};

export default LoaderLogo;
