import { IPNetwork } from "./ipNetwork";

/**
 * Implementations specific for an IPv4 network address manipulation
 */
export class IPNetworkV4 extends IPNetwork {
    /**
     * Parses an IPv4 network address from a string and masks it according to the prefix.
     *
     * @param strAddress - the string containing the network address
     * @param prefix - the prefix for the network
     */
    public static create(strAddress: string, prefix: number): IPNetworkV4 {
        const address = new DataView(new ArrayBuffer(4));
        strAddress
            .split(".")
            .forEach((val, idx) => address.setUint8(idx, parseInt(val, 10)));
        IPNetwork.applyPrefix(address, prefix);
        return new IPNetworkV4(address, prefix);
    }

    private constructor(address: DataView, prefix: number) {
        super(address, prefix);
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return `${this.address.getUint8(0)}` +
            `.${this.address.getUint8(1)}` +
            `.${this.address.getUint8(2)}` +
            `.${this.address.getUint8(3)}` +
            `/${this.prefix}`;
    }
}
