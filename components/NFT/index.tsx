import Image from 'next/image';
import { ReactElement, useContext } from 'react';
import cn from 'classnames';

import { navigation } from '@navigation';

import { AuthContext } from '@store/contexts/Auth';

import { Link } from '@components/Link';

import styles from './NFT.module.scss';

interface Label {
  positionX?: 'left' | 'right';
  positionY?: 'top' | 'bottom';
  text?: string;
}
const defaultLabelPosition: Label = {
  positionX: 'right',
  positionY: 'bottom',
  text: '',
};

type IPresale = {
  uid: string;
  author: string;
  name: string;
  icon: string;
};

type Presale<T> = T extends true
  ? IPresale & {
      amount: number;
      amountAvailable: number;
    }
  : IPresale & {
      amount?: never;
      amountAvailable?: never;
    };
type Action<T> = T extends true
  ? {
      action: ReactElement;
    }
  : {
      action?: never;
    };
type NFTProps<T extends boolean> = Action<T> & {
  data: Presale<T>;
  hasAction?: T;
  label?: Label;
};
export const NFT = <T extends boolean = true>({
  data,
  hasAction,
  label: {
    positionX = defaultLabelPosition.positionX,
    positionY = defaultLabelPosition.positionY,
    text: labelText = defaultLabelPosition.text,
  } = {
    positionX: defaultLabelPosition.positionX,
    positionY: defaultLabelPosition.positionY,
    text: defaultLabelPosition.text,
  },
  action,
}: NFTProps<T>) => {
  const { isAdmin } = useContext(AuthContext);

  const { author, name, amount, amountAvailable, icon, uid } = data;

  return (
    <Link
      href={
        isAdmin
          ? navigation.app.presale.nft.history + uid
          : navigation.app.presale.nft.item + uid
      }
      className={styles.link}
    >
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.picture}>
            <Image src={icon} alt="Teste" layout="fill" draggable={false} />
          </div>
          {labelText && (
            <div
              className={cn(
                styles.price,
                styles[positionX!],
                styles[positionY!]
              )}
            >
              {labelText}
            </div>
          )}
        </div>
        <div className={styles.item}>
          <div className={styles.info}>
            <div className={styles.author}>{author}</div>
            <div className={styles.name}>{name}</div>
          </div>
          {hasAction && (
            <div className={styles.action}>
              {action}
              <div className={styles.sale}>
                <span className={styles.items}>
                  {amountAvailable}/{amount}
                </span>
                <span className={styles.description}>on sale</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
NFT.defaultProps = {
  hasAction: true,
  label: defaultLabelPosition,
};
