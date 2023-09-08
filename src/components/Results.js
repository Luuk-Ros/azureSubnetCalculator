import React from 'react';
import { exportToJSON, exportToCSV } from '../utils/exportData'; // Assuming exportData.js is in the same directory

const Results = ({ subnets, vnetAddress }) => {

  const handleExportToJSON = () => {
    exportToJSON(subnets, vnetAddress);
  };

  const handleExportToCSV = () => {
    exportToCSV(subnets);
  };

  return (
    <div>
      <h2>Calculated Subnets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address Prefix</th>
          </tr>
        </thead>
        <tbody>
          {subnets.map(subnet => (
            <tr key={subnet.name}>
              <td>{subnet.name}</td>
              <td>{subnet.cidr}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExportToJSON}>Export to JSON</button>
      <button onClick={handleExportToCSV}>Export to CSV</button>
    </div>
  );
}

export default Results;