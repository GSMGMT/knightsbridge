import { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Bidding.module.sass';

interface BiddingItem {
  title: string;
  slug: string;
}
interface BiddingProps {
  title: string;
  children: ReactNode;
  items: Array<BiddingItem>;
  activeIndex: number;
}
export const Bidding = ({
  title,
  items,
  children,
  activeIndex,
}: BiddingProps) => (
  <div className={styles.bidding}>
    <div className={styles.head}>
      <div className={cn('container', styles.container)}>
        <h2 className={cn('h2', styles.title)}>{title}</h2>
        <div className={styles.info}>
          Any queries please contact our client services:{' '}
          <a className={styles.link} href="mailto:help@knights.app">
            help@knights.app
          </a>
        </div>
      </div>
    </div>
    <div className={styles.body}>
      <div className={cn('container', styles.container)}>
        <div className={styles.steps}>
          {items.map(({ slug, title: itemTitle }, index) => (
            <div
              className={cn(
                styles.step,
                { [styles.next]: index === activeIndex },
                { [styles.active]: index < activeIndex }
              )}
              key={slug}
            >
              <div className={styles.number}>{index + 1}</div>
              {itemTitle}
            </div>
          ))}
        </div>
        <div className={styles.wrapper}>{children}</div>
      </div>
    </div>
  </div>
);
