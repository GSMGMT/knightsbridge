import { act, render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Form } from '.';

describe('ForgotPassword request code', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <Form setEmail={() => {}} setStep={() => {}} />,
      { wrapper: MemoryRouter }
    );

    expect(getByTestId('title')).toHaveTextContent('Forgot password');
  });

  it('field value is invalid', async () => {
    const { getByTestId, getByText } = render(
      <Form setEmail={() => {}} setStep={() => {}} />,
      { wrapper: MemoryRouter }
    );

    const form = getByTestId('forgotpassword-request-form');
    const submitButton = getByTestId('submit-button');

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(getByText('Please enter an email')).toBeInTheDocument();
    expect(
      getByText('Please verify that you are not a robot')
    ).toBeInTheDocument();

    expect(submitButton).toBeDisabled();
    expect(submitButton).not.toHaveAttribute('data-loading');
  });

  it('fields value is out of format', async () => {
    const { getByTestId, getByText } = render(
      <Form setEmail={() => {}} setStep={() => {}} />,
      { wrapper: MemoryRouter }
    );

    const form = getByTestId('forgotpassword-request-form');
    const submitButton = getByTestId('submit-button');

    const emailInput = getByTestId('email-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'email' } });
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(getByText('Please enter a valid email address')).toBeInTheDocument();

    expect(submitButton).toBeDisabled();
    expect(submitButton).not.toHaveAttribute('data-loading');
  });

  it('form submit', async () => {
    const { getByTestId } = render(
      <Form setEmail={() => {}} setStep={() => {}} />,
      { wrapper: MemoryRouter }
    );

    const form = getByTestId('forgotpassword-request-form');
    const submitButton = getByTestId('submit-button');

    const emailInput = getByTestId('email-input');
    const recaptchaInput = getByTestId('recaptcha-input');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
      fireEvent.click(recaptchaInput);

      fireEvent.submit(form);
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('data-loading');
  });
});
