import { createContext } from 'react';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

export const NFTContext = createContext<{
  processing: boolean;
  handleSetProcessing: (isProcessing: boolean) => void;
  NFTs: IPresale[];
  handleBuyNFT: (uid: string) => Promise<void>;
  handleFetchNFTs: () => Promise<void>;
}>({
  processing: true,
  handleSetProcessing: () => {},
  NFTs: [],
  handleBuyNFT: async () => {},
  handleFetchNFTs: async () => {},
});
