import styles from '@styles/pages/app/presale/Presale.module.sass';

import { Main } from '@sections/pages/app/presale/nft/Main';
import { Buy } from '@sections/pages/app/presale/nft/Buy';
import { Trending } from '@sections/pages/app/presale/nft/Trending';

const PresaleNFT = () => (
  <div className={styles.container}>
    <Main />
    <Buy />
    <Trending />
  </div>
);

export default PresaleNFT;
