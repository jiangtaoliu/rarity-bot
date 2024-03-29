import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const conf = {
  rpc: 'https://rpc.ftm.tools',
  rarityContractAddress: '0xce761d788df608bd21bdd59d6f4b54b2e27f25bb',
  privateKey: process.env.WALLET_PRIVATE_KEY,
  summonCountPerClass: process.env.SUMMON_COUNT,
}

const provider = new ethers.providers.JsonRpcProvider(conf.rpc)
const wallet = new ethers.Wallet(conf.privateKey, provider)
const account = wallet.connect(provider)

const abi = ['function summon(uint256)']
const rarity = new ethers.Contract(conf.rarityContractAddress, abi, account)

const classes = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]
const summonCountPerClass = parseInt(conf.summonCountPerClass, 10)

const summon = async () => {
  const tokenIds = []
  let nonce = await provider.getTransactionCount(wallet.address)

  for (let i = 0; i < summonCountPerClass; i++) {
    for (const c of classes) {
      console.log(`Summoning class ${c} for the ${i + 1} time...`)

      const gasPrice = await provider.getGasPrice()
      const tx = await rarity.summon(c, {
        gasPrice,
        nonce,
        gasLimit: 210000,
      })
      const receipt = await tx.wait()

      console.log(
        `Transaction receipt : https://ftmscan.com/tx/${receipt.logs[1].transactionHash}`
      )

      const tokenId = parseInt(receipt.logs[0].topics[3], 16)
      tokenIds.push(tokenId)

      nonce++

      console.log(`Hero #${tokenId} is summoned!`)

      console.log('==============================')
      console.log('Summoned Token IDs:')
      console.log(tokenIds.join(','))
      console.log('==============================')
    }
  }
}

await summon()
