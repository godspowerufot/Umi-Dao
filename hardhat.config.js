import "@nomicfoundation/hardhat-toolbox";

const config = {
  solidity: "0.8.28",
  defaultNetwork: "devnet",
  networks: {
    devnet: {
      url: "https://devnet.moved.network",
      accounts: [
        "f287c7da2ab45d1ef1987544034e3580d326603a08f96a993cfea55b1c2d3424",
      ],
    },
  },
};

export default config;
