import { parseIPNetwork } from "../src/parseIPNetwork";

describe("Parse & Unparse", () => {
    const testCases: string[][] = [
        ["127.0.0.1", "127.0.0.1/32", ""],
        ["127.0.0.2/32", "127.0.0.2/32", ""],
        ["127.1.1.1/30", "127.1.1.0/30", ""],
        ["127.1.1.1/23", "127.1.0.0/23", ""],
        ["127.1.1.1/15", "127.0.0.0/15", ""],
        ["127.1.1.1/0", "0.0.0.0/0", ""],
        ["127.0.0.1/33", "", "Unable to parse CIDR prefix \"33\""],
        ["127.0.0.1/-1", "", "Unable to parse CIDR prefix \"-1\""],
        ["127.0.0.1/zero", "", "Unable to parse CIDR prefix \"zero\""],
        [".0.0.1/0", "", "Unable to parse IP address \".0.0.1\""],
        ["::1", "::1/128", ""],
        ["0:0:0:0:0:0:0:1", "::1/128", ""],
        ["0:0:0:0:0:0:0:1/64", "::/64", ""],
        ["ff::1/64", "ff::/64", ""],
        ["2001:4860:0000:2001:0000:0000:0000:0068/128", "2001:4860:0:2001::68/128", ""],
        ["2001:0:0000:2001:0000:0000:0000:0068/128", "2001:0:0:2001::68/128", ""],
        ["2001:0:0000:2001:0000:0000:0000:0068/64", "2001:0:0:2001::/64", ""],
    ];

    test.each(testCases)("%s", (input: string, output: string, expectedError: string) => {
        const testRun = () => parseIPNetwork(input)
            .toString();

        if (expectedError !== "") {
            expect(testRun)
                .toThrowError(expectedError);
        } else {
            const result = testRun()
                .toString();
            expect(result)
                .toBe(output);
        }
    });
});

describe("Contains", () => {
    const testCases: string[][] = [
        ["127.0.0.1", "127.0.0.0/24", "false"],
        ["127.0.5.0/24", "127.0.5.1", "true"],
        ["127.0.0.5/32", "127.0.0.5", "true"],
        ["127.0.6.0/24", "127.0.7.0/24", "false"],
        ["127.0.0.0/23", "127.0.1.0/24", "true"],
        ["ff::/64", "ff::/96", "true"],
        ["ff::/96", "ff::/64", "false"],
    ];

    test.each(testCases)("Does %s contain %s?", (containing: string, contained: string, result: string) => {
        const containingNetwork = parseIPNetwork(containing);
        const containedNetwork = parseIPNetwork(contained);
        expect(containingNetwork.contains(containedNetwork))
            .toBe(result === "true");
    });
});
