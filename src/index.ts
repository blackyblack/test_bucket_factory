import "dotenv/config";
import type {PrimexLens} from "./typechain/PrimexLens";
import { address as lensAddress, abi as lensAbi } from "./abi/PrimexLens.json";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, Wallet } from "ethers";
import assert from "assert";

const JSON_RPC_DEFAULT = "https://public.stackup.sh/api/v1/node/polygon-mainnet";

async function main() {
  const rpc = process.env["JSON_RPC"] ?? JSON_RPC_DEFAULT;

  const provider = new JsonRpcProvider(rpc);
  const wallet = Wallet.createRandom().connect(provider);
  const lensContract = (new Contract(lensAddress, lensAbi, provider) as PrimexLens).connect(wallet);
  const bucketInfo = await lensContract.getAllBucketsFactory("0x7E6915D307F434E4171cCee90e180f5021c60089", "0xB1cDF42c16D8dAa4311033CB3101276D986c7D89", "0x02bcaA4633E466d151b34112608f60A82a4F6035", true);

  console.log("Got bucket info: " + bucketInfo);

  const bucketAddresses = bucketInfo.map(val => { return val[0]});
  assert(bucketAddresses.includes("0x12c125181Eb7c944EaEfcB2AE881475870f0Aff3"), "Should contain USDC Bucket");
}

main()
  .then(text => {
    console.log(text);
  })
  .catch(err => {
    console.log(err);
  });