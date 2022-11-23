import Image from 'next/image';
import { FunctionComponent } from 'react';

import styles from './Detail.module.scss';

interface DetailProps {
  icon: string;
  author: string;
  name: string;
  description: string;
}
export const Detail: FunctionComponent<DetailProps> = ({
  icon,
  author,
  name,
  description,
}) => (
  <div className={styles.container}>
    <div className={styles.picture}>
      <Image src={icon} layout="fill" draggable={false} />
    </div>
    <div>
      <div className={styles.details}>
        <h3 className={styles.author}>{author}</h3>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  </div>
);
