import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Successfully } from '.';

describe('Successfully component', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <Successfully
        amount={100}
        coin={{
          uid: '',
          logo: '',
          name: '',
          price: 2,
          symbol: 'SDASD',
        }}
        walletAddress={{ address: '', id: '', network: '' }}
        handleClose={() => {}}
        visible
        depositInfo={{ hash: '', id: '' }}
      />,
      { wrapper: MemoryRouter }
    );

    const successBox = getByTestId('success-box');

    expect(successBox).toBeInTheDocument();
  });

  it('validate if info are correct', () => {
    render(
      <Successfully
        amount={100}
        coin={{
          uid: '',
          logo: '',
          name: '',
          price: 2,
          symbol: 'SDASD',
        }}
        walletAddress={{ address: '', id: '', network: '' }}
        handleClose={() => {}}
        visible
        depositInfo={{ hash: '', id: '' }}
      />,
      { wrapper: MemoryRouter }
    );

    // const amount = getByTestId('amount');
    // const id = getByTestId('id');
  });
});
