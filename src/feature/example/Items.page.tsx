import { type ReactNode, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import * as z from 'zod'

import { Chip } from '@/feature/chip/Chip'
import { useCopy } from '@/feature/copy/useCopy'
import { EmptyState } from '@/feature/empty-state/EmptyState'
import { Form } from '@/feature/form/Form'
import { useForm } from '@/feature/form/useForm'
import { Modal } from '@/feature/modal/Modal'
import type { ModalControl } from '@/feature/modal/useModal'
import { Page } from '@/feature/page/Page'
import { firstRead } from '@/feature/service/query.util'
import { useServiceError } from '@/feature/service/useServiceError'
import { Table } from '@/feature/table/Table'
import { useToast } from '@/feature/toast/useToast'

import type { Item, ItemModel } from './item.type'
import { ITEM_PARAM, ITEM_STATUSES, itemChipStatus, itemInput, itemModel, itemSort, NEW_ITEM, sortItems, withItemSort, withOpenItem } from './item.util'
import { useItem } from './useItem'
import { useItemStatusLabel } from './useItemStatusLabel'

type ItemDetailStep = 'editing' | 'confirmingDelete' | 'confirmingDiscard'

type ItemDetailProps = {
  item?: Item
  onClose: () => void
}

type ItemModalProps = {
  itemId: string
  onClose: () => void
}

const itemSchema = z.object({
  name: z.string().trim().min(1),
  status: z.enum(ITEM_STATUSES),
  description: z.string().max(500),
}) satisfies z.ZodType<ItemModel, ItemModel>

const closingControl = (onClose: () => void): ModalControl => ({
  isOpen: true,
  setOpen: (next) => {
    if (next === false) onClose()
  },
  open: () => undefined,
  close: onClose,
})

const ItemDetail = ({ item, onClose }: ItemDetailProps) => {
  const { t } = useCopy()
  const toast = useToast()
  const serviceError = useServiceError()
  const statusLabel = useItemStatusLabel()
  const mutation = {
    create: useItem.mutate.usePostItem({
      onSuccess: () => toast.show({ scope: 'app', severity: 'success', title: t('common.items.created') }),
      onError: (error) => serviceError.handle(error, form),
    }),
    update: useItem.mutate.usePutItem({
      onSuccess: () => toast.show({ scope: 'app', severity: 'success', title: t('common.items.saved') }),
      onError: (error) => serviceError.handle(error, form),
    }),
    remove: useItem.mutate.useDeleteItem({
      onSuccess: () => toast.show({ scope: 'app', severity: 'success', title: t('common.items.deleted') }),
      onError: (error) => serviceError.handle(error),
    }),
  }
  const form = useForm({
    schema: itemSchema,
    kind: item === undefined ? 'create' : 'edit',
    defaultValues: itemModel(item),
    onSubmit: (values, store) => {
      store.commitOpen()
      const settle = {
        onSuccess: (saved: Item) => {
          store.rebase(itemModel(saved))
          onClose()
        },
        onSettled: () => store.commitClose(),
      }
      if (item === undefined) mutation.create.mutate(itemInput(values), settle)
      else mutation.update.mutate({ id: item.id, input: itemInput(values) }, settle)
    },
  })
  const [step, setStep] = useState<ItemDetailStep>('editing')
  const saving = mutation.create.isPending || mutation.update.isPending

  const requestClose = () => {
    if (saving || mutation.remove.isPending || !form.formState.isDirty) {
      onClose()
      return
    }
    setStep(step === 'confirmingDiscard' ? 'editing' : 'confirmingDiscard')
  }

  return (
    <Modal control={closingControl(requestClose)}>
      <Modal.Head>
        <Modal.Head.Title>{item === undefined ? t('common.items.new') : t('common.items.edit')}</Modal.Head.Title>
        <Modal.Close />
      </Modal.Head>
      <Modal.Content>
        <Form
          form={form}
          layout="col-1"
          aria-label={item === undefined ? t('common.items.new') : t('common.items.edit')}
        >
          <Form.Section title={t('common.items.section')}>
            <form.Field.Text
              name="name"
              label={t('common.items.field.name')}
            />
            <form.Field.Select
              name="status"
              label={t('common.items.field.status')}
              options={ITEM_STATUSES.map((status) => ({ value: status, label: statusLabel[status] }))}
            />
            <form.Field.TextArea
              name="description"
              label={t('common.items.field.description')}
              helper={t('common.items.field.descriptionHelper')}
            />
          </Form.Section>
        </Form>
      </Modal.Content>
      <Modal.Foot>
        {step === 'editing' && item !== undefined && (
          <Modal.Foot.CTA
            lane="tertiary"
            variant="danger"
            onClick={() => setStep('confirmingDelete')}
          >
            {t('common.actions.delete')}
          </Modal.Foot.CTA>
        )}
        {step === 'editing' && (
          <Modal.Foot.CTA
            lane="secondary"
            onClick={requestClose}
          >
            {t('common.actions.cancel')}
          </Modal.Foot.CTA>
        )}
        {step === 'editing' && (
          <Modal.Foot.CTA
            lane="primary"
            loading={saving}
            onClick={() => void form.submit()}
          >
            {t('common.actions.save')}
          </Modal.Foot.CTA>
        )}
        {step === 'confirmingDelete' && (
          <Modal.Foot.CTA
            lane="secondary"
            onClick={() => setStep('editing')}
          >
            {t('common.actions.cancel')}
          </Modal.Foot.CTA>
        )}
        {step === 'confirmingDelete' && item !== undefined && (
          <Modal.Foot.CTA
            lane="primary"
            loading={mutation.remove.isPending}
            onClick={() => mutation.remove.mutate(item.id, { onSuccess: onClose })}
          >
            {t('common.items.confirmDelete')}
          </Modal.Foot.CTA>
        )}
        {step === 'confirmingDiscard' && (
          <Modal.Foot.CTA
            lane="secondary"
            onClick={() => setStep('editing')}
          >
            {t('common.leaveGuard.stay')}
          </Modal.Foot.CTA>
        )}
        {step === 'confirmingDiscard' && (
          <Modal.Foot.CTA
            lane="primary"
            onClick={() => {
              form.revert()
              onClose()
            }}
          >
            {t('common.leaveGuard.leave')}
          </Modal.Foot.CTA>
        )}
      </Modal.Foot>
    </Modal>
  )
}

ItemDetail.displayName = 'ItemDetail'

const ItemModal = ({ itemId, onClose }: ItemModalProps) => {
  const { t } = useCopy()
  const itemQuery = useItem.query.useGetItem(itemId === NEW_ITEM ? undefined : itemId)

  return ((): ReactNode => {
    if (itemId === NEW_ITEM) return <ItemDetail onClose={onClose} />
    if (itemQuery.data !== undefined) {
      return (
        <ItemDetail
          key={itemQuery.data.id}
          item={itemQuery.data}
          onClose={onClose}
        />
      )
    }
    return (
      <Modal control={closingControl(onClose)}>
        <Modal.Head>
          <Modal.Head.Title>{t('common.items.edit')}</Modal.Head.Title>
          <Modal.Close />
        </Modal.Head>
        <Modal.Content>
          {itemQuery.isError
            ? (
              <EmptyState
                icon="error"
                title={t('common.items.failed.title')}
                message={t('common.items.failed.message')}
              >
                <EmptyState.CTA onClick={() => void itemQuery.refetch()}>{t('common.actions.retry')}</EmptyState.CTA>
              </EmptyState>
            )
            : t('common.loading')}
        </Modal.Content>
      </Modal>
    )
  })()
}

ItemModal.displayName = 'ItemModal'

const ItemsPage = () => {
  const { t } = useCopy()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusLabel = useItemStatusLabel()
  const itemsQuery = useItem.query.useGetItems()
  const seedItem = useItem.sync.useSeedItem()
  const read = firstRead(itemsQuery)
  const sort = itemSort(searchParams)
  const openItemId = searchParams.get(ITEM_PARAM.open)

  return (
    <Page read={read}>
      <Page.Head>
        <Page.Head.Title>{t('common.nav.items')}</Page.Head.Title>
        <Page.Head.Subtitle>{t('common.items.subtitle')}</Page.Head.Subtitle>
      </Page.Head>
      <Page.Content layout="fill">
        <Table
          label={t('common.nav.items')}
          status={read.status}
          rows={sortItems(itemsQuery.data ?? [], sort)}
          getRowId={(row) => row.id}
          sort={sort}
          onSort={(next) => setSearchParams(withItemSort(searchParams, next))}
          emptyMessage={t('common.items.empty')}
          columns={[
            {
              key: 'name',
              header: t('common.items.field.name'),
              sortable: true,
              cell: (row) => (
                <Table.RowCTA asChild>
                  <Link
                    to={{ search: withOpenItem(searchParams, row.id).toString() }}
                    onClick={() => seedItem(row)}
                  >
                    {row.name}
                  </Link>
                </Table.RowCTA>
              ),
            },
            {
              key: 'status',
              header: t('common.items.field.status'),
              align: 'center',
              sortable: true,
              cell: (row) => (
                <Chip
                  label={statusLabel[row.status]}
                  status={itemChipStatus(row.status)}
                />
              ),
            },
            {
              key: 'updatedAt',
              header: t('common.items.column.updatedAt'),
              sortable: true,
              cell: (row) => t('common.format.dateTime', { value: new Date(row.updatedAt) }),
            },
          ]}
        />
      </Page.Content>
      <Page.Foot>
        <Page.Foot.CTA
          lane="primary"
          onClick={() => setSearchParams(withOpenItem(searchParams, NEW_ITEM))}
        >
          {t('common.items.new')}
        </Page.Foot.CTA>
      </Page.Foot>
      {openItemId !== null && (
        <ItemModal
          key={openItemId}
          itemId={openItemId}
          onClose={() => setSearchParams(withOpenItem(searchParams, null))}
        />
      )}
    </Page>
  )
}

ItemsPage.displayName = 'ItemsPage'

export default ItemsPage
