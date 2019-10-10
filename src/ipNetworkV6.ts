import { IPNetwork } from "./ipNetwork";

/**
 * Implementations specific for an IPv6 network address manipulation
 */
export class IPNetworkV6 extends IPNetwork {
    /**
     * Parses an IPv6 network address from a string and masks it according to the prefix.
     *
     * @param strAddress - the string containing the network address
     * @param prefix - the prefix for the network
     */
    public static create(strAddress: string, prefix: number): IPNetworkV6 {
        const address = new DataView(new ArrayBuffer(16));

        const [beg, end] = strAddress.split("::", 2);

        beg
            .split(":")
            .filter((value) => value !== "")
            .forEach((val, idx) => address.setUint16(idx * 2, parseInt(val, 16)));

        // tslint:disable-next-line:strict-type-predicates - bug https://github.com/palantir/tslint/issues/4874
        if (end !== undefined) {
            end
                .split(":")
                .filter((value) => value !== "")
                .reverse()
                .forEach((val, idx) => address.setUint16(14 - idx * 2, parseInt(val, 16)));
        }

        IPNetwork.applyPrefix(address, prefix);
        return new IPNetworkV6(address, prefix);
    }

    /**
     * Formats a list of bytes into the standard IPv6 format (colon separated list of 16 bit hexadecimals).
     *
     * @param bytes - a list of bytes to format
     */
    private static formatBytes(bytes: number[]): string {
        return bytes
            .map((byte) => byte.toString(16))
            .join(":");
    }

    private constructor(address: DataView, prefix: number) {
        super(address, prefix);
    }

    /**
     * @inheritDoc
     */
    // tslint:disable-next-line:completed-docs - there is a bug with completed-docs if @inheritDoc is used
    public toString(): string {
        const bytes = Array(8)
            .fill(0)
            .map((value, index) => this.address.getUint16(index * 2));

        let maxZeroBytes = 0;
        let zeroBytesPosition = 0;
        for (let index = 0; index < bytes.length - 1; index += 1) {
            let times = 0;
            while (bytes[index + times] === 0) {
                times += 1;
            }
            if (times > 1 && times > maxZeroBytes) {
                maxZeroBytes = times;
                zeroBytesPosition = index;
            }
        }

        const beg = IPNetworkV6.formatBytes(bytes.slice(0, zeroBytesPosition));
        const end = IPNetworkV6.formatBytes(bytes.slice(zeroBytesPosition + maxZeroBytes));
        return `${beg}::${end}/${this.prefix}`;
    }
}
