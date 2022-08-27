import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import OutsideClickHandler from 'react-outside-click-handler';
import cn from 'classnames';

import styles from './Modal.module.sass';

import { Icon } from '../Icon';

type Props =
  | {
      canBack: true;
      backAction: () => void;
    }
  | {
      canBack?: false;
      backAction?: never;
    };
type ModalProps = Props & {
  visible: boolean;
  onClose?: () => void;
  outerClassName?: string;
  children: ReactNode;
  title?: string;
};
export function Modal({
  outerClassName,
  visible,
  onClose = () => {},
  children,
  title,
  canBack,
  backAction,
}: ModalProps) {
  useEffect(() => {
    if (visible) {
      const target = document.querySelector('#modal')!;
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  return createPortal(
    visible && (
      <div id="modal" className={styles.modal}>
        <div id="modal-area" className={cn(styles.outer, outerClassName)}>
          <OutsideClickHandler onOutsideClick={onClose}>
            {title && (
              <div className={cn('h4', styles.title)}>
                {canBack && (
                  <button
                    type="button"
                    onClick={backAction}
                    className={styles.back}
                  >
                    <Icon name="arrow-left" size={32} />
                  </button>
                )}
                <span className={styles.label}>{title}</span>
              </div>
            )}
            {children}
            <button className={styles.close} onClick={onClose} type="button">
              <Icon name="close" size={24} />
            </button>
          </OutsideClickHandler>
        </div>
      </div>
    ),
    document.body
  );
}
