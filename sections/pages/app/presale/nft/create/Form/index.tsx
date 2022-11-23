import { string, object, SchemaOf } from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from '@services/api';

import { navigation } from '@navigation';

import { TextArea } from '@components/TextArea';
import { TextInput } from '@components/TextInput';
import { Icon } from '@components/Icon';

import CheckI from '@public/images/icons/check.svg';

import { stringToValue } from '@helpers/StringToValue';
import { stringToNumber } from '@helpers/StringToNumber';

import styles from './Form.module.scss';

interface FormInputs {
  title: string;
  creator: string;
  quantity: string;
  price: string;
  description: string;
}
const schema: SchemaOf<FormInputs> = object().shape({
  title: string().required('Please enter a title'),
  creator: string().required('Please enter a creator'),
  quantity: string().required('Please enter a quantity'),
  price: string().required('Please enter a price'),
  description: string().required('Please enter a description'),
});

export const Form = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit: submit,
    formState,
    control,
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const { errors, isSubmitted, isSubmitting } = formState;

  const canSubmit = useMemo(() => {
    if (isSubmitting) {
      return false;
    }

    if (!isSubmitted) {
      return true;
    }

    const errorsLength = Object.keys(errors).length;

    return errorsLength === 0;
  }, [formState]);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
    },
    maxSize: 2048 * 1024,
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

  const handleSubmit = useCallback(
    submit(async ({ creator, price, quantity, title, description }) => {
      try {
        await api.postForm('/api/presale/nft/token', {
          icon: file,
          name: title,
          author: creator,
          quote: stringToNumber(price),
          amount: quantity,
          description,
        });

        toast.success('Digital Asset created successfully');
        router.replace(navigation.app.presale.nft.list);
      } catch (error) {
        toast.error('Error, please try again');
      }
    }),
    [submit, file, reset]
  );

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        data-testid="signin-form"
      >
        <TextInput
          label="TITLE"
          type="text"
          placeholder="Male Greyhound"
          variant={errors.title ? 'error' : undefined}
          note={errors.title?.message}
          {...register('title')}
        />
        <TextInput
          label="CREATOR"
          type="text"
          placeholder="MetaRace"
          variant={errors.creator ? 'error' : undefined}
          note={errors.creator?.message}
          {...register('creator')}
        />
        <Controller
          name="quantity"
          control={control}
          render={({
            field: { onChange, ...field },
            formState: {
              errors: { quantity },
            },
          }) => (
            <TextInput
              label="QUANTITY"
              type="text"
              placeholder="5000"
              variant={quantity ? 'error' : undefined}
              note={quantity?.message}
              onChange={({ target: { value } }) => {
                const inputValue = value.replace(/\D/g, '');

                if (!inputValue) return onChange('');

                onChange(Number(inputValue));
              }}
              {...field}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({
            field: { onChange, ...field },
            formState: {
              errors: { price },
            },
          }) => (
            <TextInput
              label="Price"
              type="text"
              placeholder="220"
              variant={price ? 'error' : undefined}
              note={price?.message}
              onChange={({ target: { value } }) => {
                if (!value) return onChange('');

                onChange(stringToValue(value));
              }}
              postLabel="USDT"
              {...field}
            />
          )}
        />

        <TextArea
          label="Description"
          variant={errors?.description ? 'error' : undefined}
          note={errors?.description?.message}
          className={styles['full-field']}
          {...register('description')}
        />

        <div
          {...getRootProps({
            className: cn(styles.dropzone, { [styles.success]: hasFile }),
          })}
        >
          <input {...getInputProps()} />
          <span className={styles.title}>
            <Icon name="receipt" size={24} /> Upload Image
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
            {!file ? (
              'We recommend that the logo has a 1:1 aspect ratio like 600x600px | File max size 2Mb'
            ) : (
              <>&nbsp;</>
            )}
          </span>
        </div>

        <div className={styles.submit}>
          <button
            className={cn('button')}
            type="submit"
            disabled={!canSubmit}
            data-loading={isSubmitting || undefined}
          >
            Register a Digital Asset
          </button>
        </div>
      </form>
    </div>
  );
};
