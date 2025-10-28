import assert from 'assert';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers, deployments, getNamedAccounts } = hre;
  const { log, save, getArtifact } = deployments;
  const { deployer } = await getNamedAccounts();

  assert(deployer, "Missing named deployer account");

  const name = process.env.OP_NAME;
  if (!name) throw new Error('OP_NAME not set');
  const symbol = process.env.OP_SYMBOL;
  if (!symbol) throw new Error('OP_SYMBOL not set');
  const protocol = (await deployments.get('ProtocolStaking_Proxy')).address;
  if (!ethers.isAddress(protocol)) throw new Error(`Invalid ProtocolStaking proxy address: ${protocol}`);
  const owner = process.env.OP_OWNER;
  if (!owner || !ethers.isAddress(owner)) throw new Error(`Invalid OP_OWNER address: ${owner}`);

  log(`[OperatorStaking] OperatorStaking token name=${name}`);
  log(`[OperatorStaking] OperatorStaking token symbol=${symbol}`);
  log(`[OperatorStaking] ProtocolStaking proxy=${protocol}`);
  log(`[OperatorStaking] Owner=${owner}`);
  log(`[OperatorStaking] deploying...`);

  const F = await ethers.getContractFactory('OperatorStaking');
  const op = await F.deploy(name, symbol, protocol, owner);
  await op.waitForDeployment();

  const opAddress = await op.getAddress();
  log(`[OperatorStaking] ${opAddress}`);

  const rewarder = await op.rewarder();
  log(`[OperatorRewarder] ${rewarder}`);

  const opArtifact = await getArtifact('OperatorStaking');
  const rwArtifact = await getArtifact('OperatorRewarder');
  await save('OperatorStaking', { address: opAddress, abi: opArtifact.abi });
  await save('OperatorRewarder', { address: rewarder, abi: rwArtifact.abi });
};

export default deploy;
deploy.tags = ['staking-operator'];
