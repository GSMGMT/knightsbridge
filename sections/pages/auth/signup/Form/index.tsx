import { /* useCallback, useEffect, */ useContext, useMemo } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import useDarkMode from 'use-dark-mode';
import { useRouter } from 'next/router';

import { Checkbox } from '@components/Checkbox';
import { TextInput } from '@components/TextInput';
// import { Recaptcha } from '@components/Recaptcha';
import { PasswordRequirements } from '@components/PasswordRequirements';

import { AuthContext } from '@store/contexts/Auth';

import { passwordStrengthCheck } from '@helpers/PasswordStrengthCheck';

import { navigation } from '@navigation';

import styles from './Form.module.scss';

export interface Inputs {
  name: string;
  surname: string;
  email: string;
  password: string;
  referral: string;
  policy: boolean;
  'receive-emails': boolean;
  // recaptcha: boolean;
}
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your name')
    .matches(/^[aA-zZ\s]+$/, 'Please fill with only alphabet characters'),
  surname: yup
    .string()
    .required('Please enter your surname')
    .matches(/^[aA-zZ\s]+$/, 'Please fill with only alphabet characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Please enter an email'),
  password: yup
    .string()
    .required('Please enter your password')
    .test('password-strength', 'Password must be stronger', (password) => {
      const passwordIntensity = passwordStrengthCheck(password || '');

      return passwordIntensity.contains.length === 4;
    })
    .min(8, 'Password must be at least 8 characters long'),
  policy: yup.boolean().required().isTrue(),
  referral: yup.string(),
  'receive-emails': yup.boolean(),
  // recaptcha: yup
  //   .boolean()
  //   .oneOf([true], 'Please verify that you are not a robot')
  //   .required(),
});

export const Form = () => {
  const { value: isDark } = useDarkMode();
  const { push } = useRouter();

  const { signUp } = useContext(AuthContext);

  const {
    register,
    formState,
    handleSubmit: submit,
    setError,
    // setValue,
    watch: useWatch,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const { errors, isSubmitting, isSubmitted } = formState;

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

  const handleSubmit = submit(
    async ({ email, password, referral, name, surname }) => {
      try {
        await signUp({
          email,
          name,
          password,
          surname,
          referral,
        });

        toast(
          'You have successfully signed up, please verify your account on email!',
          {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: isDark ? '#333' : undefined,
              color: isDark ? '#fff' : undefined,
            },
          }
        );

        await push(navigation.auth.signIn);
      } catch (error) {
        setError('email', { message: 'Error, please try again later' });
      }
    }
  );

  // useEffect(() => {
  //   register('recaptcha');
  // }, [register]);

  // const handleChangeCaptcha = useCallback(
  //   (value: string | null) => {
  //     const isValid = value !== null;

  //     setValue('recaptcha', isValid, { shouldValidate: true });
  //   },
  //   [setValue]
  // );

  const password = useWatch('password');

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      data-testid="signup-form"
    >
      <div className={styles.top}>
        <h3 className={cn('h3', styles.title)} data-testid="title">
          Sign up
        </h3>
      </div>
      <div className={styles.fieldset}>
        <TextInput
          className={styles.field}
          label="name"
          type="text"
          placeholder="Name"
          note={errors.name?.message}
          variant={errors.name ? 'error' : undefined}
          data-testid="name-input"
          {...register('name')}
        />
        <TextInput
          className={styles.field}
          label="surname"
          type="text"
          placeholder="Surname"
          note={errors.surname?.message}
          variant={errors.surname ? 'error' : undefined}
          data-testid="surname-input"
          {...register('surname')}
        />
        <TextInput
          className={styles.field}
          label="email"
          type="email"
          placeholder="Email address"
          note={errors.email?.message}
          variant={errors.email ? 'error' : undefined}
          data-testid="email-input"
          {...register('email')}
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Password"
          note={errors.password?.message}
          variant={errors.password ? 'error' : undefined}
          data-testid="password-input"
          {...register('password')}
          view
        />
        <PasswordRequirements password={password} />
        <TextInput
          className={styles.field}
          label="referral"
          type="text"
          placeholder="$refferalID"
          note={errors.referral?.message}
          variant={errors.referral ? 'error' : undefined}
          {...register('referral')}
        />
        <Checkbox
          className={styles.checkbox}
          variant={errors.policy ? 'error' : undefined}
          data-testid="policy-input"
          {...register('policy')}
        >
          <span>
            By signing up I agree that I’m 18 years of age or older, to the{' '}
            <a href="/#" target="_blank" rel="noopener noreferrer">
              Terms of Services
            </a>{' '}
            .
          </span>
        </Checkbox>
        <Checkbox
          className={styles.checkbox}
          variant={errors['receive-emails'] ? 'error' : undefined}
          {...register('receive-emails')}
        >
          <span>
            I want to receive emails with promotions, offers, information about
            events and the crypto news.
          </span>
        </Checkbox>
      </div>
      {/* <Recaptcha
        onChange={handleChangeCaptcha}
        note={errors.recaptcha?.message}
      />
      <input
        type="checkbox"
        data-testid="recaptcha-input"
        className={styles['recaptcha-check']}
        {...register('recaptcha')}
      /> */}
      <button
        className={cn('button', styles.button)}
        type="submit"
        disabled={!canSubmit}
        data-testid="signup-submit-button"
        data-loading={isSubmitting || undefined}
      >
        Sign up
      </button>
    </form>
  );
};
