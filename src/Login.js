import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [inputValue, setInputValue] = useState(''); // Track input value
  const navigate = useNavigate(); // Navigation function

  // Handle button clicks
  const handleButtonClick = (value) => {
    setInputValue((prev) => prev + value); // Append the button value
  };

  // Handle backspace click
  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1)); // Remove the last digit
  };

  // Handle submit click
  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a number');
    } else if (inputValue === '11111111') {
      navigate('/Cashier');
    } else if (inputValue === '00000000') {
      navigate('/Inventory');
    } else {
      alert('Invalid ID');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        value={inputValue}
        readOnly
        className="login-input"
        placeholder="Enter a number"
      />

      <div className="keypad">
        {/* Buttons 1-9 */}
        <button className="keypad-button" onClick={() => handleButtonClick('1')}>1</button>
        <button className="keypad-button" onClick={() => handleButtonClick('2')}>2</button>
        <button className="keypad-button" onClick={() => handleButtonClick('3')}>3</button>

        <button className="keypad-button" onClick={() => handleButtonClick('4')}>4</button>
        <button className="keypad-button" onClick={() => handleButtonClick('5')}>5</button>
        <button className="keypad-button" onClick={() => handleButtonClick('6')}>6</button>

        <button className="keypad-button" onClick={() => handleButtonClick('7')}>7</button>
        <button className="keypad-button" onClick={() => handleButtonClick('8')}>8</button>
        <button className="keypad-button" onClick={() => handleButtonClick('9')}>9</button>

        {/* Backspace Button */}
        <button className="keypad-button" onClick={handleBackspace}>Backspace</button>

        {/* Button 0 */}
        <button className="keypad-button" onClick={() => handleButtonClick('0')}>0</button>

        {/* Submit Button */}
        <button className="keypad-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Login;
