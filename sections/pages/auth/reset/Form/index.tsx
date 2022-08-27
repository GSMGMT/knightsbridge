import cn from 'classnames';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import useDarkMode from 'use-dark-mode';

import { resetPassword } from '@services/api/auth/resetPassword';

import { TextInput } from '@components/TextInput';
import { PasswordRequirements } from '@components/PasswordRequirements';

import { passwordStrengthCheck } from '@helpers/PasswordStrengthCheck';

import { navigation } from '@navigation';

import styles from './NewPassword.module.scss';

interface Inputs {
  email: string;
  password: string;
}

interface FormProps {
  email: string;
}
export const Form = ({ email }: FormProps) => {
  const {
    push,
    query: { oobCode },
  } = useRouter();
  const { value: isDark } = useDarkMode();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required('Please enter your password')
      .test('password-strength', 'Password must be stronger', (password) => {
        const passwordIntensity = passwordStrengthCheck(password || '');

        return passwordIntensity.id === 3;
      }),
  });

  const {
    register,
    handleSubmit: submit,
    formState,
    setError,
    watch: useWatch,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      email,
    },
  });
  const { errors, isSubmitting } = formState;

  const handleSubmit = submit(async ({ password }) => {
    try {
      await resetPassword({
        oobCode: oobCode as string,
        password,
      });

      toast('Password updated', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : undefined,
          color: isDark ? '#fff' : undefined,
        },
      });

      await push(navigation.auth.signIn);
    } catch (error) {
      setError('password', { message: 'Error, please try again later' });
    }
  });

  const password = useWatch('password');

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      data-testid="newpassword-form"
    >
      <h3 className={cn('h3', styles.title)} data-testid="title">
        New password
      </h3>
      <div className={styles.fieldset}>
        <TextInput
          className={styles.field}
          label="email"
          type="email"
          placeholder="Email address"
          {...register('email')}
          note={errors.email?.message}
          variant={errors.email ? 'error' : undefined}
          data-testid="email-input"
          readOnly
          disabled
        />
        <TextInput
          label="new password"
          type="password"
          placeholder="Password"
          {...register('password')}
          note={errors.password?.message}
          variant={errors.password ? 'error' : undefined}
          view
          data-testid="password-input"
        />
        <PasswordRequirements password={password} />
      </div>
      <button
        className={cn('button', styles.button)}
        type="submit"
        data-testid="submit-button"
        data-loading={isSubmitting || undefined}
        disabled={isSubmitting}
      >
        {!isSubmitting ? 'Continue' : 'Wait...'}
      </button>
    </form>
  );
};
