import React, { useState } from "react";

const API_URL = "http://20.244.56.144/test/auth"; // Replace with actual API URL
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjI3ODQ2LCJpYXQiOjE3NDI2Mjc1NDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImYxMjkyNTY5LTg3M2EtNDNkOS1hMWRjLWQ3N2NiODI2MjUxZSIsInN1YiI6ImFhYmluYXlhMzExMkBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJLYXJwYWdhbSBjb2xsZWdlIG9mIGVuZ2luZWVyaW5nIiwiY2xpZW50SUQiOiJmMTI5MjU2OS04NzNhLTQzZDktYTFkYy1kNzdjYjgyNjI1MWUiLCJjbGllbnRTZWNyZXQiOiJadmFndkxBbGVsV1ZUVXhnIiwib3duZXJOYW1lIjoiQWJpbmF5YSIsIm93bmVyRW1haWwiOiJhYWJpbmF5YTMxMTJAZ21haWwuY29tIiwicm9sbE5vIjoiNzE3ODIyUDMwMSJ9.AO5lJs9z-yGCXZ65ShGgwKd6TORdBPPskrOPXic6s90"; // Replace with actual token

const NumberAverageCalculator = () => {
  const [selectedType, setSelectedType] = useState("p");
  const [previousNumbers, setPreviousNumbers] = useState([]);
  const [currentNumbers, setCurrentNumbers] = useState([]);
  const [calculatedAverage, setCalculatedAverage] = useState("N/A");
  const [errorMessage, setErrorMessage] = useState("");

  const retrieveNumbers = async () => {
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/${selectedType}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`, // Include token
          "Content-Type": "application/json",
        },
      });

      // Handle non-200 responses
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is validy
      if (!data.numbers || !Array.isArray(data.numbers)) {
        throw new Error("Invalid data format received");
      }

      setPreviousNumbers([...currentNumbers]); // Store previous state
      const updatedNumbers = [...currentNumbers, ...data.numbers]
        .filter((num, index, self) => self.indexOf(num) === index) // Remove duplicates
        .slice(-10); // Keep last 10 numbers

      setCurrentNumbers(updatedNumbers);
      setCalculatedAverage(
        updatedNumbers.length > 0
          ? (updatedNumbers.reduce((sum, num) => sum + num, 0) / updatedNumbers.length).toFixed(2)
          : "N/A"
      );
    } catch (err) {
      setErrorMessage(err.message || "Failed to fetch data");
    }
  };

  return (
    <div>
      <h2>Number Average Calculator</h2>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        <option value="p">Prime (p)</option>
        <option value="f">Fibonacci (f)</option>
        <option value="e">Even (e)</option>
        <option value="r">Random (r)</option>
      </select>
      <button onClick={retrieveNumbers}>Retrieve Numbers</button>

      {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}

      <p><strong>Previous Numbers:</strong> {JSON.stringify(previousNumbers)}</p>
      <p><strong>Current Numbers:</strong> {JSON.stringify(currentNumbers)}</p>
      <p><strong>Average:</strong> {calculatedAverage}</p>
    </div>
  );
};

export default NumberAverageCalculator;