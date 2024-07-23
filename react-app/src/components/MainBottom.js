import React from 'react';
import './MainBottom.css'; // We will create this CSS file next

const MainBottom = () => {
  return (
    <div className="main-bottom">
      <div className="column">
        <img src="/twitter.png" alt="icon1" className="icon" />
        <img src="/instagram.png" alt="icon2" className="icon" />
        <img src="/youtube.png" alt="icon3" className="icon" />
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