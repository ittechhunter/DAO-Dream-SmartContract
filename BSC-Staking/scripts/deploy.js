const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const HelloWorldFactory = await hre.ethers.getContractFactory("HelloWorld");
  const HelloWorld = await HelloWorldFactory.deploy(
    'Hello World! This is Passioneer.' // Init_Message
  );
  await HelloWorld.deployed();
  console.log("HelloWorld deployed to:", HelloWorld.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });