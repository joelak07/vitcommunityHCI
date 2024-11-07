import React from 'react';
import './popup.css'; // Style your popup as needed

const Popup = ({ onClose, children }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          ❌
        </button>
        {children}
      </div>
    </div>
  );
}

export default Popup;
