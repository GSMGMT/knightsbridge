import { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';

import { ExchangeContext } from '@store/contexts/Exchange';

import { Icon } from '@components/Icon';

import styles from './Form.module.sass';

import { Buy } from './Action/Buy';
import { Sell } from './Action/Sell';

interface FormProps {
  visible: boolean;
  setValue: (newValue: boolean) => void;
}
export const Form = ({ visible, setValue }: FormProps) => {
  const { pair } = useContext(ExchangeContext);
  const {
    base: { slug },
  } = pair!;

  const isTablet = useMediaQuery({ query: '(max-width: 1023px)' });

  return isTablet ? (
    visible ? (
      <>
        <div className={styles.head}>
          <div className={styles.title}>Place order</div>
          <button
            className={styles.close}
            onClick={() => setValue(false)}
            type="button"
          >
            <Icon name="close-circle" size={24} />
          </button>
        </div>
        <Buy classButton="button-green" buttonText={`Buy ${slug}`} />
      </>
    ) : (
      <>
        <div className={styles.head}>
          <div className={styles.title}>Place order</div>
          <button
            className={styles.close}
            onClick={() => setValue(false)}
            type="button"
          >
            <Icon name="close-circle" size={24} />
          </button>
        </div>
        <Sell classButton="button-red" buttonText={`Sell ${slug}`} />
      </>
    )
  ) : (
    <div className={styles.row}>
      <div className={styles.col}>
        <Buy classButton="button-green" buttonText={`Buy ${slug}`} />
      </div>
      <div className={styles.col}>
        <Sell classButton="button-red" buttonText={`Sell ${slug}`} />
      </div>
    </div>
  );
};
