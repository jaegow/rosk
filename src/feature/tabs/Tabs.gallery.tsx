import type { GalleryEntry } from '@/feature/gallery/gallery.type'

import { Tabs } from './Tabs'

const gallery: GalleryEntry = {
  title: 'Tabs',
  group: 'primitives',
  examples: [
    {
      name: 'Line',
      render: () => (
        <div className="w-full text-body2 text-stress">
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
              <Tabs.Trigger value="history">History</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">
              <p className="pt-3">Overview panel</p>
            </Tabs.Content>
            <Tabs.Content value="notes">
              <p className="pt-3">Notes panel</p>
            </Tabs.Content>
            <Tabs.Content value="history">
              <p className="pt-3">History panel</p>
            </Tabs.Content>
          </Tabs>
        </div>
      ),
    },
    {
      name: 'Pill',
      render: () => (
        <div className="w-full text-body2 text-stress">
          <Tabs
            variant="pill"
            defaultValue="week"
          >
            <Tabs.List>
              <Tabs.Trigger value="day">Day</Tabs.Trigger>
              <Tabs.Trigger value="week">Week</Tabs.Trigger>
              <Tabs.Trigger value="month">Month</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="day">
              <p className="pt-3">Today</p>
            </Tabs.Content>
            <Tabs.Content value="week">
              <p className="pt-3">This week</p>
            </Tabs.Content>
            <Tabs.Content value="month">
              <p className="pt-3">This month</p>
            </Tabs.Content>
          </Tabs>
        </div>
      ),
    },
  ],
}

export { gallery }
