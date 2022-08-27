import { render } from '@testing-library/react';

import { ImportantNotes } from '.';

const REFERENCE_NUMBER = '123456789';

describe('Important Notes component', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <ImportantNotes goNext={() => {}} referenceNumber={REFERENCE_NUMBER} />
    );

    const title = getByTestId('title');
    const referenceCode = getByTestId('reference-code');

    expect(title).toBeInTheDocument();
    expect(referenceCode).toHaveTextContent(REFERENCE_NUMBER);
  });
});
