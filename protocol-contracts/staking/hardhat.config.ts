import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-ethers';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomicfoundation/hardhat-verify';
import '@typechain/hardhat';
import 'dotenv/config'
import 'hardhat-exposed';
import 'hardhat-gas-reporter';
import 'hardhat-ignore-warnings';
import { HardhatUserConfig } from 'hardhat/config';
import './tasks/staking-verify';
import 'solidity-coverage';
import { HttpNetworkAccountsUserConfig } from 'hardhat/types';

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
  ? { mnemonic: MNEMONIC }
  : PRIVATE_KEY
    ? [PRIVATE_KEY]
    : {mnemonic: "test test test test test test test test test test test junk"}

if (accounts == null) {
  console.warn(
    'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
  )
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.29',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'cancun',
    },
  },
  networks: {
    'ethereum-testnet': {
      url: process.env.SEPOLIA_RPC_URL,
      accounts,
    },
    localhost: {
      accounts,
      chainId: 31337,
      url: 'http://localhost:8545',
    }
  },
  gasReporter: {
    currency: 'USD',
    enabled: !!process.env.REPORT_GAS,
    showMethodSig: true,
    includeBytecodeInJSON: true,
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v6',
  },
  exposed: {
    imports: true,
    initializers: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
  namedAccounts: {
    deployer: {
      default: 0, // wallet address of index[0], of the mnemonic in .env
    },
  },
};

export default config;
