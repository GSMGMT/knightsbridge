import { createContext } from 'react';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

export const NFTContext = createContext<{
  processing: boolean;
  handleSetProcessing: (isProcessing: boolean) => void;
  NFTs: IPresale[];
  handleFetchNFTs: () => Promise<void>;
}>({
  processing: true,
  handleSetProcessing: () => {},
  NFTs: [],
  handleFetchNFTs: async () => {},
});
