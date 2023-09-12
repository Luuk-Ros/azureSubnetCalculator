import React from 'react';
import { exportToJSON, exportToCSV } from '../utils/exportData';

const calculateUsableHosts = (cidr) => {
  const totalHosts = Math.pow(2, 32 - parseInt(cidr.split('/')[1]));
  return totalHosts - 5;
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
      <br></br>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address Prefix</th>
            <th>Usable Hosts</th>
          </tr>
        </thead>
        <tbody>
          {subnets.map(subnet => (
            <tr key={subnet.name}>
              <td>{subnet.name}</td>
              <td>{subnet.cidr}</td>
              <td>{calculateUsableHosts(subnet.cidr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <div className='export-buttons'>
      <button onClick={handleExportToJSON}>Export to JSON</button>
      <button onClick={handleExportToCSV}>Export to CSV</button>
      </div>
    </div>
  );
}

export default Results;
