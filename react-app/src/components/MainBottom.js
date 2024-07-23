import React from 'react';
import './MainBottom.css'; // We will create this CSS file next

const MainBottom = () => {
  return (
    <div className="main-bottom">
      <div className="column">
        <img src="/path-to-your-icon1.png" alt="icon1" className="icon" />
        <img src="/path-to-your-icon2.png" alt="icon2" className="icon" />
        <img src="/path-to-your-icon3.png" alt="icon3" className="icon" />
      </div>
      <div className="column">
        <p>Your text for column 2 here</p>
      </div>
      <div className="column">
        <p>Your text for column 3 here</p>
      </div>
      <div className="column">
        <p>Your text for column 4 here</p>
      </div>
    </div>
  );
};

export default MainBottom;