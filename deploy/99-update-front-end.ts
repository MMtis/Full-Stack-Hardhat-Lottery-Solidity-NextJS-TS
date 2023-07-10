import { HardhatRuntimeEnvironment } from "hardhat/types"
import fs from "fs"
import { DeployFunction } from "hardhat-deploy/types"

const FRONT_END_ADDRESSES_FILE =
    "./nextjs-smartcontract-lottery-ts/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "./nextjs-smartcontract-lottery-ts/constants/abi.json"

const UpdateUI: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, network, ethers } = hre
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        const raffle = await ethers.getContract("Raffle")
        fs.writeFileSync(
            FRONT_END_ABI_FILE,
            raffle.interface.format(ethers.utils.FormatTypes.json) as string
        )

        const chainId = network.config.chainId!.toString()
        const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
        if (chainId in currentAddresses) {
            if (!currentAddresses[chainId].includes(raffle.address)) {
                currentAddresses[chainId].push(raffle.address)
            }
        }
        {
            currentAddresses[chainId] = [raffle.address]
        }
        fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
    }
}

export default UpdateUI
UpdateUI.tags = ["all", "frontend"]
