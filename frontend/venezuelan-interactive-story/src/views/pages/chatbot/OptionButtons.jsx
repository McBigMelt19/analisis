import React from 'react';
import PropTypes from 'prop-types';
import { CButton } from '@coreui/react';

const OptionButtons = ({ options, onSelect }) => {
  return (
    <div className="option-buttons">
      {options.map((option, index) => (
        <CButton
          key={index}
          color="primary"
          className="m-2"
          onClick={() => onSelect(option)}
        >
          {option.label}
        </CButton>
      ))}
    </div>
  );
};

OptionButtons.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default OptionButtons;