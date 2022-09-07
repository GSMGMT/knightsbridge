import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import OutsideClickHandler from 'react-outside-click-handler';
import cn from 'classnames';

import { Icon } from '@components/Icon';

import styles from './Modal.module.sass';

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
export const Modal: FunctionComponent<ModalProps> = ({
  outerClassName,
  visible: modalVisible,
  onClose = () => {},
  children,
  title,
  canBack,
  backAction,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (modalVisible) {
      const target = document.querySelector('#modal')!;
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [modalVisible]);

  const visible = useMemo(
    () => mounted && modalVisible,
    [modalVisible, mounted]
  );

  return visible
    ? createPortal(
        modalVisible && (
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
                <button
                  className={styles.close}
                  onClick={onClose}
                  type="button"
                >
                  <Icon name="close" size={24} />
                </button>
              </OutsideClickHandler>
            </div>
          </div>
        ),
        document.body
      )
    : null;
};
Modal.defaultProps = {
  onClose: () => {},
  outerClassName: '',
  title: '',
};
