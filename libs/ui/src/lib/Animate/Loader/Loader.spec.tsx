import { render } from '@testing-library/react';

import Loader from './Loader';

describe('Loader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Loader />);
    expect(baseElement).toBeTruthy();
  });
});
