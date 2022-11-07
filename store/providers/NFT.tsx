import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { api } from '@services/api';
import { Portfolio, PresaleData } from '@services/api/presale/nft/portfolio';

import { NFTContext } from '@store/contexts/NFT';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

interface FlagsProviderProps {
  children: ReactElement;
  fetchedNFTs: Array<IPresale>;
  fetchedAssets: Array<PresaleData>;
}
export const NFTProvider = ({
  children,
  fetchedNFTs,
  fetchedAssets,
}: FlagsProviderProps) => {
  const [NFTs, setNFTs] = useState<Array<IPresale>>([...fetchedNFTs]);
  const [assets, setAssets] = useState<Array<PresaleData>>([...fetchedAssets]);

  const [processing, setProcessing] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const handleSetProcessing = useCallback(
    (isProcessing: boolean) => setProcessing(isProcessing),
    [processing]
  );

  const handleFetchNFTs = useCallback(async () => {
    if (fetching || processing) return;

    setFetching(true);

    const fetchTokensPromise = api.get<{
      data: Array<IPresale>;
    }>('/api/presale/nft/token');
    const fetchAssetsPromise = api.get<{
      data: Portfolio;
    }>('/api/presale/nft/portfolio');

    const [
      {
        data: { data: newNFTsFetched },
      },
      {
        data: {
          data: { assets: newAssetsFetched },
        },
      },
    ] = await Promise.all([fetchTokensPromise, fetchAssetsPromise]);

    const newNFTs = newNFTsFetched.map(
      ({ createdAt, updatedAt, ...itemData }) =>
        ({
          ...itemData,
          updatedAt: new Date(updatedAt),
          createdAt: new Date(createdAt),
        } as IPresale)
    );
    const newAssets = newAssetsFetched.map(
      ({ ...itemData }) =>
        ({
          ...itemData,
        } as PresaleData)
    );

    setNFTs([...newNFTs]);
    setAssets([...newAssets]);
    setFetching(false);
  }, [fetching, processing]);
  useInterval(handleFetchNFTs, 1000 * 60);

  const value = useMemo(
    () => ({
      processing,
      handleSetProcessing,
      NFTs,
      handleFetchNFTs,
      assets,
    }),
    [processing, handleSetProcessing, NFTs, handleFetchNFTs, assets]
  );

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
