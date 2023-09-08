const IpSubnetCalculator = {
    // Converts string formatted IPs to decimal representation
    toDecimal: function(ipString) {
        const parts = ipString.split('.');
        return ((((((+parts[0]) * 256) + (+parts[1])) * 256) + (+parts[2])) * 256) + (+parts[3]);
    },

    // Converts decimal IPs to string representation
    toString: function(ipNum) {
        const d = ipNum % 256;
        let ip = d;
        for (let i = 3; i > 0; i--) {
            ipNum = Math.floor(ipNum / 256);
            ip = ipNum % 256 + '.' + ip;
        }
        return ip;
    },

    // Finds the largest subnet mask that begins from ipNum and does not exceed ipEndNum
    getOptimalRange: function(ipNum, ipEndNum) {
        let prefixSize;
        let optimalRange = null;
        for (prefixSize = 32; prefixSize >= 0; prefixSize--) {
            const maskRange = this.getMaskRange(ipNum, prefixSize);
            if (maskRange.ipLow === ipNum && maskRange.ipHigh <= ipEndNum) {
                optimalRange = maskRange;
            } else {
                break;
            }
        }
        return optimalRange;
    },

    // Calculates details of a CIDR subnet
    getMaskRange: function(ipNum, prefixSize) {
        const prefixMask = this.getPrefixMask(prefixSize);
        const lowMask = this.getMask(32 - prefixSize);
        const ipLow = ipNum & prefixMask;
        const ipHigh = ipLow + lowMask;
        return {
            ipLow: ipLow,
            ipLowStr: this.toString(ipLow),
            ipHigh: ipHigh,
            ipHighStr: this.toString(ipHigh),
            prefixSize: prefixSize
        };
    },

    // Creates a bitmask with maskSize leftmost bits set to one
    getPrefixMask: function(prefixSize) {
        let mask = 0;
        for (let i = 0; i < prefixSize; i++) {
            mask += (1 << (32 - (i + 1)));
        }
        return mask;
    },

    // Creates a bitmask with maskSize rightmost bits set to one
    getMask: function(maskSize) {
        let mask = 0;
        for (let i = 0; i < maskSize; i++) {
            mask += (1 << i);
        }
        return mask;
    },

    // Public function to calculate subnets based on the provided VNET address and number of hosts
    calculateSubnets: function(vnetAddress, numberOfSubnets, hostsPerSubnet) {
        const subnets = [];
        let currentAddress = vnetAddress.split('/')[0]; // Start with the base address of the VNET

        for (let i = 0; i < numberOfSubnets; i++) {
            const hosts = hostsPerSubnet[i];
            const ipEnd = this.toString(this.toDecimal(currentAddress) + hosts);
            const ranges = this.calculate(currentAddress, ipEnd);

            if (ranges && ranges.length > 0) {
                const range = ranges[0]; // We'll take the first range for simplicity
                subnets.push({
                    name: `Subnet${i + 1}`,
                    cidr: range.ipLowStr + '/' + range.prefixSize
                });
                currentAddress = this.toString(range.ipHigh + 1);
            } else {
                console.error("Error calculating subnet for:", currentAddress, "with hosts:", hosts);
                break;
            }
        }

        return subnets;
    },

    // Calculates an optimal set of IP masks for the given IP address range
    calculate: function(ipStart, ipEnd) {
        const ipStartNum = this.toDecimal(ipStart);
        const ipEndNum = this.toDecimal(ipEnd);
        const rangeCollection = [];

        if (ipEndNum < ipStartNum) {
            return null;
        }

        let ipCurNum = ipStartNum;
        while (ipCurNum <= ipEndNum) {
            const optimalRange = this.getOptimalRange(ipCurNum, ipEndNum);
            if (optimalRange === null) {
                return null;
            }
            rangeCollection.push(optimalRange);
            ipCurNum = optimalRange.ipHigh + 1;
        }

        return rangeCollection;
    }
};

export default IpSubnetCalculator;
