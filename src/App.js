import React, { useState } from 'react';
import NewVNETForm from './components/NewVNETForm';
import ExistingVNETForm from './components/ExistingVNETForm';
import Results from './components/Results';
import { calculateSubnet } from './utils/calculateSubnet';
import './App.css';

function App() {
  const [subnets, setSubnets] = useState([]);
  const [vnetAddress, setVnetAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [theme, setTheme] = useState('light-mode');

  const handleCalculate = (data) => {
    const result = calculateSubnet(data.vnetAddress, data.numberOfSubnets, data.hostsPerSubnet);

    if (result.error) {
        setErrorMessage(result.error);
    } else {
        setErrorMessage(null); // Clear any previous error message
    }
    setSubnets(result.subnets);
    setVnetAddress(data.vnetAddress);
  };

  const handleAddSubnet = (data) => {
    // This is a placeholder. You can expand upon this function based on your requirements.
    alert("Functionality to add subnet to existing VNET is not yet implemented.");
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  return (
    <div className={`App ${theme}`}>
      <div className="header">
        <h1>Azure VNET Subnet Calculator</h1>
        <button onClick={toggleTheme}>Switch to {theme === 'light-mode' ? 'Dark' : 'Light'} Mode</button>
      </div>

      <div className="main-content">
        <div className="forms-section">
          <h2>Calculate New VNET</h2>
          <NewVNETForm onCalculate={handleCalculate} />
        </div>

        <div className="results-section">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {errorMessage && <div className="suggestion-message">Consider reducing the number of hosts per subnet or the total number of subnets.</div>}
          {subnets.length > 0 && <Results subnets={subnets} vnetAddress={vnetAddress} />}
        </div>
      </div>

      <div className="footer">
        © 2023 Your Company Name. All rights reserved.
      </div>
    </div>
  );
}
export default App;

//          <h2>Add Subnet to Existing VNET</h2>
//          <ExistingVNETForm onAddSubnet={handleAddSubnet} />