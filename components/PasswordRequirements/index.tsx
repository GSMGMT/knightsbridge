import cn from 'classnames';
import { useCallback, useMemo } from 'react';

import { PasswordContains } from '../../contracts/Password';

import { passwordStrengthCheck } from '../../helpers/PasswordStrengthCheck';

import styles from './PasswordRequirements.module.scss';

interface PasswordRequirementsProps {
  password: string;
}
export const PasswordRequirements = ({
  password,
}: PasswordRequirementsProps) => {
  const passwordValidation: Array<PasswordContains> = useMemo(
    () => passwordStrengthCheck(password).contains,
    [password]
  );
  const containsOnPassword: (
    passwordContainVariation: PasswordContains
  ) => boolean = useCallback(
    (passwordContainVariation) =>
      passwordValidation.includes(passwordContainVariation),
    [passwordValidation]
  );

  return (
    <ul className={cn(styles['password-requirements'])}>
      <li
        className={cn(styles.requirement, {
          [styles.valid]: containsOnPassword('lowercase'),
        })}
      >
        Includes lowercase char
      </li>
      <li
        className={cn(styles.requirement, {
          [styles.valid]: containsOnPassword('uppercase'),
        })}
      >
        Includes uppercase char
      </li>
      <li
        className={cn(styles.requirement, {
          [styles.valid]: containsOnPassword('symbol'),
        })}
      >
        Includes symbol char
      </li>
      <li
        className={cn(styles.requirement, {
          [styles.valid]: containsOnPassword('number'),
        })}
      >
        Includes numeric char
      </li>
    </ul>
  );
};
