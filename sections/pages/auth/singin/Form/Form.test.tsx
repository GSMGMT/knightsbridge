import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Form } from '.';

describe('SignIn Form component', () => {
  it('validate render', () => {
    const { getByTestId } = render(<Form />, { wrapper: MemoryRouter });

    expect(getByTestId('signin-submit-button')).toBeInTheDocument();
  });

  it('field value is invalid', async () => {
    const { getByTestId, getByText } = render(<Form />, {
      wrapper: MemoryRouter,
    });

    const form = getByTestId('signin-form');

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(getByText('Please enter an email')).toBeInTheDocument();
    expect(getByText('Please enter a password')).toBeInTheDocument();
    expect(
      getByText('Please verify that you are not a robot.')
    ).toBeInTheDocument();

    expect(getByTestId('signin-submit-button')).toBeDisabled();
  });

  it('fields value is out of format', async () => {
    const { getByTestId, getByText } = render(<Form />, {
      wrapper: MemoryRouter,
    });

    const form = getByTestId('signin-form');

    const emailInput = getByTestId('email-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'email' } });
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('form submit', async () => {
    const { getByTestId } = render(<Form />, {
      wrapper: MemoryRouter,
    });

    const form = getByTestId('signin-form');
    const submitButton = getByTestId('signin-submit-button');

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'email@test.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345678' } });
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(submitButton).toHaveAttribute('data-loading');
  });
});
