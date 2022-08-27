import { act, render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Props } from '.';

describe('ForgotPassword define new password', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <Form email="test@email.com" token="fdsf89" />,
      { wrapper: MemoryRouter }
    );

    expect(getByTestId('title')).toHaveTextContent('New password');
  });

  it('field value is invalid', async () => {
    const { getByTestId, getByText } = render(
      <Form email="test@email.com" token="fdsf89" />,
      { wrapper: MemoryRouter }
    );

    const form = getByTestId('newpassword-form');

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(getByText('Please enter your email')).toBeInTheDocument();
    expect(getByText('Please enter your password')).toBeInTheDocument();
  });

  it('fields value is out of format', async () => {
    const { getByTestId, getByText } = render(
      <Form email="test@email.com" token="fdsf89" />,
      { wrapper: MemoryRouter }
    );

    const form = getByTestId('newpassword-form');

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'email' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });

      fireEvent.submit(form);
    });

    expect(getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(getByText('Password must be stronger')).toBeInTheDocument();
  });

  it('fields value is out of format', async () => {
    const { getByTestId } = render(
      <Form email="test@email.com" token="fdsf89" />,
      { wrapper: MemoryRouter }
    );

    const password = '9VL*M7k6]@';

    const form = getByTestId('newpassword-form');
    const submitButton = getByTestId('submit-button');

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
      fireEvent.change(passwordInput, { target: { value: password } });

      fireEvent.submit(form);
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Wait...');
  });
});
