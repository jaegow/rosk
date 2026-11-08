import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Modal } from './Modal'

const gallery: GalleryEntry = {
  title: 'Modal',
  group: 'composites',
  examples: [
    {
      name: 'Dialog',
      render: () => (
        <Modal>
          <Modal.Trigger>Rename Item</Modal.Trigger>
          <Modal.Head>
            <Modal.Head.Title>Rename Item</Modal.Head.Title>
            <Modal.Head.CTAs>
              <Modal.Close />
            </Modal.Head.CTAs>
            <Modal.Head.Subtitle>The new name shows everywhere the item appears.</Modal.Head.Subtitle>
          </Modal.Head>
          <Modal.Content>Pick a short name that is easy to scan in a list.</Modal.Content>
          <Modal.Foot>
            <Modal.Foot.CTA lane="secondary">Cancel</Modal.Foot.CTA>
            <Modal.Foot.CTA lane="primary">Rename</Modal.Foot.CTA>
          </Modal.Foot>
        </Modal>
      ),
    },
    {
      name: 'Small Prompt',
      render: () => (
        <Modal size="sm">
          <Modal.Trigger variant="danger">Delete Item</Modal.Trigger>
          <Modal.Head>
            <Modal.Head.Title>Delete Item?</Modal.Head.Title>
          </Modal.Head>
          <Modal.Content>Deleting removes the item and its notes for good.</Modal.Content>
          <Modal.Foot>
            <Modal.Foot.CTA lane="secondary">Cancel</Modal.Foot.CTA>
            <Modal.Foot.CTA lane="primary">Delete</Modal.Foot.CTA>
          </Modal.Foot>
        </Modal>
      ),
    },
    {
      name: 'Drawer',
      render: () => (
        <Modal
          variant="drawer-right"
          size="md"
        >
          <Modal.Trigger>Show Details</Modal.Trigger>
          <Modal.Head>
            <Modal.Head.Title>Item Details</Modal.Head.Title>
            <Modal.Head.Chip
              label="Open"
              status="info"
            />
            <Modal.Head.CTAs>
              <Modal.Close />
            </Modal.Head.CTAs>
          </Modal.Head>
          <Modal.Content>Long reference detail scrolls inside the drawer.</Modal.Content>
          <Modal.Foot>
            <Modal.Foot.CTA lane="secondary">Close</Modal.Foot.CTA>
          </Modal.Foot>
        </Modal>
      ),
    },
  ],
}

export { gallery }
