import { act, fireEvent, render } from '@testing-library/react';

import { Table } from '.';

import { Item, User } from '../types';

const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const firstItem: Item = {
  date: new Date(),
  id: '8safdg9',
  quantity: 245,
  status: 'APPROVED',
  user,
  exchange: { name: 'Binance' },
  fee: 0.01,
  pair: { name: 'BTC/USDT' },
  price: 0.000001,
  total: 0.000001,
  type: 'BUY',
};
const secondItem: Item = {
  date: new Date(),
  id: '8safdg35239',
  quantity: 245,
  status: 'APPROVED',
  user,
  exchange: { name: 'Binance' },
  fee: 0.01,
  pair: { name: 'BTC/USDT' },
  price: 0.000001,
  total: 0.000001,
  type: 'BUY',
};
const TestTable = () => (
  <Table
    sortAsceding
    sortByCurrent={undefined}
    items={[firstItem, secondItem]}
    fetching={false}
    canAction
    handleChangeItemStatus={() => {}}
    handleToggleSelection={() => {}}
    selectedItems={[]}
    setSelectedItems={() => {}}
    handleSetSortBy={() => {}}
  />
);

describe('Table Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<TestTable />);

    const tableItem = getByTestId('table-item-1');

    expect(tableItem).toBeInTheDocument();
  });

  it('should be able to handle action', async () => {
    const { getByTestId, debug } = render(<TestTable />);

    const tableItem = getByTestId('table-item-1');

    await act(async () => {
      fireEvent.click(tableItem);
    });

    debug();

    expect(tableItem).toHaveClass('active');
  });
});
