import React from 'react';
import './OptionButtons.css'; // Crearemos este CSS

const OptionButtons = ({ options, onSelect }) => {
  return (
    <div className="option-buttons-container">
      {options.map((option) => (
        <button key={option.value} className="option-button" onClick={() => onSelect(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OptionButtons;