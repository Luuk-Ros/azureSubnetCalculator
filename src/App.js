import React, { useState } from 'react';
import NewVNETForm from './components/NewVNETForm';
import Results from './components/Results';
import { calculateSubnet, getNextSubnet, calculateCIDR } from './utils/calculateSubnet';
import './App.css';

function App() {
  const [subnets, setSubnets] = useState([]);
  const [vnetAddress, setVnetAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [theme, setTheme] = useState('light-mode');

  const handleCalculate = (data) => {
    setErrorMessage(null); // Clear any previous error message
  
    const result = calculateSubnet(data.vnetAddress, data.subnets.length, data.subnets.map(s => s.hosts));
  
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
  
    setSubnets(result.subnets.map((subnet, index) => ({
      name: data.subnets[index].name,
      cidr: subnet.cidr
    })));
    setVnetAddress(data.vnetAddress);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light-mode' ? 'dark-mode' : 'light-mode');
  };

  return (
    <div className={`App ${theme}`}>
      <div className="header">
        <h1>Azure VNET Subnet Calculator</h1>
        <button className="dark-mode-button" onClick={toggleTheme}>
          {theme === 'light-mode' ? '🌙' : '☀️'}
        </button>      
      </div>
      <div className="main-content">
        <div className="forms-section">
          <h2>Requests Subnets</h2>
          <NewVNETForm onCalculate={handleCalculate} />
        </div>

        <div className="results-section">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {errorMessage && <div className="suggestion-message">Consider reducing the number of hosts per subnet or the total number of subnets.</div>}
          {subnets.length > 0 && <Results subnets={subnets} vnetAddress={vnetAddress} />}
        </div>
      </div>

      <div className="footer">
       2023 - Luuk Ros - Azure Subnet Calculator Beta
      </div>
    </div>
  );
}

export default App;
