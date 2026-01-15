export interface IDeployedActorAndDeps {
  id: string;
  address: string;
  blockNumber: number | undefined;
  module: string | null;
}

export interface IDeployedContractsJson {
  [chainId: string]: Array<{
    name: string;
    chainId: string;
    contracts: {
      [contractName: string]: {
        address: string;
        abi: any[];
      };
    };
  }>;
}

export interface ILibraries {
  validation: string;
  constants: string;
}
