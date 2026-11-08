import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Nav } from './Nav'

const gallery: GalleryEntry = {
  title: 'Nav',
  group: 'composites',
  examples: [
    {
      name: 'Side',
      render: () => (
        <div className="w-56">
          <Nav label="Example Side">
            <Nav.Item
              route="home"
              icon="home"
            />
            <Nav.Group label="Reference">
              <Nav.Item
                route="gallery"
                icon="eye"
              />
              <Nav.Item route="galleryTokens" />
            </Nav.Group>
          </Nav>
        </div>
      ),
    },
    {
      name: 'Top',
      render: () => (
        <Nav
          label="Example Top"
          variant="top"
        >
          <Nav.Item route="home" />
          <Nav.Item route="gallery" />
          <Nav.Item route="galleryTokens" />
        </Nav>
      ),
    },
  ],
}

export { gallery }
