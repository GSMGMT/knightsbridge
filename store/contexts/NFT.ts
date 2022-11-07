import { createContext } from 'react';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';
import { PresaleData } from '@services/api/presale/nft/portfolio';

export const NFTContext = createContext<{
  processing: boolean;
  handleSetProcessing: (isProcessing: boolean) => void;
  NFTs: IPresale[];
  assets: PresaleData[];
  handleFetchNFTs: () => Promise<void>;
}>({
  processing: true,
  handleSetProcessing: () => {},
  NFTs: [],
  assets: [],
  handleFetchNFTs: async () => {},
});
