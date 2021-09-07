import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const conf = {
  wssNode: 'wss://wsapi.fantom.network',
  rarityContractAddress: '0xce761d788df608bd21bdd59d6f4b54b2e27f25bb',
  privateKey: process.env.WALLET_PRIVATE_KEY,
}

const provider = new ethers.providers.WebSocketProvider(conf.wssNode)
const wallet = new ethers.Wallet(conf.privateKey, provider)
const account = wallet.connect(provider)

const abi = ['function summon(uint256)']
const rarity = new ethers.Contract(conf.rarityContractAddress, abi, account)

const classes = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]
const summonCountPerClass = 100

const gasPrice = ethers.utils.parseUnits('70', 'gwei')

const summon = async () => {
  const tokenIds = []

  for (let i = 0; i < summonCountPerClass; i++) {
    for (const c of classes) {
      console.log(`Summoning class ${c} for the ${i + 1} times...`)
      const tx = await rarity.summon(c, {
        gasPrice,
        gasLimit: 200000,
        nonce: null,
      })
      const receipt = await tx.wait()
      const tokenId = parseInt(receipt.logs[0].topics[3], 16)
      tokenIds.push(tokenId)
    }
  }

  return tokenIds
}

const run = async () => {
  const tokenIds = await summon()
  console.log('Summoned Token IDs:')
  console.log(tokenIds.join(','))
}