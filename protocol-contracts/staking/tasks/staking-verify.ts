import { task } from 'hardhat/config';

task('staking:verify:protocol', 'Verify ProtocolStaking implementation or via proxy')
  .addOptionalParam('address', 'Contract address to verify (if not provided, uses deployment)')
  .setAction(async (args, hre) => {
    const { deployments, run } = hre;

    const contractAddress = args.address || (await deployments.get('ProtocolStaking_Proxy')).address;
    console.log(`[verify] ProtocolStaking ${contractAddress}`);

    await run('verify:verify', { address: contractAddress });
    console.log('ProtocolStaking verified');
  });

task('staking:verify:operator', 'Verify OperatorStaking and OperatorRewarder')
  .addOptionalParam('address', 'OperatorStaking address to verify (if not provided, uses deployment)')
  .addOptionalParam('rewarder', 'OperatorRewarder address to verify (if not provided, uses deployment)')
  .setAction(async (args, hre) => {
    const { deployments, run, ethers } = hre;

    const opAddress = args.address || (await deployments.get('OperatorStaking')).address;
    const rwAddress = args.rewarder || (await deployments.get('OperatorRewarder')).address;


    const op = await ethers.getContractAt('OperatorStaking', opAddress);
    const name = await op.name();
    const symbol = await op.symbol();
    const owner = await op.owner();
    const protocolAddr = (await op.protocolStaking()) as string;

    console.log(`[verify] OperatorStaking ${opAddress}`);
    await run('verify:verify', {
      address: opAddress,
      constructorArguments: [name, symbol, protocolAddr, owner],
    });

    console.log(`[verify] OperatorRewarder ${rwAddress}`);
    await run('verify:verify', {
      address: rwAddress,
      constructorArguments: [owner, protocolAddr, opAddress],
    });

    console.log('Done');
  });
