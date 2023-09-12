import React, { useState } from 'react';
import NewVNETForm from './components/NewVNETForm';
import Results from './components/Results';
import { calculateSubnet } from './utils/calculateSubnet';
import './App.css';

function App() {
  const [subnets, setSubnets] = useState([]);
  const [vnetAddress, setVnetAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [theme, setTheme] = useState('light-mode');
  const [warningMessage, setWarningMessage] = useState(null);

  const handleCalculate = (data) => {
    setErrorMessage(null);
    setWarningMessage(null);
  
    const result = calculateSubnet(data.vnetAddress, data.subnets.length, data.subnets.map(s => s.hosts));
  
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
  
    if (result.warning) {
      setWarningMessage(result.warning);
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
        <h1>Azure Subnet Calculator</h1>
      </div>
      <div className="main-content">
        <div className="forms-section">
          <h2>Request Subnets</h2>
          <NewVNETForm onCalculate={handleCalculate} />
        </div>

        <div className="results-section">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {warningMessage && <div className="warning-message" dangerouslySetInnerHTML={{ __html: warningMessage }}></div>}
          {errorMessage && <div className="suggestion-message">Consider reducing the number of hosts per subnet or the total number of subnets.</div>}
          {subnets.length > 0 && <Results subnets={subnets} vnetAddress={vnetAddress} />}
        </div>

      </div>
      <div className='information'><a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets" target="_blank" rel="noopener noreferrer">Azure reserves</a> the first four addresses and the last address, for a total of five IP addresses within each subnet.
      <br></br>
      <a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#how-small-and-how-large-can-virtual-networks-and-subnets-be" target="_blank" rel="noopener noreferrer">The smallest</a> supported IPv4 subnet is /29, and the largest is /2
      <br></br><br></br>
      The Subnet calculation logic is inspired by <a href="https://github.com/salieri/IPSubnetCalculator/blob/master/lib/ip-subnet-calculator.js" target="_blank" rel="noopener noreferrer">IPSubnetCalculator</a> from <a href="https://github.com/salier" target="_blank" rel="noopener noreferrer">Salieri</a></div>
      <div className="footer">
      Azure Subnet Calculator Beta - By <a href="https://www.linkedin.com/in/luukros/" target="_blank" rel="noopener noreferrer">Luuk Ros</a>
      </div>
    </div>
  );
}

export default App;


// <button className="dark-mode-button" onClick={toggleTheme}>
// {theme === 'light-mode' ? '🌙' : '☀️'}
// </button>
