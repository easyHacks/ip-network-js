/**
 * Abstract class defining a unified way to represent and manage both IPv4 and IPv6 addresses.
 */
export abstract class IPNetwork {
    /**
     * Applies a bit mask according to the CIDR prefix to a DataView that represents an IPv4 or IPv6 address.
     *
     * @param data - The IP address to apply the CIDR prefix to, in binary format (as ArrayBuffer)
     * @param prefix - The CIDR prefix to apply
     */
    protected static applyPrefix(data: DataView, prefix: number) {
        switch (prefix) {
            case 0:
                IPNetwork.setBytesToZero(data, 0);
                return;
            case data.byteLength * 8:
                return;
            default:
        }
        const byteOffset = Math.floor(prefix / 8);
        data.setUint8(byteOffset, data.getUint8(byteOffset) & ~(0xFF >>> prefix % 8));
        IPNetwork.setBytesToZero(data, byteOffset + 1);
    }

    /**
     * Sets all bytes in the ArrayBuffer to 0, starting from startOffset.
     *
     * @param data - The DataView interfacing the ArrayBuffer
     * @param startOffset - The position where the zero-ing should begin
     */
    private static setBytesToZero(data: DataView, startOffset: number) {
        for (let i = startOffset; i < data.byteLength; i += 1) {
            data.setUint8(i, 0);
        }
    }

    /**
     * An interface on top of the ArrayBuffer storing the real network address
     */
    protected readonly address: DataView;
    /**
     * The CIDR prefix of the network
     */
    protected readonly prefix: number;

    protected constructor(ip: DataView, prefix: number) {
        this.address = ip;
        this.prefix = prefix;
    }

    /**
     * Checks if the current network contains the network passed as argument.
     *
     * @param ip - The network to be checked if it belongs to the current network
     */
    public contains(ip: IPNetwork): boolean {
        if (this.prefix > ip.prefix) {
            return false;
        }
        const cIP = new DataView(ip.address.buffer.slice(0));
        IPNetwork.applyPrefix(cIP, this.prefix);
        for (let i = 0; i < this.address.byteLength; i += 1) {
            if (this.address.getUint8(i) !== cIP.getUint8(i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the string representation of the network
     */
    public abstract toString(): string;
}
