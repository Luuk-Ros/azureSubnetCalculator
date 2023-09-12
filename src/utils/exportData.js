const calculateUsableHosts = (cidr) => {
    const totalHosts = Math.pow(2, 32 - parseInt(cidr.split('/')[1]));
    return totalHosts - 5;
  };

const exportToJSON = (subnets, vnetAddress) => {
    const data = {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "vnetaddressPrefixes": {
                "value": [vnetAddress]
            },
            "vnetSubnets": {
                "value": subnets.map(subnet => ({
                    "name": subnet.name,
                    "properties": {
                        "addressPrefix": subnet.cidr
                    }
                }))
            }
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'azure_vnet_subnets.json';
    link.click();
};

const exportToCSV = (subnets) => {
    const csvRows = [];
    csvRows.push('Name,Address Prefix, Usable Hosts');

    subnets.forEach(subnet => {
        csvRows.push(`${subnet.name},${subnet.cidr}, ${calculateUsableHosts(subnet.cidr)}`);
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'azure_vnet_subnets.csv';
    link.click();
};

export { exportToJSON, exportToCSV };