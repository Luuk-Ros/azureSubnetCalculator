import React, { useState } from 'react';

const NewVNETForm = ({ onCalculate }) => {
  const [vnetAddress, setVnetAddress] = useState('');
  const [subnets, setSubnets] = useState([{ name: '', hosts: 0 }]);

  const handleSubnetChange = (index, field, value) => {
    const newSubnets = [...subnets];
    newSubnets[index][field] = value;
    setSubnets(newSubnets);
  };

  const addSubnet = () => {
    if (subnets.length < 8) {
      setSubnets([...subnets, { name: '', hosts: 0 }]);
    }
  };  

  const removeSubnet = () => {
    if (subnets.length > 1) { // Ensure there's always at least one subnet
      const newSubnets = [...subnets];
      newSubnets.pop();
      setSubnets(newSubnets);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      vnetAddress,
      subnets
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        VNET Address Space:
        <input type="text" value={vnetAddress} onChange={e => setVnetAddress(e.target.value)} placeholder="e.g., 172.20.10.0/28"  />
      </label>
    <div className="subnet-container">
        {subnets.map((subnet, index) => (
      <div className="subnet-form" key={index}>
      <label>
        Subnet Name:
        <input type="text" value={subnet.name} onChange={e => handleSubnetChange(index, 'name', e.target.value)} />
      </label>
      <label>
        Hosts per Subnet:
        <input type="number" value={subnet.hosts} onChange={e => handleSubnetChange(index, 'hosts', e.target.value)} />
      </label>
      </div>
      ))}
    </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button 
          type="button" 
          onClick={addSubnet} 
          className="round-button"
        >
          +
        </button>
        <button 
          type="button" 
          onClick={removeSubnet} 
          className="round-button"
        >
          -
        </button>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
};

export default NewVNETForm;
