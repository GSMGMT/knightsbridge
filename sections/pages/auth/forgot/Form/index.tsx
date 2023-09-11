import { /* useCallback, useEffect, */ useMemo } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import useDarkMode from 'use-dark-mode';

import { TextInput } from '@components/TextInput';
import { Link } from '@components/Link';

import { recoverPasswordByEmail } from '@services/api/auth/recoverPasswordByEmail';

import { navigation } from '@navigation';

import styles from './Form.module.scss';

interface Inputs {
  email: string;
  // recaptcha: boolean;
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Please enter an email'),
  // recaptcha: yup
  //   .boolean()
  //   .oneOf([true], 'Please verify that you are not a robot')
  //   .required(),
});

export const Form = () => {
  const { push } = useRouter();
  const { value: isDark } = useDarkMode();

  const {
    register,
    handleSubmit: submit,
    formState,
    setError,
    // setValue,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const { isSubmitted, isSubmitting, errors } = formState;

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

  const handleSubmit = submit(async ({ email }) => {
    try {
      await recoverPasswordByEmail({ email });

      toast('Email sent successfully', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : undefined,
          color: isDark ? '#fff' : undefined,
        },
      });

      await push(navigation.auth.signIn);
    } catch (error) {
      setError('email', { message: 'Error, please try again later' });
    }
  });

  // useEffect(() => {
  //   register('recaptcha');
  // }, [register]);

  // const handleChangeCaptcha = useCallback(
  //   (value: string | null) => {
  //     const isValid = value !== null;

  //     setValue('recaptcha', isValid, {
  //       shouldValidate: true,
  //     });
  //   },
  //   [setValue]
  // );

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      data-testid="forgotpassword-request-form"
    >
      <div className={styles.top}>
        <h3 className={cn('h3', styles.title)} data-testid="title">
          Forgot password
        </h3>
        <div className={styles.info}>
          For security purposes, no withdrawals are permitted for 24 hours after
          password changed.
        </div>
      </div>
      <div className={styles.fieldset}>
        <TextInput
          className={styles.field}
          label="Enter the account email"
          type="email"
          placeholder="Your email"
          icon="email"
          {...register('email')}
          data-testid="email-input"
          note={errors.email?.message}
          variant={errors.email ? 'error' : undefined}
        />
      </div>

      <button
        className={cn('button', styles.button)}
        type="submit"
        disabled={!canSubmit}
        data-testid="submit-button"
        data-loading={isSubmitting || undefined}
      >
        Continue
      </button>
      <div className={styles.foot}>
        <Link className={styles.link} href={navigation.auth.signIn}>
          Nevermind, I got it
        </Link>
      </div>
    </form>
  );
};
