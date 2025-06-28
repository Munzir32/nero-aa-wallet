import { pinFileWithPinata, pinJsonWithPinata } from "./pinata";
import { ChainType, TokenType } from "@/types/Pos";

export async function web3POSDetails({
    imageFile,
    name,
    description,
  }: {
    imageFile: File;
    name: string;
    description?: string;
  }) {
    const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
   
    const metadataJson = {
      description,
      image: imageFileIpfsUrl,
      name
    };
   
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }


  export async function web3POSBusinessDetails({
    businessName,
    businessAddress,
    businessEmail,
    supportedChains,
    supportedTokens,
    businessTheme = 'market', // Default theme
  }: {
    businessName: string;
    businessAddress: string;
    businessEmail: string;
    supportedChains: ChainType[];
  supportedTokens: TokenType[];
    businessTheme?: string;
  }) {
    // const imageFileIpfsUrl = await pinFileWithPinata(imageFile);
   
    const metadataJson = {
      businessName,
      businessAddress,
      businessEmail,
      supportedChains,
      supportedTokens,
      businessTheme, // Store the theme preference
      timestamp: Date.now(),
    };
   
    const contractMetadataJsonUri = await pinJsonWithPinata(metadataJson);
   
    return contractMetadataJsonUri;
  }
