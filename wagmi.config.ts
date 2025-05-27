import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import CredoraPoolFactoryABI from './abis/CredoraPoolFactory.abi.json'
import CredoraLoanPoolABI from './abis/CredoraLoanPool.abi.json'
import MockUSDCABI from './abis/MockUSDC.abi.json'
import { Abi } from 'viem'

// Deployment Block Number: 2308473
export default defineConfig({
    out: 'generated.ts',
    contracts: [
        {
            name: "CredoraPoolFactory",
            address: {
                42421: "0x3e1cBb7302218652c8E0bD208155E3FECd6012be"
            },
            abi: CredoraPoolFactoryABI as Abi
        },
        {
            name: "CredoraLoanPool",
            address: {
                // This address is the implementation address from deployment.json (CredoraLoanPool_Implementation)
                // 42421: "0xB8c9ac20a4f7846E01fE38620c4bC79e2392c8A8"
            },
            abi: CredoraLoanPoolABI as Abi,
        },
        {
            name: "MockUSDC",
            address: {
                42421: "0xceE2E796f2d7A9aEa0Bf2bb5382D328053A985e5"
            },
            abi: MockUSDCABI as Abi,
        }
    ],
    plugins: [
        react(),
    ],
})

