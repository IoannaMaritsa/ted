import React, { useState } from 'react';
import './dropdown.css';

const Dropdown = ({ options, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  return (
    <div className="job_dropdown">
      <button className="job_dropdown-toggle" onClick={toggleDropdown}>
        {selectedOption || options[0]}
        {isOpen ? (<img src='up-icon.png' className='small-icon' />) : (<img src='down-icon.png' className='small-icon' />)}
      </button>
      {isOpen && (
        <div className="job_dropdown-menu">
          {options.map((option, index) => (
            <div key={index} className="job_dropdown-item" onClick={() => handleOptionClick(option)}>
              {option}
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;