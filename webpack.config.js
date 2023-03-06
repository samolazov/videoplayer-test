const path = require("path");

module.exports = {
    devtool: "inline-source-map",
    entry: "./src/index.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    output: {
        filename: "example/index.js",
        path: path.resolve(__dirname, ""),
    },
};
