import { useReadContract } from "wagmi";
import POSAbi from "../../contract/abi.json"
import { contractAddress } from '@/contract';

export const useReadProduct = (id: string) => {
    const { data: posproduct } = useReadContract({
        abi: POSAbi,
        address: contractAddress,
        functionName: "products",
        args: [id],
    })

    return { posproduct }
}


export const useReadProductLen = () => {
    const { data: posproductLen } = useReadContract({
        abi: POSAbi,
        address: contractAddress,
        functionName: "_nextProductId",
        args: [],
    })

    return { posproductLen }
}

export const useGetProductDetails = () => {
    
}