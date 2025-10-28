import assert from 'assert';
import { getNamedAccounts } from 'hardhat';
import { type DeployFunction } from 'hardhat-deploy/types';

const deploy: DeployFunction = async (hre) => {
  const { ethers, upgrades, deployments } = hre;
  const { log, save, getArtifact } = deployments;
  const { deployer } = await getNamedAccounts();
  assert(deployer, "Missing named deployer account");

  const name = process.env.STAKING_NAME
  if (!name) throw new Error('STAKING_NAME not set');

  const symbol = process.env.STAKING_SYMBOL;
  if (!symbol) throw new Error('STAKING_SYMBOL not set');

  const version = process.env.STAKING_VERSION;
  if (!version) throw new Error('STAKING_VERSION not set');

  const stakingToken = process.env.STAKING_TOKEN;
  if (!stakingToken || !ethers.isAddress(stakingToken)) throw new Error(`Invalid staking token address: ${stakingToken}`);

  if (!ethers.isAddress(stakingToken)) throw new Error('STAKING_TOKEN is not a valid address');
  const cooldown = Number(process.env.STAKING_COOLDOWN);
  if (!cooldown) throw new Error('STAKING_COOLDOWN not set');
  const governorAddr = process.env.GOVERNOR;
  if (!governorAddr || !ethers.isAddress(governorAddr)) throw new Error(`Invalid governor address: ${governorAddr}`);
  const upgraderAddr = process.env.UPGRADER;
  if (!upgraderAddr || !ethers.isAddress(upgraderAddr)) throw new Error(`Invalid upgrader address: ${upgraderAddr}`);
  const managerAddr = process.env.MANAGER;
  if (!managerAddr || !ethers.isAddress(managerAddr)) throw new Error(`Invalid manager address: ${managerAddr}`);

  log(`[ProtocolStaking] Staking token name=${name}`);
  log(`[ProtocolStaking] Staking token symbol=${symbol}`);
  log(`[ProtocolStaking] Staking token signing domain version=${version}`);
  log(`[ProtocolStaking] Staking token underlying address=${stakingToken}`);
  log(`[ProtocolStaking] Unstake cooldown period=${cooldown}s`);
  log(`[ProtocolStaking] Governor address=${governorAddr}`);
  log(`[ProtocolStaking] Upgrader address=${upgraderAddr}`);
  log(`[ProtocolStaking] Manager address=${managerAddr}`);
  log(`[ProtocolStaking] deploying...`);

  const F = await ethers.getContractFactory('ProtocolStaking');
  const proxy = await upgrades.deployProxy(
    F,
    [name, symbol, version, stakingToken, governorAddr, upgraderAddr, managerAddr, cooldown],
    { kind: 'uups', initializer: 'initialize' }
  );
  await proxy.waitForDeployment();

  const proxyAddr = await proxy.getAddress();
  const implAddr = await upgrades.erc1967.getImplementationAddress(proxyAddr);

  log(`[ProtocolStaking] proxy=${proxyAddr}`);
  log(`[ProtocolStaking] impl =${implAddr}`);

  const artifact = await getArtifact('ProtocolStaking');
  await save('ProtocolStaking_Proxy', { address: proxyAddr, abi: artifact.abi });
  await save('ProtocolStaking_Impl', { address: implAddr, abi: artifact.abi });
};

export default deploy;
deploy.tags = ['staking-protocol'];
deploy.dependencies = [];
