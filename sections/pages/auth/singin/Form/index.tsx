import { useContext, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import * as yup from 'yup';

import { AuthContext } from '@store/contexts/Auth';

import { TextInput } from '@components/TextInput';
import { Checkbox } from '@components/Checkbox';

import { navigation } from '@navigation';

import styles from './Form.module.scss';

interface FormInputs {
  email: string;
  password: string;
  remember: boolean;
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Please enter an email'),
  password: yup
    .string()
    .required('Please enter a password')
    .min(8, 'Please enter a password with at least 8 characters.'),
  remember: yup.boolean(),
});

export const Form = () => {
  const { signIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit: submit,
    formState,
    setError,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      remember: false,
    },
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

  const handleSubmit = submit(async ({ email, password, remember }) => {
    try {
      await signIn({
        email,
        password,
        remember,
      });
    } catch (error) {
      setError('email', { message: 'Error, please try again' });
    }
  });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      data-testid="signin-form"
    >
      <div className={styles.container}>
        <TextInput
          className={styles.field}
          label="Email"
          type="email"
          placeholder="Email address"
          variant={errors.email ? 'error' : undefined}
          note={errors.email?.message}
          data-testid="email-input"
          {...register('email', { required: true })}
        />
      </div>
      <TextInput
        className={styles.field}
        label="Password"
        type="password"
        placeholder="Password"
        variant={errors.password ? 'error' : undefined}
        note={errors.password?.message}
        view
        data-testid="password-input"
        {...register('password', { required: true })}
      />
      <div className={styles.foot}>
        <Link href={navigation.auth.password.forgot}>
          <a className={styles.link}>Forgot password?</a>
        </Link>
      </div>
      <Checkbox className={styles.check} {...register('remember')}>
        <span>Remember me</span>
      </Checkbox>

      <button
        className={cn('button', styles.button)}
        type="submit"
        disabled={!canSubmit}
        data-testid="signin-submit-button"
        data-loading={isSubmitting || undefined}
      >
        Login
      </button>
    </form>
  );
};
