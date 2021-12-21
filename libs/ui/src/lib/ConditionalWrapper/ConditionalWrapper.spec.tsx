import { render } from '@testing-library/react';

import ConditionalWrapper from './ConditionalWrapper';

describe('ConditionalWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConditionalWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
