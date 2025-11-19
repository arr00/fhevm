import { expect } from 'chai';
import { deployments, ethers } from 'hardhat';
import { ERC20Mock } from '../types';

describe('Testing deployment of ProtocolStaking, OperatorRegistry, then OperatorStaking', function () {
  let token: ERC20Mock;
  before(async function () {
    token = await ethers.deployContract('ERC20Mock', ['StakingToken', 'ST', 18]);
    await token.waitForDeployment();
    console.log('ERC20Mock deployed to', token.target);
  });

  it('deploys ProtocolStaking', async function () {
    process.env.STAKING_TOKEN = token.target as string;
    const protocolDeployment = await deployments.fixture(['staking-protocol'], { keepExistingDeployments: true });
    await deployments.save('ProtocolStaking_Proxy', protocolDeployment['ProtocolStaking_Proxy']);

    const protocolDep = await deployments.get('ProtocolStaking_Proxy');
    expect(protocolDep.address).to.be.properAddress;
  });

  it('deploys OperatorRegistry', async function () {
    const operatorRegistryDeployment = await deployments.fixture(['operator-registry'], { keepExistingDeployments: true });
    await deployments.save('ProtocolOperatorRegistry', operatorRegistryDeployment['ProtocolOperatorRegistry']);

    const registryDep = await deployments.get('ProtocolOperatorRegistry');
    expect(registryDep.address).to.be.properAddress;
  });

  it('deploys OperatorStaking', async function () {
    const [deployer] = await ethers.getSigners();
    process.env.OP_NAME = 'OPStakeTest';
    process.env.OP_SYMBOL = 'OPTEST';
    process.env.OP_OWNER = deployer.address;

    const operatorDeployment = await deployments.fixture(['staking-operator'], { keepExistingDeployments: true });
    await deployments.save('OperatorStaking', operatorDeployment['OperatorStaking']);
    await deployments.save('OperatorRewarder', operatorDeployment['OperatorRewarder']);

    const opDep = await deployments.get('OperatorStaking');
    const rwDep = await deployments.get('OperatorRewarder');
    const op = await ethers.getContractAt('OperatorStaking', opDep.address);
    const rewarder = await op.rewarder();
    expect(rewarder).to.equal(rwDep.address);
  });
});
