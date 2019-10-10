import { isIP } from "net";

import { IPNetwork } from "./ipNetwork";
import { IPNetworkV4 } from "./ipNetworkV4";
import { IPNetworkV6 } from "./ipNetworkV6";

/**
 * Parses and validates a CIDR prefix according to the size of the IP (IPv6 vs IPv4).
 *
 * @param str - The string containing the prefix
 * @param ipType - 4 for IPv4 and 6 for IPv6 - to match the value returned by {@link isIP}
 *
 * @returns - The prefix parsed or the address size in bits if the first argument is undefined
 *
 * @throws - A {@link TypeError} if it is unable to parse the prefix
 */
const parsePrefix = (str: string | undefined, ipType: 4 | 6): number | never => {
    const max = { 4: 32, 6: 128 }[ipType];

    if (str === undefined) {
        return max;
    }

    const result = parseInt(str, 10);
    if (!isNaN(result) && result >= 0 && result <= max) {
        return result;
    }
    throw new TypeError(`Unable to parse CIDR prefix "${str}"`);
};

/**
 * Parses an IPv4 or IPv6 network from a string that has it in CIDR notation. If the prefix is missing then the address
 * is considered to be a single address with the longest prefix (32 for IPv4 and 128 for IPv6).
 *
 * @param str - The string containing the network address in CIDR notation.
 *
 * @returns - An {@link IPNetwork} with the parsed network address
 *
 * @throws - A {@link TypeError} if parsing fails
 */
export const parseIPNetwork = (str: string): IPNetwork => {
    const [strAddress, strPrefix] = str.split("/", 2);

    const ipType = isIP(strAddress);
    if (ipType === 0) {
        throw new TypeError(`Unable to parse IP address "${strAddress}"`);
    }

    const prefix = parsePrefix(strPrefix, ipType as 4 | 6);

    return ipType === 4 ? IPNetworkV4.create(strAddress, prefix) : IPNetworkV6.create(strAddress, prefix);
};
