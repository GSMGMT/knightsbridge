import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { NFTContext } from '@store/contexts/NFT';

import styles from '@styles/pages/app/presale/Presale.module.sass';

import { Main } from '../Main';
import { Buy } from '../Buy';
import { Trending } from '../Trending';

const PresaleNFTContainer: FunctionComponent = () => {
  const mobile = useMediaQuery('(min-width: 475px) and (max-width: 639px)');
  const desktop = useMediaQuery('(min-width: 1601px)');

  const [responsive, setResponsive] = useState(false);

  const { NFTs } = useContext(NFTContext);
  const definedNFTs = useMemo(
    () => NFTs.sort(({ createdAt: a }, { createdAt: b }) => +b - +a),
    [NFTs]
  );
  const itemsOnNewest = useMemo(() => {
    if (responsive) {
      if (desktop) return 4;

      if (mobile) return 2;
    }

    return 3;
  }, [mobile, desktop, responsive]);
  const newestNFTs = useMemo(
    () => NFTs.slice(0, itemsOnNewest),
    [definedNFTs, itemsOnNewest]
  );
  const trendingNFTs = useMemo(
    () => NFTs.slice(itemsOnNewest, -1),
    [definedNFTs, itemsOnNewest]
  );

  useEffect(() => {
    setResponsive(true);
  }, []);

  return (
    <div className={styles.container}>
      <Main />
      <Buy items={newestNFTs} />
      <Trending items={trendingNFTs} />
    </div>
  );
};

export default PresaleNFTContainer;
