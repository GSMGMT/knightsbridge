import {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';
import toast from 'react-hot-toast';

import { api } from '@services/api';

import { NFTContext } from '@store/contexts/NFT';

import { PresaleNFT as IPresale } from '@contracts/presale/nft/PresaleCoin';

interface FlagsProviderProps {
  children: ReactElement;
  fetchedNFTs: Array<IPresale>;
}
export const NFTProvider: FunctionComponent<FlagsProviderProps> = ({
  children,
  fetchedNFTs = [],
}) => {
  const [NFTs, setNFTs] = useState<Array<IPresale>>([...fetchedNFTs]);

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

    const [
      {
        data: { data: newNFTsFetched },
      },
    ] = await Promise.all([fetchTokensPromise]);

    const newNFTs = newNFTsFetched.map(
      ({ createdAt, updatedAt, ...itemData }) =>
        ({
          ...itemData,
          updatedAt: new Date(updatedAt),
          createdAt: new Date(createdAt),
        } as IPresale)
    );

    setNFTs([...newNFTs]);
    setFetching(false);
  }, [fetching, processing]);
  useInterval(handleFetchNFTs, 1000 * 60);

  const handleBuyNFT = useCallback(
    async (uid: string) => {
      if (processing) return;

      try {
        handleSetProcessing(true);

        await api.post('/api/presale/nft/order', {
          presaleNFTId: uid,
        });

        toast.success('NFT bought successfully');
      } catch (error) {
        toast.error('Something went wrong, please try again');
      } finally {
        await handleFetchNFTs();

        handleSetProcessing(false);
      }
    },
    [processing, handleSetProcessing]
  );

  const value = useMemo(
    () => ({
      processing,
      handleSetProcessing,
      NFTs,
      handleFetchNFTs,
      handleBuyNFT,
    }),
    [processing, handleSetProcessing, NFTs, handleFetchNFTs, handleBuyNFT]
  );

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
