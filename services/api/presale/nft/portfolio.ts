import getAssetsByWalletUid from '@libs/firebase/functions/wallet/presaleNFTAsset/getAssetsByWalletUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { PresaleAsset as Asset } from '@contracts/presale/nft/PresaleAsset';

export type PresaleData = {
  uid: string;
  name: string;
  author: string;
  quote: number;
  icon: string;
  baseCurrency: string;
};

export type Portfolio = {
  assets: PresaleData[];
};

export const usersPresalePortfolio = async (
  userUid: string
): Promise<Portfolio> => {
  const wallet = await getWalletByUserUid(userUid);

  let assets: Asset[] = [];

  if (wallet) {
    assets = await getAssetsByWalletUid(wallet.uid);
  }

  const portfolio: PresaleData[] = assets
    .sort(({ createdAt: a }, { createdAt: b }) => +b - +a)
    .map(
      ({
        nft: {
          author,
          baseCurrency: { symbol: baseCurrency },
          icon,
          name,
          quote,
          uid,
        },
      }) =>
        ({
          author,
          uid,
          baseCurrency,
          icon,
          name,
          quote,
        } as PresaleData)
    );

  return {
    assets: portfolio,
  };
};
