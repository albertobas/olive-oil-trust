import { ethers, waffle } from 'hardhat';
import { Wallet } from 'ethers';
import { Contracts, Tokens } from 'hardhat-env/test/shared/types';

export function baseContext(description: string, hooks: () => void): void {
  describe(description, function () {
    before(async function () {
      // eslint-disable-next-line
      this.contracts = {} as Contracts;
      // eslint-disable-next-line
      this.token = {} as Tokens;
      const [deployer, acc2, acc3] = (await (ethers as any).getSigners()) as Wallet[];
      this.signers = { deployer, acc2, acc3 };
      this.loadFixture = waffle.createFixtureLoader([deployer, acc2, acc3]);
    });
    hooks();
  });
}
