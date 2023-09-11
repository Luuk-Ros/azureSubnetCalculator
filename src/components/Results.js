import React from 'react';
import { exportToJSON, exportToCSV } from '../utils/exportData';

const calculateUsableHosts = (cidr) => {
  const totalHosts = Math.pow(2, 32 - parseInt(cidr.split('/')[1]));
  return totalHosts - 2; // Subtracting 2 for network and broadcast address
};

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
            <th>Usable Hosts</th> {/* New column header */}
          </tr>
        </thead>
        <tbody>
          {subnets.map(subnet => (
            <tr key={subnet.name}>
              <td>{subnet.name}</td>
              <td>{subnet.cidr}</td>
              <td>{calculateUsableHosts(subnet.cidr)}</td> {/* New column data */}
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
