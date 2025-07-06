import { BCS, getRustConfig } from "@benfen/bcs";
import { ethers } from "ethers";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
} from "viem";
import { publicActionsL2, walletActionsL2 } from "viem/op-stack";
import { abi } from "./artifacts/contracts/Lock.sol/UmiCoreDAO.json";
import { privateKeyToAccount } from "viem/accounts";
declare global {
  interface Window {
    ethereum?: any; // or use EIP-1193 type below
  }
}

const CONTRACT_ADDRESS = "0x67F969d11984EA94F3F2DFb5c79A3cdcC0882Ea5";
const PRIVATE_KEY =
  "0xf287c7da2ab45d1ef1987544034e3580d326603a08f96a993cfea55b1c2d3424";

const bcs = new BCS(getRustConfig());
bcs.registerEnumType("SerializableTransactionData", {
  EoaBaseTokenTransfer: "",
  ScriptOrDeployment: "",
  EntryFunction: "",
  L2Contract: "",
  EvmContract: "Vec<u8>",
});

const serializeFunction = (data: string): `0x${string}` => {
  const code = Uint8Array.from(Buffer.from(data.replace("0x", ""), "hex"));
  const evmContract = bcs.ser("SerializableTransactionData", {
    EvmContract: code,
  });
  return `0x${evmContract.toString("hex")}`;
};

export const devnet = defineChain({
  id: 42069,
  sourceId: 42069,
  name: "Umi",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.uminetwork.com/"],
    },
  },
});

export const getAccount = async () => {
  const account = privateKeyToAccount(PRIVATE_KEY);
  return account;
};

export const publicClient = () =>
  createPublicClient({
    chain: devnet,
    transport: custom(window.ethereum!),
  }).extend(publicActionsL2());

export const walletClient = () =>
  createWalletClient({
    chain: devnet,
    transport: custom(window.ethereum!),
  }).extend(walletActionsL2());

export const getFunction = async (name: string) => {
  const counter = new ethers.Contract(CONTRACT_ADDRESS, abi);
  const tx = await counter.getFunction(name).populateTransaction();
  return { to: tx.to as `0x${string}`, data: serializeFunction(tx.data) };
};
