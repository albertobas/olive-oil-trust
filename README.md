# Olive Oil Trust

[![GNU General Public License v3.0](https://img.shields.io/badge/License-GNU_General_Public_License_v3.0-yellow.svg)](https://github.com/albertobas/olive-oil-trust/blob/main/LICENSE)

## About

[Olive Oil Trust](https://github.com/albertobas/olive-oil-trust 'https://github.com/albertobas/olive-oil-trust') is an olive oil traceability solution built on Ethereum that allows its members to trace and trade an ERC-1155 token representation of their own products, and end customers to trace and buy these tokens.

This can be seen as a collaboration network of olive growers, olive oil mills, bottle manufacturers, bottling plants, distributors, retailers and certifiers.

For this, they agree to follow the same rules, i.e. to abide by the same smart contracts to trade their tokens or to certify the types of the tokens.

Whenever a token is minted, it can be deposited in an escrow, which is the mechanism that another actor in the chain can use to acquire the ownership of this token after the correspondent payment to the escrow and approval from the seller.

The idea behind this project is to use the Ethereum blockchain as a means to give trust to its members and customers that the actions performed in the supply chain are, and will always remain, stored and unaltered.

This is due to the immutability characteristics of this technology, which then makes using this solution an excellent way to trace a product back to its origin with a total degree of confidence.

## Technical details

The contracts are written in Solidity using Hardhat, an Ethereum development environment. All the contracts are upgradeable and most of them are UUPS compliant.

The front-end code is mostly written in TypeScript using Next.js, a React.js framework, and it is implemented based on an hexagonal architecture in which the global state exists outside the core and persists globally using Redux.

Finally, data are queried from a local TheGraph node using GraphQL. The subgraph that is used is set to support multiple networks, relevant deployment data will be shared accordingly.

- **Contracts Framework**: [Hardhat](https://hardhat.org/)
- **Front-End Framework**: [Next.js](https://nextjs.org/)
- **Query Language**: [GraphQL](https://graphql.org/)
- **Data Resource**: [TheGraph](https://thegraph.com/)
- **Styling**: [PostCSS](https://postcss.org)

## Overview

- `hardhat-env/contracts/*`: smart contracts written in Solidity language.
- `hardhat-env/scripts/*`: TypeScript scripts to deploy contracts and to write relevant information about them in both front-end and subgraph workspaces.
- `hardhat-env/tasks/setState`: Hardhat task to set a state to the local node.
- `hardhat-env/test/*`: contracts unit tests with [Mocha](https://mochajs.org/) alongside [Chai](https://www.chaijs.com/) written using a Hardhat plugin for integration with [Waffle](https://hardhat.org/plugins/nomiclabs-hardhat-waffle.html) and [Ethers.js](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html).
- `next-app/src/app/*`: app state, postcss mixins and a global css file, user interface components and constants.
- `next-app/src/features/*`: explore and management web page sections. Each feature with its core, styles, user interface components and code. The data sources as well as the repositories and entities are in a shared folder at the same folders level.
- `next-app/src/pages/*`: static pages.
- `next-app/src/**/shared/*`: user interface code and constants shared across files at the same folder level.
- `next-app/src/**/styles/*`: CSSModules files.
- `services/*`: TheGraph graph node.
- `subgraph/scripts/*`: script to generate a subgraph manifest from a template, replacing keys for values from a JSON file.
- `subgraph/src/*`: mappings, written in AssemblyScript, constants and entities used to extract data from the local Hardhat chain, process them and store them.
- `subgraph/templates/*`: a subgraph manifest template.

## Running locally

First of all, a TheGraph node has to be configured in `services/graph-node`.

> Visit the TheGrpah [graph node repo](https://github.com/graphprotocol/graph-node/tree/f5e18bfdce700892e412096c26ec06090852a251) for more information about the TheGraph node.

The npm script to run this service currently runs the Docker image of the node, but this may well be changed as per your preference.

```bash
$ git clone https://github.com/albertobas/olive-oil-trust.git
$ cd olive-oil-trust
$ npm i
```

Now, run the Hardhat node:

```bash
$ npm run hardhat:node
```

Then, open two separate terminal tabs or windows and in one of them run the following command to start the TheGraph node:

```bash
$ npm run services:start
```

This will start PostgreSQL, IPFS and the TheGraph node in Docker. See the [Graph Node Docker Image](https://github.com/graphprotocol/graph-node/tree/f5e18bfdce700892e412096c26ec06090852a251/docker) GitHub page for more information.

Once it is up and running, in the terminal tab or window left run:

```bash
$ npm run start
```

This will compile the contracts, deploy them in the local Hardhat chain, paste required info in the subgraph and front-end workspaces, generate the subgraph manifest and finally create the subgraph and deploy it, i.e. load the subgraph, compile it, build it and upload it to IPFS.

When this is all accomplished, just run the following command to start the Next.js development server:

```bash
$ npm run next-app:dev
```

Then, visit `http://localhost:3000` to view your application.

In order to simulate the work flow in an olive oil supply chain, the current version of Olive Oil Trust deploys several contracts for figurative members in this supply chain.

Signer addresses from the Hardhat chain can be used to configure multiple wallets in Metamask for every single one of this members, as well as a figurative end customer, in order to sign transactions in the localhost chain.

In `hardhat-env/shared/constants.ts` we can see that `dictAccounts` gathers indexes for the signers in this simulation. These are the indexes of the correspondent addresses in the Hardhat local chain array of addresses.

Then, every figurative member, as well as an end customer, of this simulation in Olive Oil Trust is assigned a wallet address with fake Ether in the harhdat local chain, only for development purposes.

Running `npm run hardhat:setState`, or `npm run start:setState` above instead of `npm run start`, will set a state to the local chain to represent tokens being minted and traded from an imaginative olive grower to a figurative end customer.
