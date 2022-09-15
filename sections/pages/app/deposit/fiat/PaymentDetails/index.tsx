import { useInterval } from 'usehooks-ts';
import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { useCopy } from '@hooks/Copy';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';
import CheckI from '@public/images/icons/check.svg';
import { depositConfirm } from '@services/api/app/deposit/confirm';
import { Successfully } from '../Successfully';

import { Request } from '../types';

import styles from './PaymentDetails.module.scss';

interface PaymentDetailsProps {
  requestInfo: Request;
  handleBackToBegining: () => void;
}
export const PaymentDetails = ({
  requestInfo,
  handleBackToBegining,
}: PaymentDetailsProps) => {
  const { push } = useRouter();

  const referenceNumber = useMemo(
    () => requestInfo.referenceNumber,
    [requestInfo]
  );
  const id = useMemo(() => requestInfo.id, [requestInfo]);

  const { handleElementCopy: handleCopy } = useCopy();

  const [success, setSuccess] = useState<boolean>(false);

  const bankInfo = useMemo(() => requestInfo.bank, [requestInfo]);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
    },
    maxSize: 4096 * 1024,
    onDropRejected([
      {
        errors: [{ code: codeError }],
      },
    ]) {
      if (codeError === 'file-too-large') {
        toast.error('File size is too large. Max size is 4MB');
      }
    },
  });
  const file = useMemo(() => acceptedFiles[0], [acceptedFiles]);
  const hasFile = useMemo(() => !!file, [file]);

  const [expired, setExpired] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 15);
  const remainingTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [timeLeft]);
  const updateTime = useCallback(() => {
    if (timeLeft > 0) setTimeLeft(timeLeft - 1);

    if (timeLeft - 1 === 0) setExpired(true);
  }, [timeLeft]);
  useInterval(updateTime, 1000);

  const [fetching, setFetching] = useState<boolean>(false);
  const canHandleAction = useMemo(
    () => (!fetching && !!file) || expired,
    [expired, fetching, file]
  );
  const handleSubmit: () => Promise<void> = useCallback(async () => {
    try {
      setFetching(true);

      await depositConfirm({
        depositId: id,
        receipt: file,
      });

      setSuccess(true);
    } catch (error) {
      setFetching(false);
    }
  }, [file, id]);

  const handleClick = useCallback(() => {
    if (!expired) handleSubmit();
    else handleBackToBegining();
  }, [expired, handleSubmit, handleBackToBegining]);

  const handleCloseModal = useCallback(() => {
    setSuccess(false);

    push('/app/wallet');
  }, [push]);

  return (
    <>
      <div>
        <div className={styles.header}>
          <div className={styles.title} data-testid="title">
            Payment details
          </div>
          <div className={styles.timer}>
            <span className={styles.time}>
              {!expired ? remainingTime : 'Time expired'}
            </span>{' '}
            {!expired && <> left to confirm your deposit request</>}
          </div>
        </div>
        <div className={styles.info}>Bank account</div>
        <div className={styles.list}>
          <div className={styles.line}>
            <div className={styles.subtitle}>Account name</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.accountName}</div>
              <button
                className={cn(styles.copy)}
                type="button"
                onClick={handleCopy}
                data-testid="copy-account-name"
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>Account number</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.accountNumber}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>Address</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.address}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>SWIFT Code</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.swiftCode}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>Bank Name</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.bankName}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>Branch</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.branch}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.subtitle}>Bank Address</div>
            <div className={styles.details}>
              <div className={styles.content}>{bankInfo.bankAddress}</div>
              <button
                className={styles.copy}
                type="button"
                onClick={handleCopy}
              >
                <Icon name="copy" size={24} />
              </button>
            </div>
          </div>
        </div>
        {!expired && (
          <>
            <div className={styles.info}>Reference code</div>
            <div className={styles.text}>
              You MUST include the Reference Code in your deposit in order to
              credit your account! <br />
              Reference Code:
            </div>
            <div
              className={cn(styles.code)}
              role="button"
              tabIndex={-1}
              onClick={handleCopy}
              data-testid="reference-code"
            >
              {referenceNumber}
            </div>
            <div
              {...getRootProps({
                className: cn(styles.dropzone, { [styles.success]: hasFile }),
              })}
              data-testid="dropzone"
            >
              <input {...getInputProps()} data-testid="dropzone-input" />
              <span className={styles.title}>
                <Icon name="receipt" size={24} /> Upload deposit receipt
              </span>
              <span className={styles.subtitle}>
                {file ? (
                  <>
                    <CheckI /> {file.name}
                  </>
                ) : (
                  'Select file to upload'
                )}
              </span>
              <span className={styles.description}>
                {!file ? 'or Drag and Drop, Copy and Paste File' : <>&nbsp;</>}
              </span>
              <span className={styles['max-size']}>
                {!file ? 'File max size 5mb' : <>&nbsp;</>}
              </span>
            </div>
          </>
        )}
        <div className={styles.btns}>
          <button
            className={cn('button', styles.button)}
            type="button"
            disabled={!canHandleAction}
            onClick={handleClick}
            data-testid="action-button"
          >
            {expired ? 'Restart deposit request' : 'Confirm deposit request'}
          </button>
        </div>
      </div>
      <Modal visible={success} onClose={handleCloseModal}>
        <Successfully requestInfo={requestInfo} />
      </Modal>
    </>
  );
};
