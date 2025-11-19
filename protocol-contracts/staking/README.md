# Staking Contracts

## Deployment

Copy the `.env.example` file to `.env` and fill in the values.

Then, run the following commands to deploy the contracts:

```
npx hardhat deploy --tags staking-protocol --network <net>
npx hardhat deploy --tags operator-registry --network <net>
npx hardhat deploy --tags staking-operator --network <net>
```

> Note: order matters; the staking protocol must be deployed before the staking operators.

## Verification

To verify the contracts, run the following commands:
```
npx hardhat staking:verify:protocol --network <net>
npx hardhat staking:verify:operator --network <net>
```

To verify specific contract addresses:
```
npx hardhat staking:verify:protocol --address <address> --network <net>
npx hardhat staking:verify:operator --address <operator-address> --rewarder <rewarder-address> --network <net>
```
