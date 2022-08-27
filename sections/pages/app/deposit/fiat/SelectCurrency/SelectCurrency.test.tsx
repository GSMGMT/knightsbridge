import { act, render, fireEvent } from '@testing-library/react';

import { SelectCurrency } from '.';

describe('Select Currency component', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <SelectCurrency goNext={() => {}} setRequestInfo={() => {}} />
    );

    const title = getByTestId('title');

    expect(title).toBeInTheDocument();
  });

  it('change value', async () => {
    const { getByTestId } = render(
      <SelectCurrency goNext={() => {}} setRequestInfo={() => {}} />
    );

    const value = 45;

    const inputValue = getByTestId('input-value');
    const usdPrice = getByTestId('usd-price');

    await act(async () => {
      fireEvent.change(inputValue, { target: { value } });
    });

    expect(inputValue).toHaveValue(value.toString());
    expect(usdPrice).toHaveTextContent(`${value.toFixed(2)} USD`);
  });

  it('change value by variant', async () => {
    const { getByTestId } = render(
      <SelectCurrency goNext={() => {}} setRequestInfo={() => {}} />
    );

    const inputValue = getByTestId('input-value');
    const priceVariant = getByTestId('price-variant-50');

    await act(async () => {
      fireEvent.click(priceVariant);
    });

    expect(priceVariant).toHaveClass('active');
    expect(inputValue).toHaveValue(priceVariant.textContent);
  });

  it('validate invalid minimun value', async () => {
    const { getByTestId } = render(
      <SelectCurrency goNext={() => {}} setRequestInfo={() => {}} />
    );

    const inputValue = getByTestId('input-value');
    const submitButton = getByTestId('submit-button');

    await act(async () => {
      fireEvent.change(inputValue, { target: { value: '19.99' } });
    });

    expect(submitButton).toBeDisabled();
  });

  it('submit amount', async () => {
    const { getByTestId } = render(
      <SelectCurrency goNext={() => {}} setRequestInfo={() => {}} />
    );

    const submitButton = getByTestId('submit-button');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Loading...');
  });
});
