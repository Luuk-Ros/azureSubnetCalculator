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

    // Check if vnetAddress is empty
    if (!vnetAddress.trim()) {
      alert("Please enter the VNET Address space.");
      return;
    }

    // Check for empty subnet names or hosts
    for (let subnet of subnets) {
      if (!subnet.name.trim() || subnet.hosts <= 0) {
          alert("Please ensure all subnet names and host counts are filled out correctly.");
          return;
      }

      if (subnet.hosts <= 2) {
          alert("Please enter a valid number of hosts. Considering Azure's reserved IP addresses, you need to request more than 2 usable hosts.");
          return;
      }
    }

    // Check for invalid host numbers
    for (let subnet of subnets) {
        if (subnet.hosts <= 2) {
            alert("Please enter a valid number of hosts. Considering Azure's reserved IP addresses, you need to request more than 2 usable hosts.");
            return;
        }
    }

    onCalculate({
      vnetAddress,
      subnets
    });
};

  return (
    <form onSubmit={handleSubmit}>
      <label>
        New VNET Address Space:
        <input type="text" value={vnetAddress} onChange={e => setVnetAddress(e.target.value)} placeholder="e.g., 172.20.10.0/24"  />
      </label>
    <div className="subnet-container">
        {subnets.map((subnet, index) => (
      <div className="subnet-form" key={index}>
      <label>
        Subnet Name:
        <input type="text" value={subnet.name} onChange={e => handleSubnetChange(index, 'name', e.target.value)} placeholder="e.g., hub-prd-01"/>
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
