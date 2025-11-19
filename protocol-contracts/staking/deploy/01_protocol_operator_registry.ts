import assert from 'assert';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  assert(deployer, "Missing named deployer account");

  await deploy('ProtocolOperatorRegistry', {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deploy;
deploy.tags = ['operator-registry'];
