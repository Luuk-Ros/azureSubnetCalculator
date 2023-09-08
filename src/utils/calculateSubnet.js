const calculateCIDR = (hosts) => {
  if (hosts <= 2) return 30;
  if (hosts <= 6) return 29;
  if (hosts <= 14) return 28;
  if (hosts <= 30) return 27;
  if (hosts <= 62) return 26;
  if (hosts <= 126) return 25;
  // ... add more conditions if needed
};

const getNextSubnet = (baseAddress, cidr) => {
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

export const calculateSubnet = (vnetAddress, numberOfSubnets, hostsPerSubnet) => {
  const subnets = [];
  let currentAddress = vnetAddress;
  let totalAvailableAddresses = calculateTotalAddresses(vnetAddress);

  for (let i = 0; i < numberOfSubnets; i++) {
    const cidr = calculateCIDR(hostsPerSubnet);
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
    currentAddress = getNextSubnet(subnets[i].cidr, cidr);
    totalAvailableAddresses -= subnetAddresses;
  }

  return { subnets };
};

