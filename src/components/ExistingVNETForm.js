import React, { useState } from 'react';

const ExistingVNETForm = ({ onAddSubnet }) => {
  const [vnetAddress, setVnetAddress] = useState('');
  const [currentSubnets, setCurrentSubnets] = useState([]);
  const [newSubnetHosts, setNewSubnetHosts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSubnet({
      vnetAddress,
      currentSubnets,
      newSubnetHosts
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        VNET Address Space:
        <input type="text" value={vnetAddress} onChange={e => setVnetAddress(e.target.value)} />
      </label>
      <label>
        Current Subnets (comma-separated CIDRs):
        <input type="text" value={currentSubnets} onChange={e => setCurrentSubnets(e.target.value.split(','))} />
      </label>
      <label>
        Hosts for New Subnet:
        <input type="number" value={newSubnetHosts} onChange={e => setNewSubnetHosts(e.target.value)} />
      </label>
      <button type="submit">Add Subnet</button>
    </form>
  );
};

export default ExistingVNETForm;