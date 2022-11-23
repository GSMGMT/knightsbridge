import { FunctionComponent } from 'react';

import { Header } from '@sections/pages/app/presale/nft/item/Header';
import { Main } from '@sections/pages/app/presale/nft/item/Main';
import { Store } from '@sections/pages/app/presale/nft/item/Store';

import styles from '@styles/pages/app/presale/Presale.module.sass';

import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';

interface ContainerProps {
  nft: PresaleNFT;
}
export const Container: FunctionComponent<ContainerProps> = ({ nft }) => (
  <div className={styles.container}>
    <Header title={nft.name} />
    <Main
      uid={nft.uid}
      amountAvailable={nft.amountAvailable}
      icon={nft.icon}
      name={nft.name}
      author={nft.author}
      description={nft.description}
      quote={nft.quote}
      currencySymbol={nft.baseCurrency.symbol}
    />
    <Store nftUid={nft.uid} />
  </div>
);
