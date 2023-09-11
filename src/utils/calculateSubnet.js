export const calculateCIDR = (hosts) => {
  if (hosts <= 2) return 30; // 4 addresses, 2 usable for hosts
  if (hosts <= 6) return 29; // 8 addresses, 6 usable for hosts
  if (hosts <= 14) return 28; // 16 addresses, 14 usable for hosts
  if (hosts <= 30) return 27; // 32 addresses, 30 usable for hosts
  if (hosts <= 62) return 26; // 64 addresses, 62 usable for hosts
  if (hosts <= 126) return 25; // 128 addresses, 126 usable for hosts
  if (hosts <= 254) return 24; // 256 addresses, 254 usable for hosts
  if (hosts <= 510) return 23; // 512 addresses, 510 usable for hosts
  if (hosts <= 1022) return 22; // 1024 addresses, 1022 usable for hosts
  if (hosts <= 2046) return 21; // 2048 addresses, 2046 usable for hosts
  if (hosts <= 4094) return 20; // 4096 addresses, 4094 usable for hosts
  // ... add more conditions if needed
};

export const getNextSubnet = (baseAddress, cidr) => {
  const [address,] = baseAddress.split('/');
  const ipParts = address.split('.').map(part => parseInt(part, 10));
  const increment = Math.pow(2, 32 - cidr);

  ipParts[3] += increment;

  for (let i = 3; i > 0; i--) {
    if (ipParts[i] >= 256) {
      ipParts[i] -= 256;
      ipParts[i - 1] += 1;
    }
  }

  return ipParts.join('.') + '/' + cidr;
};

const calculateTotalAddresses = (cidr) => {
  return Math.pow(2, 32 - parseInt(cidr.split('/')[1]));
};

function getNetworkAddress(ip, cidr) {
  const ipParts = ip.split('.').map(part => parseInt(part, 10));
  const ipBinary = ipParts.map(part => part.toString(2).padStart(8, '0')).join('');

  const networkBinary = ipBinary.substring(0, cidr).padEnd(32, '0');
  const networkParts = [];
  for (let i = 0; i < 32; i += 8) {
    networkParts.push(parseInt(networkBinary.substring(i, i + 8), 2));
  }

  return networkParts.join('.');
}

//
export const calculateSubnet = (vnetAddress, numberOfSubnets, hostsPerSubnetArray) => {
  const subnets = [];
  const adjustedBaseAddress = getNetworkAddress(vnetAddress.split('/')[0], parseInt(vnetAddress.split('/')[1]));
  let currentAddress = adjustedBaseAddress + '/' + vnetAddress.split('/')[1];
  let totalAvailableAddresses = calculateTotalAddresses(vnetAddress);

  for (let i = 0; i < numberOfSubnets; i++) {
    const cidr = calculateCIDR(hostsPerSubnetArray[i]);
    const subnetAddresses = Math.pow(2, 32 - cidr);

    if (subnetAddresses > totalAvailableAddresses) {
      return {
        subnets,
        error: `Only ${i} subnets can fit in the provided address space. Requested ${numberOfSubnets} subnets.`
      };
    }

    subnets.push({
      name: `Subnet${i + 1}`,
      cidr: currentAddress.split('/')[0] + '/' + cidr,
    });
    currentAddress = getNextSubnet(currentAddress, cidr); // Update the currentAddress to the next subnet
    totalAvailableAddresses -= subnetAddresses;
  }

  // Check if the last calculated subnet goes beyond the VNET address space
  const base = parseInt(vnetAddress.split('/')[0].split('.').join(''), 10);
  const lastSubnetAddress = parseInt(currentAddress.split('/')[0].split('.').join(''), 10);
  const vnetEndAddress = base + calculateTotalAddresses(vnetAddress.split('/')[1]) - 1;

  if (lastSubnetAddress > vnetEndAddress) {
    return {
      subnets,
      error: `The calculated subnets exceed the provided VNET address space.`
    };
  }

  return { subnets };
};
