import { HardhatUserConfig } from 'hardhat/types';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'tsconfig-paths/register';
import './tasks/set-state';

const config: HardhatUserConfig = {
  solidity: '0.8.14',
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      chainId: 1337 // https://hardhat.org/metamask-issue.html
    },
    localhost: {
      chainId: 1337,
      url: 'http://localhost:8545'
    }
  },
  paths: {
    tests: './test'
  },
  typechain: {
    outDir: './types'
  },
  gasReporter: {
    currency: 'EUR',
    enabled: !!(typeof process.env.REPORT_GAS !== 'undefined'),
    excludeContracts: [],
    src: './contracts'
  }
};

export default config;
