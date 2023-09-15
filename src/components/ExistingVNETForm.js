import React, { useState } from "react";

const ExistingVNETForm = ({ onCalculate }) => {
  const [vnetAddress, setVnetAddress] = useState("");
  const [existingSubnets, setExistingSubnets] = useState([{ name: "", addressSpace: "" },]);
  const [newSubnets, setNewSubnets] = useState([{ name: "", hosts: "" }]);

  const handleExistingSubnetChange = (index, field, value) => {
    const updatedSubnets = [...existingSubnets];
    updatedSubnets[index][field] = value;
    setExistingSubnets(updatedSubnets);
  };

  const handleNewSubnetChange = (index, field, value) => {
    const updatedSubnets = [...newSubnets];
    updatedSubnets[index][field] = value;
    setNewSubnets(updatedSubnets);
  };

  const addExistingSubnet = () => {
    setExistingSubnets([...existingSubnets, { name: "", addressSpace: "" }]);
  };

  const removeExistingSubnet = () => {
    const updatedSubnets = [...existingSubnets];
    updatedSubnets.pop();
    setExistingSubnets(updatedSubnets);
  };

  const addNewSubnet = () => {
    setNewSubnets([...newSubnets, { name: "", hosts: "" }]);
  };

  const removeNewSubnet = () => {
    const updatedSubnets = [...newSubnets];
    updatedSubnets.pop();
    setNewSubnets(updatedSubnets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if vnetAddress is empty
    if (!vnetAddress.trim()) {
      alert("Please enter the VNET Address space.");
      return;
    }

    // Validate VNET Address format
    const vnetRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]{1,2}$/;
    if (!vnetRegex.test(vnetAddress)) {
      alert("Invalid VNET Address format.");
      return;
    }

    // Validate Subnet Address format
    for (let subnet of existingSubnets) {
      if (!subnet.name.trim() || !subnet.addressSpace.trim()) {
        alert(
          "Please ensure all existing subnet names and address spaces are filled out correctly."
        );
        return;
      }

      if (!vnetRegex.test(subnet.addressSpace)) {
        alert(`Invalid address format for existing subnet: ${subnet.name}`);
        return;
      }
    }

    // Check for empty subnet names and valid hosts
    for (let subnet of newSubnets) {
      if (!subnet.name.trim() || subnet.hosts <= 0) {
        alert(
          "Please ensure all subnet names and host counts are filled out correctly."
        );
        return;
      }

      if (subnet.hosts <= 2) {
        alert(
          "Please enter a valid number of hosts. Considering Azure's reserved IP addresses, you need to request more than 2 usable hosts."
        );
        return;
      }
    }

    onCalculate({ vnetAddress, existingSubnets, newSubnets });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Existing VNET Address Space:
        <input type="text" value={vnetAddress} onChange={(e) => setVnetAddress(e.target.value)} placeholder="e.g., 172.20.10.0/24"/>
      </label>
      <h3>Existing Subnets:</h3>
      <div className="subnet-container">
        {existingSubnets.map((subnet, index) => (
          <div className="subnet-form" key={index}>
            <label>
              Subnet Name:
              <input type="text" value={subnet.name} onChange={(e) => handleExistingSubnetChange(index, "name", e.target.value)} placeholder="e.g., hub-prd-01"/>
            </label>
            <label>
              Address Space:
              <input type="text" value={subnet.addressSpace} onChange={(e) => handleExistingSubnetChange( index, "addressSpace", e.target.value)} placeholder="e.g., 172.20.10.0/27"/>
            </label>
          </div>
        ))}
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center",}}>
        <button type="button" onClick={addExistingSubnet} className="round-button">
          +
        </button>
        <button type="button" onClick={removeExistingSubnet} className="round-button">
          -
        </button>
      </div>

      <h3>New Subnets:</h3>
      <div className="subnet-container">
        {newSubnets.map((subnet, index) => (
          <div className="subnet-form" key={index}>
            <label>
              Subnet ame:
              <input type="text" value={subnet.name} onChange={(e) => handleNewSubnetChange(index, "name", e.target.value)} placeholder="e.g., vm-prd-01"/>
            </label>
            <label>
              Hosts per Subnet:
              <input type="number" value={subnet.hosts} onChange={(e) => handleNewSubnetChange(index, "hosts", e.target.value)}/>
            </label>
          </div>
        ))}
      </div>
      <div
        style={{display: "flex", justifyContent: "center", alignItems: "center",}}>
        <button type="button" onClick={addNewSubnet} className="round-button">
          +
        </button>
        <button type="button" onClick={removeNewSubnet} className="round-button">
          -
        </button>
      </div>
      <button type="submit">Calculate</button>
    </form>
  );
};

export default ExistingVNETForm;