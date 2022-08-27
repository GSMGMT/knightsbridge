import { render, fireEvent, act } from '@testing-library/react';

import { Form } from '.';

describe('SignUp Form component', () => {
  it('validate render', () => {
    const { getByTestId } = render(<Form />);

    expect(getByTestId('signup-submit-button')).toBeInTheDocument();
  });

  it('field value is invalid', async () => {
    const { getByTestId, getByText } = render(<Form />);

    const form = getByTestId('signup-form');

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(getByText('Please enter your name')).toBeInTheDocument();
    expect(getByText('Please enter your surname')).toBeInTheDocument();
    expect(getByText('Please enter an email')).toBeInTheDocument();
    expect(getByText('Please enter your password')).toBeInTheDocument();
    expect(
      getByText('Please verify that you are not a robot')
    ).toBeInTheDocument();
    expect(getByTestId('policy-input')).toHaveClass('error');

    expect(getByTestId('signup-submit-button')).toBeDisabled();
  });

  it('fields value is out of format', async () => {
    const { getByTestId, getByText } = render(<Form />);

    const form = getByTestId('signup-form');

    const nameInput = getByTestId('name-input');
    const surnameInput = getByTestId('surname-input');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const policyInput = getByTestId('policy-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(surnameInput, { target: { value: '' } });
      fireEvent.change(emailInput, { target: { value: 'email' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(policyInput);
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(getByText('Please enter your name')).toBeInTheDocument();
    expect(getByText('Please enter your surname')).toBeInTheDocument();
    expect(getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(getByText('Password must be stronger')).toBeInTheDocument();
  });

  it('form submit', async () => {
    const { getByTestId } = render(<Form />);

    const password = '9VL*M7k6]@';

    const form = getByTestId('signup-form');
    const submitButton = getByTestId('signup-submit-button');

    const nameInput = getByTestId('name-input');
    const surnameInput = getByTestId('surname-input');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const policyInput = getByTestId('policy-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'User' } });
      fireEvent.change(surnameInput, { target: { value: 'Test' } });
      fireEvent.change(emailInput, { target: { value: 'email@test.com' } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.click(policyInput);
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(submitButton).toHaveAttribute('data-loading');
  });
});
