import { useContext, useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import Image from 'next/image';

import { AuthContext } from '../../../store/contexts/Auth';

import user from '../../../public/images/avatar-user.jpg';

import styles from './User.module.scss';

import { Icon, Icons } from '../../Icon';
import { Theme } from '../../Theme';
import { Link } from '../../Link';

interface Item {
  title: string;
  icon: Icons;
  content?: string;
  url?: string;
}
const items: Item[] = [
  {
    title: 'Dark mode',
    icon: 'theme-dark',
    content: 'Switch dark/light mode',
  },
];

interface UserProps {
  className?: string;
}
export const User = ({ className }: UserProps) => {
  const { signOut } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(className, styles.user, { [styles.active]: visible })}>
        <button
          className={styles.head}
          onClick={() => setVisible(!visible)}
          type="button"
        >
          <Image src={user} alt="Avatar" />
        </button>
        <div className={styles.body}>
          <div className={styles.menu}>
            {items.map((x) =>
              x.url ? (
                <Link
                  className={styles.item}
                  href={x.url}
                  onClick={() => setVisible(!visible)}
                  key={x.title}
                >
                  <div className={styles.icon}>
                    <Icon name={x.icon} size={20} />
                  </div>
                  <div className={styles.details}>
                    <div className={styles.title}>{x.title}</div>
                    <div className={styles.content}>{x.content}</div>
                  </div>
                </Link>
              ) : (
                <div className={styles.item} key={x.title}>
                  <div className={styles.icon}>
                    <Icon name={x.icon} size={20} />
                  </div>
                  <div className={styles.details}>
                    <div className={styles.line}>
                      <div className={styles.title}>{x.title}</div>
                      <Theme className={styles.theme} small />
                    </div>
                    <div className={styles.content}>{x.content}</div>
                  </div>
                </div>
              )
            )}
            <button className={styles.item} onClick={signOut} type="button">
              <div className={styles.icon}>
                <Icon name="exit" size={20} />
              </div>
              <div className={styles.details}>
                <div className={styles.title}>Sign out</div>
                <div className={styles.content} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};
User.defaultProps = {
  className: '',
};
