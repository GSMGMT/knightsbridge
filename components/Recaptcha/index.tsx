import ReCAPTCHA from 'react-google-recaptcha';
import useDarkMode from 'use-dark-mode';

import styles from './Recaptcha.module.scss';

interface RecaptchaProps {
  onChange?: (token: string | null) => void;
  note?: string;
  [key: string]: any;
}
export const Recaptcha = ({ note, ...props }: RecaptchaProps) => {
  const darkMode = useDarkMode(false);

  return (
    <div>
      <ReCAPTCHA
        sitekey="6LffWm0gAAAAANU1dA7AVeTC-34qJi0GwyONK00B"
        theme={darkMode.value ? 'dark' : 'light'}
        className={styles.recaptcha}
        {...props}
      />
      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
};
Recaptcha.defaultProps = {
  onChange: () => {},
  note: undefined,
};
