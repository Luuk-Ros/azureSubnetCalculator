import React, { useState } from 'react';

const NewVNETForm = ({ onCalculate }) => {
  const [vnetAddress, setVnetAddress] = useState('');
  const [numberOfSubnets, setNumberOfSubnets] = useState(0);
  const [hostsPerSubnet, setHostsPerSubnet] = useState(0);
  const [dedicatedSubnets, setDedicatedSubnets] = useState({
    AzureBastion: false,
    // ... Add other dedicated subnets here
  });

  const handleCheckboxChange = (event) => {
    setDedicatedSubnets({
      ...dedicatedSubnets,
      [event.target.name]: event.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      vnetAddress,
      numberOfSubnets,
      hostsPerSubnet,
      dedicatedSubnets
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        VNET Address Space:
        <input type="text" value={vnetAddress} onChange={e => setVnetAddress(e.target.value)} />
      </label>
      <label>
        Number of Subnets:
        <input type="number" value={numberOfSubnets} onChange={e => setNumberOfSubnets(e.target.value)} />
      </label>
      <label>
        Hosts per Subnet:
        <input type="number" value={hostsPerSubnet} onChange={e => setHostsPerSubnet(e.target.value)} />
      </label>
      <label>
        Azure Bastion:
        <input 
          type="checkbox" 
          name="AzureBastion" 
          checked={dedicatedSubnets.AzureBastion} 
          onChange={handleCheckboxChange} 
        />
      </label>
      {/* Add more checkboxes for other dedicated subnets as needed */}
      <button type="submit">Calculate</button>
    </form>
  );
};

export default NewVNETForm;