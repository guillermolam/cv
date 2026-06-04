import { describe, expect, it } from 'vitest';

import { titleFor } from './site';

describe('titleFor', () => {
  it('creates a composed page title', () => {
    expect(titleFor('Home')).toContain('Home');
  });
});
