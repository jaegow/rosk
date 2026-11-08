import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Icon } from './Icon'

describe('Icon', () => {
  it('reads as a named image only when it carries a label', () => {
    render(
      <>
        <Icon name="search" />
        <Icon
          name="warning"
          label="Needs attention"
        />
      </>,
    )

    expect(screen.getAllByRole('img')).toEqual([screen.getByRole('img', { name: 'Needs attention' })])
  })
})
