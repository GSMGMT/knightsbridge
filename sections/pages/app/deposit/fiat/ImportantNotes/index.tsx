import cn from 'classnames';
import { MouseEventHandler, useContext, useMemo } from 'react';

import { AuthContext } from '@store/contexts/Auth';

import { useCopy } from '@hooks/Copy';

import styles from './ImportantNotes.module.scss';

interface ImportantNoteProps {
  goNext: () => void;
  referenceNumber: string;
}
export const ImportantNotes = ({
  goNext,
  referenceNumber,
}: ImportantNoteProps) => {
  const { user } = useContext(AuthContext);

  const name = useMemo(() => `${user.name} ${user.surname}`, [user]);

  const handleClickButton: MouseEventHandler<HTMLButtonElement> = () =>
    goNext();

  const { handleElementCopy: handleCopy } = useCopy();

  return (
    <div className={styles.item}>
      <div className={styles.title} data-testid="title">
        Important notes
      </div>
      <div className={styles.text}>
        We ONLY accept fundings from a bank account under your own name:
      </div>
      <div className={styles.info}>{name}</div>
      <div className={styles.text}>
        You MUST include the Reference Code in your deposit in order to credit
        your account!
      </div>
      <div className={styles.text}>
        DISCLAIMER: If you have made, or wish to make, a deposit under a
        different name or have not included, or cannot include, your Reference
        Code contact <a href="mailto:help@knights.app">help@knights.app</a>
      </div>
      <div className={styles.text}>Reference Code:</div>
      <div
        className={styles.code}
        role="button"
        tabIndex={-1}
        onClick={handleCopy}
        data-testid="reference-code"
      >
        {referenceNumber}
      </div>
      <div className={styles.btns}>
        <button
          className={cn('button', styles.button)}
          onClick={handleClickButton}
          type="button"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
