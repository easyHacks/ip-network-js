import { resolve } from "path";
import { Configuration } from "webpack";

const outputFolder = ".";

const config: Configuration = {
    devtool: false,
    entry: "./index.ts",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: "ts-loader" }],
            },
        ],
    },
    optimization: { minimize: false },
    output: {
        filename: "index.js",
        libraryTarget: "commonjs2",
        path: resolve(outputFolder),
    },
    performance: { hints: false },
    resolve: {
        extensions: [".js", ".ts"],
    },
    target: "node",
};

// tslint:disable-next-line:no-default-export
export default config;
