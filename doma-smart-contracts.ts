// doma-smart-contracts.ts
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

// Doma Protocol Smart Contract Addresses (Testnet)
export const DOMA_SMART_CONTRACTS = {
  DOMA_RECORD: '0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8',
  DOMA_FORWARDER: '0xf17beC16794e018E2F0453a1282c3DA3d121f410',
  DOMA_GATEWAY: '0xCE1476C791ff195e462632bf9Eb22f3d3cA07388',
  DOMA_RECORD_PROXY: '0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff',
  OWNERSHIP_TOKEN: '0x9A374915648f1352827fFbf0A7bB5752b6995eB7'
}

// Doma testnet chain configuration
export const DOMA_CHAIN_CONFIG = {
  chainId: '0x17d74', // Doma Testnet (97476)
  chainName: 'Doma Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rpc-testnet.doma.xyz/'],
  blockExplorerUrls: ['https://explorer-testnet.doma.xyz']
}

// ...rest of the file unchanged...

// Update the isConnectedToDomaTestnet function to check for testnet
async isConnectedToDomaTestnet(): Promise<boolean> {
  try {
    const chainId = await this.web3.eth.getChainId()
    return chainId === 97476 // Doma testnet
  } catch (error) {
    console.error('[DomaSmartContracts] Error checking chain:', error)
    return false
  }
}

// Update switchToDomaTestnet to use the correct chainId
async switchToDomaTestnet(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: DOMA_CHAIN_CONFIG.chainId }],
      })
      return true
    }
    return false
  } catch (error) {
    console.error('[DomaSmartContracts] Error switching network:', error)
    return false
  }
}

// Add a method to get ETH balance for connected wallet
async getEthBalance(address: string): Promise<string> {
  try {
    const balanceWei = await this.web3.eth.getBalance(address)
    // Return balance in ETH
    return this.web3.utils.fromWei(balanceWei, 'ether')
  } catch (error) {
    console.error('[DomaSmartContracts] Error fetching ETH balance:', error)
    return '0'
  }
}